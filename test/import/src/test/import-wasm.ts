import { Draw, Pass, RawQuads } from '@use-gpu/workbench';
import { RustText } from '@use-gpu/glyph';
import { mountGPUDevice } from '@use-gpu/webgpu';

const testWASM = () => {
  const {findGlyph} = RustText();
  if (typeof findGlyph !== 'function') return [false, 'cannot find wasm/rust text api'];
  return [true];
}

const [ok, error] = testWASM();
if (!ok) {
  console.error('failed during wasm test', error);
  process.exit(1);
}
