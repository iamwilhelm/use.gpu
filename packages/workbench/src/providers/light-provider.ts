import { ShaderModule } from '@use-gpu/shader/types';
import { useContext, makeContext } from '@use-gpu/live';

type LightContextProps = ShaderModule;

export const LightContext = makeContext<LightContextProps>(undefined, 'LightContext');

export const LightConsumer = makeContext(undefined, 'LightConsumer');

export const useLightContext = () => useContext(LightContext);
