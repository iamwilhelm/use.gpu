
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
  const {map, width, height, debugPlacements, debugAnchors, debugValidate} = atlas;  

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

  for (const anchor of debugAnchors()) {
    const {pt: [x, y], sx, sy, caret} = anchor;
    pos.push([x, y, 0.5, 1]);

    const l = x + 8;
    const t = y + 8;
    /*
    const r = x + (caret ? sx || 10 : 0) - 8;
    const b = y + (caret ? sy || 10 : 0) - 8;
    */

    out.push(
      use(Surface)({
        layout: [x - 4, y - 4, x + 4, y + 4],
        fill: [0, 0, 0, 0.5],
        stroke: [1, 1, 1, 1],
        border: [2, 2, 2, 2],
      }),
    )

    /*
    if (caret) {
      out.push(
        use(Surface)({
          layout: [Math.min(l, r), Math.min(t, b), Math.max(l, r), Math.max(t, b)],
          fill: [0, 0, 0, 0.5],
          stroke: [1, 0.5, 1, 1],
          border: [2, 2, 2, 2],
        }),
      )
    }
    */

    if (caret) {
      out.push(
        use(Surface)({
          layout: [x + 4, y + 4, x + caret[0] - 4, y + caret[1] - 4],
          fill: [0, 0, 0.05, 0.5],
          stroke: [0, 0.45, 0.95, 1],
          border: [2, 2, 2, 2],
        }),
      )
    }
  }

  for (const anchor of debugValidate()) {
    const {pt: [x, y], dx, dy, caret} = anchor;
    out.push(
      use(Surface)({
        layout: [x, y, x + dx, y + dy],
        fill: [1, 0, 0, 0.05],
        stroke: [1, 0, 0, 1],
        border: [5, 5, 5, 5],
      }),
    )
  }
  
  return [
    use(UI)({ children: out }),
    use(CompositeData)({
      fields: lineDataFields,
      data: [{ pos }],
      isLoop: (o: any) => false,
      render: ([segments, positions]: StorageSource[]) => [
        use(Lines)({ segments, positions, color: [0.5, 0, 1, 1], size: 5, }),
      ]
    }),
  ];

  /*
  return use(Element)({
    width,
    height,
    image,
  });
  */
};
