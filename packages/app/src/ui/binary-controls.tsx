import React from 'react';
import type { LC, LiveElement } from '@use-gpu/live';

import { use, fragment, useResource, useState } from '@use-gpu/live';
import { HTML } from '@use-gpu/react';
import { useRouterContext } from '@use-gpu/workbench';

const STYLE = {
  position: 'absolute',

  left: 0,
  //left: '50%',
  //marginLeft: '-100px',

  bottom: 0,
  width: '300px',
  padding: '20px',
  background: 'rgba(0, 0, 0, .75)',
};

// @ts-ignore
const isDevelopment = process.env.NODE_ENV === 'development';
const base = isDevelopment ? '/' : '/demo/';

type State = {
  mode: string,
};

type BinaryControlsProps = {
  container?: Element | null,
  render?: (state: State) => LiveElement
};

const FILES = [
  { id: 1, url: base + "data/doom.bin", name: 'doom.exe' },
  { id: 2, url: base + "data/wolf3d.bin", name: 'wolf3d.exe' },
];

const MODES = [
  { id: 'spatial', name: 'Spatial (XYZ)' },
  { id: 'histogram', name: 'Histogram' },
];

export const BinaryControls: LC<BinaryControlsProps> = (props: BinaryControlsProps) => {
  const {hasNormalize, container, render} = props;

  const [fileId, setFileId] = useState(2);
  //const [customFile, setCustomFile] = useState<File>();

  const [mode, setMode] = useState('spatial');
  const [buffer, setBuffer] = useState(() => new ArrayBuffer(1));

  useResource(async (dispose) => {
    const file = FILES.find(({id}) => fileId == id);
    if (!file) return;

    const {url} = file;
    const buffer = await fetch(url).then(r => r.arrayBuffer());
    setBuffer(buffer);
  }, [fileId]);

  return fragment([
    render ? render({mode, buffer}) : null,
    use(HTML, {
      container,
      style: STYLE,
      children: (<>
        <div>
          <label>Show file:</label>
          <select style={{marginLeft: 20}} onChange={(e) => setFileId(e.target.value)}>
            {FILES.map(({id, name}) => <option key={id} value={id}>{name}</option>)}
            {/*custom ? <option value={custom}>{custom}</option> : */}
          </select>
        </div>
        <div>
          <label>Coloring:</label>
          <select style={{marginLeft: 20}} onChange={(e) => setMode(e.target.value)}>
            {MODES.map(({id, name}) => <option key={id} value={id}>{name}</option>)}
          </select>
        </div>
      </>)
    }),
  ]);
}
