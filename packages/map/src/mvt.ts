import type { LiveComponent, LiveElement } from '@use-gpu/live';

import { gather, use, yeet, useOne } from '@use-gpu/live';
import { Fetch, VirtualLayers, useLayoutContext } from '@use-gpu/workbench';
import { VectorTile } from 'mapbox-vector-tile';
import earcut from 'earcut';

import { useTileContext } from './providers/tile-provider';
import { useMVTStyleContext } from './providers/mvt-style-provider';

export type MVTProps = {
  x: number,
  y: number,
  zoom: number,

  native?: boolean,

  children?: LiveElement,
};

const FEATURE_TYPES = ['', 'point', 'line', 'face'];
const DEFAULT_CLASSES = ['', 'point', 'border', 'face'];

export const MVT: LiveComponent<MVTProps> = (props) => {

  const {x, y, zoom, native} = props;
  
  const layout = useLayoutContext();
  const flipY = layout[1] > layout[3] ? -1 : 1;

  const z = 1 / Math.pow(2, zoom);
  const ox = x * z;
  const oy = y * z;
  
  const styles = useMVTStyleContext();
  const {getMVT} = useTileContext();
  const mvt = getMVT(x, y, zoom);
  
  const render = (mvt: VectorTile) => {
    const {layers} = mvt;
    
    const shapes: any[] = [];

    let minX = 0;
    let minY = 0;
    let maxX = 0;
    let maxY = 0;

    for (const k in layers) {
      const layer = layers[k];
      const {length} = layer;
      for (let i = 0; i < length; ++i) {
        const feature = layer.feature(i);
        const {type: t, properties, extent} = feature;
        
        {
          const [a, b, c, d] = feature.bbox();
          minX = Math.min(minX, a);
          minY = Math.min(minY, b);
          maxX = Math.max(maxX, c);
          maxY = Math.max(maxY, d);
        }
        
        const type = FEATURE_TYPES[t];
        const klass = properties.class;
        
        if (!klass) {
        }
        
        const style = styles[klass] ?? styles.default;
        console.log({type, class: klass, properties})

        const toPoint = ({x, y}) => [
          (ox + z * x / extent) * 2 - 1,
          ((oy + z * y / extent) * 2 - 1) * flipY,
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
    
    console.log({minX, minY, maxX, maxY})
    return use(VirtualLayers, { items: shapes });
  };

  if (typeof mvt === 'string') {
    return use(Fetch, {
      url: mvt,
      type: 'arrayBuffer',
      render: (buffer: ArrayBuffer) => {
        try {
          return useOne(() => render(new VectorTile(new Uint8Array(buffer))), buffer);
        } catch (e) {
          throw new Error("Unable to parse .mvt - " + e.stack);
        }
      },
    });
  }
  else if (mvt) {
    return useOne(() => render(new VectorTile(mvt)), mvt);
  }

  return props.children ?? null;
};



