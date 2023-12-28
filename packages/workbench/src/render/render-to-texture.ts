import type { LiveFiber, LiveComponent, LiveElement, ArrowFunction, PropsWithChildren } from '@use-gpu/live';
import type { UseGPURenderContext, ColorSpace, TextureTarget } from '@use-gpu/core';

import { use, provide, yeet, useCallback, useMemo, useOne, incrementVersion } from '@use-gpu/live';
import { RenderContext, useRenderContext, useNoRenderContext } from '../providers/render-provider';
import { QueueReconciler } from '../reconcilers';

import { getRenderFunc } from '../hooks/useRenderProp';

import {
  makeColorState,
  makeColorAttachment,
  makeTargetTexture,
  makeDepthTexture,
  makeDepthStencilState,
  makeDepthStencilAttachment,
  BLEND_PREMULTIPLY,
  seq,
} from '@use-gpu/core';

const {quote} = QueueReconciler;

const NO_SAMPLER: Partial<GPUSamplerDescriptor> = {};

export type RenderToTextureProps = {
  target?: UseGPURenderContext,
  render?: (texture: TextureTarget) => LiveElement,
  children?: (texture: TextureTarget) => LiveElement,
};

/** Render to a given off-screen target, or the current target (if inside a `@{<RenderTarget>}`). */
export const RenderToTexture: LiveComponent<RenderToTextureProps> = (props: PropsWithChildren<RenderToTextureProps>) => {
  const {
    target,
    children,
  } = props;

  const renderContext = target ? (useNoRenderContext(), target) : useRenderContext();
  const {source} = renderContext;
  if (!source) throw new Error("No render target provided or in use");

  const trigger = useMemo(() => quote(yeet(() => {
    source!.version = incrementVersion(source!.version);
  })), [source]);

  const render = getRenderFunc(props);
  const view = render ? render(source) : children;

  return [trigger, provide(RenderContext, renderContext, view)];
};
