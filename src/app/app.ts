import {LiveComponent} from '../live/types';
import {defer} from '../live/live';

const Canvas = () => () => {};

type AppProps = {};

export const App: LiveComponent<AppProps> = (context) => () => {
  return defer(Canvas)();
};