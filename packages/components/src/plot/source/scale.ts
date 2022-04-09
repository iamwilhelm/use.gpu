import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { StorageSource, LambdaSource, UniformType } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/wgsl/types';
import { ScaleTrait, AxisTrait } from '../types'; 

import { yeet, provide, useOne, useMemo, useNoMemo, useContext, incrementVersion } from '@use-gpu/live';

import { DataContext, ValuesContext } from '../../providers/data-provider';
import { RangeContext } from '../../providers/range-provider';
import { useRawStorage } from '../../hooks/useRawStorage';
import { useBoundShaderWithRefs } from '../../hooks/useBoundShaderWithRefs';

import { useProp, useScaleTrait, useAxisTrait } from '../traits';
import { parsePosition4 } from '../util/parse';
import { logarithmic, linear } from '../util/domain';

import { getScalePosition } from '@use-gpu/wgsl/plot/scale.wgsl';

import { vec4 } from 'gl-matrix';

const SCALE_BINDINGS = [
  { name: 'getScaleOrigin', format: 'vec4<f32>', value: vec4.fromValues(0, 0, 0, 0) },
  { name: 'getScaleDirection', format: 'i32', value: 0 },

  { name: 'getScaleValue', format: 'f32', value: 0 },
];

export type ScaleProps = Partial<ScaleTrait> & Partial<AxisTrait> & {
  origin?: VectorLike,
  render?: (positions: LambdaSource) => LiveElement<any>,
  children?: LiveElement<any>,
};

export const Scale: LiveComponent<ScaleProps> = (props) => {

  const {
    origin,
    render,
    children,
  } = props;

  const {axis, range} = useAxisTrait(props);
  const domainOptions = useScaleTrait(props);

  const parentRange = useContext(RangeContext);
  
  const r = range ?? parentRange[axis];
  const p = useProp(origin, parsePosition4);

  const og = vec4.clone(p);
  og[axis] = 0;
  og[3] = 1;

  // Generate tick scale
  const values = useMemo(() => {
    const f = (props.mode === 'log') ? logarithmic : linear;
    return new Float32Array(f(r[0], r[1], domainOptions));
  }, [r[0], r[1], props]);

  const n = values.length;
  const data = useRawStorage(values, UniformType.f32);

  // Make tick vertex shader
  const bound = useBoundShaderWithRefs(getScalePosition, SCALE_BINDINGS, [og, axis], [data]);

  // Expose position source
  const source = useMemo(() => ({
    shader: bound,
    alloc: data.alloc,
    length: n,
    size: [n],
    version: 0,
  }), [bound]);

  useOne(() => {
    source.length = n;
    source.size[0] = n;
  }, n);

  useOne(() => {
    source.version = incrementVersion(source.version);
  }, values);

  return useMemo(() => {
    if (render == null && children === undefined) return yeet(source);
    return (
      provide(ValuesContext, values,
        provide(DataContext, source, render != null ? render(source) : children)
      )
    );
  }, [render, children, source, values]);
}
