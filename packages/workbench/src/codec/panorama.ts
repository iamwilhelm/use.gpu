import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { Point, ColorSpace, TextureSource } from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';

import { use, yeet, useYolo } from '@use-gpu/live';
import { useBoundShader } from '../hooks/useBoundShader';
import { useDerivedSource } from '../hooks/useDerivedSource';

import { getEquiToCubeSample } from '@use-gpu/wgsl/render/sample/equi-to-cube.wgsl';

export type PanoramaMapProps = {
  texture: TextureSource,
  projection?: keyof typeof PROJECTIONS,
  gain?: number,

  /** Leave empty to yeet texture instead. */
  render?: (source: ShaderSource | null) => LiveElement,
};

const PROJECTIONS = {
  equirectangular: getEquiToCubeSample,
};

export const PanoramaMap: LiveComponent<PanoramaMapProps> = (props) => {
  const {
    texture,
    gain = 1,
    projection = 'equirectangular',
    render,
  } = props;
  
  const shader = PROJECTIONS[projection];
  if (!shader) throw new Error(`Unsupported projection '${projection}'`);

  const derived = useDerivedSource(texture, { variant: 'textureSampleLevel' });

  const bound = useBoundShader(shader, [derived, gain]);
  const source = useDerivedSource({ shader: bound } as any, {
    size: () => source.size,
    length: () => (source as any).length,
    version: () => source.version,
  });

  return useYolo(() => render ? render(source) : yeet(source), [render, source]);
};
