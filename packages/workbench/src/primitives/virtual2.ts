import type { LiveComponent } from '@use-gpu/live';
import type { RenderPassMode, DeepPartial, Lazy, StorageSource } from '@use-gpu/core';
import type { ShaderModule, ParsedBundle, ParsedModule } from '@use-gpu/shader';
import type { VirtualDraw } from '../render/pass2';
import { memo, use, fragment, yeet, useContext, useNoContext, useMemo, useNoMemo, useOne, useNoOne } from '@use-gpu/live';
import { resolve } from '@use-gpu/core';

import { bindBundle, bindingToModule } from '@use-gpu/shader/wgsl';
import { getWireframe, getWireframeIndirect } from '../render/wireframe';
import { useInspectHoverable } from '../hooks/useInspectable';

import { usePassContext } from '../providers/pass-provider';

import { DeviceContext } from '../providers/device-provider';
import { ViewContext } from '../providers/view-provider';
import { RenderContext } from '../providers/render-provider';
import { PickingContext } from '../render/picking';
import { getNativeColor } from '../hooks/useNativeColor';

import instanceDrawVirtualShaded from '@use-gpu/wgsl/render/vertex/virtual-shaded.wgsl';
import instanceDrawVirtualSolid from '@use-gpu/wgsl/render/vertex/virtual-solid.wgsl';
import instanceDrawVirtualPick from '@use-gpu/wgsl/render/vertex/virtual-pick.wgsl';
import instanceDrawVirtualUI from '@use-gpu/wgsl/render/vertex/virtual-ui.wgsl';

import instanceFragmentShaded from '@use-gpu/wgsl/render/fragment/shaded.wgsl';
import instanceFragmentSolid from '@use-gpu/wgsl/render/fragment/solid.wgsl';
import instanceFragmentPick from '@use-gpu/wgsl/render/fragment/pick.wgsl';
import instanceFragmentUI from '@use-gpu/wgsl/render/fragment/ui.wgsl';

import { Dispatch } from './dispatch';
import { DrawCall, drawCall } from './draw-call';

const PICKING_RENDERER = [
  instanceDrawVirtualPick,
  instanceFragmentPick,
] as VirtualRenderer;

const SOLID_RENDERER = [
  instanceDrawVirtualSolid,
  instanceFragmentSolid,
] as VirtualRenderer;

const SHADED_RENDERER = [
  instanceDrawVirtualShaded,
  instanceFragmentShaded,
] as VirtualRenderer;

const UI_RENDERER = [
  instanceDrawVirtualUI,
  instanceFragmentUI,
] as VirtualRenderer;

const BUILTIN = {
  solid: SOLID_RENDERER,
  shaded: SHADED_RENDERER,
  ui: UI_RENDERER,
} as Record<string, VirtualRenderer>;

type VirtualRenderer = [ParsedBundle, ParsedBundle];

export type Virtual2Props = VirtualDraw;

export const Virtual2: LiveComponent<Virtual2Props> = memo((props: Virtual2Props) => {
  const {useVariants, getRenderer} = usePassContext();

  const hovered = useInspectHoverable();
  const variants = useVariants(props, hovered);

  if (Array.isArray(variants)) {
    if (variants.length === 1) {
      const [component] = variants;
      return use(component, props);
    }
    return variants.map(component => use(component, props));
  }
  else {
    const component = variants;
    return component(props);
  }
}, 'Virtual2');

export const Variant2: LiveComponent<Variant2Props> = (props: Variant2Props) => {
  /*
  let {
    getVertex: gV,
    vertexCount: vC = 0,
    instanceCount: iC = 0,
    indirect,

    getFragment: gF,
    getPicking: gP,
    getSurface: gS,
    getScissor: gC,
    getLight: gL,

    pipeline,
    defines,

    renderer = SOLID_RENDERER,
    id = 0,
  } = props?.virtual ?? props;

  let mode = props.mode ?? props?.virtual.mode ?? 'opaque';

  const isDebug = m === 'debug';
  const isPicking = m === 'picking';
  const topology = pipeline.primitive?.topology ?? 'triangle-list';

  const device = useContext(DeviceContext);
  const renderContext = useContext(RenderContext);
  const pickingContext = useContext(PickingContext);
  const resolvedContext = isPicking ? pickingContext?.renderContext : renderContext;
  if (!resolvedContext) throw new Error("GPU picking is not available");

  const {colorInput, colorSpace} = resolvedContext;

  // Get vertex and fragment shader for renderer
  const [
    vertexShader,
    fragmentShader,
    getVertex,
    vertexCount,
    instanceCount,
    wireframeCommand,
    wireframeIndirect,
  ] = useMemo(() => {
    let vertexShader: ShaderModule;
    let fragmentShader: ShaderModule;

    let getVertex: ShaderModule | null = gV ?? null;
    let wireframeCommand: ShaderModule | null = null;
    let wireframeIndirect: StorageSource | null = null;

    let vertexCount: Lazy<number> = vC;
    let instanceCount: Lazy<number> = iC;

    if (isDebug) {
      // Decorate vertex shader with wireframe
      [vertexShader, fragmentShader] = SOLID_RENDERER;
      if (gV) {
        if (indirect) {
          ({getVertex, wireframeCommand, wireframeIndirect} = getWireframeIndirect(device, gV, indirect, topology));
        } else  {
          ({getVertex, vertexCount, instanceCount} = getWireframe(gV, vC, iC, topology));
        }
      }
    }
    else if (isPicking) {
      [vertexShader, fragmentShader] = PICKING_RENDERER;
    }
    else {
      let r: VirtualRenderer | undefined;
      r = (typeof renderer == 'string') ? BUILTIN[renderer] : renderer;
      if (!r) throw new Error(`Unknown renderer '${renderer}'`);
      [vertexShader, fragmentShader] = r;
    }

    return [vertexShader, fragmentShader, getVertex, vertexCount, instanceCount, wireframeCommand, wireframeIndirect];
  }, [gV, vC, iC, indirect, m, topology]);

  const getPicking = useOne(() => gP ?? (isPicking ? bindingToModule({uniform: ID_BINDING, constant: id}) : null), id);
  const getFragment = gF;
  const getSurface = gS;
  const getScissor = gC;
  const getLight =  gL;

  // Binds links into shader
  const [v, f] = useMemo(() => {
    const links = {
      getVertex,
      getPicking,
      getFragment,
      getSurface,
      getScissor,
      getLight,
      toColorSpace: getNativeColor(colorInput, colorSpace),
    };
    console.log({links, renderer})
    const v = bindBundle(vertexShader, links, undefined);
    const f = bindBundle(fragmentShader, links, undefined);
    return [v, f];
  }, [vertexShader, fragmentShader, getVertex, getFragment, getPicking, getSurface, getScissor, getLight, isDebug, colorInput, colorSpace]);

  // Inline the render fiber to avoid another memo()
  const call = {
    vertexCount,
    instanceCount,
    indirect: wireframeIndirect ?? indirect,
    vertex: v,
    fragment: f,
    defines,
    pipeline,
    renderContext: resolvedContext,
    mode: m,
    id,
  };

  // Count indirect vertices/instances for wireframe
  if (wireframeCommand) {
    return [use(Dispatch, {shader: wireframeCommand}), use(DrawCall, call)];
  }

  return yeet(drawCall(call));
  */
};
