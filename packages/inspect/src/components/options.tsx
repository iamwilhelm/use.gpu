import React from 'react';
import { useRefineCursor, Cursor } from '@use-gpu/state';
import { OptionsContainer } from './layout';

export type OptionsProps = {
  cursor: Cursor,
};

export const Options: React.FC<OptionsProps> = (props: OptionsProps) => {
  
  const useCursor = useRefineCursor(props.cursor);
  const [runCounts, setRunCounts] = useCursor('counts');
  const [fullSize, setFullSize] = useCursor('fullSize');
  
  return (
    <OptionsContainer>
      <div>
        <label><input type="checkbox" checked={runCounts} onChange={(e) => setRunCounts(e.target.checked)} /> Show Runs</label>
      </div>
      <div>
        <label><input type="checkbox" checked={fullSize} onChange={(e) => setFullSize(e.target.checked)} /> Big View</label>
      </div>
    </OptionsContainer>
  );
};