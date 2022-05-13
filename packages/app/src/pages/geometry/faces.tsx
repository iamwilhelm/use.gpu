import { LC } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import React from '@use-gpu/live/jsx';
import { use } from '@use-gpu/live';

import {
  Draw, Pass,
  Cursor,
  CompositeData, FaceSegments,
	RawFaces,
  OrbitCamera, OrbitControls,
  LineLayer, ArrowLayer,
} from '@use-gpu/components';

const seq = (n: number, s: number = 0, d: number = 1) => Array.from({ length: n }).map((_, i: number) => s + d * i);

const randomColor = () => [Math.random(), Math.random(), Math.random(), 1];
const randomInt = (min: number, max: number) => min + Math.round(Math.random() * (max - min));
const randomFloat = (min: number, max: number) => min + Math.random() * (max - min);

const circleX = (a: number, r: number) => Math.cos(a * Math.PI * 2) * r;
const circleY = (a: number, r: number) => Math.sin(a * Math.PI * 2) * r;

const N = 32;

let faceData = seq(20).map(i => {
	const n = Math.max(3, randomInt(5, 16) - randomInt(0, 5));
	const r = randomFloat(0.15, 0.5);
	const o = [randomFloat(-1, 1), randomFloat(-1, 1), randomFloat(-1, 1)];
	return {
		positions: seq(n).map(j => [
			o[0] + circleX(j / n, r) * circleX(i / 20, 1),
			o[1] + circleY(j / n, r),
			o[2] + circleX(j / n, r) * circleY(i / 20, 1),
			1,
		]),
		color: randomColor(),
	};
});

const dataFields = [
  ['array<vec4<f32>>', (o: any) => o.positions],
  ['vec4<f32>', 'color'],
] as DataField[];

export const GeometryFacesPage: LC = () => {

  const view = (
    <Draw>
      <Pass>
        <CompositeData
          fields={dataFields}
          data={faceData}
					on={<FaceSegments />}
          render={([positions, colors, segments]: StorageSource[]) =>
            <RawFaces
              positions={positions}
              segments={segments}
              colors={colors}
            />
          }
        />
      </Pass>
    </Draw>
  );

  return [
    <OrbitControls
      radius={3}
      bearing={0.5}
      pitch={0.3}
      render={(radius: number, phi: number, theta: number) =>
        <OrbitCamera
          radius={radius}
          phi={phi}
          theta={theta}
          scale={2160}
        >
          {view}
        </OrbitCamera>
      }
    />,
    <Cursor cursor='move' />
  ];
};
