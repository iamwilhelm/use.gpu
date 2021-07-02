import { LiveFiber, LiveComponent, LiveElement, Task } from '@use-gpu/live/types';
import { GPUPresentationContext } from '@use-gpu/webgpu/types';
import { yeet, gatherReduce, useMemo } from '@use-gpu/live';

export type DrawProps = {
  gpuContext: GPUPresentationContext,
  colorAttachments: GPURenderPassColorAttachmentDescriptor[],
  children?: LiveElement<any>,
  render?: () => LiveElement<any>,
};

const mapper = (t: Task) => [t];
const reducer = (a: Task[], b: Task[]) => [...a, ...b];

export const Draw: LiveComponent<DrawProps> = (fiber) => (props) => {
  const {gpuContext, colorAttachments, children} = props;

  const Done = useMemo(fiber)(() =>
    (fiber) => (ts: Task[]) => {
      // @ts-ignore
      colorAttachments[0].view = gpuContext
      // @ts-ignore
        .getCurrentTexture()
        .createView();
    
      for (let task of ts) task();
    },
    [gpuContext, colorAttachments]);

  if (!Done.displayName) Done.displayName = '[Draw]';

  return gatherReduce(children ?? render(), Done);
}
