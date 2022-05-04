import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { StorageSource, LambdaSource, UniformType } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';
import { ScaleTrait, AxisTrait, VectorLike } from '../types'; 

import { yeet, provide, useOne, useMemo, useNoMemo, useContext, incrementVersion } from '@use-gpu/live';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';

import { DataContext, ValuesContext } from '../../providers/data-provider';
import { RangeContext } from '../../providers/range-provider';
import { useBoundStorage } from '../../hooks/useBoundStorage';
import { useBoundShader } from '../../hooks/useBoundShader';
import { useShaderRef } from '../../hooks/useShaderRef';

import { useProp, useScaleTrait, useAxisTrait } from '../traits';
import { parsePosition4 } from '../util/parse';
import { logarithmic, linear } from '../util/domain';

import { getScalePosition } from '@use-gpu/wgsl/plot/scale.wgsl';

import { vec4 } from 'gl-matrix';

const SCALE_BINDINGS = bundleToAttributes(getScalePosition);

export type ScaleProps = Partial<ScaleTrait> & Partial<AxisTrait> & {
  origin?: VectorLike,
  render?: (positions: LambdaSource, values: Float32Array) => LiveElement<any>,
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

  // Generate tick scale
  const newValues = useMemo(() => {
    const f = (props.mode === 'log') ? logarithmic : linear;
    return new Float32Array(f(r[0], r[1], domainOptions));
  }, [r[0], r[1], props]);

  const values = useMemo(() => newValues, newValues as any);
  const data = useBoundStorage(values, 'f32');
  const n = values.length;

  // Make tick vertex shader
  const og = vec4.clone(p as any);
  og[axis] = 0;

  const o = useShaderRef(og);
  const a = useShaderRef(axis);
  const bound = useBoundShader(getScalePosition, SCALE_BINDINGS, [data, a, o]);

  // Expose position source
  const source = useMemo(() => ({
    shader: bound,
    alloc: (data as any).alloc,
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
        provide(DataContext, source, render != null ? render(source, values) : children)
      )
    );
  }, [render, children, source, values]);
}
