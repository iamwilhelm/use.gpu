import type { LiveComponent, LiveElement, PropsWithChildren } from '@use-gpu/live';
import type { StorageSource, LambdaSource, UniformType } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';
import type { VectorLike } from '@use-gpu/traits';

import { makeUseTrait, optional, combine, trait, useProp } from '@use-gpu/traits/live';
import { parseVec4 } from '@use-gpu/parse';
import { yeet, provide, useOne, useMemo, useNoMemo, useContext, incrementVersion } from '@use-gpu/live';
import { useLambdaSource, useRawSource, useShader, useShaderRef, getRenderFunc } from '@use-gpu/workbench';

import { useDataContext, DataContext, ValuesContext } from '../providers/data-provider';
import { useRangeContext } from '../providers/range-provider';

import { logarithmic, linear } from '../util/domain';
import { vec4 } from 'gl-matrix';

import { getScalePosition } from '@use-gpu/wgsl/plot/scale.wgsl';

import {
  ScaleTrait,
  AxisTrait,
} from '../traits';

const Traits = combine(
  ScaleTrait,
  AxisTrait,
  trait({
    origin: parseVec4,
  }),
);

const useTraits = makeUseTrait(Traits);

export type ScaleProps = TraitProps<typeof Traits> & {
  as?: string,
  render?: (positions: LambdaSource, values: Float32Array) => LiveElement,
  children?: (positions: LambdaSource, values: Float32Array) => LiveElement,
};

export const Scale: LiveComponent<ScaleProps> = (props: PropsWithChildren<ScaleProps>) => {

  const {
    as = 'positions',
    children,
  } = props;

  const {axis, range, origin, ...domainOptions} = useTraits(props);

  const parentRange = useRangeContext();
  const r = range ?? parentRange[axis];

  // Generate tick scale
  const newValues = useMemo(() => {
    const f = (props.mode === 'log') ? logarithmic : linear;
    return new Float32Array(f(r[0], r[1], domainOptions));
  }, [r[0], r[1], props]);

  const values = useMemo(() => newValues, newValues as any);
  const data = useRawSource(values, 'f32');
  const length = values.length;

  // Make scale position vertex shader
  const og = vec4.clone(origin as any);
  og[axis] = 0;

  const n = useShaderRef(length);
  const o = useShaderRef(og);
  const a = useShaderRef(axis);
  const bound = useShader(getScalePosition, [data, a, o]);

  // Expose position source
  const source = useLambdaSource(bound, { length: n });

  const dataContext = useDataContext();
  const context = useMemo(() => ({...dataContext, [as]: source}), dataContext, source, as);
  const call = getRenderFunc(props);

  return useMemo(() => {
    if (call == null && children == null) return yeet(source);
    if (call) return call(source, values);
    if (children != null) {
      return (
        provide(ValuesContext, values,
          provide(DataContext, context, children)
        )
      );
    };
  }, [call, children, source, context, values]);
}
