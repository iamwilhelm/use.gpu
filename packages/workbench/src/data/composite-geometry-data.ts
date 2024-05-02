import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader';
import type { GPUGeometry, DataSchema, DataField, StorageSource, LambdaSource, CPUGeometry, TypedArray } from '@use-gpu/core';

import { keyed, yeet, gather, useMemo, useOne, useHooks } from '@use-gpu/live';
import { formatToArchetype } from '@use-gpu/core';
import mapValues from 'lodash/mapValues';
import groupBy from 'lodash/groupBy';
import { useRenderProp } from '../hooks/useRenderProp';

import { Data } from './data';

export type CompositeGeometryDataProps = {
  data: CPUGeometry[],
  render?: (meshes: GPUGeometry[]) => LiveElement,
  children?: (meshes: GPUGeometry[]) => LiveElement,
};

export const CompositeGeometryData: LiveComponent<CompositeGeometryDataProps> = (props: CompositeGeometryDataProps) => {
  const {
    data,
  } = props;

  const partitions = useOne(
    () => groupBy(data, (geometry: CPUGeometry) => {
      const {archetype, formats, unwelded, topology} = geometry;
      return archetype ?? (geometry.archetype = formatToArchetype(formats, {topology, unwelded}));
    }),
    data);

  const archetypes = Object.keys(partitions);

  const schemas: Record<number, DataSchema> = useMemo(() =>
    mapValues(partitions, ([item]: CPUGeometry[], archetype: number) =>
      mapValues(item.attributes, (_, k) => ({
        format: `array<${item.formats[k]}>`,
        index: k === 'indices',
        unwelded: !!item.unwelded?.[k],
      }))
    ) as any,
    // Diff archetypes by value
    archetypes
  );

  const items: Record<number, Record<string, TypedArray>[]> = useMemo(() =>
    mapValues(
      partitions,
      (items: CPUGeometry[], archetype: number): Record<string, TypedArray>[] =>
        items.map(i => i.attributes)
    ) as any,
    [data, schemas]
  );

  return gather(archetypes.map((archetype: string) => {
    const data = partitions[archetype];
    if (!data.length) return null;

    const schema = (schemas as any)[archetype as any];
    const {topology, attributes, formats, unwelded} = data[0];

    return keyed(Data, archetype, {
      data: (items as any)[archetype as any],
      schema,
      render: (sources: Record<string, StorageSource | LambdaSource>) => {
        const out = {
          archetype,
          attributes: sources,
          topology,
          unwelded,
        };
        return yeet(out);
      },
    })
  }), (meshes: GPUGeometry[]) => {
    return useRenderProp(props, meshes);
  });
};
