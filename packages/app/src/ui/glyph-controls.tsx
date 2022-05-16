import React from 'react';
import { LiveElement } from '@use-gpu/live/types';
import { PAGES } from '../routes';
import { use, fragment, useState } from '@use-gpu/live';
import { HTML } from '@use-gpu/react';
import { useRouterContext } from '@use-gpu/components';

const STYLE = {
  position: 'absolute',

  left: 0,
  //left: '50%',
  //marginLeft: '-100px',

	bottom: 0,
  width: '200px',
  padding: '20px',
  background: 'rgba(0, 0, 0, .75)',
};

type GlyphControlsProps = {
  hasGlyph?: boolean,
  hasContours?: boolean,
  container: Element,
  render?: ({
    subpixel: boolean,
    contours: boolean,
    glyph: string,
  }) => LiveElement<any>
};

export const GlyphControls = (props: GlyphControlsProps) => {
  const {hasGlyph, hasContours, container, render} = props;

  const [subpixel, setSubpixel] = useState(true);
  const [contours, setContours] = useState(false);
  const [glyph, setGlyph] = useState('Q');

  return fragment([
		render({subpixel, contours, glyph}),
    use(HTML, {
      container,
      style: STYLE,
      children: (<>
        {hasGlyph ? (
          <div>
            <label>Glyph <input type="text" value={glyph} onChange={(e) => setGlyph(e.target.value)} /></label>
          </div>
        ) : null}
        {hasContours ? (
          <div>
            <label><input type="checkbox" checked={contours} onChange={(e) => setContours(e.target.checked)} /> Show SDF Contours</label>
          </div>
        ) : null}
        <div>
          <label><input type="checkbox" checked={subpixel} onChange={(e) => setSubpixel(e.target.checked)} /> Subpixel SDF</label>
        </div>
      </>)
    }),
  ]);
}
