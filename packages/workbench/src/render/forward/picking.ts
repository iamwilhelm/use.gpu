import type { LiveComponent } from '@use-gpu/live';
import type { VirtualDraw } from '../render/pass';

import { memo, use, fragment, yeet, useContext, useNoContext, useMemo, useNoMemo, useOne, useNoOne } from '@use-gpu/live';
import { resolve } from '@use-gpu/core';
import { bindBundle, bindingToModule } from '@use-gpu/shader/wgsl';

import { drawCall } from '../../queue/draw-call';

import { useDeviceContext } from '../../providers/device-provider';
import { usePassContext } from '../../providers/pass-provider';
import { useViewContext } from '../../providers/view-provider';

import instanceDrawVirtualPicking from '@use-gpu/wgsl/render/vertex/virtual-pick.wgsl';
import instanceFragmentPicking from '@use-gpu/wgsl/render/fragment/pick.wgsl';

export type PickingRenderProps = VirtualDraw;

const ID_BINDING = { name: 'getId', format: 'u32', value: 0, args: [] };

export const PickingRender: LiveComponent<PickingRenderProps> = (props: PickingRenderProps) => {
  let {
    vertexCount,
    instanceCount,
    indirect,

    links: {
      getVertex,
      getPicking,
    },

    pipeline,
    defines,
  } = props;

  const device = useDeviceContext();
  const {renderContexts: {picking: renderContext}} = usePassContext();

  const {layout: globalLayout} = useViewContext();

  const vertexShader = instanceDrawVirtualPicking;
  const fragmentShader = instanceFragmentPicking;

  // Binds links into shader
  const [v, f] = useMemo(() => {
    const links = {
      getVertex,
      getPicking,
    };
    const v = bindBundle(vertexShader, links, undefined);
    const f = fragmentShader;
    return [v, f];
  }, [vertexShader, fragmentShader, getVertex, getPicking]);

  // Inline the render fiber to avoid another memo()
  const call = {
    vertexCount,
    instanceCount,
    indirect,
    vertex: v,
    fragment: f,
    defines,
    pipeline,
    renderContext,
    globalLayout,
    mode: 'picking',
  };

  return yeet(drawCall(call));
};
