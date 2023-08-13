declare module "@use-gpu/wgsl/codec/f16.wgsl" {
  type ParsedBundle = import('@use-gpu/shader').ParsedBundle;
  const __module: ParsedBundle;
  export const toF16u: ParsedBundle;
  export const fromF16u: ParsedBundle;
  export const toF16u4: ParsedBundle;
  export const fromF16u4: ParsedBundle;
  export default __module;
}
