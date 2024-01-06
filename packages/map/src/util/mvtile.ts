import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { MVTStyleSheet, MVTStyleProperties } from '../types';
import type { VectorTile } from 'mapbox-vector-tile';

import { cutPolygons, clipTileEdges } from './tesselate';
import earcut from 'earcut';

type Vec2 = {x: number, y: number};

type XY = [number, number];
type XYZW = [number, number, number, number];

export const getMVTShapes = (
  x: number, y: number, zoom: number,
  mvt: VectorTile,
  styles: MVTStyleSheet,
  flipY: boolean,
  tesselate: number = 0,
) => {
  const z = Math.pow(2, zoom);
  const iz = 1 / z

  const ox = x * iz;
  const oy = y * iz;

  const {layers} = mvt;

  const shapes = {
    point: {
      positions: [],
      color: [],
      size: [],
      depth: [],
      zBias: [],
    },
    line: {
      positions: [],
      color: [],
      width: [],
      depth: [],
      zBias: [],
    },
    loop: {
      positions: [],
      color: [],
      width: [],
      depth: [],
      zBias: [],
      loop: true,
    },
    face: {
      positions: [],
      color: [],
      depth: [],
      zBias: [],
      concave: true,
    },
  };

  const addPoint = (
    geometry: Vec2[],
    properties: Record<string, any>,
    style: MVTStyleProperties,
    toPoint4: (xy: XY) => XYZW,
  ) => {
    return;
    const positions = geometry.map(({x, y}: Vec2) => toPoint4([x, y]));
    if (style.point) {
      if (properties.name) {
        /*
        shapes.label.push({
          position: positions,
          text: properties.name,
          color: style.point.color,
        });
        */
      }
      else {
        shapes.point.positions.push(positions);
        shapes.point.color.push(style.point.color);
        shapes.point.size.push(style.point.size);
        shapes.point.depth.push(style.point.depth);
        shapes.point.zBias.push(style.point.zBias);
      }
    }
  }

  const addLine = (
    geometry: Vec2[][],
    properties: Record<string, any>,
    style: MVTStyleProperties,
    toPoint4: (xy: XY) => XYZW,
  ) => {
    const positions = geometry.map((path) => path.map(({x, y}: Vec2) => [x, y]));

    if (properties.name) {
      /*
      shapes.label.push({
        positions,
        text: properties.name,
        color: style.line.color,
      });
      */
    }
    else {
      shapes.line.positions.push(positions);

      const n = geometry.length;
      for (let i = 0; i < 1; ++i) {
        shapes.line.color.push(style.line.color);
        shapes.line.width.push(style.line.width);
        shapes.line.depth.push(style.line.depth);
        shapes.line.zBias.push(style.line.zBias);
      }
    }
  }

  const addPolygon = (
    geometry: XY[][][],
    properties: Record<string, any>,
    style: MVTStyleProperties,
    extent: number,
    toPoint4: (xy: XY) => XYZW,
  ) => {
    const originalGeometry = geometry;
    if (tesselate > 0) geometry = tesselateGeometry(geometry, [0, 0, extent, extent], tesselate);

    if (style.face.fill) {
      const positions = geometry.map(polygon => polygon.map((ring: XY[]) => ring.map((p: XY) => toPoint4(p))));

      shapes.face.positions.push(...positions);
      const n = geometry.length;
      for (let i = 0; i < n; ++i) {
        shapes.face.color.push(style.face.fill);
        shapes.face.depth.push(style.face.depth);
        shapes.face.zBias.push(style.face.zBias);
      }
    }

    if (style.face.stroke) {
      const {loop, line} = clipTileEdges(originalGeometry, 0, 0, extent, extent);
      if (loop.length) {
        const positions = loop.map((path: XY[]) => path.map((p: XY) => toPoint4(p)));
        shapes.loop.positions.push(positions);
        shapes.loop.color.push(style.face.stroke);
        shapes.loop.width.push(style.face.width);
        shapes.loop.depth.push(style.face.depth);
        shapes.loop.zBias.push(style.face.zBias + 1);
      }
      if (line.length) {
        const positions = line.map((path: XY[]) => path.map((p: XY) => toPoint4(p)));
        shapes.line.positions.push(positions);
        shapes.line.color.push(style.face.stroke);
        shapes.line.width.push(style.face.width);
        shapes.line.depth.push(style.face.depth);
        shapes.line.zBias.push(style.face.zBias + 1);
      }
    }
  };

  const toPoint4 = ([x, y]: XY): XYZW => [
    (( ox + iz * x/256) * 2 - 1),
    (((oy + iz * y/256) * 2 - 1) * (flipY ? -1 : 1)),
    0,
    1,
  ];
  const style = styles['background'];
  if (style) {
    addPolygon([[[[0, 0], [256, 0], [256, 256], [0, 256]]]], {}, style, 256, toPoint4);
  }

  //const unstyled: string[] = [];

  for (const k in layers) {
    const layer = layers[k];
    const {length, extent, name} = layer;

    //console.log("layer", name, layer, length)

    for (let i = 0; i < length; ++i) {
      const feature = layer.feature(i);
      const {type: t, properties, extent} = feature;

      const klass = properties['class'] as any as string;

      const ownStyles = styles[name + '/'+ klass] ?? styles[name] ?? styles[klass];
      const style = ownStyles ?? styles.default;

      //if (!ownStyles) unstyled.push(`${klass}/${name} ${t}`);

      const toPoint = ({x, y}: Vec2): XY => [x, y];
      const toPoint4 = ([x, y]: XY): XYZW => [
        (( ox + iz * (x / extent)) * 2 - 1),
        (((oy + iz * (y / extent)) * 2 - 1) * (flipY ? -1 : 1)),
        0,
        1,
      ];

      if (t === 1) {
        continue;
        const geometry = feature.asPoints();
        if (geometry) addPoint(geometry!, properties, style, toPoint4);
      }
      else if (t === 2) {
        const geometry = feature.asLines();
        if (geometry) addLine(geometry, properties, style, toPoint4);
      }
      else if (t === 3) {
        const poly = feature.asPolygons();
        if (!poly) continue;

        let geometry = poly.map((polygon: Vec2[][]) => polygon.map((ring: Vec2[]) => {
          const r = ring.map(toPoint); r.pop(); return r;
        }));

        geometry = cutPolygons(geometry, 1, 0, 0);
        geometry = cutPolygons(geometry, 0, 1, 0);
        geometry = cutPolygons(geometry, -1, 0, -extent);
        geometry = cutPolygons(geometry, 0, -1, -extent);

        addPolygon(geometry, properties, style, extent, toPoint4);
      }
    }
  }

  if (!shapes.point.positions.length) delete shapes.point;
  if (!shapes.line.positions.length)  delete shapes.line;
  if (!shapes.loop.positions.length)  delete shapes.loop;
  if (!shapes.face.positions.length)  delete shapes.face;

  return shapes;
};

const tesselateGeometry = (polygons: XY[][][], [l, t, r, b]: XYZW, limit: number = 1, depth: number = 0): XY[][][] => {
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
