import { DeepPartial, StorageSource, LambdaSource, TypedArray } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';
import { LC, PropsWithChildren } from '@use-gpu/live/types';

import { provide, memo, makeContext, useContext, useMemo } from '@use-gpu/live';
import { patch } from '@use-gpu/state';

export const DEBUG_DEFAULTS = {
  sdf2d: {
    contours: false,
    subpixel: true,
    relax: false,
  },
  layout: {
    inspect: false,
  }
} as DebugContextProps;

export type DebugContextProps = {
  sdf2d: {
    contours: boolean,
    subpixel: boolean,
    relax: boolean,
  },
  layout: {
    inspect: boolean,
  },
};

export type DebugProviderProps = {
  debug: DeepPartial<DebugContextProps>,
};

export const DebugContext = makeContext<DebugContextProps>(DEBUG_DEFAULTS, 'DebugContext');
export const useDebugContext = () => useContext(DebugContext);

export const DebugProvider: LC<DebugProviderProps> = memo(({debug, children}: PropsWithChildren<DebugProviderProps>) => {
  const parent = useContext(DebugContext);
  const context = useMemo(() => patch(parent, debug), [parent, debug]);
  return provide(DebugContext, context, children);
}, 'DebugProvider');
