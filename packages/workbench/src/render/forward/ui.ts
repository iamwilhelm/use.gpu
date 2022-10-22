import type { LiveComponent } from '@use-gpu/live';
import type { VirtualDraw } from '../render/pass2';

import { memo, use, fragment, yeet, useContext, useNoContext, useMemo, useNoMemo, useOne, useNoOne } from '@use-gpu/live';
import { resolve } from '@use-gpu/core';
import { bindBundle, bindingToModule } from '@use-gpu/shader/wgsl';

import { drawCall } from '../command/draw-call';
import { getNativeColor } from '../../hooks/useNativeColor';

import { DeviceContext } from '../../providers/device-provider';
import { RenderContext } from '../../providers/render-provider';

import instanceDrawVirtualUI from '@use-gpu/wgsl/render/vertex/virtual-ui.wgsl';
import instanceFragmentUI from '@use-gpu/wgsl/render/fragment/ui.wgsl';

export type UIRenderProps = VirtualDraw;

export const UIRender: LiveComponent<UIRenderProps> = (props: UIRenderProps) => {
  let {
    vertexCount,
    instanceCount,
    indirect,

    links: {
      getVertex,
      getFragment,
    },

    pipeline,
    defines,
    mode = 'opaque',
  } = props;

  const device = useContext(DeviceContext);
  const renderContext = useContext(RenderContext);
  const {colorInput, colorSpace} = renderContext;

  const vertexShader = instanceDrawVirtualUI;
  const fragmentShader = instanceFragmentUI;

  // Binds links into shader
  const [v, f] = useMemo(() => {
    const links = {
      getVertex,
      getFragment,
      toColorSpace: getNativeColor(colorInput, colorSpace),
    };
    const v = bindBundle(vertexShader, links, undefined);
    const f = bindBundle(fragmentShader, links, undefined);
    return [v, f];
  }, [vertexShader, fragmentShader, getVertex, getFragment, colorInput, colorSpace]);

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
    mode,
  };

  return yeet(drawCall(call));
};
