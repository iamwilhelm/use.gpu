import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction, UniformPipe } from '@use-gpu/live';
import type { TextureSource } from '@use-gpu/core';
import type { LightEnv, Renderable } from '../pass';
import type { Light } from '../../light/types';
import { mat4, vec3 } from 'gl-matrix';

import { use, quote, yeet, wrap, memo, useMemo, useOne } from '@use-gpu/live';
import {
  makeDepthStencilAttachments, makeFrustumPlanes, makeGlobalUniforms, makeOrthogonalMatrix, makeTexture, uploadBuffer,
} from '@use-gpu/core';
import { bindBundle, bundleToAttributes } from '@use-gpu/shader/wgsl';

import { useDeviceContext } from '../../providers/device-provider';
import { useRenderContext } from '../../providers/render-provider';
import { useViewContext } from '../../providers/view-provider';

import { useFrustumCuller } from '../../hooks/useFrustumCuller';
import { useInspectable } from '../../hooks/useInspectable';
import { useBoundShader } from '../../hooks/useBoundShader';
import { useShaderRef } from '../../hooks/useShaderRef';

import { SHADOW_FORMAT, SHADOW_PAGE } from '../renderer/light-data';
import { drawToPass, reverseZ } from './util';

import { getCubeToOmniSample } from '@use-gpu/wgsl/render/sample/cube-to-omni.wgsl';

import { useShadowBlit } from './shadow-blit';

const SAMPLE_BINDINGS = bundleToAttributes(getCubeToOmniSample);

export type ShadowOmniPassProps = {
  calls: {
    shadow?: Renderable[],
  },
  map: Light,
  descriptors: GPURenderPassDescriptor[],
  texture: TextureSource,
};

const NO_OPS: any[] = [];
const toArray = <T>(x?: T[]): T[] => Array.isArray(x) ? x : NO_OPS; 
const τ = Math.PI * 2; 

const PROJECTION_MATRICES = [
  mat4.fromValues(
    0, 0,-1, 0,
    0, 1, 0, 0,
   -1, 0, 0, 0,
    0, 0, 0, 1,
  ),  // R
  mat4.fromValues(
    0, 0, 1, 0,
    0, 1, 0, 0,
    1, 0, 0, 0,
    0, 0, 0, 1,
  ),  // L
  mat4.fromValues(
   -1, 0, 0, 0,
    0, 0,-1, 0,
    0, 1, 0, 0,
    0, 0, 0, 1,
  ),  // T
  mat4.fromValues(
    1, 0, 0, 0,
    0, 0, 1, 0,
    0, 1, 0, 0,
    0, 0, 0, 1,
  ),  // Bm
  mat4.fromValues(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0,-1, 0,
    0, 0, 0, 1,
  ),  // F
  mat4.fromValues(
   -1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ),  // B
];

/** Shadow render pass.

Draws all shadow calls to an omnidirectional shadow map.
*/
export const ShadowOmniPass: LC<ShadowOmniPassProps> = memo((props: PropsWithChildren<ShadowOmniPassProps>) => {
  const {
    calls,
    map,
    descriptors: shadowMapDescriptors,
    texture: shadowMapTexture,
  } = props;

  const inspect = useInspectable();

  const renderContext = useRenderContext();
  const device = useDeviceContext();
  const {defs, uniforms: viewUniforms} = useViewContext();

  const shadows = toArray(calls['shadow'] as Renderable[]);

  const binding = useMemo(() =>
    makeGlobalUniforms(device, [defs]),
    [device, defs]);

  const {bindGroup, buffer, pipe} = binding;

  const uniforms = useOne(() => ({
    ...viewUniforms,
    projectionMatrix: { current: mat4.fromValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1) },
    projectionViewMatrix: { current: mat4.create() },
    projectionViewFrustum: { current: null },
    viewMatrix: { current: mat4.create() },
    viewPosition: { current: [0, 0] },
    viewNearFar: { current: [0, 0] },
    viewResolution: { current: [0, 0] },
    viewSize: { current: [0, 0] },
    viewWorldDepth: { current: 1 },
    viewPixelRatio: { current: 1 },
  }), viewUniforms) as any as ViewUniforms;

  const {viewPosition, projectionViewFrustum} = uniforms;
  const cull = useFrustumCuller(viewPosition, projectionViewFrustum);

  const {
    into,
    position,
    shadow: {
      depth, depth: [near, far],
      size, size: [width, height],
    },
    shadowMap,
    shadowUV,
    shadowBlur,
  } = map;

  const [cubeTexture, cubeSource, cubeDescriptors] = useMemo(() => {
    const s = Math.round(Math.max(width, height) * .5);
    const texture = makeTexture(
      device,
      s,
      s,
      6,
      SHADOW_FORMAT,
      GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      1,
      1,
      '2d',
    );

    const attachments = makeDepthStencilAttachments(texture, SHADOW_FORMAT, 6);

    const descriptors = attachments.map(depthStencilAttachment => ({
      colorAttachments: [],
      depthStencilAttachment,
    }));

    const source = {
      texture,
      sampler: {},
      length: s*s*6,
      size: [s, s, 6],
      format: SHADOW_FORMAT,
      layout: 'texture_depth_cube',
      version: 0,
    };

    return [texture, source, descriptors];
  }, [device, size]);

  const matrices = useOne(() =>
    PROJECTION_MATRICES.map(p => {
      const m = mat4.clone(p);

      const s = mat4.perspectiveZO(mat4.create(), τ/4, 1, near, far);
      mat4.multiply(m, s, m);
      reverseZ(m, m);
      return m;
    }), depth);

  const frustums = useOne(() => matrices.map(makeFrustumPlanes), matrices);

  uniforms.viewMatrix.current = into;
  uniforms.viewPosition.current = position;
  uniforms.viewNearFar.current = [ near, far ];
  uniforms.viewResolution.current = [ 1 / width, 1 / height ];
  uniforms.viewSize.current = [ width, height ];
  uniforms.viewWorldDepth.current = [1, 1];
  uniforms.viewPixelRatio.current = 1;

  const border = Math.max(1, Math.min(4, shadowBlur));
  const scaleRef = useShaderRef([width / (width - border * 2), height / (height - border * 2)]);

  const getSample = useBoundShader(getCubeToOmniSample, SAMPLE_BINDINGS, [cubeSource, scaleRef]);
  const blit = useShadowBlit(shadowMapDescriptors[shadowMap], shadowUV, getSample);

  return quote(yeet(() => {
    let vs = 0;
    let ts = 0;

    const countGeometry = (v: number, t: number) => { vs += v; ts += t; };

    const {projectionViewMatrix, projectionViewFrustum, projectionMatrix, viewMatrix} = uniforms;
    for (let i = 0; i < 6; ++i) {
      projectionMatrix.current = matrices[i];
      projectionViewMatrix.current = mat4.multiply(mat4.create(), projectionMatrix.current, viewMatrix.current);
      projectionViewFrustum.current = makeFrustumPlanes(projectionViewMatrix.current);

      pipe.fill(uniforms);
      uploadBuffer(device, buffer, pipe.data);

      const commandEncoder = device.createCommandEncoder();
      const passEncoder = commandEncoder.beginRenderPass(cubeDescriptors[i]);
      passEncoder.setBindGroup(0, bindGroup);

      drawToPass(cull, shadows, passEncoder, countGeometry);

      passEncoder.end();
      
      blit(commandEncoder);

      const command = commandEncoder.finish();
      device.queue.submit([command]);
    }

    inspect({
      output: {
        depth: cubeSource,
      },
      render: {
        vertices: vs,
        triangles: ts,
      },
    });

    return null;
  }));
}, 'ShadowOmniPass');
