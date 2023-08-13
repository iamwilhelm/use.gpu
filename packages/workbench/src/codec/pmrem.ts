import type { LC, LiveElement } from '@use-gpu/live';
import type { TextureSource } from '@use-gpu/core';

import { use, useMemo } from '@use-gpu/live';
import { makeAtlas, makeDataBuffer, clamp, seq, lerp } from '@use-gpu/core';
import { useDeviceContext } from '../providers/device-provider';
import { DebugAtlas } from '../text/debug-atlas';
import { Queue } from '../queue/queue';
import { Dispatch } from '../queue/dispatch';
import { Compute } from '../compute/compute';
import { useBoundShader, getBoundShader } from '../hooks/useBoundShader';
import { useDerivedSource, getDerivedSource } from '../hooks/useDerivedSource';

import { sampleBlur } from '@use-gpu/wgsl/pmrem/pmrem.wgsl';
import { sampleCubeMap, sampleTextureMap } from '@use-gpu/wgsl/pmrem/pmrem-read.wgsl';

const π = Math.PI;
const sqr = (x: number) => x * x;

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

const MIN_SIGMA = 0.05;
const MAX_SIGMA = Math.sqrt(getVarianceForRoughness(1));
const PIXEL_PER_SIGMA = 5;

export const PrefilteredEnvMap: LC<PrefilteredEnvMapProps> = (props: PrefilteredEnvMapProps) => {
  const {
    levels = 9,
    size = 512,
    texture,
    render,
  } = props;
  
  if (!texture) return;
  
  const device = useDeviceContext();

  const {atlas, sigmas, sizes, radii, mappings, buffer, target} = useMemo(() => {
    const radiansPerPixel = (π / 2) / size;

    const sigmas = seq(levels).map(i => i
      ? Math.pow(2, lerp(Math.log2(MIN_SIGMA), Math.log2(MAX_SIGMA), (i - 1) / (levels - 2)))
      : 0);

    const sizes = sigmas.map((sigma, i) => sigma
      ? Math.round(size * Math.min(1, PIXEL_PER_SIGMA / (sigma / radiansPerPixel)))
      : size);

    const radii = sigmas.map((sigma, i) => (sigma / (π / 2)) * sizes[i]);

    const w = sizes[0];
    const h = sizes[0] + sizes[1] + sizes[2];
    const atlas = makeAtlas(w, h);
  
    const mappings = [];
    for (const [i, size] of sizes.entries()) {
      mappings.push(atlas.place(i, size, size));
    }

    const storageFlags = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;

    const {width, height} = atlas;
    const bufferLength = width * height;
    const buffer = makeDataBuffer(device, bufferLength * 8, storageFlags);
    const target = {
      buffer: buffer,
      format: 'vec2<u32>',
      length: bufferLength,
      size: [width, height],
      version: 0,
      readWrite: true,
    } as StorageSource;

    return {atlas, sigmas, sizes, radii, mappings, buffer, target};
  }, [size, levels]);

  const dispatches = useMemo(() => {
    
    const out = [];
    
    const cubeMap = getDerivedSource(texture, {
      variant: 'textureSampleGrad',
    });

    const makeDispatch = (i: number) => {
      const bound = getBoundShader(sampleBlur, [
        mappings[i],
        mappings[i - 1] ?? [0,0,0,0],
        cubeMap,
        target,
      ], {PMREM_PASS: i});

      const size = sizes[i];
      const dispatchSize = [Math.ceil(size / 8), Math.ceil(size / 8), 1];

      const dispatch = (
        use(Dispatch, {
          size: dispatchSize,
          shader: bound,
          onDispatch: () => console.log('dispatch', texture.size)
        })
      );
      return dispatch;
    };
    
    out.push(makeDispatch(0));
    console.log({out})
    return out;
  }, [sigmas, radii, mappings, texture, target]);

  const {width, height} = atlas;
  const boundCubeMap = useBoundShader(sampleCubeMap, [mappings[0], target]);
  const boundTexture = useDerivedSource(
    useBoundShader(sampleTextureMap, [mappings[0], target]),
    {
      length: width * height,
      size: [width, height],
    }
  );

  return [
    use(DebugAtlas, {atlas}),
    use(Queue, {nested: true, children: use(Compute, {children: dispatches}) }),
    render ? render(boundCubeMap, boundTexture) : yeet(boundCubeMap),
  ];
  /*
    seq(mappings).map(i => {
    
    }),
  ];
  */
  
  /*
  const computeBuffers = seq(mips).map((_, i) => makeDataBuffer(device, bufferLengths[i], storageFlags));
  const [computeBuffer] = computeBuffers;

  const clear = () => {
    const commandEncoder = device.createCommandEncoder();
    commandEncoder.clearBuffer(computeBuffer);
    const command = commandEncoder.finish();
    device.queue.submit([command]);
  };

  const computeTargets = computeBuffers.map((computeBuffer, i) => ({
    buffer: computeBuffer,
    format: 'u32',
    length: bufferLengths[i] / 4,
    size: bufferSizes[i].map((x, i) => i ? x : x / 4),
    version: 0,
    readWrite: true,
  } as StorageSource));
  
  */
  return null;
};
