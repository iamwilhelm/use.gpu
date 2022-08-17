import { parseColor } from '@use-gpu/traits';

export type MVTStyle = {
  
  stroke?: ColorLike,
  fill?: ColorLike,
  depth?: number,
  zBias?: number,

  line: {
    width?: number,
  },
  point?: {
    shape?: any,
    size?: number,
  },
  font?: {
    family?: string,
    style?: string,
    weight?: string | number,
    lineHeight?: number,
    size?: number,
  },  
};

export const DEFAULT_STYLE_SHEET = {
  water: {
    stroke: parseColor('#a0a7ff'),
    fill: parseColor('#30407f'),
    line: { width: 4 },
    zBias: 5,
  },
  admin: {
    stroke: parseColor('#8087ff'),
    line: { width: 2 },
    zBias: 5,
  },
  'admin/background': {
    zBias: -50,
    fill: parseColor('#0a0a10'),
  },
};