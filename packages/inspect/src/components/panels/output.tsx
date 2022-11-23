import type { LiveComponent, LiveFiber, LiveElement } from '@use-gpu/live';
import type { LambdaSource, TextureSource } from '@use-gpu/core';
import type { Action } from '../types';

import { memo, use, wrap, provide, useFiber, useMemo, useOne } from '@use-gpu/live';
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
    return vec4<f32>(depth, depth, depth, 1.0);
  }
`;

const ARRAY_BINDINGS = bundleToAttributes(arrayShader);
const PICKING_BINDINGS = bundleToAttributes(pickingShader);
const DEPTH_BINDINGS = bundleToAttributes(depthShader);

type OutputProps = {
  fiber: LiveFiber<any>,
};

type ViewProps = TextureViewsProps & {
  canvas: HTMLCanvasElement,
  device: GPUDevice,
};

type TextureViewsProps = {
  color?: TextureSource | TextureSource[],
  depth?: TextureSource | TextureSource[],
  picking?: TextureSource | TextureSource[],
};

export const Output: React.FC<OutputProps> = ({fiber}) => {
  usePingContext();
  
  const {color, picking, depth} = fiber.__inspect?.output;
  const device = fiber.context.values.get(DeviceContext)?.current;

  return (
    <div style={{height: 520, position: 'relative'}}>
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
        wrap(Queue,
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
                            x: 'scroll',
                            direction: 'x',
                            children:
                              use(TextureViews, {color, picking, depth})
                          }))))))))
            ]
          })
        )
      )
    ),
  })
);

const TextureViews: LiveComponent<TextureViewsProps> = memo((props: TextureViewsProps) => {
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
    if (!color) return out;

    for (const texture of toArray(color)) {
      out.push(makeView(texture));
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

  const depthViews = useOne(() => {
    const out: LiveElement[] = [];
    for (let t of toArray(depth)) {
      const {size, layout} = t;
      t = {...t, comparison: false, sampler: {}};
      console.log({t})

      if (layout.match(/array/)) {
        const [,, depth] = size;
        for (let i = 0; i < depth; ++i) {
          let texture = getBoundShader(arrayShader, ARRAY_BINDINGS, [i, t]);
          texture = getBoundShader(depthShader, DEPTH_BINDINGS, [texture]);
          texture = getLambdaSource(texture, t);
          out.push(makeView(texture));
        }
      }
      else {
        out.push(makeView(t));
      }
    }
    return out;
  }, depth);

  const view: LiveElement[] = useMemo(() => [
    ...colorViews,
    ...pickingViews,
    ...depthViews,
  ], [colorViews, pickingViews, depthViews]);

  return view;
}, 'TextureViews');
