import type { LiveComponent } from '@use-gpu/live';
import type { VectorLike } from '@use-gpu/traits';
import type { ShaderModule } from '@use-gpu/shader';
import type { XYZW } from '@use-gpu/core';

import { makeUseTrait, optional, combine, trait, useProp } from '@use-gpu/traits/live';
import { parseBoolean, parseIntegerPositive, parseAxis, parseVec4 } from '@use-gpu/parse';
import { yeet, memo, use, fragment, gather, provide, useContext, useFiber, useOne, useMemo } from '@use-gpu/live';
import {
  useShader, useNoShader,
  useViewContext, useRawSource,
  useShaderRef, useNoShaderRef,
  useTransformContext, useNoTransformContext,
  Data, LineLayer,
} from '@use-gpu/workbench';

import { useRangeContext } from '../providers/range-provider';

import { vec4 } from 'gl-matrix';

import { logarithmic, linear } from '../util/domain';

import { getGridPosition } from '@use-gpu/wgsl/plot/grid.wgsl';
import { getGridAutoState } from '@use-gpu/wgsl/plot/grid-auto.wgsl';
import { getLineSegment } from '@use-gpu/wgsl/geometry/segment.wgsl';

import {
  ColorTrait,
  GridTrait,
  LineTrait,
  ROPTrait,
  ScaleTrait,
  ZIndexTrait,
} from '../traits';

const Traits = combine(
  ColorTrait,
  GridTrait,
  LineTrait,
  ROPTrait,
  ZIndexTrait,
  trait({
    origin: parseVec4,
    auto: optional(parseBoolean),
  }),
);

const useScaleTrait = makeUseTrait(ScaleTrait);
const useTraits = makeUseTrait(Traits);

const NO_POINT4: XYZW = [0, 0, 0, 0];

export type GridProps =
  TraitProps<typeof Traits>
& {
  first?: Partial<ScaleTrait> & { detail?: number },
  second?: Partial<ScaleTrait> & { detail?: number },
};

const NO_SCALE_PROPS: Partial<ScaleTrait> = {};

export const Grid: LiveComponent<GridProps> = (props) => {
  const {
    axes, range, loop,
    origin, auto,
    zIndex,
    ...flags
  } = useTraits(props);

  const first = useScaleTrait(props.first ?? NO_SCALE_PROPS);
  const second = useScaleTrait(props.second ?? NO_SCALE_PROPS);

  const firstDetail = useProp(props.first?.detail, parseIntegerPositive);
  const secondDetail = useProp(props.second?.detail, parseIntegerPositive);

  const parentRange = useRangeContext();
  const transform = useTransformContext();

  const getGrid = (options: ScaleTrait, detail: number, index: number, other: number) => {
    const main  = parseAxis(axes[index]);
    const cross = parseAxis(axes[other]);

    const r = range?.[index] ?? parentRange[main];
    const r2 = range?.[other] ?? parentRange[cross];

    const newValues = useMemo(() => {
      const f = (options.mode === 'log') ? logarithmic : linear;
      return new Float32Array(f(r[0], r[1], options));
    }, [r[0], r[1], options]);

    const values = useMemo(() => newValues, newValues as any);
    const data = useRawSource(values, 'f32');
    const n = values.length * (detail + 1);

    const orig = vec4.clone(origin);
    const shift = vec4.clone(NO_POINT4);

    let autoBound: ShaderModule | null = null;
    if (auto) {
      orig.forEach((_, i) => {
        // Pin to minimum
        orig[i] = parentRange[i][0];

        if (i === main || i === cross) {
          shift[i] = 0;
        }
        else {
          shift[i] = parentRange[i][1] - parentRange[i][0];
        }
      });

      autoBound = useShader(getGridAutoState, [transform.transform]);
    }
    else {
      useNoShader();
    }

    const min = vec4.clone(orig as any);
    min[main] = 0;
    min[cross] = r2[0];

    const max = vec4.clone(orig as any);
    max[main] = 0;
    max[cross] = r2[1];

    const m = useShaderRef(main);
    const m1 = useShaderRef(min);
    const m2 = useShaderRef(max);
    const s = useShaderRef(shift);

    const defines = useOne(() => ({ LINE_DETAIL: detail, GRID_AUTO: !!auto }), detail);
    const bound = useShader(getGridPosition, [data, m, m1, m2, s, autoBound], defines);

    // Expose position source
    const source = useMemo(() => ({
      shader: bound,
      length: n,
      size: [n],
    }), [bound]);

    source.length = n;
    source.size[0] = n;

    return source;
  };

  const firstPositions = getGrid(first as any, firstDetail, 0, 1);
  const secondPositions = getGrid(second as any, secondDetail, 1, 0);

  // const firstLoop = loop || props.first?.loop;
  // const secondLoop = loop || props.second?.loop;

  const {id} = useFiber();
  const view = fragment([
    props.first !== null ? use(LineLayer, {
      count: () => firstPositions.length * (auto ? 2 : 1),
      positions: firstPositions,
      segments: getLineSegment,
      ...flags,
    }) : null,
    props.second !== null ? use(LineLayer, {
      count: () => secondPositions.length * (auto ? 2 : 1),
      positions: secondPositions,
      segments: getLineSegment,
      ...flags,
    }) : null,
  ], id);

  return yeet({
    element: {
      transform,
      element: view,
      zIndex,
    },
  });
};
