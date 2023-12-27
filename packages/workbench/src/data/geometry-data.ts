import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader';
import type { StorageSource, CPUGeometry, GPUGeometry } from '@use-gpu/core';

import { use, yeet, useMemo } from '@use-gpu/live';
import mapObject from 'lodash/zipObject';
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
    mapObject(item.attributes, (_, k) => ({
      format: `array<${formats[k]}>`,
      index: k === 'indices',
      unwelded: !!item.unwelded[k],
    })),
    [attributes, formats],
  );

  return (
    use(Data, {
      fields,
      render: (sources: StorageSource[]) => {
        const out = {
          attributes: sources,
          count,
          topology,
          unwelded,
        };
        return useRenderProp(props, out);
      },
    })
  );
};
