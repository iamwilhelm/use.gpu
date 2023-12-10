import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ShaderSource } from '@use-gpu/shader';
import type { StorageSource, CPUGeometry, GPUGeometry } from '@use-gpu/core';

import { use, yeet, useMemo } from '@use-gpu/live';
import zipObject from 'lodash/zipObject';

import { Data } from './data';

export type GeometryDataProps = CPUGeometry & {
  render?: (sources: GPUGeometry) => LiveElement,
};

export const GeometryData: LiveComponent<GeometryDataProps> = (props: GeometryDataProps) => {
  const {
    count,
    topology,
    attributes,
    formats,
    unwelded,
    render,
  } = props;

  const fields = useMemo(() =>
    Object.keys(attributes).map(k => [
      formats[k],
      attributes[k],
    ]),
    [attributes, formats],
  );

  return (
    use(Data, {
      fields,
      render: (...sources: StorageSource[]) => {
        const out = {
          ...zipObject(Object.keys(attributes), sources),
          count,
          topology,
          unwelded,
        };
        return render ? render(out) : yeet(out);
      },
    })
  );
};
