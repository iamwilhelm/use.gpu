import type { LiveFiber, LiveComponent, LiveElement, Task } from '@use-gpu/live';
import type { StorageTarget } from '@use-gpu/core';

import { getDataArrayByteLength, makeDataBuffer } from '@use-gpu/core';
import { use, wrap, provide, fence, yeet, useCallback, useContext, useFiber, useMemo, useOne, incrementVersion } from '@use-gpu/live';
import { RenderContext } from '../providers/render-provider';
import { DeviceContext } from '../providers/device-provider';
import { FeedbackContext } from '../providers/feedback-provider';
import { ComputeContext } from '../providers/compute-provider';
import { FrameContext, usePerFrame, useNoPerFrame } from '../providers/frame-provider';
import { useAnimationFrame, useNoAnimationFrame } from '../providers/loop-provider';

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

export type ComputeDataProps = {
  width?: number,
  height?: number,
  depth?: number,
  history?: number,
  format?: UniformType,

  children?: LiveElement<any>,
  render?: (source: StorageTarget) => LiveElement<any>,
  then?: (source: StorageTarget) => LiveElement<any>,
};

export const ComputeData: LiveComponent<ComputeDataProps> = (props) => {
  const device = useContext(DeviceContext);
  const renderContext = useContext(RenderContext);

  const {
    resolution = 1,
    width = Math.floor(renderContext.width * resolution),
    height = Math.floor(renderContext.height * resolution),
    depth = 1,
    format = 'f32',
    history = 0,
    render,
    children,
    then,
  } = props;

  const length = width * height * depth;

  const [buffer, buffers, counter] = useMemo(
    () => {
      const flags = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST;
      const byteLength = getDataArrayByteLength(format, length);
      const buffer = makeDataBuffer(device, byteLength, flags);
      
      const buffers = history > 0 ? seq(history).map(() =>
        makeDataBuffer(device, byteLength, flags)
      ) : null;
      if (buffers) buffers.push(buffer);

      let i = 0;
      if (buffers) for (const b of buffers) b.label = 'history-' + ++i;
      buffer.label = 'target';

      const counter = { current: 0 };
      return [buffer, buffers, counter];
    },
    [device, width, height, depth, format, history]
  );

  const targetBuffer = buffer;

  const [source, sources] = useMemo(() => {
    const size = [width, height, depth] as [number, number, number];
    const volatile = history ? history + 1 : 0;

    const swap = () => {
      if (!history) return;

      const {current: index} = counter;
      const n = buffers!.length;

      source.buffer = buffers[index];

      for (let i = history - 1; i >= 0; i--) {
        const j = (index + n - i - 1) % n;
        sources[i].buffer = buffers![j];
        sources[i].version = i ? sources[i - 1].version : source.version;
      }

      source.version = incrementVersion(source.version);

      counter.current = (index + 1) % n;
    };

    const makeSource = (readWrite: boolean) => ({
      buffer: targetBuffer,
      format,
      length,
      size,
      volatile,
      version: 0,
      readWrite: false,
    }) as StorageTarget;

    const sources = history ? seq(history).map(() => makeSource(false)) : null;

    const source = makeSource(true);
    source.swap = swap;
    source.history = sources;
    source.readWrite = true;

    return [source, sources];
  }, [targetBuffer, width, height, depth, format, history]);

  if (!(render ?? children)) return yeet(source);

  const content = render ? render(source) : children;
  const view = provide(ComputeContext, source, content);

  if (then) return fence(view, () => then(source));
  return view;
}
