import { LiveComponent } from '@use-gpu/live/types';
import { Rectangle, StorageSource } from '@use-gpu/core/types';
import { Alignment } from '../layout/types';

import { memo, yeet, useContext, useOne } from '@use-gpu/live';
import { makeTuples } from '@use-gpu/core';

import { useFontText, useFontHeight } from './providers/font-provider';
import { useSDFGlyphData } from './providers/sdf-font-provider';

type GlyphSourceProps = {
  strings: string[] | string,
  lineHeight?: number,
  align?: Alignment,
  wrap?: number,
  snap?: boolean,
  detail: 48,
  
  render?: (buffers: StorageSource[]) => void,
};

const NO_LAYOUT: Rectangle = [0, 0, 0, 0];

export const GlyphSource: LiveComponent<GlyphSourceProps> = memo((props: GlyphSourceProps) => {
  const {
    strings,
    lineHeight,
    align = 'center',
    size = 48,
    wrap = 0,
    snap,
    
    render,
  } = props;

  const {spans, breaks, glyphs} = useFontText(strings, size);
  const height = useFontHeight(size, lineHeight);

  const buffers = useSDFGlyphData(
    NO_LAYOUT,
    spans,
    glyphs,
    breaks,
    height,
    align,
    size,
    wrap,
    snap,
  );
  
  return render ? render(buffers) : yeet(buffers);
});

GlyphSource.displayName = 'GlyphSource';