import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader';
import type { GPUGeometry, DataField, StorageSource, CPUGeometry } from '@use-gpu/core';

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

  const schemas = useMemo(() =>
    mapValues(partitions, ([item]: CPUGeometry[], archetype: number) =>
      mapValues(item.attributes, (_, k) => ({
        format: `array<${formats[k]}>`,
        index: k === 'indices',
        unwelded: !!item.unwelded[k],
      }))
    ),
    // Diff archetypes by value
    archetypes);

  const items = useMemo(() => {
    mapValues(partitions, (items: CPUGeometry[], archetype: number) => items.map(i => i.attributes))
  }, [data, schemas]);

  return gather(archetypes.map((archetype: string) => {
    const data = partitions[archetype];
    if (!data.length) return null;

    const schema = schames[archetype];
    const {topology, attributes, formats, unwelded} = data[0];

    return keyed(Data, archetype, {
      data: items[archetype],
      schema,
      render: (sources: Record<string, StorageSource>) => {
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
