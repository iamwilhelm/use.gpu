import { parseColor } from '@use-gpu/traits';

export const DEFAULT_STYLE_SHEET = {
  water: {
    face: {
      stroke: parseColor('#a0a7ff'),
      fill: parseColor('#30407f'),
      width: 4,
      depth: 0.5,
      zBias: 0,
    }
  },
  admin: {
    line: {
      color: parseColor('#8087ff'),
      width: 2,
      depth: 0.5,
      zBias: 0,
    },
  },
  'admin/background': {
    face: {
      fill: parseColor('#0a0a10'),
      zBias: -50,
    }
  },
};