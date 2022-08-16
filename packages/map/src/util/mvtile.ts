import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { MVTStyleContextProps } from '../providers/mvt-style-provider';

import { gather, use, yeet, useMemo, useOne } from '@use-gpu/live';
import { cutPolygon } from './tess';
import earcut from 'earcut';

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
        ( ox + iz * x / extent) * 2 - 1,
        ((oy + iz * y / extent) * 2 - 1) * (flipY ? -1 : 1),
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
          const out = ring.map(toPoint);
          out.pop();
          return out;
        }));

        if (tesselate > 0) {
          const t = 1 << zoom;
          const g = extent;

          for (let i = 0; i < tesselate; ++i) {
            const z = 1 / (1 << (i + 1));
            {
              const o: XY[][] = [];
              geometry.forEach((polygon) => {
                const l = cutPolygon(polygon,  1,  0,  (2 * i + 1) * z * g);
                const r = cutPolygon(polygon, -1,  0, -(2 * i + 1) * z * g);
                if (l?.length) o.push(...l);
                if (r?.length) o.push(...r);
              });
              geometry = o;
            }
            {
              const o: XY[][] = [];
              geometry.forEach((polygon) => {
                const t = cutPolygon(polygon,  0,  1,  (2 * i + 1) * z * g);
                const b = cutPolygon(polygon,  0, -1, -(2 * i + 1) * z * g);
                if (t?.length) o.push(...t);
                if (b?.length) o.push(...b);
              });
              geometry = o;
            }
          }
        }

        for (const polygon of geometry) {
          const polygon4 = polygon.map(ring => ring.map((p, i) => toPoint4(p)));

          const data = earcut.flatten(polygon4);
          if (!data.vertices.length) continue;

          const triangles = earcut(data.vertices, data.holes, data.dimensions);
          if (!triangles.length) continue;

          shapes.push({
            type: 'line',
            count: data.vertices.length / 4,
            positions: data.vertices,
            segments: polygon.flatMap((path) => path.map((_, i) => i === 0 ? 1 : i === path.length - 1 ? 2 : 3)),
            color: style.stroke,
            width: 4,
          });

          shapes.push({
            type,
            count: data.vertices.length / 4,
            positions: data.vertices,
            indices: triangles,
            color: style.fill,
            size: style.size,
          });
        }
      }

    }
  }

  return shapes;    
};
