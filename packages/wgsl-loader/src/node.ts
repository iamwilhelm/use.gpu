import { readFileSync } from "fs";
import require_hacker from 'require-hacker';
import { transpileWGSL } from '@use-gpu/shader/wgsl';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const hook = require_hacker.hook('wgsl', (path) => transpileWGSL(readFileSync(path).toString(), path, false));
