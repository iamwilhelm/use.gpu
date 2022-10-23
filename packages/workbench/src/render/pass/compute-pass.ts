import type { LC, PropsWithChildren, LiveFiber, LiveElement, ArrowFunction } from '@use-gpu/live';
import type { ComputeToPass } from '../pass';

import { use, quote, yeet, memo, multiGather, useContext, useMemo } from '@use-gpu/live';
import { RenderContext } from '../../providers/render-provider';
import { DeviceContext } from '../../providers/device-provider';
import { useInspectable } from '../../hooks/useInspectable'

export type ComputePassProps = {
  calls: {
    compute?: ComputeToPass[],
  },
};

const NO_OPS: any[] = [];
const toArray = <T>(x?: T[]): T[] => Array.isArray(x) ? x : NO_OPS; 

/** Compute pass.

Executes all compute calls
*/
export const ComputePass: LC<ComputePassProps> = memo((props: PropsWithChildren<ComputePassProps>) => {
  const {
    calls,
  } = props;

  const inspect = useInspectable();

  const device = useContext(DeviceContext);
  const renderContext = useContext(RenderContext);

  const computes = toArray(rs['compute'] as ComputeToPass[]);

  const computeToContext = (
    commandEncoder: GPUCommandEncoder,
    rs: ComputeToPass[],
    countDispatch: ComputeCounter,
  ) => {
    const passEncoder = commandEncoder.beginComputePass();
    for (const r of rs) r(passEncoder, countDispatch);
    passEncoder.end();
  };

  return quote(yeet(() => {
    let ds = 0;
    
    const countDispatch = (d: number) => { ds += d; };

    if (computes.length) {
      const commandEncoder = device.createCommandEncoder();
      computeToContext(commandEncoder, computes, countDispatch);

      const command = commandEncoder.finish();
      device.queue.submit([command]);
    }

    inspect({
      render: {
        vertexCount: vs,
        triangleCount: ts,
      },
    });

    return null;
  }));

}, 'ComputePass');
