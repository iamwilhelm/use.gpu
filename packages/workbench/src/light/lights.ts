import { LC, PropsWithChildren } from '@use-gpu/live/types';
import { TypedArray, StorageSource } from '@use-gpu/core/types';
import { Light } from './types';

import { LightContext, LightConsumer } from '../providers/light-provider';
import { useDeviceContext } from '../providers/device-provider';

import { consume, provide, gather, keyed, makeContext, useContext, useConsumer, useMemo, useOne } from '@use-gpu/live';
import { bundleToAttribute, bundleToAttributes, getBundleKey } from '@use-gpu/shader/wgsl';
import { makeUniformLayout, makeLayoutFiller, makeLayoutData, makeStorageBuffer, uploadBuffer } from '@use-gpu/core';
import { useBufferedSize } from '../hooks/useBufferedSize';
import { getBoundShader } from '../hooks/useBoundShader';
import { getShaderRef } from '../hooks/useShaderRef';

import { Light as WGSLLight } from '@use-gpu/wgsl/use/types.wgsl';
import { applyLights as applyLightsWGSL } from '@use-gpu/wgsl/material/lit.wgsl';

export const useLightConsumer = (light: Light) => useConsumer(LightConsumer, light);

const LIGHTS_BINDINGS = bundleToAttributes(applyLightsWGSL);
const LIGHT_ATTRIBUTE = bundleToAttribute(WGSLLight);
const LIGHT_LAYOUT = makeUniformLayout(LIGHT_ATTRIBUTE.members);

type LightsProps = {
  max?: number,
};

export const Lights: LC = (props: PropsWithChildren<object>) => {
  const {
    max = 32,
    children,
  } = props;
  
  const device = useDeviceContext();

  // Make light storage buffer
  const [context, storage, data] = useMemo(() => {
    const data = makeLayoutData(LIGHT_LAYOUT, max);
    const buffer = makeStorageBuffer(device, data);

    const storage = {
      buffer,
      format: WGSLLight,
      length: 0,
      size: [0],
      version: 1,
    } as any as StorageSource;

    const applyLights = getBoundShader(applyLightsWGSL, LIGHTS_BINDINGS, [() => storage.length, storage]);
    const context = applyLights;

    return [context, storage, data];
  }, [device, max]);

  const render = provide(LightContext, context, children);

  // Gather live lights
  return consume(LightConsumer, render, (registry: Map<LiveFiber<any>, Light>) => {
    let lights = Array.from(registry.values());

    if (lights.length > 0) lights = lights.slice(0, max);
    storage.size[0] = storage.length = lights.length;

    // Group by transform
    const keyFor = (transform?: ShaderModule | null) => transform ? getBundleKey(transform) : '0';
    const map = new Map<ShaderModule | null, Light[]>();
    for (const light of lights) {
      const key = keyFor(light.transform);
      let list = map.get(key);
      if (!list) map.set(key, list = []);
      list.push(light);
    }

    let base = 0;
    const render = Array.from(map.keys()).map((key: ShaderModule | null) => {
      const lights = map.get(key)!;
      const b = base;
      base += lights.length;
      return keyed(LightEmitter, key, {storage, lights, data, base: b});
    });

    return gather(render, () => {
      uploadBuffer(device, storage.buffer, data);
    });
  });
};

type LightEmitterProps = {
  storage: StorageSource,
  lights: Light[],
  data: ArrayBuffer,
  base: number,
};

export const LightEmitter: LC<LightEmitterProps> = (props: LightEmitterProps) => {
  const {storage, lights, data, base} = props;
  const [{transform}] = lights;

  const filler = useOne(() => makeLayoutFiller(LIGHT_LAYOUT, data), data);

  let i = base;
  for (const light of lights) filler.setItem(i++, light);

  if (transform) {
    console.warn('lights are being transformed');
  }

  return null;
};
