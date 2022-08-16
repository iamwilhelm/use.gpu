import type { LC, PropsWithChildren } from '@use-gpu/live';

import { provide, makeContext, useContext, useNoContext, useOne } from '@use-gpu/live';
import { bundleToAttributes } from '@use-gpu/shader/wgsl';
import { useBoundShader } from '../hooks/useBoundShader';

import { getScissorLevel } from '@use-gpu/wgsl/transform/scissor.wgsl';

const SCISSOR_BINDINGS = bundleToAttributes(getScissorLevel);

export type ScissorContextProps = [number, number][];

export type ScissorProps = {
  range: [number, number][],
};

export const ScissorContext = makeContext<ScissorContextProps>(null, 'ScissorContext');

export const useScissorContext = () => useContext<ScissorContextProps | null>(ScissorContext);
export const useNoScissorContext = () => useNoContext(ScissorContext);

export const Scissor: LC<ScissorProps> = (props: PropsWithChildren<ScissorProps>) => {
  const {range, children} = props;

  const min = useOne(() => range.map(r => r[0]), range);
  const max = useOne(() => range.map(r => r[1]), range);

  const bound = useBoundShader(getScissorLevel, SCISSOR_BINDINGS, [min, max]);

  return provide(ScissorContext, bound, children);
};
