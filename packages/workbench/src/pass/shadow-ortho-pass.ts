import type { LC, PropsWithChildren, LiveFiber, LiveElement } from '@use-gpu/live';
import type { TextureSource, ViewUniforms } from '@use-gpu/core';
import type { LightEnv, Renderable } from '../pass';
import type { BoundLight } from '../light/types';
import { mat4 } from 'gl-matrix';

import { use, quote, yeet, wrap, memo, useMemo, useOne } from '@use-gpu/live';
import {
  makeFrustumPlanes, makeGlobalUniforms, makeOrthogonalMatrix, uploadBuffer,
  VIEW_UNIFORMS,
} from '@use-gpu/core';

import { useDeviceContext } from '../providers/device-provider';
import { usePassContext } from '../providers/pass-provider';

import { useFrustumCuller } from '../hooks/useFrustumCuller'
import { useInspectable } from '../hooks/useInspectable'

import { SHADOW_FORMAT, SHADOW_PAGE } from '../render/light/light-data';
import { drawToPass } from './util';

import { useDepthBlit } from './depth-blit';

export type ShadowOrthoPassProps = {
  calls: {
    shadow?: Renderable[],
  },
  map: BoundLight,
  descriptors: GPURenderPassDescriptor[],
  texture: TextureSource,
};

const NO_OPS: any[] = [];
const toArray = <T>(x?: T[]): T[] => Array.isArray(x) ? x : NO_OPS;

/** Orthographic shadow render pass.

Draws all shadow calls to an orthographic shadow map.
*/
export const ShadowOrthoPass: LC<ShadowOrthoPassProps> = memo((props: PropsWithChildren<ShadowOrthoPassProps>) => {
  const {
    calls,
    map,
    descriptors,
    texture,
  } = props;

  const inspect = useInspectable();

  const device = useDeviceContext();
  const {buffers: {shadow: [renderContext]}} = usePassContext();

  const shadows = toArray(calls['shadow'] as Renderable[]);

  const binding = useMemo(() =>
    makeGlobalUniforms(device, [VIEW_UNIFORMS]),
    [device]);

  const {bindGroup, buffer, pipe} = binding;

  const uniforms: ViewUniforms = useOne(() => ({
    projectionMatrix: { current: mat4.fromValues(1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1) },
    projectionViewMatrix: { current: mat4.create() },
    projectionViewFrustum: { current: null as any },
    inverseViewMatrix: { current: mat4.create() },
    inverseProjectionViewMatrix: { current: mat4.create() },
    viewMatrix: { current: mat4.create() },
    viewPosition: { current: [0, 0, 0, 1] },
    viewNearFar: { current: null as any },
    viewResolution: { current: null as any },
    viewSize: { current: null as any },
    viewWorldDepth: { current: [1, 1] },
    viewPixelRatio: { current: 1 },
  }));

  const {viewPosition, projectionViewFrustum} = uniforms;
  const cull = useFrustumCuller(viewPosition, projectionViewFrustum);

  const {
    into,
    normal,
    shadow,
    shadowMap,
    shadowUV,
  } = map;

  const {
    depth: [near, far],
    size: [width, height],
  } = shadow!;

  uniforms.viewNearFar.current = [ near, far ];
  uniforms.viewResolution.current = [ 1 / width, 1 / height ];
  uniforms.viewSize.current = [ width, height ];

  const clear = useDepthBlit(renderContext, descriptors[shadowMap!], shadowUV!, SHADOW_PAGE);

  const draw = quote(yeet(() => {
    let vs = 0;
    let ts = 0;

    const countGeometry = (v: number, t: number) => { vs += v; ts += t; };

    uniforms.viewMatrix.current = into!;
    uniforms.viewPosition.current = [-normal![0], -normal![1], -normal![2], 0];

    const {projectionViewMatrix, projectionViewFrustum, projectionMatrix, viewMatrix} = uniforms;
    projectionViewMatrix.current = mat4.multiply(mat4.create(), projectionMatrix.current, viewMatrix.current);
    projectionViewFrustum.current = makeFrustumPlanes(projectionViewMatrix.current);

    pipe.fill(uniforms);
    uploadBuffer(device, buffer, pipe.data);

    const commandEncoder = device.createCommandEncoder();

    clear(commandEncoder);

    const x = shadowUV![0] * SHADOW_PAGE;
    const y = shadowUV![1] * SHADOW_PAGE;
    const w = (shadowUV![2] - shadowUV![0]) * SHADOW_PAGE;
    const h = (shadowUV![3] - shadowUV![1]) * SHADOW_PAGE;

    const passEncoder = commandEncoder.beginRenderPass(descriptors[shadowMap!]);
    passEncoder.setViewport(x, y, w, h, 0, 1);
    passEncoder.setScissorRect(x, y, w, h);
    passEncoder.setBindGroup(0, bindGroup);

    drawToPass(cull, shadows, passEncoder, countGeometry, uniforms);

    passEncoder.end();

    const command = commandEncoder.finish();
    device.queue.submit([command]);

    inspect({
      render: {
        vertices: vs,
        triangles: ts,
      },
    });

    return null;
  }));

  return draw;
}, 'ShadowOrthoPass');
