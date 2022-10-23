import type { LiveComponent } from '@use-gpu/live';
import type { VirtualDraw } from '../render/pass';

import { memo, use, fragment, yeet, useContext, useNoContext, useMemo, useNoMemo, useOne, useNoOne } from '@use-gpu/live';
import { resolve } from '@use-gpu/core';
import { bindBundle, bindingToModule } from '@use-gpu/shader/wgsl';

import { drawCall } from '../command/draw-call';
import { getNativeColor } from '../../hooks/useNativeColor';

import { DeviceContext } from '../../providers/device-provider';
import { RenderContext } from '../../providers/render-provider';

import instanceDrawVirtualShaded from '@use-gpu/wgsl/render/vertex/virtual-shaded.wgsl';
import instanceFragmentShaded from '@use-gpu/wgsl/render/fragment/shaded.wgsl';

export type ShadedRenderProps = VirtualDraw;

export const ShadedRender: LiveComponent<ShadedRenderProps> = (props: ShadedRenderProps) => {
  let {
    vertexCount,
    instanceCount,
    indirect,

    links: {
      getVertex,
      getSurface,
      getLight,
    },

    pipeline,
    defines,
    mode = 'opaque',
  } = props;

  const device = useContext(DeviceContext);
  const renderContext = useContext(RenderContext);
  const {colorInput, colorSpace} = renderContext;

  const vertexShader = instanceDrawVirtualShaded;
  const fragmentShader = instanceFragmentShaded;

  // Binds links into shader
  const [v, f] = useMemo(() => {
    const links = {
      getVertex,
      getSurface,
      getLight,
      toColorSpace: getNativeColor(colorInput, colorSpace),
    };
    const v = bindBundle(vertexShader, links, undefined);
    const f = bindBundle(fragmentShader, links, undefined);
    return [v, f];
  }, [vertexShader, fragmentShader, getVertex, getSurface, getLight, colorInput, colorSpace]);

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
