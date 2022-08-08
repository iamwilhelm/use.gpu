import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { StorageSource, Lazy, UniformAttributeValue } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';

import { yeet, useMemo, useOne, useRef } from '@use-gpu/live';
import { resolve } from '@use-gpu/core';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';
import { getBoundShader } from '../hooks/useBoundShader';

import { useComputeContext } from '../providers/compute-provider';
import { useFeedbackContext, useNoFeedbackContext } from '../providers/feedback-provider';
import { RenderContext } from '../providers/render-provider';

import { dispatch } from '../primitives/dispatch';

export type KernelProps = {
  shader: ShaderModule,
  source?: StorageSource,
  sources?: StorageSource[],
  size?: Lazy<number[]>,
  initial?: boolean,
  history?: boolean,
  swap?: boolean,
};

const NO_SOURCES: StorageSource[] = [];

export const Kernel: LiveComponent<KernelProps> = (props) => {
  const {
    shader,
    source,
    sources = NO_SOURCES,
    size,
    initial,
    history,
    swap,
  } = props;

  const target = useComputeContext();
  const feedback = history ? target.history : null;

  const [dispatchKernel, s] = useMemo(() => {
    const sz = resolve(size) ?? target.size;

    const f = feedback ? (typeof history === 'number' ? feedback.slice(0, history) : feedback) : NO_SOURCES;    
    const s = (source ? [source] : NO_SOURCES).map(s => ({...s, readWrite: false}));

    const attr = bundleToAttributes(shader);
    const args = [...sources, ...s, target, ...f];

    const kernel = getBoundShader(shader, attr, args);
    return [kernel, sz];
  }, [shader, target, source, sources, feedback, history]);

  let first = useRef(true);
  useOne(() => { first.current = true; }, target);

  const shouldDispatch = initial ? () => {
    if (!first.current) return false;
    first.current = false;
  } : undefined;

  const onDispatch = () => {
    if (swap && target.swap) target.swap();
  };

  return yeet(dispatch({
    shader: dispatchKernel,
    size: s,
    shouldDispatch,
    onDispatch,
  }));
};
