import type { LiveComponent, LiveFiber, LiveElement } from '@use-gpu/live';
import type { LambdaSource, TextureSource } from '@use-gpu/core';
import type { Action } from '../types';

import { memo, use, wrap, provide, signal, useFiber, useMemo, useOne, makeContext } from '@use-gpu/live';
import { LiveCanvas } from '@use-gpu/react';
import { wgsl, bundleToAttributes } from '@use-gpu/shader/wgsl';
import { Draw, Pass, Flat, FontLoader, Queue, DeviceContext, getBoundShader, getLambdaSource } from '@use-gpu/workbench';
import { AutoCanvas } from '@use-gpu/webgpu';
import { UI, Layout, Flex, Block, Overflow, Absolute } from '@use-gpu/layout';

import { styled as _styled } from '@stitches/react';

import React, { Fragment } from 'react';

import { UseInspect } from '../../use-inspect';
import { inspectObject } from './props';
import { usePingContext } from '../ping';

import { decodeOctahedral } from '@use-gpu/wgsl/codec/octahedral.wgsl';

const NO_OPS: any[] = [];
const toArray = <T,>(x?: T | T[]): T[] => Array.isArray(x) ? x : x ? [x] : NO_OPS; 

const backgroundColor = [0, 0, 0, 0.1];
const styled: any = _styled;

//const StyledShader = styled('div', {
//});

const arrayShader = wgsl`
  @link fn getIndex() -> u32;
  @link fn getTexture(uv: vec2<f32>, index: u32) -> vec4<f32>;

  fn main(uv: vec2<f32>) -> vec4<f32> { return getTexture(uv, getIndex()); }
`;

const depthCubeShader = wgsl`
  @link fn decodeOctahedral(o: vec2<f32>) -> vec3<f32>;
  @link fn getTexture(uv: vec3<f32>) -> vec4<f32>;

  fn main(uv: vec2<f32>) -> vec4<f32> {
    var uvw: vec3<f32> = decodeOctahedral(uv * 2.0 - 1.0);

    let t = getTexture(uvw);

    let a = abs(uvw);
    var b: vec2<f32>;
    
    var tint = vec3<f32>(0.0, 0.0, 0.0);
    if (a.x > a.y) {
      if (a.x > a.z) {
        b = uvw.yz / a.x;
        if (uvw.x > 0.0) {
          tint.r += 1.0;
        }
        else {
          tint.r += 1.0;
          tint.g += 0.5;
        }
      }
      else {
        b = uvw.xy / a.z;
        if (uvw.z > 0.0) {
          tint.b += 1.0;
          tint.g += 0.25;
        }
        else {
          tint.b += 1.0;
          tint.r += 0.5;
          tint.g += 0.25;
        }
      }
    }
    else {
      if (a.y > a.z) {
        b = uvw.xz / a.y;
        if (uvw.y > 0.0) {
          tint.g += 1.0;
        }
        else {
          tint.g += 1.0;
          tint.b += 0.5;
        }
      }
      else {
        b = uvw.xy / a.z;
        if (uvw.z > 0.0) {
          tint.b += 1.0;
          tint.g += 0.25;
        }
        else {
          tint.b += 1.0;
          tint.r += 0.5;
          tint.g += 0.25;
        }
      }
    }
    let border = clamp(50.0 * (max(abs(b.x), abs(b.y)) - 0.9), 0.0, 1.0);
    
    let depth = t.x;
    return mix(vec4<f32>(fract(depth), fract(depth * 16.0) * .75, fract(depth * 256.0), 1.0), vec4<f32>(tint, 1.0), border * 0.5);
  }
`;

const pickingShader = wgsl`
  @link fn getSize() -> vec2<f32>;
  @link fn getPicking(uv: vec2<i32>, level: i32) -> vec4<u32>;

  fn main(uv: vec2<f32>) -> vec4<f32> {
    let iuv = vec2<i32>(uv * getSize());
    let pick = vec2<f32>(getPicking(iuv, 0).xy);

    let a = (pick.r / 16.0) % 1.0;
    let b = (pick.g / 16.0) % 1.0;
    let c = (pick.r + pick.g) / 256.0;
    return sqrt(vec4<f32>(a, c, b, 1.0));
  }
`;

const depthShader = wgsl`
  @link fn getTexture(uv: vec2<f32>) -> vec4<f32>;

  fn main(uv: vec2<f32>) -> vec4<f32> {
    let depth = getTexture(uv).x;
    return vec4<f32>(depth, fract(depth * 16.0) * .75, fract(depth * 256.0), 1.0);
  }
`;

const ARRAY_BINDINGS = bundleToAttributes(arrayShader);
const PICKING_BINDINGS = bundleToAttributes(pickingShader);
const DEPTH_BINDINGS = bundleToAttributes(depthShader);
const DEPTH_CUBE_BINDINGS = bundleToAttributes(depthCubeShader);

type OutputProps = {
  fiber: LiveFiber<any>,
};

type ViewProps = TexturesProps & {
  canvas: HTMLCanvasElement,
  device: GPUDevice,
};

type TexturesProps = {
  color?: TextureSource | TextureSource[],
  depth?: TextureSource | TextureSource[],
  picking?: TextureSource | TextureSource[],
};

export const Output: React.FC<OutputProps> = ({fiber}) => {
  usePingContext();
  
  const {color, picking, depth} = fiber.__inspect?.output;
  const device = fiber.context.values.get(DeviceContext)?.current;

  return (
    <div style={{height: 522, position: 'relative'}}>
      <LiveCanvas>
        {(canvas: HTMLCanvasElement) => use(View, {canvas, device, color, picking, depth})}
      </LiveCanvas>
    </div>
  );
};

const View: LiveComponent<ViewProps> = ({canvas, device, color, picking, depth}) => (
  use(UseInspect, {
    container: canvas.parentNode,
    active: true,
    fiber: useFiber(),
    children: (
      provide(DeviceContext, device,
        wrap(Queue, [
          signal(),
          use(Inner, {canvas, device, color, picking, depth}),
        ])
      )
    ),
  })
);

const Inner: LiveComponent<ViewProps> = memo(({canvas, color, picking, depth}) => (
  use(AutoCanvas, {
    backgroundColor,
    canvas,
    children: [
      wrap(FontLoader,
        wrap(Flat,
          wrap(Draw,
            wrap(Pass,
              wrap(UI,
                wrap(Layout,
                  wrap(Absolute, use(Overflow, {
                    x: 'auto',
                    direction: 'x',
                    children: use(TextureViews, {color, picking, depth}),
                  }))))))))
    ]
  })
), 'Inner');

const TextureViews: LiveComponent<TexturesProps> = memo((props: TexturesProps) => {
  const {color, picking, depth} = props;

  const makeView = (texture: TextureSource | LambdaSource) => {
    const {size: [w, h]} = texture;
    const width = w > h ? 512 : w/h * 512;
    const height = w > h ? h/w * 512 : 512;

    return use(Block, {
      width, height,
      fill: [0, 0, 0, .5],
      image: {texture, fit: 'contain', align: 'center', repeat: 'none'},
    });
  };

  const colorViews = useOne(() => {
    const out: LiveElement[] = [];

    for (let t of [...toArray(color), ...toArray(depth)]) {
      const {layout, format, size} = t;

      if (layout.match(/depth/) || format.match(/depth/)) {
        t = {...t, comparison: false, sampler: {}};

        if (layout.match(/cube_array/)) {
          throw new Error("TODO");
        }
        else if (layout.match(/cube/)) {
          let texture = getBoundShader(depthCubeShader, DEPTH_CUBE_BINDINGS, [decodeOctahedral, t]);
          texture = getLambdaSource(texture, t);
          out.push(makeView(texture));
        }
        else if (layout.match(/array/)) {
          const [,, depth] = size;
          for (let i = 0; i < depth; ++i) {
            let texture = getBoundShader(arrayShader, ARRAY_BINDINGS, [i, t]);
            texture = getBoundShader(depthShader, DEPTH_BINDINGS, [texture]);
            texture = getLambdaSource(texture, t);
            out.push(makeView(texture));
          }
        }
        else {
          let texture = getBoundShader(depthShader, DEPTH_BINDINGS, [t]);
          texture = getLambdaSource(texture, t);
          out.push(makeView(texture));
        }
      }
      else out.push(makeView(t));
    }

    return out;
  }, color);

  const pickingViews = useOne(() => {
    const out: LiveElement[] = [];
    for (let t of toArray(picking)) {
      const {size} = t;

      let texture = getBoundShader(pickingShader, PICKING_BINDINGS, [() => size, t]);
      texture = getLambdaSource(texture, t);

      out.push(makeView(texture));
    }
    return out;
  }, picking);

  const view: LiveElement[] = useMemo(() => [
    ...colorViews,
    ...pickingViews,
  ], [colorViews, pickingViews]);

  return view;
}, 'TextureViews');
