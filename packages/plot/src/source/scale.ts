import type { LiveComponent, LiveElement, PropsWithChildren } from '@use-gpu/live';
import type { TensorArray } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';
import type { VectorLike } from '@use-gpu/traits';

import { makeUseTrait, optional, combine, trait, shouldEqual, sameShallow, useProp } from '@use-gpu/traits/live';
import { parseVec4 } from '@use-gpu/parse';
import { memo, yeet, provide, useMemo, useNoMemo } from '@use-gpu/live';
import { toTensorArray, fillNumberArray } from '@use-gpu/core';
import { getRenderFunc } from '@use-gpu/workbench';

import { useDataContext, DataContext } from '../providers/data-provider';
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
  /** Omit to provide data context `positions` and `values` instead. */
  render?: (data: {positions: TensorArray, values: TensorArray}) => LiveElement,
  children?: (data: {positions: TensorArray, values: TensorArray}) => LiveElement,
};

export const Scale: LiveComponent<ScaleProps> = memo((props: PropsWithChildren<ScaleProps>) => {

  const {
    children,
  } = props;

  const {axis, range, origin, ...domainOptions} = useTraits(props);

  const parentRange = useRangeContext();
  const r = range ?? parentRange[axis];

  // Generate value scale
  const values = useMemo(() => {
    const f = (props.mode === 'log') ? logarithmic : linear;
    return toTensorArray('f32', new Float32Array(f(r[0], r[1], domainOptions)));
  }, [r[0], r[1], props]);
  const version = useMemo(() => [], [...values.array]);

  // Generate positions aligned with origin
  const n = values.length;
  const positions = useMemo(() => {
    const vs = values.array;
    const array = new Float32Array(n * 4);
    fillNumberArray(origin, array, 4, 4, 0, 0, n);
    for (let i = 0; i < n; ++i) array[i * 4 + axis] = vs[i];
    return toTensorArray('vec4<f32>', array);
  }, [version, origin]);

  const render = getRenderFunc(props);

  const tensors = useMemo(() => ({positions, values}), [positions, version]);
  const dataContext = useDataContext();
  const context = !render && children ? useMemo(() => ({
    ...dataContext,
    ...tensors,
  }), [dataContext, tensors]) : useNoMemo();

  return render ? render(tensor) : children ? provide(DataContext, context, children) : yeet(tensor);
}, shouldEqual({
  origin: sameShallow(),
  range: sameShallow(sameShallow()),
}), 'Scale');
