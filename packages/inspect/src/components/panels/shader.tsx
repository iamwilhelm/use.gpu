import type { LiveFiber } from '@use-gpu/live';
import type { Action } from '../types';

import { formatNode, formatValue } from '@use-gpu/live';
import { styled as _styled } from '@stitches/react';

import React, { useCallback, useState } from 'react';
import { SplitRow, Label, Selectable, Spacer } from '../layout';

import { inspectObject } from './props';
import { usePingContext } from '../ping';

import { WGSL } from '../wgsl';

const styled: any = _styled;

const StyledShader = styled('div', {
  background: 'rgba(255, 255, 255, 0.1)',
  fontFamily: '"Fira Code", "Bitstream Vera Mono", monospace',
  fontSize: '12px',
  lineHeight: '13px',
});

const StyledHeader = styled('div', {
  display: 'flex',
});

const Grow = styled('div', {
  flexGrow: 1,
});

const StyledEditor = styled('div', {
  display: 'flex',
  padding: '10px 0',
  width: '100%',
});

const StyledGutter = styled('div', {
  padding: '0 5px',
  borderRight: '1px solid var(--LiveInspect-borderThin)',
  textAlign: 'right',
  color: 'var(--LiveInspect-colorTextMuted)',
  fontSize: '0.9em',
});

const StyledCode = styled('div', {
  flexGrow: '1',
  whiteSpace: 'pre',
  padding: '0 10px',
  overflow: 'auto',
});

type ShaderProps = {
  type: string,
  fiber: LiveFiber<any>,
};

export const Shader: React.FC<ShaderProps> = ({type, fiber}) => {
  usePingContext();

  const shader = fiber.__inspect?.[type];
  const uniforms = fiber.__inspect?.uniforms;
  const bindings = fiber.__inspect?.bindings;
  const volatiles = fiber.__inspect?.volatiles;

  const [state, setState] = useState<Record<string, boolean>>({});
  const toggleState = (id: string) => setState((state) => ({
    ...state,
    [id]: !state[id],
  }));
  
  const toObject = (us: any[]) => {
    const out: Record<string, any> = {};
    for (let u of us) {
      u = {...u};
      let n = u.uniform.name;
      if (n in out) {
        let i = 2;
        for (; i < 100; ++i) if (!(n + i in out)) break;
        n = n + i;
      }
      out[n] = u;
      if (u.constant) {
        if (typeof u.constant === 'function') {
          u.resolved = u.constant();
        }
      }
    }
    return out;
  }

  const {hash} = shader;
  const handleCommit = useCallback((code: string) => {
    fiber.__inspect?.updateShader?.(hash, code);
  }, [fiber, hash]);

  return (<>
    {uniforms || bindings ? (<>
      {uniforms?.length  ? <><div><b>Constants</b></div>{inspectObject(toObject(uniforms), state, toggleState, 'u')}</> : null}
      {bindings?.length  ? <><div><b>Bindings</b></div>{inspectObject(toObject(bindings), state, toggleState, 'b')}</> : null}
      {volatiles?.length ? <><div><b>Volatiles</b></div>{inspectObject(toObject(volatiles), state, toggleState, 'v')}</> : null}
      <Spacer />
    </>) : null}
    <StyledHeader>
      <Grow><b>Shader</b> (<code>{shader.hash}</code>)</Grow>
      <div><span style={{opacity: 0.5}}>(Ctrl-Enter = Hot Reload)</span></div>
    </StyledHeader>
    <StyledShader><Selectable>
      <WGSL code={shader.code} onCommit={handleCommit} />
    </Selectable></StyledShader>
  </>);
}
