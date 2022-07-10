import { LiveComponent } from '@use-gpu/live/types';
import { ShaderSource } from '@use-gpu/shader/types';
import { ColorTrait, LineTrait, ROPTrait, SurfaceTrait } from '../types';

import { use, useContext } from '@use-gpu/live';
import { SurfaceLayer } from '@use-gpu/workbench';

import { DataContext } from '../providers/data-provider';
import {
  useColorTrait,
  useSurfaceTrait,
  useROPTrait,
} from '../traits';

export type SurfaceProps =
  Partial<ColorTrait> &
  Partial<LineTrait> &
  Partial<ROPTrait> &
  Partial<SurfaceTrait> & {
  colors?: ShaderSource,
};

export const Surface: LiveComponent<SurfaceProps> = (props) => {
  const {colors} = props;

  const positions = useContext(DataContext) ?? undefined;

  const {loopX, loopY, shaded} = useSurfaceTrait(props);
  const color = useColorTrait(props);
  const rop = useROPTrait(props);

  return (
    use(SurfaceLayer, {
      positions,
      color,
      colors,
      loopX,
      loopY,
      shaded,
    })
  );
};

