import { getOptions } from 'loader-utils';
import { validate } from 'schema-utils';
import { transpileWGSL } from '@use-gpu/shader/wgsl';

const LOADER_NAME = 'WGSL Loader';

const schema = {
  type: 'object',
  properties: {
  },
} as any;

function wgslLoader(this: any, source: string) {

  // Parse options
  const options = this.getOptions();
  validate(schema, options, {
    name: LOADER_NAME,
    baseDataPath: 'options'
  });

  const esModule = options.esModule != null ? options.esModule : true;
  const minify = options.minify != null ? options.minify : false;

  const {resourcePath} = this;

  return transpileWGSL(source, resourcePath, esModule, minify);
}

export default wgslLoader;