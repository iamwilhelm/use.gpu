import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader';
import type { GPUGeometry, DataField, StorageSource, GeometryArray } from '@use-gpu/core';

import { keyed, yeet, gather, useMemo, useYolo } from '@use-gpu/live';
import { getAggregateArchetype } from '@use-gpu/core';
import zipObject from 'lodash/zipObject';
import groupBy from 'lodash/groupBy';

import { CompositeData } from './composite-data';

export type CompositeGeometryDataProps = {
  data: GeometryArray[],
  render?: (meshes: GPUGeometry[]) => LiveElement,
};

export const CompositeGeometryData: LiveComponent<CompositeGeometryDataProps> = (props: CompositeGeometryDataProps) => {
  const {
    data,
    render,
  } = props;

  const partitions = groupBy(data, (geometry: GeometryArray) => {
    const {archetype, formats, unwelded} = geometry;
    return archetype ?? (geometry.archetype = getAggregateArchetype(formats, unwelded));
  });

  const archetypes = Object.keys(partitions);

  return gather(archetypes.map((archetype: string) => {
    const data = partitions[archetype];
    if (!data.length) return null;

    const {topology, attributes, formats, unwelded} = data[0];
    const fields = useMemo(() =>
      Object.keys(attributes).map(k => [
        `array<${formats[k]}>`,
        d => d.attributes[k],
        k === 'indices' ? 'index' : unwelded?.[k] ? 'unwelded' : null,
      ] as DataField),
      [attributes, formats, unwelded]
    );

    return keyed(CompositeData, archetype, {
      data,
      fields,
      render: (...sources: StorageSource[]) => {
        const out = {
          ...zipObject(Object.keys(attributes), sources),
          topology,
          unwelded,
        };
        return yeet(out);
      },
    })
  }), (meshes: Record<string, StorageSource>[]) => {
    return useYolo(() => render ? render(meshes) : yeet(meshes), [render, meshes]);
  });
};
