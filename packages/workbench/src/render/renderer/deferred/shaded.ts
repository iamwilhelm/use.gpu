import type { LiveComponent } from '@use-gpu/live';
import type { VirtualDraw } from '../render/pass';

import { memo, use, fragment, yeet, useContext, useNoContext, useMemo, useNoMemo, useOne, useNoOne } from '@use-gpu/live';
import { resolve } from '@use-gpu/core';
import { bindBundle, bindingToModule } from '@use-gpu/shader/wgsl';

import { drawCall } from '../../command/draw-call';
import { getNativeColor } from '../../../hooks/useNativeColor';

import { useDeviceContext } from '../../../providers/device-provider';
import { useRenderContext } from '../../../providers/render-provider';
import { useViewContext } from '../../../providers/view-provider';
import { usePassContext } from '../../../providers/pass-provider';

import instanceDrawVirtualShaded from '@use-gpu/wgsl/render/vertex/virtual-shaded.wgsl';
import instanceFragmentShaded from '@use-gpu/wgsl/render/fragment/deferred-shaded.wgsl';

import { getScissorColor } from '@use-gpu/wgsl/mask/scissor.wgsl';

import { ShadedRender as ForwardShadedRender } from '../forward/shaded';

export type ShadedRenderProps = VirtualDraw;

export const ShadedRender: LiveComponent<ShadedRenderProps> = (props: ShadedRenderProps) => {
  let {
    vertexCount,
    instanceCount,
    bounds,
    indirect,

    links: {
      getVertex,
      getSurface,
    },

    pipeline,
    defines,
    mode = 'opaque',
  } = props;

  if (mode === 'transparent') return ForwardShadedRender(props);

  const device = useDeviceContext();
  const renderContext = useRenderContext();
  const {colorInput, colorSpace} = renderContext;

  const {layout: globalLayout} = useViewContext();
  const {renderContexts: {gbuffer}} = usePassContext();

  const vertexShader = instanceDrawVirtualShaded;
  const fragmentShader = instanceFragmentShaded;

  // Binds links into shader
  const [v, f] = useMemo(() => {
    const links = {
      getVertex,
      getSurface,
      getScissor: defines?.HAS_SCISSOR ? getScissorColor : null,
      toColorSpace: getNativeColor(colorInput, colorSpace),
    };
    const v = bindBundle(vertexShader, links, undefined);
    const f = bindBundle(fragmentShader, links, undefined);
    return [v, f];
  }, [vertexShader, fragmentShader, getVertex, getSurface, colorInput, colorSpace]);

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
    renderContext: gbuffer,

    globalLayout,
    mode,
  };

  return yeet(drawCall(call));
};
