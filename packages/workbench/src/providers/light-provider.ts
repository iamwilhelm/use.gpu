import { LC, PropsWithChildren } from '@use-gpu/live/types';
import { ShaderModule } from '@use-gpu/shader/types';
import { makeContext, useContext, useConsumer } from '@use-gpu/live';

type LightContextProps = ShaderModule;

export const LightContext = makeContext<LightContextProps>(undefined, 'LightContext');

export const LightConsumer = makeContext(undefined, 'LightConsumer');

export const useLightContext = () => useContext(LightContext);
export const useLightConsumer = () => useConsumer(LightConsumer);
