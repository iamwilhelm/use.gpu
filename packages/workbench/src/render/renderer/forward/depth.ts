import type { LiveComponent } from '@use-gpu/live';
import type { VirtualDraw } from '../render/pass';

import { memo, use, fragment, yeet, useContext, useNoContext, useMemo, useNoMemo, useOne, useNoOne } from '@use-gpu/live';
import { resolve } from '@use-gpu/core';
import { patch, $apply } from '@use-gpu/state';
import { bindBundle, bindingToModule } from '@use-gpu/shader/wgsl';

import { drawCall } from '../../command/draw-call';

import { useDeviceContext } from '../../../providers/device-provider';
import { useRenderContext } from '../../../providers/render-provider';
import { useViewContext } from '../../../providers/view-provider';

import instanceDrawVirtualDepth from '@use-gpu/wgsl/render/vertex/virtual-depth.wgsl';
import instanceFragmentDepth from '@use-gpu/wgsl/render/fragment/depth.wgsl';

import { getScissorColor } from '@use-gpu/wgsl/mask/scissor.wgsl';

export type DepthRenderProps = VirtualDraw;

export const DepthRender: LiveComponent<DepthRenderProps> = (props: DepthRenderProps) => {
  let {
    vertexCount,
    instanceCount,
    bounds,
    indirect,

    links: {
      getVertex,
      getFragment,
    },

    propPipeline,
    defines,
  } = props;

  const device = useDeviceContext();
  const renderContext = useRenderContext();

  const {layout: globalLayout} = useViewContext();

  const vertexShader = instanceDrawVirtualDepth;
  const fragmentShader = instanceFragmentDepth;

  const pipeline = useOne(() => patch(propPipeline, {
    multisample: { count: 1 },
    fragment: { targets: [] },
  }), propPipeline);

  // Binds links into shader
  const [v, f] = useMemo(() => {
    const links = {
      getVertex,
      getFragment,
      getScissor: defines?.HAS_SCISSOR ? getScissorColor : null,
    };
    const v = bindBundle(vertexShader, links, undefined);
    const f = bindBundle(fragmentShader, links, undefined);
    return [v, f];
  }, [vertexShader, fragmentShader, getVertex, getFragment]);

  // Inline the render fiber to avoid another memo()
  const call = {
    vertexCount,
    instanceCount,
    bounds,
    indirect,

    vertex: v,
    fragment: f,
    defines,
    pipeline,
    renderContext,
    globalLayout,
    mode: 'shadow',
  };

  return yeet(drawCall(call));
};
