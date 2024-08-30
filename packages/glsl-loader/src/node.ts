import {readFileSync} from "fs";
import require_hacker from 'require-hacker';
import { transpileGLSL } from '@use-gpu/shader/glsl';

// eslint-disable-next-line
const hook = require_hacker.hook('glsl', (path) => transpileGLSL(readFileSync(path).toString(), path, {
  esModule: false,
}).output);
