import React from 'react';
import { useRefineCursor, Cursor } from '@use-gpu/state';
import { OptionsContainer } from './layout';
import { OptionState } from './types';

export type OptionsProps = {
  cursor: Cursor<OptionState>,
};

export const Options: React.FC<OptionsProps> = (props: OptionsProps) => {
  
  const useCursor = useRefineCursor(props.cursor);
  const [runCounts, setRunCounts] = useCursor<boolean>('counts');
  const [fullSize, setFullSize] = useCursor<boolean>('fullSize');
  const [builtins, setBuiltins] = useCursor<boolean>('builtins');
  const [highlight, setHighlight] = useCursor<boolean>('highlight');
  
  return (
    <OptionsContainer>
      <div>
        <label><input type="checkbox" checked={runCounts} onChange={(e) => setRunCounts(e.target.checked)} /> Show Runs</label>
      </div>
      <div>
        <label><input type="checkbox" checked={fullSize} onChange={(e) => setFullSize(e.target.checked)} /> Big View</label>
      </div>
      <div>
        <label><input type="checkbox" checked={builtins} onChange={(e) => setBuiltins(e.target.checked)} /> Show Builtins</label>
      </div>
      <div>
        <label><input type="checkbox" checked={highlight} onChange={(e) => setHighlight(e.target.checked)} /> Hover Highlight</label>
      </div>
    </OptionsContainer>
  );
};