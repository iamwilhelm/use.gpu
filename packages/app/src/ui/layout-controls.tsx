import React from 'react';
import { PAGES } from '../routes';
import { use, fragment, useState } from '@use-gpu/live';
import { HTML } from '@use-gpu/react';
import { useRouterContext } from '@use-gpu/components';

const STYLE = {
  position: 'absolute',
  left: '0',
	bottom: 0,
  width: '200px',
  padding: '20px',
  background: 'rgba(0, 0, 0, .75)',
};

type LayoutControlsProps = {
  container: Element,
};

export const LayoutControls = (props: LayoutControlsProps) => {
  const {container, render} = props;
  const [mode, setMode] = useState('inspect');

  return fragment([
		render(mode),
    use(HTML, {
      container,
      style: STYLE,
      children: (<>
        <div>
          <label><input type="radio" checked={mode === 'inspect'} onChange={(e) => e.target.checked && setMode('inspect')} /> Interact</label>
        </div>
        <div>
          <label><input type="radio" checked={mode === 'zoom'} onChange={(e) => e.target.checked && setMode('zoom')} /> Pan &amp; Zoom</label>
        </div>
      </>)
    }),
  ]);
}
