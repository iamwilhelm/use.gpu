import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { XY, ColorSpace, TextureSource } from '@use-gpu/core';
import type { ShaderSource } from '@use-gpu/shader';

import { use, yeet, useMemo, useYolo } from '@use-gpu/live';
import { getBoundShader } from '../hooks/useBoundShader';
import { getDerivedSource } from '../hooks/useDerivedSource';

import { getEquiToCubeSample } from '@use-gpu/wgsl/render/sample/equi-to-cube.wgsl';

export type PanoramaMapProps = {
  texture?: TextureSource | null,
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

  const source = useMemo(() => {
    if (!texture) return null;

    const derived = getDerivedSource(texture, { variant: 'textureSampleLevel' });

    const bound = getBoundShader(shader, [derived, gain]);
    const source = getDerivedSource({ shader: bound } as any, {
      size: () => texture?.size,
      length: () => (texture as any)?.length,
      version: () => texture?.version,
    });

    return source;
  }, [texture]);

  return useYolo(() => render ? render(source) : yeet(source), [render, source]);
};
