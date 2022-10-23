import type { LiveComponent } from '@use-gpu/live';
import type { VirtualDraw } from '../render/pass';

import { memo, use, fragment, yeet, useContext, useNoContext, useMemo, useNoMemo, useOne, useNoOne } from '@use-gpu/live';
import { resolve } from '@use-gpu/core';
import { bindBundle, bindingToModule } from '@use-gpu/shader/wgsl';

import { drawCall } from '../command/draw-call';
import { getNativeColor } from '../../hooks/useNativeColor';

import { DeviceContext } from '../../providers/device-provider';
import { PickingContext } from '../../providers/picking-provider';

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
    id = 0,
  } = props;

  const device = useContext(DeviceContext);
  const {renderContext} = useContext(PickingContext);

  const vertexShader = instanceDrawVirtualPicking;
  const fragmentShader = instanceFragmentPicking;

  // Binds links into shader
  const [v, f] = useMemo(() => {
    const getId = bindingToModule({uniform: ID_BINDING, constant: id});
    const links = {
      getVertex,
      getPicking: getPicking ?? getId,
    };
    const v = bindBundle(vertexShader, links, undefined);
    const f = bindBundle(fragmentShader, links, undefined);
    return [v, f];
  }, [vertexShader, fragmentShader, getVertex, getPicking, id]);

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
    mode: 'picking',
  };

  return yeet(drawCall(call));
};
