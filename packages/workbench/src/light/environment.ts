import type { LC, PropsWithChildren } from '@use-gpu/live';
import type { ShaderModule, ShaderSource } from '@use-gpu/shader';
import type { UniformAttribute } from '@use-gpu/core';

import { patch, $set } from '@use-gpu/state';
import { provide, useMemo } from '@use-gpu/live';

import { EnvironmentContext } from '../providers/environment-provider';

import { getShader, useShader, useNoShader } from '../hooks/useShader';

import { getDefaultEnvironment } from '@use-gpu/wgsl/material/lights-default-env.wgsl';

import {
  SH_DIFFUSE  as SH_DIFFUSE_PARK,
  SH_SPECULAR as SH_SPECULAR_PARK,
} from '@use-gpu/wgsl/material/env/park.wgsl';
import {
  SH_DIFFUSE  as SH_DIFFUSE_PISA,
  SH_SPECULAR as SH_SPECULAR_PISA,
} from '@use-gpu/wgsl/material/env/pisa.wgsl';
import {
  SH_DIFFUSE  as SH_DIFFUSE_ROAD,
  SH_SPECULAR as SH_SPECULAR_ROAD,
} from '@use-gpu/wgsl/material/env/road.wgsl';
import {
  SH_DIFFUSE  as SH_DIFFUSE_FIELD,
  SH_SPECULAR as SH_SPECULAR_FIELD,
} from '@use-gpu/wgsl/material/env/field.wgsl';

const PRESETS = {
  'park':  [SH_DIFFUSE_PARK, SH_SPECULAR_PARK],
  'pisa':  [SH_DIFFUSE_PISA, SH_SPECULAR_PISA],
  'road':  [SH_DIFFUSE_ROAD, SH_SPECULAR_ROAD],
  'field': [SH_DIFFUSE_FIELD, SH_SPECULAR_FIELD],
} as Record<string, [ShaderModule, ShaderModule]>;

export type EnvironmentProps = {
  map?: ShaderSource | null,
  preset?: (keyof typeof PRESETS) | 'none',
  gain?: number,
};

const SAMPLE_ENVIRONMENT: UniformAttribute = {
  name: 'sampleEnvironment',
  args: ['vec3<f32>', 'f32', 'vec3<f32>', 'vec3<f32>'],
  format: 'vec4<f32>',
};

export const Environment: LC<EnvironmentProps> = (props: PropsWithChildren<EnvironmentProps>) => {
  const {map, preset, gain, children} = props;

  const environment = map || !((preset as any) in PRESETS)
    ? (useNoShader(), map ?? null)
    : useShader(getDefaultEnvironment, [...PRESETS[preset as any] ?? PRESETS.park]);

  return (
    provide(EnvironmentContext, environment, children)
  );
};
