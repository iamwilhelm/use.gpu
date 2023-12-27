import type { LC, PropsWithChildren } from '@use-gpu/live';

import { provide, useOne } from '@use-gpu/live';
import { ScissorContext, useShader, useShaderRefs } from '@use-gpu/workbench';

import { useRangeContext, useNoRangeContext } from '../providers/range-provider';

import { getScissorLevel } from '@use-gpu/wgsl/transform/scissor.wgsl';

const NO_LOOP = [0, 0, 0, 0];

export type ScissorProps = {
  loop?: boolean,
  range?: [number, number][],
};

export const Scissor: LC<ScissorProps> = (props: PropsWithChildren<ScissorProps>) => {
  const {loop = NO_LOOP, children} = props;

  const range = props.range ? (useNoRangeContext(), props.range) : useRangeContext();

  const min = useOne(() => range.map(r => r[0]), range);
  const max = useOne(() => range.map(r => r[1]), range);

  const defines = useOne(() => ({
    HAS_SCISSOR_LOOP: loop.some(x => !!x),
  }), loop);

  const bound = useShader(getScissorLevel, useShaderRefs(min, max, loop), defines);

  return provide(ScissorContext, bound, children);
};
