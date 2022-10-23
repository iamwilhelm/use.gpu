import type { LiveComponent } from '@use-gpu/live';
import type { VirtualDraw } from '../render/pass';

import { memo, use, fragment, yeet, useContext, useNoContext, useMemo, useNoMemo, useOne, useNoOne } from '@use-gpu/live';
import { resolve } from '@use-gpu/core';
import { bindBundle, bindingToModule } from '@use-gpu/shader/wgsl';

import { getNativeColor } from '../../hooks/useNativeColor';

import { DrawCall, drawCall } from '../command/draw-call';
import { Dispatch } from '../command/dispatch';
import { getWireframe, getWireframeIndirect } from '../wireframe';

import { DeviceContext } from '../../providers/device-provider';
import { RenderContext } from '../../providers/render-provider';

import instanceDrawVirtualSolid from '@use-gpu/wgsl/render/vertex/virtual-solid.wgsl';
import instanceFragmentSolid from '@use-gpu/wgsl/render/fragment/solid.wgsl';

export type DebugRenderProps = VirtualDraw;

export const DebugRender: LiveComponent<DebugRenderProps> = (props: DebugRenderProps) => {
  let {
    vertexCount: vC = 0,
    instanceCount: iC = 0,
    indirect,

    links: {
      getVertex: gV,
    },

    pipeline,
    defines,
  } = props;

  const topology = pipeline.primitive?.topology ?? 'triangle-list';

  const device = useContext(DeviceContext);
  const renderContext = useContext(RenderContext);

  const vertexShader = instanceDrawVirtualSolid;
  const fragmentShader = instanceFragmentSolid;

  // Binds links into shader
  const [v, f, vertexCount, instanceCount, wireframeCommand, wireframeIndirect] = useMemo(() => {
    let getVertex = gV;
    let vertexCount = vC;
    let instanceCount = iC;
    let wireframeCommand = null;
    let wireframeIndirect = null;

    // Decorate vertex shader with wireframe operator
    if (indirect) {
      ({getVertex, wireframeCommand, wireframeIndirect} = getWireframeIndirect(device, gV, indirect, topology));
    } else  {
      ({getVertex, vertexCount, instanceCount} = getWireframe(gV, vC, iC, topology));
    }

    const links = {getVertex};
    const v = bindBundle(vertexShader, links, undefined);
    const f = fragmentShader;
    return [v, f, vertexCount, instanceCount, wireframeCommand, wireframeIndirect];
  }, [vertexShader, fragmentShader, gV]);

  // Inline the render fiber to avoid another memo()
  const call = {
    vertexCount,
    instanceCount,
    indirect: wireframeIndirect,
    vertex: v,
    fragment: f,
    defines,
    pipeline,
    renderContext,
    mode: 'debug',
  };

  // Count indirect vertices/instances for wireframe
  if (wireframeCommand) {
    return [use(Dispatch, {shader: wireframeCommand}), use(DrawCall, call)];
  }

  return yeet(drawCall(call));
};
