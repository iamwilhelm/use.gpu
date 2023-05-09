import React from 'react';
import { useRefineCursor, Cursor } from '@use-gpu/state';
import { SmallButton, OptionsContainer, Spacer } from './layout';
import { OptionState } from './types';

import { DetailSlider } from './detail';

import { IconItem, SVGHighlightElement, SVGLayoutSide, SVGLayoutFull, SVGBuiltinElement, SVGPickElement, SVGRunCount } from './svg';

export type OptionsProps = {
  cursor: Cursor<OptionState>,
  toggleInspect: () => void,
};

export const Options: React.FC<OptionsProps> = (props: OptionsProps) => {
  
  const {cursor, toggleInspect} = props;
  const useCursor = useRefineCursor(cursor);

  const [depthLimit, setDepthLimit] = useCursor<number>('depth');
  const [runCounts, setRunCounts] = useCursor<boolean>('counts');
  const [fullSize, setFullSize] = useCursor<boolean>('fullSize');
  const [builtins, setBuiltins] = useCursor<boolean>('builtins');
  const [highlight, setHighlight] = useCursor<boolean>('highlight');
  const [inspect] = useCursor<boolean>('inspect');

  return (
    <OptionsContainer>
      <SmallButton
        className={fullSize ? 'active' : ''}
        onClick={() => setFullSize(!fullSize)}
        title={fullSize ? "Collapse to sidebar" : "Expand to Full Size"}
      >
        <IconItem height={24} top={1}>{
          fullSize
          ? <SVGLayoutFull size={24} />
          : <SVGLayoutSide size={24} />
        }</IconItem>
      </SmallButton>
      <SmallButton
        className={runCounts ? 'active' : ''}
        onClick={() => setRunCounts(!runCounts)}
        title="Show run counts"
      >
        <IconItem height={24} top={1}><SVGRunCount size={24} /></IconItem>
      </SmallButton>
      <SmallButton
        className={builtins ? 'active' : ''}
        onClick={() => setBuiltins(!builtins)}
        title="Show built-in &lt;components&gt;"
      >
        <IconItem height={24} top={1}><SVGBuiltinElement size={24} /></IconItem>
      </SmallButton>
      <SmallButton
        className={highlight ? 'active' : ''}
        onClick={() => setHighlight(!highlight)}
        title="Hover highlight in inspector"
      >
        <IconItem height={24} top={1}><SVGHighlightElement size={24} /></IconItem>
      </SmallButton>
      <SmallButton
        className={inspect ? 'active' : ''}
        onClick={toggleInspect}
        title="Hover highlight in layout"
      >
        <IconItem height={24} top={1}><SVGPickElement size={24} /></IconItem>
      </SmallButton>

      <Spacer />
      <div style={{flexGrow: 1, minWidth: 50, maxWidth: 150}}>
        <DetailSlider value={depthLimit} onChange={setDepthLimit} />
      </div>
      <Spacer />
    </OptionsContainer>
  );
};
