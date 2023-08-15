import type { LC, LiveElement } from '@use-gpu/live';
import type { TextureSource, TextureTarget } from '@use-gpu/core';

import { gather, use, useMemo } from '@use-gpu/live';
import { makeAtlas, makeDataBuffer, clamp, seq, lerp } from '@use-gpu/core';
import { useDeviceContext } from '../providers/device-provider';
import { DebugAtlas } from '../text/debug-atlas';
import { Queue } from '../queue/queue';
import { Dispatch } from '../queue/dispatch';
import { Compute } from '../compute/compute';
import { Readback } from '../primitives/readback';
import { TextureBuffer } from '../compute/texture-buffer';
import { useBoundShader, getBoundShader } from '../hooks/useBoundShader';
import { useDerivedSource, getDerivedSource } from '../hooks/useDerivedSource';
import { useRawSource } from '../hooks/useRawSource';
import { useScratchSource } from '../hooks/useScratchSource';
import { useInspectable } from '../hooks/useInspectable'

import { pmremInit } from '@use-gpu/wgsl/pmrem/pmrem-init.wgsl';
import { pmremCopy } from '@use-gpu/wgsl/pmrem/pmrem-copy.wgsl';
import { pmremBlur } from '@use-gpu/wgsl/pmrem/pmrem-blur.wgsl';
import { pmremDiffuseSH } from '@use-gpu/wgsl/pmrem/pmrem-diffuse-sh.wgsl';
import { pmremDiffuseRender } from '@use-gpu/wgsl/pmrem/pmrem-diffuse-render.wgsl';

import { sampleCubeMap } from '@use-gpu/wgsl/pmrem/pmrem-read.wgsl';

const π = Math.PI;
const τ = 2*π;
const sqr = (x: number) => x * x;

const MAX_SAMPLES = 20;

const LINEAR_SAMPLER: GPUSamplerDescriptor = {
  minFilter: 'linear',
  magFilter: 'linear',
};

export type PrefilteredEnvMapProps = {
  texture: TextureSource,
  size?: number,
  levels?: number,
  render: (cubeMap: TextureSource, textureMap: TextureSource) => LiveElement,
};

// Based on
// https://drive.google.com/file/d/15y8r_UpKlU9SvV4ILb0C3qCPecS8pvLz/view

const getVarianceForRoughness = (roughness: number) => {
  const r = clamp(0, 1, roughness);
  if (r < 0.4) return 1.74 * sqr(sqr(r));
  if (r < 0.8) return 0.575 * r - 0.184;
  return 0.312 * r + 0.027;
};

const MIN_SIGMA = 0.0125;
const MAX_SIGMA = Math.sqrt(getVarianceForRoughness(1));
const PIXEL_PER_SIGMA = 5;

const WEIGHT_CUTOFF = 0.0125;
const SIGMA_CUTOFF = Math.sqrt(-Math.log(WEIGHT_CUTOFF));

const FIX_BILINEAR_SEAM = true;

const CRISP_SIGMA = 0.3989422804; // 1/sqrt(2π) - normalizes to p(0) == 1

const FIRST_MIP = Math.ceil(PIXEL_PER_SIGMA * (π / 2) / MIN_SIGMA) + 2;
const DIFFUSE_MIP = 127;

const hasWebGPU = typeof GPUBufferUsage !== 'undefined';
const READ_WRITE_SOURCE = hasWebGPU ? { readWrite: true, flags: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC } : {};

export const PrefilteredEnvMap: LC<PrefilteredEnvMapProps> = (props: PrefilteredEnvMapProps) => {
  const {
    levels = 8,
    size = 1024,
    texture,
    render,
  } = props;
  
  if (!texture) return;
  
  const device = useDeviceContext();
  const inspect = useInspectable();

  const {atlas, mappings, mips, sigmas, sigmas2, dsigmas, sizes, radii} = useMemo(() => {

    const sigmas = [];
    const sigmas2 = [];
    const dsigmas = [];
    const sizes = [];
    const radii = [];

    // MIP downscale
    const mips = Math.max(1, Math.ceil(Math.log2(size / FIRST_MIP)));
    for (let i = 0; i < mips; ++i) {
      const sigma = CRISP_SIGMA * (τ / 4) / (size >> i);
      sigmas.push(sigma);
      sigmas2.push(sigma * sigma);
      dsigmas.push(0);
      sizes.push(size >> i);
      radii.push(0);
    }

    // Blur downscale
    for (let i = 0; i < levels; ++i) {
      const sigma = Math.pow(2, lerp(Math.log2(MIN_SIGMA), Math.log2(MAX_SIGMA), i / (levels - 1)));
      const size = (Math.ceil(PIXEL_PER_SIGMA * (τ / 4) / sigma) + 1) | 1;

      const last = sigmas[sigmas.length - 1] || 0;
      const dsigma = Math.sqrt(sigma*sigma - last*last);
      const radius = Math.ceil(SIGMA_CUTOFF * dsigma * (size - 1) / (τ / 4));

      if (radius > MAX_SAMPLES) console.warn(`PMREM radius too big: ${radius} > MAX_SAMPLES ${MAX_SAMPLES}`);

      sigmas.push(sigma);
      sigmas2.push(sigma * sigma);
      dsigmas.push(dsigma);
      sizes.push(size);
      radii.push(radius);
    }

    // Lambertian diffuse
    sizes.push(DIFFUSE_MIP);

    // Allocate in atlas
    const area = sizes.reduce((a, b) => a + b*b, 0);
    const w = Math.max(sizes[0], FIRST_MIP);
    const h = Math.max(sizes[0], FIRST_MIP) + Math.max(sizes[1], sizes[mips] + sizes[mips + 1]);
    const atlas = makeAtlas(w, h, w*2);

    const mappings = [];
    for (const [i, size] of sizes.entries()) {
      mappings.push(atlas.place(i, size, size));
    }

    return {atlas, mappings, mips, sigmas, sigmas2, dsigmas, sizes, radii};
  });

  const {width, height} = atlas;
  return (
    gather([
      use(TextureBuffer, {
        width,
        height,
        sampler: LINEAR_SAMPLER,
        format: 'rgba16float',
        filterable: true,
        colorSpace: 'linear',
      }),
      use(TextureBuffer, {
        width: Math.max(size, FIRST_MIP),
        height: Math.max(size, FIRST_MIP),
        sampler: LINEAR_SAMPLER,
        format: 'rgba16float',
        filterable: true,
        colorSpace: 'linear',
        history: 1,
      }),
    ], ([target, scratch]: TextureTarget[]) => {

      const diffuseInput = sizes.findIndex(s => s <= 64);
      const [diffuseSHBuffer, allocate] = useScratchSource('vec4<f32>', READ_WRITE_SOURCE);
      allocate(10);

      const targetIn = getDerivedSource(target, {
        variant: 'textureSampleLevel',
        absolute: true,
      });

      const scratchOut = useDerivedSource(scratch, {
        sampler: null,
      });
      
      const scratchIn = getDerivedSource(scratch.history[0], {
        variant: 'textureSampleLevel',
        absolute: true,
      });

      const dispatches = useMemo(() => {
    
        const out = [];

        const cubeMap = getDerivedSource(texture, {
          variant: 'textureSampleLevel',
        });
    
        const makeInitShader = () =>
          getBoundShader(pmremInit, [
            mappings[0],
            cubeMap,
            scratchOut,
            target,
          ]);

        const makeCopyShader = (i: number) =>
          getBoundShader(pmremCopy, [
            mappings[i],
            mappings[i - 1],
            scratchIn,
            scratchOut,
            target,
          ]);

        const makeBlurShader = (i: number, pass: number) =>
          getBoundShader(pmremBlur, [
            mappings[i],
            pass ? mappings[i] : mappings[i - 1],
            dsigmas[i],
            radii[i],
            scratchIn,
            scratchOut,
            target,
          ], {
            BLUR_PASS: pass,
            SIGMA_CUTOFF,
            MAX_SAMPLES,
          });

        const makeDispatch = (shader: ShaderModule, i: number) => 
          use(Dispatch, {
            shader,
            size: [sizes[i], sizes[i]],
            group: [8, 8],
            onDispatch: scratch.swap,
          });

        const makeDiffuseDispatch = (i: number, j: number) => [
          use(Dispatch, {
            shader: getBoundShader(pmremDiffuseSH, [
              mappings[i],
              targetIn,
              diffuseSHBuffer,
            ]),
            size: [1, 1],
          }),
          use(Dispatch, {
            shader: getBoundShader(pmremDiffuseRender, [
              mappings[j],
              diffuseSHBuffer,
              target,
            ]),
            size: [sizes[j], sizes[j]],
            group: [8, 8],
          }),
          /*
          use(Readback, {
            source: diffuseSHBuffer,
            then: (data: TypedArray) => console.log(data),
          }),
          */
        ];

        out.push(makeDispatch(makeInitShader(), 0));
        for (let i = 1; i < mips; ++i) out.push(makeDispatch(makeCopyShader(i), i));
        for (let i = 0; i < levels; ++i) for (let j = 0; j < 4; ++j) out.push(makeDispatch(makeBlurShader(i + mips, j), i + mips));
        out.push(...makeDiffuseDispatch(diffuseInput, mips + levels));

        return out;
      }, [sigmas, sizes, radii, mappings, texture, target, scratch]);

      const mappingData = new Uint16Array(mappings.flatMap(m => m));
      const varianceData = new Float32Array(sigmas);

      const boundMappings = useRawSource(mappingData, 'vec4<u16>');
      const boundVariances = useRawSource(varianceData, 'f32');
      const boundCubeMap = useBoundShader(sampleCubeMap, [
        () => sigmas2.length,
        boundMappings,
        boundVariances,
        targetIn,
        diffuseSHBuffer,
      ], {FIX_BILINEAR_SEAM});

      inspect({
        output: {
          color: target,
        },
      });
  
      return [
        use(DebugAtlas, {atlas}),
        use(Queue, {nested: true, children: use(Compute, {children: dispatches}) }),
        render ? render(boundCubeMap, target) : yeet(boundCubeMap),
      ];      
    })
  );
};
