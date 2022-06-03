import { LiveComponent } from '@use-gpu/live/types';
import { RenderPassMode, DeepPartial, Prop } from '@use-gpu/core/types';
import { ShaderModule, ParsedBundle, ParsedModule } from '@use-gpu/shader/types';
import { memo, use, fragment, useContext, useNoContext, useMemo, useNoMemo, useOne, useState, useResource, useConsoleLog } from '@use-gpu/live';
import { resolve } from '@use-gpu/core';

import { bindBundle, bindingToModule } from '@use-gpu/shader/wgsl';
import { getWireframe } from '../render/wireframe';
import { useInspectHoverable } from '../hooks/useInspectable';

import instanceDrawVirtualSolid from '@use-gpu/wgsl/render/vertex/virtual-solid.wgsl';
import instanceDrawVirtualPick from '@use-gpu/wgsl/render/vertex/virtual-pick.wgsl';
import instanceDrawVirtualUI from '@use-gpu/wgsl/render/vertex/virtual-ui.wgsl';

import instanceFragmentSolid from '@use-gpu/wgsl/render/fragment/solid.wgsl';
import instanceFragmentPick from '@use-gpu/wgsl/render/fragment/pick.wgsl';
import instanceFragmentUI from '@use-gpu/wgsl/render/fragment/ui.wgsl';

import instanceDrawWireframeStrip from '@use-gpu/wgsl/render/vertex/wireframe-strip.wgsl';
import instanceDrawWireframeList from '@use-gpu/wgsl/render/vertex/wireframe-list.wgsl';

import { render } from './render';

const PICK_RENDERER = [
  instanceDrawVirtualPick,
  instanceFragmentPick,
] as VirtualRenderer;

const SOLID_RENDERER = [
  instanceDrawVirtualSolid,
  instanceFragmentSolid,
] as VirtualRenderer;

const SHADED_RENDERER = [
  instanceDrawVirtualSolid,
  instanceFragmentSolid,
  //instanceDrawVirtualShaded,
  //instanceFragmentShaded,
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

export type VirtualProps = {
  pipeline: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode | string,
  id?: number,

  vertexCount: Prop<number>,
  instanceCount: Prop<number>,

  getVertex: ShaderModule,
  getFragment: ShaderModule,

  renderer?: VirtualRenderer | string,
  defines: Record<string, any>,
  deps: any[] | null,
};

const DEBUG_BINDING = { name: 'getInstanceSize', format: 'u32', value: 0, args: [] };
const ID_BINDING = { name: 'getId', format: 'u32', value: 0, args: [] };

export const Virtual: LiveComponent<VirtualProps> = memo((props: VirtualProps) => {
  const {
    mode = RenderPassMode.Opaque,
    id = 0,
  } = props;

  if (id && mode !== RenderPassMode.Picking) {
    return fragment([
      use(Variant, {...props, id: 0}),
      use(Variant, {...props, mode: RenderPassMode.Picking}),
    ]);
  }
  
  return Variant(props);
}, 'Virtual'); 

export const Variant: LiveComponent<VirtualProps> = (props: VirtualProps) => {
  let {
    getVertex: gV,
    vertexCount: vC,
    instanceCount: iC,

    getFragment,

    pipeline,
    defines,

    renderer = SOLID_RENDERER,
    deps = null,
    mode = RenderPassMode.Opaque,
    id = 0,
  } = props;

  let m = mode;
  const hovered = useInspectHoverable();
  if (hovered) m = RenderPassMode.Debug;

  const isDebug = m === RenderPassMode.Debug;
  const isPicking = m === RenderPassMode.Picking;
  const topology = pipeline.primitive?.topology ?? 'triangle-list';

  const [
    vertexShader,
    fragmentShader,
    getVertex,
    vertexCount,
    instanceCount
  ] = useMemo(() => {
    let vertexShader: ShaderModule;
    let fragmentShader: ShaderModule;

    let getVertex: ShaderModule = gV;
    let vertexCount: Prop<number> = vC;
    let instanceCount: Prop<number> = iC;

    if (isDebug) {
      [vertexShader, fragmentShader] = SOLID_RENDERER;
      ({getVertex, vertexCount, instanceCount} = getWireframe(gV, vC, iC, topology));
    }
    else if (isPicking) {
      [vertexShader, fragmentShader] = PICK_RENDERER;
    }
    else {
      let r: VirtualRenderer | undefined;
      r = (typeof renderer == 'string') ? BUILTIN[renderer] : renderer;
      if (!r) throw new Error(`Unknown renderer '${renderer}'`);
      [vertexShader, fragmentShader] = r;
    }

    return [vertexShader, fragmentShader, getVertex, vertexCount, instanceCount];
  }, [gV, vC, iC, m, topology]);

  const getId = useOne(() => isPicking ? bindingToModule({uniform: ID_BINDING, constant: id}) : null, id);

  // Binds links into shader
  const [v, f] = useMemo(() => {
    const links = {
      getId,
      getVertex,
      getFragment: isDebug ? null : getFragment,
    };
    const v = bindBundle(vertexShader, links, undefined);
    const f = bindBundle(fragmentShader, links, undefined);
    return [v, f];
  }, [vertexShader, fragmentShader, getVertex, getFragment, getId, isDebug]);
  
  // Inline the render fiber to avoid another memo()
  return render({
    vertexCount,
    instanceCount,
    vertex: v,
    fragment: f,
    defines,
    deps,

    pipeline,
    mode: m,
    id,
  });
};
