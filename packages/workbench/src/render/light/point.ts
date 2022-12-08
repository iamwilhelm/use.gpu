import type { LiveComponent, LiveElement, Lazy, TextureSource } from '@use-gpu/live';
import type { ShaderModule } from '@use-gpu/shader/wgsl';
import type { VirtualDraw } from '../pass';
import type { LightKindProps } from './light';
import type { BoundLight } from '../../light/types';

import { yeet, useCallback, useMemo, useOne, useRef } from '@use-gpu/live';
import { uploadBuffer } from '@use-gpu/core';
import { bindBundle, bindEntryPoint, bundleToAttributes } from '@use-gpu/shader/wgsl';

import { useBufferedSize } from '../../hooks/useBufferedSize';
import { useBoundShader } from '../../hooks/useBoundShader';
import { useRawSource } from '../../hooks/useRawSource';

import { useDeviceContext } from '../../providers/device-provider';
import { useViewContext } from '../../providers/view-provider';

import { makeSphereGeometry } from '../../primitives/geometry/sphere';

import { getLightVertex } from '@use-gpu/wgsl/instance/vertex/light.wgsl';
import { getLightFragment } from '@use-gpu/wgsl/instance/fragment/light.wgsl';

import { GEOMETRY_PIPELINE, GEOMETRY_DEFS, useLightRender } from './light';

const VERTEX_BINDINGS = bundleToAttributes(getLightVertex);
const FRAGMENT_BINDINGS = bundleToAttributes(getLightFragment);

export const PointLightRender: LiveComponent<LightKindProps> = (props: LightKindProps) => {
  const {
    lights,
    order,
    start,
    end,
    gbuffer,

    getLight,
    applyLight,
  } = props;

  const device = useDeviceContext();
  const {cull} = useViewContext();

  const sphere = useOne(() => makeSphereGeometry({ width: 2, detail: [4, 8] }));
  const getPosition = useRawSource(sphere.attributes.positions, 'vec4<f32>');
  const getIndex = useRawSource(sphere.attributes.indices, 'u16');

  const size = useBufferedSize(end - start);
  const indices = useOne(() => new Uint16Array(size), size);
  const getInstance = useRawSource(indices, 'u16');

  const getVertex = useBoundShader(getLightVertex, VERTEX_BINDINGS, [getLight, getInstance, getPosition, getIndex], GEOMETRY_DEFS);
  const getFragment = useBoundShader(getLightFragment, FRAGMENT_BINDINGS, [...gbuffer, getLight, applyLight]);

  const links = useMemo(() => ({getVertex, getFragment}), [getVertex, getFragment]);

  const countRef = useRef(0);

  const onDispatch = useCallback(() => {
    let count = 0;
    for (let i = start; i < end; ++i) {
      const light = lights.get(order[i]);
      const {position, intensity, cutoff} = light;
      const radius = Math.sqrt(intensity * 3.1415 / cutoff);
      if (cull(position, radius)) indices[count++] = i;
    }
    countRef.current = count;

    uploadBuffer(device, getInstance.buffer, indices.buffer);
  }, [lights, indices]);

  return yeet(useLightRender(sphere.count, countRef, 0, links, GEOMETRY_PIPELINE, onDispatch));
}
