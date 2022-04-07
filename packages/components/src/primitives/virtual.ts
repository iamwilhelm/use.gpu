import { LiveComponent } from '@use-gpu/live/types';
import { RenderPassMode, DeepPartial } from '@use-gpu/core/types';
import { ShaderModule, ParsedBundle, ParsedModule } from '@use-gpu/shader/types';
import { memo, use, useContext, useNoContext, useFiber, useMemo, useOne, useState, useResource, useConsoleLog } from '@use-gpu/live';

import { bindBundle, bindingsToLinks } from '@use-gpu/shader/wgsl';
import { useRenderPipeline } from '../hooks/useRenderPipeline';

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
	let instanceSize = vertexCount;
  if (isDebug) {
    if (topology === 'triangle-strip') {
      const tris = vertexCount - 2;
      const edges = tris * 2 + 1;
      
      instanceCount = edges * instanceCount;
			instanceSize = edges;
      vertexCount = 4;
    }
    else if (topology === 'triangle-list') {
      instanceCount = vertexCount * instanceCount;
			instanceSize = vertexCount;
      vertexCount = 18;
    }
  }

  // Binds links into shader
  const key = useFiber().id;
  const [v, f] = useMemo(() => {
		const defines = { WIREFRAME_INSTANCE_SIZE: instanceSize };
    const links = { getVertex, getFragment };
    const v = bindBundle(vertexShader, links, defines, key);
    const f = bindBundle(fragmentShader, links, defines, key);
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
