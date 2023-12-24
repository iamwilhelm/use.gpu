import type { LiveComponent, PropsWithChildren } from '@use-gpu/live';
import { use, fence, yeet } from '@use-gpu/live';
import { VirtualLayers } from '@use-gpu/workbench';

export type LayerProps = PropsWithChildren<{
  zIndex?: number,
}>;

const OPTIONS = {};

export const Layer: LiveComponent<LayerProps> = (props) => {
  const {children} = props;
  return fence(
    children ? use(VirtualLayers, { ...OPTIONS, children }) : null,
    (value: any) => {
      return yeet({
        layer: yeet(value),
        zIndex,
      });
    },
  );
};