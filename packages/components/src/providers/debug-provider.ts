import { DeepPartial, StorageSource, LambdaSource, TypedArray } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';
import { LC, PropsWithChildren } from '@use-gpu/live/types';

import { provide, memo, makeContext, useContext, useOne } from '@use-gpu/live';
import { patch } from '@use-gpu/state';

export const DEBUG_DEFAULTS = {
  sdf2d: {
    contours: false,
  },
  layout: {
    inspect: false,
  }
};

export type DebugContextProps = {
  sdf2D: {
    contours: false,
  },
  layout: {
    inspect: boolean,
  },
};

export type DebugProviderProps = {
  debug: DeepPartial<DebugContextProps>,
};

export const DebugContext = makeContext<DebugContextProps>(DEBUG_DEFAULTS, 'DebugContext');
export const useDebugContext = () => useContext(DataContext);

export const DebugProvider: LC<DebugProviderProps> = memo(({debug, children}: PropsWithChildren<DebugProviderProps>) => {
  const context = useOne(() => patch(DEBUG_DEFAULTS, debug), debug);
  return provide(DebugContext, context, children);
}, 'DebugProvider');
