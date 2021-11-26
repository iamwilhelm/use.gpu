import { ParsedModule } from '@use-gpu/shader';

/*
declare module '*.glsl' {
  const code: string;
  export default code;
}
*/

declare module '*.glsl' {
  const module: ParsedModule;
  export default module;
}
