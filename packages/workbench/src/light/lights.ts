import { LC, PropsWithChildren } from '@use-gpu/live/types';
import { TypedArray, StorageSource } from '@use-gpu/core/types';
import { Light } from './types';

import { LightContext, LightConsumer } from '../providers/light-provider';
import { useDeviceContext } from '../providers/device-provider';

import { consume, provide, keyed, makeContext, useContext, useConsumer, useMemo, useOne } from '@use-gpu/live';
import { bundleToAttribute, bundleToAttributes, getBundleKey } from '@use-gpu/shader/wgsl';
import { makeUniformLayout, makeLayoutData, makeStorageBuffer } from '@use-gpu/core';
import { getBoundShader } from '../hooks/useBoundShader';
import { getShaderRef } from '../hooks/useShaderRef';

import { Light as WGSLLight } from '@use-gpu/wgsl/use/types.wgsl';
import { applyLights as applyLightsWGSL } from '@use-gpu/wgsl/material/lit.wgsl';

export const useLightConsumer = (light: Light) => useConsumer(LightConsumer, light);

const LIGHTS_BINDINGS = bundleToAttributes(applyLightsWGSL);
const LIGHT_ATTRIBUTE = bundleToAttribute(WGSLLight);

type LightsProps = {
  max?: number,
};

export const Lights: LC = (props: PropsWithChildren<object>) => {
  const {
    max = 32,
    children,
  } = props;
  
  const device = useDeviceContext();
  const lightCount = useOne(() => ({current: 0}));

  const [context, storage] = useMemo(() => {
    const layout = makeUniformLayout(LIGHT_ATTRIBUTE.members);
    const data = makeLayoutData(layout, max);
    const buffer = makeStorageBuffer(device, data);

    const storage = {
      buffer,
      format: WGSLLight,
      length: 0,
      size: [0],
      version: 1,
    } as any as StorageSource;

    const applyLights = getBoundShader(applyLightsWGSL, LIGHTS_BINDINGS, [lightCount, storage]);
    const context = applyLights;

    return [context, storage];
  }, [device, max]);

  const render = provide(LightContext, context, children);

  return consume(LightConsumer, render, (registry: Map<LiveFiber<any>, Light>) => {
    let lights = registry.values();

    if (lights.length > 0) lights = lights.slice(0, max);
    lightCount.current = lights.length;
    
    const keyFor = (transform?: ShaderModule | null) => transform ? getBundleKey(transform) : '0';

    const map = new Map<ShaderModule | null, Light[]>();
    for (const light of lights) {
      const key = keyFor(light.transform);
      let list = map.get(key);
      if (!list) map.set(key, list = []);
      list.push(light);
    }

    console.log('gathered lights', lights, Array.from(map));

    let base = 0;
    return Array.from(map.keys()).map((key: ShaderModule | null) => {
      const lights = map.get(key)!;
      const [{transform}] = lights;

      const o = base;
      base += lights.length;
      return keyed(LightEmitter, key, {storage, lights, base});
    });
  });
};

type LightEmitterProps = {
  storage: StorageSource,
  lights: Light[],
  base: number,
};

export const LightEmitter: LC<LightEmitterProps> = (props: LightEmitterProps) => {
  const {storage, lights, base} = props;
  return null;
};