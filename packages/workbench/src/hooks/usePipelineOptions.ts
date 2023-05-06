import type { Update } from '@use-gpu/state';
import { BLEND_NONE, BLEND_ALPHA, BLEND_PREMULTIPLIED, BLEND_ADDITIVE } from '@use-gpu/core';
import { useMemo } from '@use-gpu/live';
import { $set, $delete } from '@use-gpu/state';
import { useRenderContext } from '../providers/render-provider';

export type PipelineOptions = {
  mode: string,
  blend: 'none' | 'alpha' | 'premultiplied' | 'additive' | GPUBlendState,
  side: 'front' | 'back' | 'both',
  shadow: boolean,
  scissor: any,
  depthWrite: boolean,
  depthTest: boolean,
  alphaToCoverage: boolean,
  topology: GPUPrimitiveTopology,
  stripIndexFormat: any,
};

const BLENDS = {
  none: BLEND_NONE,
  alpha: BLEND_ALPHA,
  premultiplied: BLEND_PREMULTIPLIED,
  additive: BLEND_ADDITIVE,
};

const CULL_SIDE = {
  front: 'back',
  back: 'front',
  both: 'none',
} as Record<string, GPUCullMode>;

export const usePipelineOptions = (
  options: Partial<PipelineOptions>,
): [
  Update<GPURenderPipelineDescriptor>,
  Record<string, any>,
] => {
  const {
    shadow = null,
    scissor = null,
    mode = 'opaque',
    topology = 'triangle-list',
    stripIndexFormat = undefined,
    side = 'both',
    depthTest = null,
    depthWrite = null,
    alphaToCoverage = false,
    blend = (mode === 'transparent' && !alphaToCoverage) ? 'premultiplied' : 'none',
  } = options;

  const {samples} = useRenderContext();

  const pipeline = useMemo(() => {
    const primitive = {
      topology: topology,
      cullMode: CULL_SIDE[side],
      stripIndexFormat,
    };

    const multisample = {
      alphaToCoverageEnabled: alphaToCoverage && samples > 1,
    };
  
    const fragment = {
      targets: {
        0: {blend: typeof blend === 'object' ? $set(blend) : (BLENDS[blend] ?? $delete())},
      } as any
    };
  
    const depthStencil = {
      depthWriteEnabled: depthWrite != null ? depthWrite : undefined,
      depthCompare: depthTest === false ? 'always' as GPUCompareFunction : undefined,
    };

    return {primitive, multisample, fragment, depthStencil};
  }, [
    mode,
    topology,
    side,
    depthTest,
    depthWrite,
    alphaToCoverage,
    blend,
    samples,
  ]);

  const defs = useMemo(() => ({
    HAS_ALPHA_TO_COVERAGE: alphaToCoverage && samples > 1,
    HAS_SCISSOR: !!scissor,
    HAS_SHADOW: !!shadow,
  }), [alphaToCoverage, samples, !!scissor, !!shadow]);

  return [pipeline, defs];
};
