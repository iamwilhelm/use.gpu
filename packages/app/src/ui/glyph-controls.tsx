import React from 'react';
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
  container: Element,
};

export const GlyphControls = (props: GlyphControlsProps) => {
  const {container, render} = props;
  const [subpixel, setSubpixel] = useState(true);

  return fragment([
		render(subpixel),
    use(HTML, {
      container,
      style: STYLE,
      children: (<>
        <div>
          <label><input type="checkbox" checked={subpixel} onChange={(e) => setSubpixel(e.target.checked)} /> Subpixel SDF</label>
        </div>
      </>)
    }),
  ]);
}
