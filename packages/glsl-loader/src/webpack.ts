import { validate } from 'schema-utils';
import { transpileGLSL } from '@use-gpu/shader/glsl';

const LOADER_NAME = 'GLSL Loader';

const schema = {
  type: 'object',
  properties: {
  },
} as any;

function glslLoader(this: any, source: string) {

  // Parse options
  const options = this.getOptions();
  validate(schema, options, {
    name: LOADER_NAME,
    baseDataPath: 'options'
  });

  const {resourcePath} = this;
  return transpileGLSL(source, resourcePath, options).output;
}

export default glslLoader;