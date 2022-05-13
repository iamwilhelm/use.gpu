import { LC } from '@use-gpu/live/types';
import { CanvasRenderingContextGPU } from '@use-gpu/webgpu/types';
import { DataField, Emitter, StorageSource, ViewUniforms, UniformAttribute, RenderPassMode } from '@use-gpu/core/types';

import React from '@use-gpu/live/jsx';
import { use } from '@use-gpu/live';

import earcut from 'earcut';

import {
  Draw, Pass,
  Cursor,
  CompositeData, FaceSegments, FaceLayer,
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

let convexFaceData = seq(20).map(i => {
	const n = Math.max(3, randomInt(5, 16) - randomInt(0, 5));
	const r = randomFloat(0.15, 0.5);
	const o = [randomFloat(-2, 2), randomFloat(-1, 1), randomFloat(-2, -0.5)];
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

let concaveFaceData = seq(20).map(i => {
	const n = Math.max(3, randomInt(5, 24) - randomInt(0, 5));
	const r = randomFloat(0.15, 0.5);
	const o = [randomFloat(-2, 2), randomFloat(-1, 1), randomFloat(0.5, 2)];

	const positions = seq(n).map(j => {
		const spikes = randomInt(3, 10);
		const modulate = (1 + circleX(j / n * spikes, 1) * .5);
		return [
			o[0] + circleX(j / n, r * modulate) * circleX(i / 20, 1),
			o[1] + circleY(j / n, r * modulate),
			o[2] + circleX(j / n, r * modulate) * circleY(i / 20, 1),
		1,
		];
	});

	const flatPos3D = positions.flatMap(p => p.slice(0, 3));
	const indices = earcut(flatPos3D, [], 3);

	return {
		positions,
		indices,
		color: randomColor(),
	};
});
console.log(convexFaceData);
console.log(concaveFaceData);

const convexDataFields = [
  ['array<vec4<f32>>', (o: any) => o.positions],
  ['vec4<f32>', 'color'],
] as DataField[];

const concaveDataFields = [
  ['array<vec4<f32>>', (o: any) => o.positions],
  ['vec4<f32>', 'color'],
  ['array<u32>', (o: any) => o.indices, true],
] as DataField[];

export const GeometryFacesPage: LC = () => {

  const view = (
    <Draw>
      <Pass>
        <CompositeData
          fields={convexDataFields}
          data={convexFaceData}
					on={<FaceSegments />}
          render={([positions, colors, segments]: StorageSource[]) =>
            <FaceLayer
              positions={positions}
              segments={segments}
              colors={colors}
            />
          }
        />

        <CompositeData
          fields={concaveDataFields}
          data={concaveFaceData}
          render={([positions, colors, indices]: StorageSource[]) =>
            <FaceLayer
              positions={positions}
              indices={indices}
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
