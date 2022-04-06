import { UniformAttributeValue } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/wgsl/types';

import { useOne } from '@use-gpu/live';
import { makeShaderBindings } from '@use-gpu/core';
import { bindingsToLinks, bindBundle } from '@use-gpu/shader/wgsl';

type Ref<T> = { current: T };

export const useBoundShaderWithRefs = (
  shader: ShaderModule,
  defs: UniformAttributeValue[],
  values: any[],
) => {
  const refs = useOne(() => defs.map(() => ({current: null})), defs);

  let n = Math.min(values.length, refs.length);
  for (let i = 0; i < n; ++i) refs[i].current = values[i];

  return useOne(() => {
    const bindings = makeShaderBindings<ShaderModule>(defs, refs);
    const links = bindingsToLinks(bindings);

    return bindBundle(shader, links);
  }, refs);
}
