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

import instanceDrawVirtualSolid from '@use-gpu/wgsl/render/vertex/virtual-solid.wgsl';
import instanceFragmentSolid from '@use-gpu/wgsl/render/fragment/deferred-solid.wgsl';

import { getScissorColor } from '@use-gpu/wgsl/mask/scissor.wgsl';

import { SolidRender as ForwardSolidRender } from '../forward/solid';

export type DeferredSolidRenderProps = VirtualDraw;

export const DeferredSolidRender: LiveComponent<DeferredSolidRenderProps> = (props: DeferredSolidRenderProps) => {
  let {
    vertexCount,
    instanceCount,
    bounds,
    indirect,

    links: {
      getVertex,
      getFragment,
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

  const vertexShader = instanceDrawVirtualSolid;
  const fragmentShader = instanceFragmentSolid;

  // Binds links into shader
  const [v, f] = useMemo(() => {
    const links = {
      getVertex,
      getFragment,
      getScissor: defines?.HAS_SCISSOR ? getScissorColor : null,
      toColorSpace: getNativeColor(colorInput, colorSpace),
    };
    const v = bindBundle(vertexShader, links, undefined);
    const f = bindBundle(fragmentShader, links, undefined);
    return [v, f];
  }, [vertexShader, fragmentShader, getVertex, getFragment, colorInput, colorSpace]);

  const defs = useOne(() => ({...defines, HAS_ALPHA_TO_COVERAGE: true}), defines);

  // Inline the render fiber to avoid another memo()
  const call = {
    vertexCount,
    instanceCount,
    bounds,
    indirect,

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
