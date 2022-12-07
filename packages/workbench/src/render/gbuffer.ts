import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction } from '@use-gpu/live';
import type { DataBounds, RenderPassMode, StorageSource, TextureSource, TextureTarget, UseGPURenderContext } from '@use-gpu/core';
import type { ShaderModule } from '@use-gpu/shader';
import type { AggregatedCalls } from './pass/types';
import type { UseLight } from './light-data';

import { yeet, memo, provide, fence, useMemo, useOne } from '@use-gpu/live';
import { DEPTH_STENCIL_FORMAT, COLOR_SPACE, EMPTY_COLOR } from '../constants';
import {
  makeColorAttachment, makeColorState, makeDepthTexture, makeDepthStencilAttachment, makeDepthStencilState, makeTargetTexture,
} from '@use-gpu/core';

import { useDeviceContext } from '../providers/device-provider';
import { RenderContext, useRenderContext } from '../providers/render-provider';

import { useInspectable } from '../hooks/useInspectable';

export type GBufferProps = {
  render?: (gbufferContext: UseGPURenderContext) => LiveElement,
  then?: (targets: TextureTarget[]) => LiveElement,
};

export const GBuffer: LC<GBufferProps> = memo((props: PropsWithChildren<GBufferProps>) => {
  const device = useDeviceContext();
  const renderContext = useRenderContext();

  const inspect = useInspectable();

  const {render, then} = props;
  const {width, height, samples} = renderContext;
  if (samples > 1) throw new Error("GBuffer cannot be multisampled");

  const {depthStencilState: {format}} = renderContext;

  // Set up GBuffer
  const formats = useMemo(() => [
    'rgba8unorm',
    'rgba16float', 
    'rgba8unorm',
    device.features.has('rg11b10ufloat-renderable') ? 'rg11b10ufloat' : 'rgb10a2unorm',
    format,
  ], [device, format]);

  const renderTextures = useMemo(() => formats.map(format => makeTargetTexture(
    device,
    width,
    height,
    format,
    1,
  )), [device, width, height, formats]);

  const colorStates = useOne(() => formats.slice(0, 3).map(format => makeColorState(format)), formats);
  const colorAttachments = useOne(() => renderTextures.slice(0, 3).map(texture => makeColorAttachment(texture, null)), renderTextures);

  const sources = useMemo(() => {
    const makeSource = (texture: GPUTexture, i: number) => ({
      texture,
      sampler: {},
      layout: formats[i].match(/depth/) ? 'texture_depth_2d' : 'texture_2d<f32>',
      format: formats[i],
      colorSpace: 'linear',
      size: [width, height],
      version: 0,
      swap: () => {},
    }) as TextureTarget;

    return renderTextures.map(makeSource);
  }, [renderTextures, formats, width, height]);

  const context = useMemo(() => ({
    ...renderContext,
    colorStates,
    colorAttachments,
    sources,
    swap: () => {},
  }), [renderContext, colorStates, colorAttachments, sources]);

  inspect({
    output: {
      color: sources,
    },
  });

  if (!(render ?? children)) return yeet(context);

  const view = render ? render(context) : null;
  if (then) return fence(view, () => then(source));
  return view;
}, 'GBuffer');
