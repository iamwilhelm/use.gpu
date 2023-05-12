declare module "@use-gpu/wgsl/transform/slide.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const getSlidePosition: ParsedBundle;
  export const getSlideInverse: ParsedBundle;
  export default __module;
}
