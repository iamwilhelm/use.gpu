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

export type DualContourProps =
  Partial<ColorTrait> &
  Partial<ROPTrait> &
  Partial<VolumeTrait> & {
  colors?: ShaderSource,
};

export const DualContour: LiveComponent<DualContourProps> = (props: DualContourProps) => {
  const {colors} = props;

  const positions = useContext(DataContext) ?? undefined;

  const {loopX, loopY, loopZ, shaded} = useVolumeTrait(props);
  const color = useColorTrait(props);
  const rop = useROPTrait(props);

  return (
    use(DualContourLayer, {
      positions,
      color,
      colors,
      loopX,
      loopY,
      loopZ,
      shaded,
    })
  );
};