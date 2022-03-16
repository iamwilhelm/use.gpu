
import { use, useContext } from '@use-gpu/live';
import { UI } from './ui';
import { Surface } from './surface';
import { CompositeData } from '../data';
import { Lines } from '../layers';
import { FontContext } from '../providers/font-provider';


const lineDataFields = [
  ['array<vec4<f32>>', (o: any) => o.pos],
] as DataField[];

export const DebugAtlas = () => {
  const {atlas} = useContext(FontContext);
  const {map, width, height, debugPlacements, debugSlots, debugValidate} = atlas;  

  const out = [];
  const pos = [] as number[];

  for (const {rect, uv} of debugPlacements()) {
    out.push(
      use(Surface)({
        layout: rect,
        fill: [Math.random() * .5, Math.random() * .5, Math.random(), 0.5],
        stroke: [1, 1, 1, 1],
        border: [1, 1, 1, 1],
      }),
    )
  }

  for (const [l, t, r, b, sx, sy, corner] of debugSlots()) {
    out.push(
      use(Surface)({
        layout: [l + 4, t + 4, r - 4, b - 4],
        fill: [0, 0, 0.25, 0.25],
        stroke: [0, 0.45, 0.95, 1],
        border: [2, 2, 2, 2],
      }),
    )
    out.push(
      use(Surface)({
        layout: [l + 8, t + 8, l + sx - 8, t + sy - 8],
        fill: [0, 0, 0, 0.5],
        stroke: [1, 0.5, 1, 1],
        border: [2, 2, 2, 2],
      }),
    )
  }

  for (const anchor of debugValidate()) {
    const {x, y, dx, dy} = anchor;
    out.push(
      use(Surface)({
        layout: [x, y, x + dx, y + dy],
        fill: [1, 0, 0, 0.05],
        stroke: [1, 0, 0, 1],
        border: [5, 5, 5, 5],
      }),
    )
  }
  
  for (const {rect, uv} of debugPlacements()) {
    out.push(
      use(Surface)({
        layout: rect,
        fill: [0, 0, 0, 0],
        stroke: [1, 1, 1, 1],
        border: [1, 1, 1, 1],
      }),
    )
  }
  
  return [
    use(UI)({ children: out }),
  ];
};
