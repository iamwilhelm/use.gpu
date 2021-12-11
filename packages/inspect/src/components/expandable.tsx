import React from 'react';
import { useRefineCursor, Cursor } from './cursor';

type ExpandableProps = {
  id: string,
  expandCursor: Cursor<ExpandState>,
  label: React.ReactElement,
}

export const Expandable: React.FC<ExpandableProps> = ({id, expandCursor, children}) => {
  const [expand, updateExpand] = useRefineCursor<boolean>(expandCursor)(id);

  const onClick = (e: any) => {
    updateExpand(expand === false);
    e.preventDefault();
  }

  return children(expand, onClick);
}
