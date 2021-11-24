import { LiveComponent, LiveFiber, LiveElement } from '@use-gpu/live/types';
import { UseRenderingContextGPU, RenderPassMode } from '@use-gpu/core/types';
import { use, yeet, memo, multiGatherReduce, useContext, useMemo } from '@use-gpu/live';
import { RenderContext } from '../providers/render-provider';
import { PickingContext } from './picking';

export type PassProps = {
  device: GPUDevice,
  colorAttachments: GPURenderPassColorAttachment[],
  depthStencilAttachment: GPURenderPassDepthStencilAttachment,
  children: LiveElement<any>,
  render: () => LiveElement<any>,
};

export type RenderToPass = (passEncoder: GPURenderPassEncoder, mpde?: RenderPassMode) => void;
export type Renderable = RenderToPass | {mode: RenderPassMode, pass: RenderToPass};

const makeStaticDone = (c: any): any => {
  c.isStaticComponent = true;
  c.displayName = '[Pass]';
  return c;
}

const toArray = <T>(x: T | T[]): T[] => Array.isArray(x) ? x : [x]; 

export const Pass: LiveComponent<PassProps> = memo((fiber) => (props) => {
  const {children, render} = props;

  const Done = useMemo(() => makeStaticDone((fiber: LiveFiber<any>) => (rs: Record<string, Renderable | Renderable[]>) => {
    const renderContext = useContext(RenderContext);
    const pickingContext = useContext(PickingContext);

    const {device} = renderContext;
  
    const renders = toArray(rs[RenderPassMode.Render]);
    const pickings = toArray(rs[RenderPassMode.Picking]);

    const renderToContext = (
      commandEncoder: GPUCommandEncoder,
      context: UseRenderingContextGPU,
      rs: Renderable[],
      mode: RenderPassMode,
    ) => {
      const {colorAttachments, depthStencilAttachment} = context;
      const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments,
        depthStencilAttachment,
      };

      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
      for (let r of rs) {
        const f = r.mode ? r.pass : r;
        f(passEncoder, mode);
      }
      passEncoder.endPass();
    };

    return yeet(() => {
      const commandEncoder = device.createCommandEncoder();

      renderToContext(commandEncoder, renderContext, renders, RenderPassMode.Render);
      if (pickingContext) renderToContext(commandEncoder, pickingContext.renderContext, pickings, RenderPassMode.Picking);

      device.queue.submit([commandEncoder.finish()]);      
    });
  }), []);

  return multiGatherReduce(children ?? (render ? render() : null), Done);
}, 'Pass');
