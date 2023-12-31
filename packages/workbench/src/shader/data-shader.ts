import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { StorageSource, Lazy } from '@use-gpu/core';
import type { ShaderSource, ShaderModule } from '@use-gpu/shader';

import { yeet, useMemo, useHooks } from '@use-gpu/live';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';

import { useShaderRefs } from '../hooks/useShaderRef';
import { getDerivedSource } from '../hooks/useDerivedSource';
import { getLambdaSource } from '../hooks/useLambdaSource';
import { useRawSource, useNoRawSource } from '../hooks/useRawSource';
import { getShader } from '../hooks/useShader';
import { useRenderProp } from '../hooks/useRenderProp';

export type DataShaderProps = {
  data?: TensorArray,
  source?: StorageSource,
  shader: ShaderModule,

  sources?: ShaderSource[],
  args?: Lazy<any>[],

  render?: (source: ShaderModule) => LiveElement,
  children?: (source: ShaderModule) => LiveElement,
};

const NO_SOURCES: ShaderSource[] = [];

/** Sample shader for sampling of a linear input buffer.

Provides:
- `@optional @link fn getDataSize() -> vec4<f32>`
- `@optional @link fn getData(i: u32) -> T` where `T` is the source format.

Unnamed arguments are linked in the order of: args, sources, source | data.
*/
export const DataShader: LiveComponent<DataShaderProps> = (props) => {
  const {
    data,
    shader,
    sources = NO_SOURCES,
    args = NO_SOURCES,
    render,
  } = props;

  const argRefs = useShaderRefs(...args);

  const source = data ? useRawSource(data.array, data.format) : (useNoRawSource(), props.source);

  const getData = useMemo(() => {
    const s = (source ? [source] : NO_SOURCES).map(s => ((s as any)?.buffer)
      ? getDerivedSource(s as any, {readWrite: false}) : s);

    const bindings = bundleToAttributes(shader);
    const links = {
      getData: s[0],
      getDataSize: () => source?.size,
    } as Record<string, any>;

    const allArgs = [...argRefs, ...sources];

    const values = bindings.map(b => {
      let k = b.name;
      return links[k] ? links[k] : allArgs.shift();
    });

    return getLambdaSource(
      getShader(shader, values),
      data ?? source
    );
  }, [shader, args.length, data, source, sources]);

  return useRenderProp(props, getData);
};
