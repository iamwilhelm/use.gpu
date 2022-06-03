import { LiveComponent } from '@use-gpu/live/types';
import { RenderPassMode, DeepPartial, Prop } from '@use-gpu/core/types';
import { ShaderModule, ParsedBundle, ParsedModule } from '@use-gpu/shader/types';
import { memo, use, useContext, useNoContext, useMemo, useNoMemo, useOne, useState, useResource, useConsoleLog } from '@use-gpu/live';
import { resolve } from '@use-gpu/core';

import { bindBundle, bindingToModule } from '@use-gpu/shader/wgsl';
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

const DEBUG_RENDERER = {
  list: instanceDrawWireframeList,
  strip: instanceDrawWireframeStrip,
  fragment: instanceFragmentSolid,
} as Record<string, ParsedBundle>;

const PICK_PASS = [
  instanceDrawVirtualPick,
  instanceFragmentPick,
] as [ParsedBundle, ParsedBundle];

const SOLID_RENDERER = {
  color: [
    instanceDrawVirtualSolid,
    instanceFragmentSolid,
  ],
  pick: PICK_PASS,
} as VirtualRenderer;

const SHADED_RENDERER = {
  color: [
    instanceDrawVirtualSolid,
    instanceFragmentSolid,
    //instanceDrawVirtualShaded,
    //instanceFragmentShaded,
  ],
  pick: PICK_PASS,
} as VirtualRenderer;

const UI_RENDERER = {
  color: [
    instanceDrawVirtualUI,
    instanceFragmentUI,
  ],
  pick: PICK_PASS,
} as VirtualRenderer;

const BUILTIN = {
  solid: SOLID_RENDERER,
  shaded: SHADED_RENDERER,
  ui: UI_RENDERER,
} as Record<string, VirtualRenderer>;

type VirtualRenderer = {
  color: [ParsedBundle, ParsedBundle],
  pick: [ParsedBundle, ParsedBundle],
};

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
    getVertex,
    getFragment,

    pipeline,
    defines,

    renderer = SOLID_RENDERER,
    deps = null,
    mode = RenderPassMode.Opaque,
    id = 0,
  } = props;

  const hovered = useInspectHoverable();

  const isDebug = mode === RenderPassMode.Debug || hovered;
  const isPicking = mode === RenderPassMode.Picking;

  const topology = pipeline.primitive?.topology ?? 'triangle-list';

  let vertexShader: ParsedBundle;
  let fragmentShader: ParsedBundle;
  
  if (isDebug) {
    vertexShader = DEBUG_RENDERER[(topology === 'triangle-strip') ? 'strip' : 'list'];
    fragmentShader = DEBUG_RENDERER.fragment;
  }
  else {
    let r: VirtualRenderer | undefined;
    r = (typeof renderer == 'string') ? BUILTIN[renderer] : renderer;
    if (!r) throw new Error(`Unknown renderer '${renderer}'`);

    const k = isPicking ? 'pick' : 'color';
    [vertexShader, fragmentShader] = r[k];
  }

  // Debug wireframe
  let {
    vertexCount,
    instanceCount,
  } = props;

  let getInstanceSize: ShaderModule | null = null;

  if (isDebug) {
    const i = instanceCount;
    const v = vertexCount;

    [vertexCount, instanceCount, getInstanceSize] = useMemo(() => {
      let vertexCount, instanceCount, instanceSize;

      if (topology === 'triangle-strip') {
        const edges = () => (resolve(v) - 2) * 2 + 1;

        vertexCount = 4;
        instanceCount = () => edges() * resolve(i);
        instanceSize = edges;
      }
      else /*if (topology === 'triangle-list')*/ {
        vertexCount = 18;
        instanceCount = () => resolve(v) * resolve(i);
        instanceSize = () => resolve(v);
      }
    
      const getInstanceSize = bindingToModule({uniform: DEBUG_BINDING, constant: instanceSize});      
      return [vertexCount, instanceCount, getInstanceSize];
    }, [vertexCount, instanceCount]);
  }
  else {
    useNoMemo();
  }

  const getId = useOne(() => isPicking ? bindingToModule({uniform: ID_BINDING, constant: id}) : null, id);

  // Binds links into shader
  const [v, f] = useMemo(() => {
    const links = {
      getVertex,
      getFragment: isDebug ? null : getFragment,
      getId,
      getInstanceSize: isDebug ? getInstanceSize : null,
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
    mode,
    id,
  });
}, "Virtual");
