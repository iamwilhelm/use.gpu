import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { provide, makeContext, useContext, useNoContext } from '@use-gpu/live';

export type Time = TimeContextProps;

export type TimeContextProps = {
  timestamp: number,
  elapsed: number,
  delta: number,
};

export const TimeContext = makeContext<TimeContextProps>({
  timestamp: 0,
  elapsed: 0,
  delta: 0,
}, 'TimeContext');

export const useTimeContext = () => useContext<TimeContextProps>(TimeContext);
export const useNoTimeContext = () => useNoContext(TimeContext);
