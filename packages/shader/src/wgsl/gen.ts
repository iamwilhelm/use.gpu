import { ParsedBundle, ParsedModule, DataBinding, RefFlags as RF } from './types';

import { getHash, makeKey, getObjectKey, mixBits, scrambleBits } from '../util/hash';
import { getBundleHash } from '../util/bundle';
import { getBindingArgument } from '../util/bind';
import { loadVirtualModule } from './shader';
import { makeSwizzle } from './cast';
import { PREFIX_VIRTUAL } from '../constants';
import { VIRTUAL_BINDGROUP, VOLATILE_BINDGROUP } from './constants';

const INT_PARAMS = [{name: 'index', type: {name: 'u32'}}];
const INT_ARG = ['u32'];
const UV_ARG = ['vec2<f32>'];
const LOAD_ARG = ['vec2<i32>', 'i32'];

const arg = (x: number) => String.fromCharCode(97 + x);

const getBindingKey = (b: DataBinding) =>
  (+!!b.constant) +
  (+!!b.storage) * 2 +
  (+!!b.lambda) * 4 +
  (+!!b.texture) * 8 + 
  (+!!(b.storage?.volatile || b.texture?.volatile)) * 16;

const getBindingsKey = (bs: DataBinding[]) => scrambleBits(bs.reduce((a, b) => mixBits(a, getBindingKey(b)), 0)) >>> 0;
const getValueKey = (b: DataBinding) => getObjectKey(b.constant ?? b.storage ?? b.texture);

export const makeBindingAccessors = (
  bindings: DataBinding[],
): Record<string, ParsedBundle | ParsedModule> => {

  // Extract uniforms by type
  const lambdas = bindings.filter(({lambda}) => lambda != null);
  const storages = bindings.filter(({storage}) => storage != null);
  const textures = bindings.filter(({texture}) => texture != null);
  const constants = bindings.filter(({constant}) => constant != null);

  // Virtual module symbols
  const virtuals = [...constants, ...storages, ...textures];
  const symbols = virtuals.map(({uniform}) => uniform.name);
  const types = virtuals.map(({uniform}) => uniform.format);
  const declarations = virtuals.map(({uniform}) => ({
    at: 0,
    symbol: uniform.name,
    func: {
      name: uniform.name,
      type: {name: uniform.format},
      parameters: uniform.args ?? INT_PARAMS,
    },
    flags: 0,
  }));

  // Hash + readable representation
  const readable = symbols.join(' ');
  const signature = getBindingsKey(bindings).toString(16);
  const external = lambdas.map(l => getBundleHash(l.lambda!.shader));
  const unique = `@access [${signature}] [${external}] [${readable}] [${types.join(' ')}]`;

  const hash = getHash(unique);
  const code = `@access [${readable}] [${hash}]`;

  const keyed = bindings.reduce((a, s) => mixBits(a, getValueKey(s)), 0);
  const key   = getHash(`${hash} ${keyed}`);

  // Code generator
  const render = (
    namespace: string,
    rename: Map<string, string>,
    bindingBase: number = 0,
    volatileBase: number = 0,
  ) => {
    const program: string[] = [];
    const bindingSet = getBindingArgument(rename.get(VIRTUAL_BINDGROUP));
    const volatileSet = getBindingArgument(rename.get(VOLATILE_BINDGROUP));

    for (const {uniform: {name, format: type, args}} of constants) {
      program.push(makeUniformFieldAccessor(PREFIX_VIRTUAL, namespace, type, name, args));
    }

    for (const {uniform: {name, format: type, args}, storage} of storages) {
      const {volatile, format} = storage!;
      const set = volatile ? volatileSet : bindingSet;
      const base = volatile ? volatileBase++ : bindingBase++;
      program.push(makeStorageAccessor(namespace, set, base, type, format, name));
    }

    for (const {uniform: {name, format: type, args}, texture} of textures) {
      const {volatile, layout, variant, absolute, sampler, format} = texture!;
      const set = volatile ? volatileSet : bindingSet;
      const base = volatile ? volatileBase++ : bindingBase++;
      if (sampler) volatile ? volatileBase++ : bindingBase++;
      program.push(makeTextureAccessor(namespace, set, base, type, format, name, layout, variant, absolute, !!sampler));
    }

    return program.join('\n');
  }

  const virtual = loadVirtualModule({
    uniforms: constants,
    storages,
    textures,
    render,
  }, {
    symbols,
    declarations,
  }, undefined, hash, code, key);

  const links: Record<string, ParsedBundle | ParsedModule> = {};
  for (const binding of constants) links[binding.uniform.name] = virtual;
  for (const binding of storages)  links[binding.uniform.name] = virtual;
  for (const binding of textures)  links[binding.uniform.name] = virtual;
  for (const lambda  of lambdas)   links[lambda.uniform.name]  = lambda.lambda!.shader;

  return links;
};

export const makeUniformBlock = (
  constants: DataBinding[],
  set: number | string = 0,
  binding: number | string = 0,
): string => {
  // Uniform Buffer Object struct members
  const members = constants.map(({uniform: {name, format}}) => `${name}: ${format}`);
  return members.length ? makeUniformBlockLayout(PREFIX_VIRTUAL, set, binding, members) : '';
}

export const makeUniformBlockLayout = (
  ns: string,
  set: number | string,
  binding: number | string,
  members: string[],
) => `
struct ${ns}Type {
  ${members.map(m => `${m},`).join('\n  ')}
};
@group(${set}) @binding(${binding}) var<uniform> ${ns}Uniform: ${ns}Type;
`;

export const makeUniformFieldAccessor = (
  uniform: string,
  ns: string,
  type: string,
  name: string,
  args: string[] = INT_ARG,
) => `
fn ${ns}${name}(${args.map((t, i) => `${arg(i)}: ${t}`).join(', ')}) -> ${type} {
  return ${uniform}Uniform.${ns}${name};
}
`;

export const makeStorageAccessor = (
  ns: string,
  set: number | string,
  binding: number | string,
  type: string,
  format: string,
  name: string,
) => `
@group(${set}) @binding(${binding}) var<storage> ${ns}${name}Storage: array<${format}>;

fn ${ns}${name}(index: u32) -> ${type} {
  ${format !== type ? 'let v =' : 'return'} ${ns}${name}Storage[index];
${format !== type ? '  return ' + makeSwizzle(format, type, 'v') + ';\n' : ''
}}
`;

export const makeTextureAccessor = (
  ns: string,
  set: number | string,
  binding: number,
  type: string,
  format: string,
  name: string,
  layout: string,
  variant: string = 'textureSample',
  absolute: boolean = false,
  sampler: boolean = true,
  args: string[] = (variant === 'textureLoad' ? LOAD_ARG : UV_ARG),
) => {
  const m = layout.match(/[0-9]/) ?? [2];
  const dims = +m[0];
  const dimsCast = dims === 1 ? 'f32' : `vec${dims}<f32>`;

  const shaderType = format ? TEXTURE_SHADER_TYPES[format] : type;
  const hasCast = shaderType !== type;
  if (hasCast) debugger;

  return `
@group(${set}) @binding(${binding}) var ${ns}${name}Texture: ${layout};
${sampler ? `@group(${set}) @binding(${binding + 1}) var ${ns}${name}Sampler: sampler;\n` : ''}
fn ${ns}${name}(${args.map((t, i) => `${arg(i)}: ${t}`).join(', ')}) -> ${type} {
  ${absolute ?
    `let relUV = ${arg(0)} / ${dimsCast}(textureDimensions(${ns}${name}Texture));\n  ` : ``
  }${hasCast ? 'let v =' : 'return'} ${variant}(${ns}${name}Texture, ${sampler ? `${ns}${name}Sampler, ` : ''}${args.map((_, i) => `${i === 0 && absolute ? 'relUV' : arg(i)}`).join(', ')});
${hasCast ? '  return ' + makeSwizzle(shaderType, type, 'v') + ';\n' : ''
}}
`
};

export const TEXTURE_SHADER_TYPES = {
  // 8-bit formats
  "r8unorm": 'vec4<f32>',
  "r8snorm": 'vec4<f32>',
  "r8uint": 'vec4<u32>',  // u8
  "r8sint": 'vec4<i32>',  // i8

  // 16-bit formats
  "r16uint": 'vec4<u32>',        // u16
  "r16sint": 'vec4<i32>',        // i16
  "r16float": 'vec4<f32>',       // f16
  "rg8unorm": 'vec4<f32>',
  "rg8snorm": 'vec4<f32>',
  "rg8uint": 'vec4<u32>',  // u8
  "rg8sint": 'vec4<i32>',  // i8

  // 32-bit formats
  "r32uint": 'vec4<u32>',
  "r32sint": 'vec4<i32>',
  "r32float": 'vec4<f32>',
  "rg16uint": 'vec4<u32>',        // u16
  "rg16sint": 'vec4<i32>',        // i16
  "rg16float": 'vec4<f32>',       // f32
  "rgba8unorm": 'vec4<f32>', 
  "rgba8unorm-srgb": 'vec4<f32>',
  "rgba8snorm": 'vec4<f32>',
  "rgba8uint": 'vec4<u32>',       // u8
  "rgba8sint": 'vec4<i32>',       // i8
  "bgra8unorm": 'vec4<f32>',
  "bgra8unorm-srgb": 'vec4<f32>',
  // Packed 32-bit formats
  "rgb9e5ufloat": 'vec4<f32>',
  "rgb10a2unorm": 'vec4<f32>',
  "rg11b10ufloat": 'vec4<f32>',

  // 64-bit formats
  "rg32uint": 'vec4<u32>',
  "rg32sint": 'vec4<i32>',
  "rg32float": 'vec4<f32>',
  "rgba16uint": 'vec4<u32>',
  "rgba16sint": 'vec4<i32>',
  "rgba16float": 'vec4<f32>',

  // 128-bit formats
  "rgba32uint": 'vec4<u32>',
  "rgba32sint": 'vec4<i32>',
  "rgba32float": 'vec4<f32>',

  // Depth and stencil formats
  "stencil8": 'vec4<u32>',              // u8
  "depth16unorm": 'vec4<f32>',
  "depth24plus": 'vec4<u32>',
  "depth24plus-stencil8": 'vec4<u32>',
  "depth32float": 'vec4<f32>',
} as Record<string, string>;
