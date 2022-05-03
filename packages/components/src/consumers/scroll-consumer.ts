import { LC } from '@use-gpu/live/types';
import { consume, yeet, makeContext, useContext, useFiber, useNoContext } from '@use-gpu/live';

export const ScrollContext = makeContext(undefined, 'ScrollContext');

export const ScrollConsumer: LC = (props) => {
  const {children} = props;
  
  return consume(ScrollContext, children, Resume);
};

const Resume = () => yeet();