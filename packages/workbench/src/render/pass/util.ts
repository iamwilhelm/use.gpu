import { Culler, Renderable } from './types';
import { resolve, proxy } from '@use-gpu/core';

export const getRenderPassDescriptor = (
  renderContext: UseGPURenderContext,
  overlay?: boolean,
  merge?: boolean,
) => {
  let {colorAttachments, depthStencilAttachment} = renderContext;

  if (overlay || merge) {
    colorAttachments = colorAttachments.map(a => proxy(a, {loadOp: 'load'}));
  }
  if (merge && depthStencilAttachment) {
    const {depthLoadOp, stencilLoadOp} = depthStencilAttachment;
    const override: Record<string, any> = {};

    if (depthLoadOp) override.depthLoadOp = 'load';
    if (stencilLoadOp) override.stencilLoadOp = 'load';
    depthStencilAttachment = proxy(a, override);
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
    const depth = bounds ? cull(resolve(bounds)) : true;
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
