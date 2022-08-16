import type { LiveComponent, LiveElement } from '@use-gpu/live';

import { gather, use, yeet, useOne } from '@use-gpu/live';
import { Fetch, VirtualLayers, useLayoutContext } from '@use-gpu/workbench';
import earcut from 'earcut';

import { useMVTStyleContext } from './providers/mvt-style-provider';

export type MVTileProps = {
  x: number,
  y: number,
  zoom: number,
  
  mvt: VectorTile,

  children?: LiveElement,
};

const FEATURE_TYPES = ['', 'point', 'line', 'face'];
const DEFAULT_CLASSES = ['', 'point', 'border', 'face'];

export const MVTile: LiveComponent<MVTileProps> = (props) => {

  const {x, y, zoom, mvt} = props;
  
  const layout = useLayoutContext();
  const flipY = layout[1] > layout[3] ? -1 : 1;

  const z = Math.pow(2, zoom);
  const iz = 1 / Math.pow(2, zoom);

  if (x >= z || y >= z) debugger;

  const ox = x * iz;
  const oy = y * iz;
  
  const styles = useMVTStyleContext();
  
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

      const toPoint = ({x, y}) => [
        ( ox + iz * x / extent) * 2 - 1,
        ((oy + iz * y / extent) * 2 - 1) * flipY,
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
        const geometry = feature.asPolygons();
        for (const polygon of geometry) {
          const positions = polygon.map((ring) => ring.map(toPoint));
          for (const poly of positions) poly.pop();

          const data = earcut.flatten(positions);
          const triangles = earcut(data.vertices, data.holes, data.dimensions);

          shapes.push({
            x: 'x',
            type: 'line',
            count: positions.flat().length,
            positions: positions.flat(2),
            segments: positions.flatMap((path) => path.map((_, i) => i === 0 ? 1 : i === path.length - 1 ? 2 : 3)),
            color: style.stroke,
            width: 4,
          });

          shapes.push({
            type,
            count: data.vertices.flat().length / 4,
            positions: data.vertices.flat(),
            indices: triangles,
            color: style.fill,
            size: style.size,
          });
        }
      }

    }
  }
  
  return use(VirtualLayers, { items: shapes });
};



