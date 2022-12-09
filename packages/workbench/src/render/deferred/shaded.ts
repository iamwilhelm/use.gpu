import type { LiveComponent } from '@use-gpu/live';
import type { VirtualDraw } from '../render/pass';

import { memo, use, fragment, yeet, useContext, useNoContext, useMemo, useNoMemo, useOne, useNoOne } from '@use-gpu/live';
import { resolve } from '@use-gpu/core';
import { bindBundle, bindingToModule } from '@use-gpu/shader/wgsl';

import { drawCall } from '../../queue/draw-call';
import { getNativeColor } from '../../hooks/useNativeColor';

import { useDeviceContext } from '../../providers/device-provider';
import { useRenderContext } from '../../providers/render-provider';
import { useViewContext } from '../../providers/view-provider';
import { usePassContext } from '../../providers/pass-provider';

import instanceDrawVirtualShaded from '@use-gpu/wgsl/render/vertex/virtual-shaded.wgsl';
import instanceFragmentShaded from '@use-gpu/wgsl/render/fragment/deferred-shaded.wgsl';

import { getScissorColor } from '@use-gpu/wgsl/mask/scissor.wgsl';

import { ShadedRender as ForwardShadedRender } from '../forward/shaded';

export type DeferredShadedRenderProps = VirtualDraw;

export const DeferredShadedRender: LiveComponent<DeferredShadedRenderProps> = (props: DeferredShadedRenderProps) => {
  let {
    vertexCount,
    instanceCount,
    bounds,
    indirect,
    shouldDispatch,
    onDispatch,

    links: {
      getVertex,
      getSurface,
    },

    pipeline,
    defines,
    mode = 'opaque',
  } = props;

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

  const defs = useOne(() => ({...defines, HAS_ALPHA_TO_COVERAGE: true}), defines);

  // Inline the render fiber to avoid another memo()
  const call = {
    vertexCount,
    instanceCount,
    bounds,
    indirect,
    shouldDispatch,
    onDispatch,

    vertex: v,
    fragment: f,
    defines: defs,
    pipeline,
    renderContext: gbuffer,

    globalLayout,
    mode,
  };

  return yeet(drawCall(call));
};
