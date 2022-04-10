import { LiveComponent } from '@use-gpu/live/types';
import { RenderPassMode, DeepPartial } from '@use-gpu/core/types';
import { ShaderModule, ParsedBundle, ParsedModule } from '@use-gpu/shader/types';
import { memo, use, useContext, useNoContext, useFiber, useMemo, useNoMemo, useOne, useState, useResource, useConsoleLog } from '@use-gpu/live';
import { resolve } from '@use-gpu/core';

import { bindBundle, bindingToModule } from '@use-gpu/shader/wgsl';

import instanceDrawVirtual from '@use-gpu/wgsl/instance/draw/virtual.wgsl';
import instanceDrawVirtualPick from '@use-gpu/wgsl/instance/draw/virtual-pick.wgsl';

import instanceFragmentSolid from '@use-gpu/wgsl/instance/fragment/solid.wgsl';
import instanceFragmentSolidPick from '@use-gpu/wgsl/instance/fragment/solid-pick.wgsl';

import instanceDrawWireframeStrip from '@use-gpu/wgsl/instance/draw/wireframe-strip.wgsl';
import instanceDrawWireframeList from '@use-gpu/wgsl/instance/draw/wireframe-list.wgsl';

import { render } from './render';

export type VirtualProps = {
  pipeline: DeepPartial<GPURenderPipelineDescriptor>,
  mode?: RenderPassMode | string,
  id?: number,

  vertexCount: number,
  instanceCount: number,

  getVertex: ShaderModule,
  getFragment: ShaderModule,

  defines: Record<string, any>,
  deps: any[] | null,
};

const DEBUG_BINDING = { name: 'getInstanceSize', format: 'i32', value: 0 };

export const Virtual: LiveComponent<VirtualProps> = memo((props: VirtualProps) => {
  const {
    getVertex,
    getFragment,

    pipeline,
    defines,
    deps = null,
    mode = RenderPassMode.Opaque,
    id = 0,
  } = props;

  const isDebug = mode === RenderPassMode.Debug;
  const isPicking = mode === RenderPassMode.Picking;

  const topology = pipeline.primitive?.topology ?? 'triangle-list';

  let vertexShader: ParsedBundle;
  let fragmentShader: ParsedBundle;
  if (isDebug) {
    if (topology === 'triangle-strip') vertexShader   = instanceDrawWireframeStrip;
    else vertexShader = instanceDrawWireframeList;
    fragmentShader = instanceFragmentSolid;
  }
  else {
    vertexShader   = isPicking ? instanceDrawVirtualPick : instanceDrawVirtual;
    fragmentShader = isPicking ? instanceFragmentSolidPick : instanceFragmentSolid;
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
      else if (topology === 'triangle-list') {
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

  // Binds links into shader
  const key = useFiber().id;
  const [v, f] = useMemo(() => {
    const links = { getVertex, getFragment, getInstanceSize };
    const v = bindBundle(vertexShader, links, undefined, key);
    const f = bindBundle(fragmentShader, links, undefined, key);
    return [v, f];
  }, [vertexShader, fragmentShader, getVertex, getFragment]);

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
