import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { StorageSource, Lazy, UniformAttributeValue } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';

import { yeet, useMemo, useOne, useRef } from '@use-gpu/live';
import { resolve } from '@use-gpu/core';
import { bundleToAttribute, bundleToAttributes, getBundleEntry } from '@use-gpu/shader/wgsl';
import { getBoundShader } from '../hooks/useBoundShader';
import { getDerivedSource } from '../hooks/useDerivedSource';

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

  const [dispatchKernel, dispatchSize] = useMemo(() => {
    const entry = getBundleEntry(shader);
    const symbol = bundleToAttribute(shader, entry);

    const workgroupAttr = symbol.attr.find(({name}) => name === 'workgroup_size')?.args ?? [];
    const workgroupSize = workgroupAttr.map(s => parseInt(s) || 1);

    const dataSize = () => resolve(size) ?? target.size;
    const dispatchSize = () => {
      const [w, h, d] = dataSize();
      return [
        Math.ceil(w / (workgroupSize[0] || 1)),
        Math.ceil(h / (workgroupSize[1] || 1)),
        Math.ceil(d / (workgroupSize[2] || 1)),
      ];
    };

    const f = feedback ? (typeof history === 'number' ? feedback.slice(0, history) : feedback) : NO_SOURCES;    
    const s = (source ? [source] : NO_SOURCES).map(s => (s?.buffer) ? getDerivedSource(s, {readWrite: false}) : s);

    const bindings = bundleToAttributes(shader);
    const args = [dataSize, ...sources, ...s, target, ...f];

    const kernel = getBoundShader(shader, bindings, args);
    return [kernel, dispatchSize];
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
    size: dispatchSize,
    shouldDispatch,
    onDispatch,
  }));
};
