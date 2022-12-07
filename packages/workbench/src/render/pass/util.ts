import type { Culler, Renderable } from './types';
import { resolve, proxy } from '@use-gpu/core';
import { mat4, vec3 } from 'gl-matrix';

export const getRenderPassDescriptor = (
  renderContext: UseGPURenderContext,
  overlay?: boolean,
  merge?: boolean,
) => {
  let {colorAttachments, depthStencilAttachment} = renderContext;

  if (overlay) {
    colorAttachments = colorAttachments.map(a => proxy(a, {loadOp: 'load'}));
  }
  if (merge && depthStencilAttachment) {
    const {depthLoadOp, stencilLoadOp} = depthStencilAttachment;
    const override: Record<string, any> = {};

    if (depthLoadOp) override.depthLoadOp = 'load';
    if (stencilLoadOp) override.stencilLoadOp = 'load';
    depthStencilAttachment = proxy(depthStencilAttachment, override);
  }

  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments,
    depthStencilAttachment: depthStencilAttachment ?? undefined,
  };

  return renderPassDescriptor;
}

export const getDrawOrder = (cull: Culler, calls: Renderable[], sign: number = 1) => {
  let i = 0;
  const order = [];
  const depths = [];

  for (const {draw, bounds} of calls) {
    let depth;
    if (bounds) {
      const {center, radius} = resolve(bounds);
      depth = cull(center, radius);
    }
    else {
      depth = true;
    }
    depths.push(depth);
    
    if (depth !== false) order.push(i);
    i++;
  }

  order.sort((a, b) => {
    const da = depths[a];
    const db = depths[b];
    if (da === db) return a - b;
    if (da === true) return 1;
    if (db === true) return -1;
    return (da - db) * sign;
  })

  return order;
};

export const drawToPass = (
  cull: Culler,
  calls: Renderable[],
  passEncoder: GPURenderPassEncoder,
  countGeometry: (v: number, t: number) => void,
  sign: number = 1,
) => {
  const order = getDrawOrder(cull, calls, sign);
  for (const i of order) calls[i].draw(passEncoder, countGeometry);
};

const REVERSE_Z = mat4.create();
mat4.translate(REVERSE_Z, REVERSE_Z, vec3.fromValues(0, 0, 1));
mat4.scale(REVERSE_Z, REVERSE_Z, vec3.fromValues(1, 1, -1));

export const reverseZ = (a: mat4, b: mat4) => mat4.multiply(a, REVERSE_Z, b);
