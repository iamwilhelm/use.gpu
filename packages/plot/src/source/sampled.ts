import type { LiveComponent, LiveElement, PropsWithChildren } from '@use-gpu/live';
import type { StorageSource, Emit } from '@use-gpu/core';

import { yeet, use, gather, provide, useContext, useMemo, useOne, tagFunction } from '@use-gpu/live';
import { SampledData, getRenderFunc } from '@use-gpu/workbench';
import { useDataContext, DataContext } from '../providers/data-provider';
import { RangeContext } from '../providers/range-provider';
import { parseAxis } from '@use-gpu/parse';

export type SampledProps = {
  axis?: string,
  axes?: string,

  range?: [number, number][],
  size: number[],

  padding?: number,
  sparse?: boolean,
  centered?: boolean[] | boolean,
  expr?: (emit: Emit, ...args: any[]) => void,
  items?: number,

  format?: string,
  live?: boolean,
  index?: boolean,
  time?: boolean,

  as?: string,

  render?: (source: StorageSource) => LiveElement,
  children?: (source: StorageSource) => LiveElement,
};

export const Sampled: LiveComponent<SampledProps> = (props: PropsWithChildren<SampledProps>) => {
  const {
    axis,
    axes = 'xyzw',
    range: outerRange,
    render,
    children,
    as = 'positions',
    ...rest
  } = props;

  const parentRange = useContext(RangeContext);
  const resolvedRange = outerRange ?? parentRange;

  const a = axis ?? axes;
  const range = useMemo(() => {
    const basis = a.split('').map(parseAxis);
    return basis.map(i => resolvedRange[i]);
  }, [resolvedRange, a]);

  const dataContext = useDataContext();

  return (
    use(SampledData, {
      ...rest,
      range,
      render: tagFunction((source: StorageSource) => {
        const context = useMemo(() => ({...dataContext, [as]: source}), dataContext, source, as);
        const call = getRenderFunc(props);

        return useMemo(() => {
          if (call == null && children == null) return yeet(source);
          if (call) return render(source);
          return (
            provide(DataContext, context, children)
          );
        }, [render, children, source, dataContext]);
      }, 'sample')
    })
  );
};

