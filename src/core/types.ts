export enum ShaderLanguage {
  GLSL = 'glsl',
};

export type ShaderLanguages = {[k in ShaderLanguage]: any};

export type ShaderModuleDescriptor = {
  code: string,
  entryPoint: string,
};
