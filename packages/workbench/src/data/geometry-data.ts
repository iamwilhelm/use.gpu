import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader';
import type { StorageSource, CPUGeometry, GPUGeometry } from '@use-gpu/core';

import { use, yeet, useMemo } from '@use-gpu/live';
import mapValues from 'lodash/mapValues';
import { useRenderProp } from '../hooks/useRenderProp';

import { Data } from './data';

export type GeometryDataProps = CPUGeometry & {
  render?: (source: GPUGeometry) => LiveElement,
  children?: (source: GPUGeometry) => LiveElement,
};

export const GeometryData: LiveComponent<GeometryDataProps> = (props: GeometryDataProps) => {
  const {
    count,
    topology,
    attributes,
    formats,
    unwelded,
  } = props;

  const schema = useMemo(() =>
    mapValues(attributes, (_, k) => ({
      format: `array<${formats[k]}>`,
      index: k === 'indices',
      unwelded: !!unwelded?.[k],
    })),
    [attributes, formats],
  );
  console.log(attributes, schema)

  return (
    use(Data, {
      schema,
      data: attributes,
      render: (sources: StorageSource[]) => {
        const out = {
          count,
          topology,
          attributes: sources,
          unwelded,
        };
        console.log('useRenderProp <GeometryData>', out, props)
        return useRenderProp(props, out);
      },
    })
  );
};
