import { LC, PropsWithChildren } from '@use-gpu/live/types';
import { TypedArray } from '@use-gpu/core/types';
import { Light } from './types';

import { LightContext, LightConsumer } from '../providers/light-provider';

import { consume, provide, makeContext, useContext, useOne } from '@use-gpu/live';
import { bundleToAttribute, bundleToAttributes } from '@use-gpu/shader/wgsl';
import { makeUniformLayout } from '@use-gpu/core';
import { getBoundShader } from '../hooks/useBoundShader';

import { Light as WGSLLight } from '@use-gpu/wgsl/use/types.wgsl';
import { applyLights as applyLightsWGSL } from '@use-gpu/wgsl/material/lit.wgsl';

const LIGHTS_BINDINGS = bundleToAttributes(applyLightsWGSL);
const LIGHT_ATTRIBUTE = bundleToAttribute(WGSLLight);

export const Lights: LC = (props: PropsWithChildren<object>) => {
  const {children} = props;

  const [context, storage] = useOne(() => {
    const layout = makeUniformLayout(LIGHT_ATTRIBUTE.members);

    const storage = {
      buffer: null,
      length: 0,
      size: [0],
    };
    const length = () => storage.length;

    const applyLights = getBoundShader(applyLightsWGSL, LIGHTS_BINDINGS, [length, storage]);
    const context = applyLights;

    return [context, storage];
  });

  const render = provide(LightContext, context, children);

  return consume(LightConsumer, render, (registry: Map<LiveFiber<any>, Light>) => {
    const lights = registry.values();
    console.log('gathered lights', lights);
  });
};
