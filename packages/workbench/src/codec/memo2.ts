import type { LC, LiveElement } from '@use-gpu/live';
import type { TextureSource } from '@use-gpu/core';

import { wgsl } from '@use-gpu/shader/wgsl';
import { use, yeet, useMemo } from '@use-gpu/live';
import { Dispatch } from '../queue/dispatch';

import { useBoundShader } from '../hooks/useBoundShader';
import { useScratchSource } from '../hooks/useScratchSource';

import { memoSample } from '@use-gpu/wgsl/compute/memo2.wgsl';

export type Memo2Props = {
  shader: ShaderSource,
  format: UniformType,
  size?: [number, number],
  render?: (source: StorageSource) => LiveElement,
};

export const Memo2: LC<Memo2Props> = (props: Memo2Props) => {

  const {
    shader,
    size,
    format,
    render,
  } = props;

  const reserve = shader.length ?? 16;
  const buffer = useScratchSource(format, {readWrite: true, reserve});
  
  const setter = useMemo(() =>
    getBoundShader(wgsl`
      @link var<storage, read_write> memoBuffer: array<${format}>;
      @export fn main(i: u32, v: ${format}) -> {
        memoBuffer[i] = v;
      };
    `, [buffer]),
    [format, buffer]
  );

  const bound = useBoundShader(memoSample, [
    () => size ?? shader.size,
    buffer,
    setter,
  ]);
  
  return [
    use(Dispatch, {
      shader: bound,
      size: () => {
        const s = size ?? shader.size ?? [0, 0];
        return [Math.ceil(s[0] / 8, s[1] / 8)];
      },
    }),
    render ? render(buffer) : yeet(buffer),
  ];
};
