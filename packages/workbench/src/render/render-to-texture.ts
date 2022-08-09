import type { LiveFiber, LiveComponent, LiveElement, Task } from '@use-gpu/live';
import type { ColorSpace, TextureTarget } from '@use-gpu/core';

import { use, provide, gather, useCallback, useContext, useFiber, useMemo, useOne, incrementVersion } from '@use-gpu/live';
import { PRESENTATION_FORMAT, DEPTH_STENCIL_FORMAT, COLOR_SPACE, EMPTY_COLOR } from '../constants';
import { RenderContext } from '../providers/render-provider';
import { DeviceContext } from '../providers/device-provider';
import { FrameContext, usePerFrame, useNoPerFrame } from '../providers/frame-provider';

import {
  makeColorState,
  makeColorAttachment,
  makeRenderableTexture,
  makeDepthTexture,
  makeDepthStencilState,
  makeDepthStencilAttachment,
  makeTextureView,
  BLEND_PREMULTIPLIED,
} from '@use-gpu/core';

const seq = (n: number, start: number = 0, step: number = 1) => Array.from({length: n}).map((_, i) => start + i * step);

const NO_SAMPLER: Partial<GPUSamplerDescriptor> = {};

export type RenderToTextureProps = {
  width?: number,
  height?: number,
  live?: boolean,
  history?: number,
  sampler?: Partial<GPUSamplerDescriptor>,
  format?: GPUTextureFormat,
  depthStencil?: GPUTextureFormat | null,
  backgroundColor?: GPUColor,
  colorSpace?: ColorSpace,
  colorInput?: ColorSpace,
  samples?: number,
  resolution?: number,

  children?: LiveElement<any>,
  then?: (texture: TextureTarget) => LiveElement<any>,
};

export const RenderToTexture: LiveComponent<RenderToTextureProps> = (props) => {
  const device = useContext(DeviceContext);
  const renderContext = useContext(RenderContext);

  const {
    resolution = 1,
    width = Math.floor(renderContext.width * resolution),
    height = Math.floor(renderContext.height * resolution),
    samples = renderContext.samples,
    format = PRESENTATION_FORMAT,
    history = 0,
    sampler = NO_SAMPLER,
    depthStencil = DEPTH_STENCIL_FORMAT,
    backgroundColor = EMPTY_COLOR,
    colorSpace = COLOR_SPACE,
    colorInput = COLOR_SPACE,
    live,
    children,
    then,
  } = props;

  const [renderTexture, resolveTexture, bufferTextures, bufferViews, counter] = useMemo(
    () => {
      const render =
        makeRenderableTexture(
          device,
          width,
          height,
          format,
          samples,
        );

      const resolve = samples > 1 ?
        makeRenderableTexture(
          device,
          width,
          height,
          format,
        ) : null;

      const buffers = history > 0 ? seq(history).map(() =>
        makeRenderableTexture(
          device,
          width,
          height,
          format,
        )
      ) : null;
      if (buffers) buffers.push(resolve ?? render);      

      const views = buffers ? buffers.map(b => makeTextureView(b)) : null;

      const counter = { current: 0 };

      return [render, resolve, buffers, views, counter];
    },
    [device, width, height, format, samples, history]
  );
  
  if (live) usePerFrame();
  else useNoPerFrame();

  const targetTexture = resolveTexture ?? renderTexture;

  const colorStates      = useOne(() => [makeColorState(format, BLEND_PREMULTIPLIED)], format);
  const colorAttachments = useMemo(() =>
    [makeColorAttachment(renderTexture, resolveTexture, backgroundColor)],
    [renderTexture, resolveTexture, backgroundColor]
  );
  const depthStencilState = useOne(() => depthStencil
    ? makeDepthStencilState(depthStencil)
    : undefined,
    depthStencil);

  const [
    depthTexture,
    depthStencilAttachment,
  ] = useMemo(() => {
      if (!depthStencil) return [];

      const texture = makeDepthTexture(device, width, height, depthStencil, samples);
      const attachment = makeDepthStencilAttachment(texture, depthStencil);
      return [texture, attachment];
    },
    [device, width, height, depthStencil, samples]
  );

  const [source, sources] = useMemo(() => {
    const view = makeTextureView(targetTexture);
    const size = [width, height] as [number, number];
    const volatile = history ? history + 1 : 0;
    const layout = 'texture_2d<f32>';

    const swap = () => {
      if (!history) return;
      const {current: index} = counter;
      const n = bufferViews!.length;

      const texture = bufferTextures![index];
      const view = bufferViews![index];

      if (resolveTexture) colorAttachments[0].resolveTarget = view;
      else colorAttachments[0].view = view;

      source.texture = texture;
      source.view = view;

      for (let i = 0; i < history; i++) {
        const j = (index + n - i - 1) % n;
        sources[i].texture = bufferTextures![j];
        sources[i].view = bufferViews![j];
      }

      counter.current = (index + 1) % n;
    };
    
    const makeSource = () => ({
      texture: targetTexture,
      view,
      sampler,
      layout,
      format,
      colorSpace,
      size,
      volatile,
      version: 0,
    }) as TextureTarget;

    const sources = history ? seq(history).map(makeSource) : null;

    const source = makeSource(true);
    source.swap = swap;
    source.history = sources;

    return [source, sources];
  }, [targetTexture, width, height, format, history, sampler]);

  const rttContext = useMemo(() => ({
    ...renderContext,
    width,
    height,
    colorSpace,
    colorInput,
    colorStates,
    colorAttachments,
    depthTexture,
    depthStencilState,
    depthStencilAttachment,
    swapView: source.swap,
    history: sources,
  }), [renderContext, width, height, colorStates, colorAttachments, depthTexture, depthStencilState, depthStencilAttachment, source, sources]);

  const Done = (ts: Task[]) => {
    usePerFrame();

    const children: LiveElement<any> = [];
    for (const task of ts) {
      const c = task();
      if (c) children.push(c);
    }

    source.version = incrementVersion(source.version);

    if (then) {
      const c = then(source);
      if (c) children.push(
        provide(FrameContext, {current: source.version}, c)
      );
    }

    if (!children.length) return null;
    return children;
  };
  
  if (!children) return null;

  return (
    gather(
      provide(RenderContext, rttContext, children)
    , Done)
  );
}
