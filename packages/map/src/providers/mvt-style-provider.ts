import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { ColorLike } from '@use-gpu/traits';

import { patch } from '@use-gpu/state';
import { parseNumber, parseColor } from '@use-gpu/traits';
import { makeContext, useContext, useNoContext } from '@use-gpu/live';

import { DEFAULT_STYLE_SHEET } from '../style';

export type MVTStyle = {
  stroke?: ColorLike,
  fill?: ColorLike,
  depth?: number,

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

export type MVTStyleContextProps = Record<string, MVTStyle>;

const DEFAULT_STYLE: MVTStyle = {
  fill: [0.5, 0.5, 0.5, 1],
  stroke: [1, 1, 1, 1],
  depth: 0.5,
  zBias: 0,
  line: {
    width: 2,
  },
  point: {
    shape: 'circle',
    size: 5,
  },
  font: {
    family: 'sans-serif',
    style: 'normal',
    weight: 'normal',
    size: 16,
    lineHeight: 20,
  },
};

for (let k in DEFAULT_STYLE_SHEET) DEFAULT_STYLE_SHEET[k] = patch(DEFAULT_STYLE_SHEET[k], {$apply: x => patch(DEFAULT_STYLE, x)});

export const MVTStyleContext = makeContext<MVTStyleContextProps>(patch({
  default: DEFAULT_STYLE,
}, DEFAULT_STYLE_SHEET), 'MVTStyleContext');

export const useMVTStyleContext = () => useContext(MVTStyleContext);
export const useNoMVTStyleContext = () => useNoContext(MVTStyleContext);

export type MVTStyleProps = {
  styles?: MVTStyleContextProps,
  children?: LiveElement,
};

export const MVTStyle: LiveComponent<MVTStyleProps> = (props) => {
  const {styles, children} = props;

  const context = useOne(() => {
    const parseStyle = (style: any, def: any) => {
      const {fill, stroke} = style;
      const out = patch(def, style);
      if (fill) out.fill = parseColor(fill);
      if (stroke) out.stroke = parseColor(stroke);
      return out;
    };
    
    const out: MVTStyleContextProps = {
      default: parseStyle(styles.default ?? {}, DEFAULT_STYLE),
    };
    const def = out.default;

    for (const k in styles) {
      if (k !== 'default') {
        out[k] = parseStyle(styles[k], def);
      }
    }
    return out;
  }, styles);
  
  return provide(MVTStyleContext, styles, children);
};
