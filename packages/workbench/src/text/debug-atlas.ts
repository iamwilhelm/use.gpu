import type { LiveComponent } from '@use-gpu/live';
import type { ShaderModule } from '@use-gpu/shader';
import type { Atlas, Rectangle } from '@use-gpu/core';

import { debug, memo, use, yeet, useContext, useNoContext, useFiber, useMemo } from '@use-gpu/live';
import { TextureSource } from '@use-gpu/core';
import { useBoundShader, useLambdaSource } from '@use-gpu/workbench';

import { SDFFontContext } from './providers/sdf-font-provider';

import { wgsl } from '@use-gpu/shader/wgsl';

export type DebugAtlasProps = {
  atlas: Atlas,
  source: TextureSource,
  compact?: boolean,
  size?: number,
  dpi?: number,
  version: number,
};

export type DebugAtlasShapeProps = {
  atlas: Atlas,
  source: TextureSource,
  size?: number,
  dpi?: number,
  compact?: boolean,
  box?: Rectangle,
  clip?: ShaderModule | null,
  mask?: ShaderModule | null,
  transform?: ShaderModule | null,
  version: number,
};

export const DebugAtlas: LiveComponent<Partial<DebugAtlasProps> | undefined> = memo((props: Partial<DebugAtlasProps> = {}) => {
  let {atlas, source, size = 500, dpi = 1, compact} = props;
  if (!atlas && !source) {
    let getTexture;
    ({__debug: {atlas, source}} = useContext(SDFFontContext) as any);
  }
  else useNoContext(SDFFontContext);

  if (!atlas) return;

  const {width: w, height: h} = atlas;
  const width = size * w / h;
  const height = size;

  const shape = useMemo(() => ({
    atlas: atlas!,
    source: source!,
    version: atlas!.version,
    size,
    compact,
    dpi,
  }), [atlas, source, atlas!.version, size, compact, dpi]);

  return yeet({
    sizing: [width, height, width, height],
    margin: [0, 0, 0, 0],
    grow: 0,
    shrink: 0,
    fit: (into: any) => ({
      size: [width, height],
      render: (
        box: Rectangle,
        origin: Rectangle,
        clip?: ShaderModule | null,
        mask?: ShaderModule | null,
        transform?: ShaderModule | null,
      ) => useMemo(() => use(DebugAtlasShape, {
        ...shape,
        box,
        clip,
        mask,
        transform,
      }), [shape, ...box, clip, mask, transform]),
    }),
  });
}, 'DebugAtlas');

const COLORS = [
  [0, 1, 1, 1],
  [1, 0, 1, 1],
  [1, 1, 0, 1],
  [0.5, 0.5, 1, 1],
  [0.5, 1, 0.5, 1],
  [1, .5, 0.5, 1],
];

const premultiply = wgsl`
@optional @link fn getTexture(uv: vec2<f32>) -> vec4<f32> { return vec4<f32>(0.5, 0.5, 0.5, 1.0); };

fn main(uv: vec2<f32>) -> vec4<f32> {
  let c = getTexture(uv);
  return vec4<f32>(pow(c.rgb, vec3<f32>(2.2)) * c.a, c.a);
}
`;

export const DebugAtlasShape: LiveComponent<DebugAtlasShapeProps> = memo((props: DebugAtlasShapeProps) => {
  const {
    atlas,
    source,
    box,
    size = 500,
    dpi = 1,
    compact,
    clip,
    mask,
    transform,
  } = props;

  const {map, width: w, height: h, debugPlacements, debugSlots, debugValidate, debugUploads} = atlas as any;  
  const {id} = useFiber();

  const yeets = [];
  const pos = [] as number[];
  
  const width = size * w / h;
  const height = size;
  const sx = width / w;
  const sy = height / h;

  const left = box?.[0] ?? 0;
  const top = box?.[1] ?? 0;
  const fit = ([l, t, r, b]: Rectangle): Rectangle => [left + l * sx, top + t * sy, left + r * sx, top + b * sy];
  const inset = ([l, t, r, b]: Rectangle, v: number): Rectangle => [l + v * dpi, t + v * dpi, r - v * dpi, b - v * dpi];

  const border = [dpi, dpi, dpi, dpi];
  const border2 = [2*dpi, 2*dpi, 2*dpi, 2*dpi];
  const border5 = [5*dpi, 5*dpi, 5*dpi, 5*dpi];

  let ID = 0;
  const next = () => `${id}-${ID++}`;

  const boundSource = useLambdaSource(useBoundShader(premultiply, [source]), source);

  yeets.push({
    id: next(),
    rectangle: [left + (compact ? 0 : width), top, left + width + (compact ? 0 : width), top + height],
    uv: [0, 0, w, h],
    radius: [0, 0, 0, 0],
    texture: boundSource,
    fill: [0, 0, 0, 1],
    count: 1,
    repeat: 3,
    clip, mask, transform,
  });

  for (const rect of debugPlacements()) {
    yeets.push({
      id: next(),
      rectangle: fit(rect),
      uv: [0, 0, 1, 1],
      fill: [Math.random() * .5, Math.random() * .5, Math.random(), 0.5],
      stroke: [1, 1, 1, 1],
      border,
      count: 1,
      repeat: 0,
      clip, mask, transform,
    });
  }
  
  const fix = ([l, t, r, b]: Rectangle): Rectangle =>
    [Math.min(l, r), Math.min(t, b), Math.max(l, r), Math.max(t, b)];

  for (const [l, t, r, b, nearX, nearY, farX, farY, corner] of debugSlots()) {
    yeets.push({
      id: next(),
      rectangle: fit(inset([l, t, r, b], 4)),
      uv: [0, 0, 1, 1],
      fill: [0, 0, 0.25, 0.25],
      stroke: [0, 0.45, 0.95, 1],
      border: border2,
      count: 1,
      repeat: 0,
      clip, mask, transform,
    });
    yeets.push({
      id: next(),
      rectangle: fit(inset([l, t, l + nearX, t + nearY], 8)),
      uv: [0, 0, 1, 1],
      fill: [0, 0, 0, 0.5],
      stroke: [1, 1, 0.2, 1],
      border: border2,
      count: 1,
      repeat: 0,
      clip, mask, transform,
    });
    yeets.push({
      id: next(),
      rectangle: fit(inset([l, t, l + farX, t + farY], 6)),
      uv: [0, 0, 1, 1],
      fill: [0, 0, 0, 0.5],
      stroke: [0.2, 0.5, 1.0, 1],
      border: border2,
      count: 1,
      repeat: 0,
      clip, mask, transform,
    });
  }

  for (const anchor of debugValidate()) {
    const {x, y, dx, dy} = anchor;
    yeets.push({
      id: next(),
      rectangle: fit([x, y, x + dx, y + dy]),
      uv: [0, 0, 1, 1],
      fill: [1, 0, 0, 0.05],
      stroke: [1, 0, 0, 1],
      border: border5,
      count: 1,
      repeat: 0,
      clip, mask, transform,
    });
  }

  for (const rect of debugPlacements()) {
    yeets.push({
      id: next(),
      rectangle: fit(rect),
      uv: [0, 0, 1, 1],
      fill: [Math.random() * .5, Math.random() * .5, Math.random(), 0.5],
      stroke: [1, 1, 1, 1],
      border,
      count: 1,
      repeat: 0,
      clip, mask, transform,
    });
  }
  
  return yeet(yeets);
}, 'DebugAtlasShape');
