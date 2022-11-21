import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction, UniformPipe } from '@use-gpu/live';
import type { LightEnv, Renderable } from '../pass';
import type { Light } from '../../light/types';
import { mat4 } from 'gl-matrix';

import { use, quote, yeet, memo, useMemo, useOne } from '@use-gpu/live';
import {
  makeDepthStencilState, makeDepthStencilAttachment, makeFrustumPlanes,
  makeGlobalUniforms, makeOrthogonalMatrix, uploadBuffer,
} from '@use-gpu/core';

import { useDeviceContext } from '../../providers/device-provider';
import { useViewContext } from '../../providers/view-provider';

import { useFrustumCuller } from '../../hooks/useFrustumCuller'
import { useInspectable } from '../../hooks/useInspectable'

import { SHADOW_FORMAT, SHADOW_PAGE } from '../renderer/light-data';
import { getRenderPassDescriptor, getDrawOrder } from './util';

export type ShadowOrthoPassProps = {
  calls: {
    shadow?: Renderable[],
  },
  map: Light,
  descriptor: GPURenderPassDescriptor,
};

const NO_OPS: any[] = [];
const toArray = <T>(x?: T[]): T[] => Array.isArray(x) ? x : NO_OPS; 

const drawToPass = (
  cull: Culler,
  calls: Renderable[],
  passEncoder: GPURenderPassEncoder,
  countGeometry: (v: number, t: number) => void,
  sign: number = 1,
) => {
  const order = getDrawOrder(cull, calls, sign);
  for (const i of order) calls[i].draw(passEncoder, countGeometry);
};

/** Shadow render pass.

Draws all opaque calls to multiple shadow maps.
*/
export const ShadowOrthoPass: LC<ShadowOrthoPassProps> = memo((props: PropsWithChildren<ShadowOrthoPassProps>) => {
  const {
    calls,
    map,
    descriptor,
  } = props;

  const inspect = useInspectable();

  const device = useDeviceContext();
  const {defs, uniforms: viewUniforms} = useViewContext();

  const shadows = toArray(calls['shadow'] as Renderable[]);

  const binding = useMemo(() =>
    makeGlobalUniforms(device, [defs]),
    [device, defs]);

  const {bindGroup, buffer, pipe} = binding;

  const uniforms = useOne(() => ({
    ...viewUniforms,
    projectionMatrix: { current: mat4.create() },
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
      depth: [near, far],
      size: [width, height],
    },
    shadowUV,
  } = map;

  const left   = -width/2;
  const top    = -height/2;
  const right  = width/2;
  const bottom = height/2;
  const matrix = makeOrthogonalMatrix(left, right, bottom, top, near, far);
  uniforms.projectionMatrix.current = matrix;

  return quote(yeet(() => {
    let vs = 0;
    let ts = 0;

    const countGeometry = (v: number, t: number) => { vs += v; ts += t; };

    uniforms.viewMatrix.current = into;
    uniforms.viewPosition.current = position;
    uniforms.viewNearFar.current = [ near, far ];
    uniforms.viewResolution.current = [ 1 / width, 1 / height ];
    uniforms.viewSize.current = [ width, height ];
    uniforms.viewWorldDepth.current = [1, 1];
    uniforms.viewPixelRatio.current = 1;

    const {projectionViewMatrix, projectionViewFrustum, projectionMatrix, viewMatrix} = uniforms;
    projectionViewMatrix.current = mat4.multiply(mat4.create(), projectionMatrix.current, viewMatrix.current);
    projectionViewFrustum.current = makeFrustumPlanes(projectionViewMatrix.current);

    pipe.fill(uniforms);
    uploadBuffer(device, buffer, pipe.data);

    const commandEncoder = device.createCommandEncoder();

    const passEncoder = commandEncoder.beginRenderPass(descriptor);
    passEncoder.setBindGroup(0, bindGroup);

    drawToPass(cull, shadows, passEncoder, countGeometry);

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

}, 'ShadowOrthoPass');
