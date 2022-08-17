import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { MVTStyleContextProps } from '../providers/mvt-style-provider';

import { gather, use, yeet, useMemo, useOne } from '@use-gpu/live';
import { cutPolygon, cutPolygons, getRingArea } from './tess';
import earcut from 'earcut';

type Point4 = [number, number, number, number];

const FEATURE_TYPES = ['', 'point', 'line', 'face'];
const DEFAULT_CLASSES = ['', 'point', 'line', 'face'];

export const getMVTShapes = (
  x: number, y: number, zoom: number,
  mvt: VectorTile,
  styles: MVTStyleContextProps,
  flipY: boolean,
  tesselate: number = 0,
) => {
  const z = Math.pow(2, zoom);
  const iz = 1 / z

  const ox = x * iz;
  const oy = y * iz;  

  const {layers} = mvt;

  const shapes: any[] = [];

  for (const k in layers) {
    const layer = layers[k];
    const {length} = layer;
    for (let i = 0; i < length; ++i) {
      const feature = layer.feature(i);
      const {type: t, properties, extent} = feature;
    
      const type = FEATURE_TYPES[t];
      const klass = properties.class;
    
      const style = styles[klass] ?? styles.default;

      const toPoint = ({x, y}) => [x, y];

      const toPoint4 = ([x, y]) => [
        (( ox + iz * (x / extent)) * 2 - 1),
        (((oy + iz * (y / extent)) * 2 - 1) * (flipY ? -1 : 1)),
        0,
        1,
      ];

      if (t === 1) {
        continue;
        const geometry = feature.asPoints();
        const positions = geometry.flatMap(toPoint);
        const count = positions.length / 4;
        if (properties.name) {
          shapes.push({
            type: 'label',
            position: positions,
            text: properties.name,
            color: style.fill,
          });
        }
        else {
          shapes.push({
            type,
            count,
            positions,
            color: style.fill,
            size: style.size,
          });
        }
      }
      else if (t === 2) {
        continue;
        const geometry = feature.asLines();
        const positions = geometry.flatMap((path) => path.flatMap(toPoint));
        const count = geometry.reduce((a, b) => a + b.length, 0);

        if (properties.name) {
          shapes.push({
            type: 'label',
            positions,
            text: properties.name,
            color: style.fill,
          });
        }
        else {
          shapes.push({
            type,
            count,
            positions,
            segments: geometry.flatMap((path) => path.map((_, i) => i === 0 ? 1 : i === path.length - 1 ? 2 : 3)),
            color: style.stroke,
            width: style.width,
            size: style.size,
          });
        }
      }
      else if (t === 3) {

        let geometry = feature.asPolygons().map(polygon => polygon.map((ring) => {
          const r = ring.map(toPoint); r.pop(); return r;
        }));

        geometry = cutPolygons(geometry, 1, 0, 0);
        geometry = cutPolygons(geometry, 0, 1, 0);
        geometry = cutPolygons(geometry, -1, 0, -extent);
        geometry = cutPolygons(geometry, 0, -1, -extent);
      
        const originalGeometry = geometry;
        if (tesselate > 0) geometry = tesselateGeometry(geometry, [0, 0, extent, extent], tesselate);

        for (const polygon of geometry) {
          const polygon4 = polygon.map(ring => ring.map((p, i) => toPoint4(p)));

          const data = earcut.flatten(polygon4);
          if (!data.vertices.length) continue;

          const triangles = earcut(data.vertices, data.holes, data.dimensions);
          if (!triangles.length) continue;

          shapes.push({
            type,
            count: data.vertices.length / 4,
            positions: data.vertices,
            indices: triangles,
            color: style.fill,
            size: style.size,
          });
        }
        
        originalGeometry.map(polygon => polygon.map((ring) => {
          ring.push(ring[0]);
        }));

        for (const polygon of originalGeometry) {
          const polygon4 = polygon.flatMap(ring => ring.flatMap((p, i) => toPoint4(p)));

          shapes.push({
            type: 'line',
            count: polygon4.length / 4,
            positions: polygon4,
            segments: polygon.flatMap((path) => path.map((p, i) => {
              const next = path[i + 1] ?? path[i + 1 - path.length];
              return (
                (p[0] <= 0 && next[0] <= 0) || (p[0] >= extent && next[0] >= extent) ||
                (p[1] <= 0 && next[1] <= 0) || (p[1] >= extent && next[1] >= extent) ? 0 :
                i === 0 ? 1 :
                i === path.length - 1 ? 2 :
                3
              );
            })),
            color: style.stroke,
            width: 5,
          });
        }
        
      }

    }
  }

  return shapes;    
};

const tesselateGeometry = (polygons: XY[][][], [l, t, r, b]: Point4, limit: number = 1, depth: number = 0) => {
  const x = (l + r) / 2;
  const y = (t + b) / 2;
  
  const ll: XY[][][] = cutPolygons(polygons, -1, 0, -x);
  const rr: XY[][][] = cutPolygons(polygons,  1, 0,  x);

  const tl: XY[][][] = cutPolygons(ll, 0, -1, -y);
  const tr: XY[][][] = cutPolygons(rr, 0, -1, -y);
  const bl: XY[][][] = cutPolygons(ll, 0,  1,  y);
  const br: XY[][][] = cutPolygons(rr, 0,  1,  y);

  depth++;
  if (depth < limit) {
    return [
      ...tesselateGeometry(tl, [l, t, x, y], limit, depth),
      ...tesselateGeometry(tr, [x, t, r, y], limit, depth),
      ...tesselateGeometry(bl, [l, y, x, b], limit, depth),
      ...tesselateGeometry(br, [x, y, r, b], limit, depth),
    ];
  }

  return [...tl, ...tr, ...bl, ...br];
};
