import { LiveComponent } from '@use-gpu/live/types';
import { ShaderSource } from '@use-gpu/shader/types';
import { ColorTrait, LineTrait, ROPTrait, VolumeTrait } from '../types';

import { use, useContext } from '@use-gpu/live';
import { DualContourLayer } from '@use-gpu/workbench';

import { DataContext } from '../providers/data-provider';
import {
  useColorTrait,
  useVolumeTrait,
  useROPTrait,
} from '../traits';

export type ImplicitSurfaceProps =
  Partial<ColorTrait> &
  Partial<ROPTrait> &
  Partial<VolumeTrait> & {
};

export const ImplicitSurface: LiveComponent<ImplicitSurfaceProps> = (props: ImplicitSurfaceProps) => {
  const values = useContext(DataContext) ?? undefined;

  const {loopX, loopY, loopZ, shaded} = useVolumeTrait(props);
  const color = useColorTrait(props);
  const rop = useROPTrait(props);

  return (
    use(DualContourLayer, {
      values,
      color,
      loopX,
      loopY,
      loopZ,
      shaded,
    })
  );
};