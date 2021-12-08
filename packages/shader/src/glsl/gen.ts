import { ParsedBundle, ParsedModule, DataBinding } from '../types';

import { loadVirtualModule } from './shader';
import { makeKey } from '../util/hash';

const INT_ARG = ['int'];

export const makeBindingAccessors = (
  bindings: DataBinding[],
  set: number | string = 0,
  key: number | string = makeKey(),
): Record<string, ParsedBundle | ParsedModule> => {

  // Extract uniforms
  const lambdas = bindings.filter(({lambda}) => lambda != null);
  const storages = bindings.filter(({storage}) => storage != null);
  const constants = bindings.filter(({constant}) => constant != null);

  // Uniform Buffer Object struct members
  const members = constants.map(({uniform: {name, format}}) => `${format} ${name}`);

  // Virtual module symbols
  const virtuals = [...constants, ...storages];
  const symbols = virtuals.map(({uniform}) => uniform.name);

  // Code generator
  const render = (namespace: string, nextBinding: () => number) => {
    const program: string[] = [];

    if (members.length) {
      const b = nextBinding();
      program.push(makeUniformBlockLayout(namespace, set, b, members));
    }
    for (const {uniform: {name, format, args}} of constants) {
      program.push(makeUniformFieldAccessor(namespace, format, name, args));
    }

    for (const {uniform: {name, format, args}} of storages) {
      const b = nextBinding();
      program.push(makeStorageAccessor(namespace, set, b, format, name));
    }

    return {
      code: program.join('\n'),
      virtuals: [constants, ...storages.map(s => [s])],
    };
  }

  const virtual = loadVirtualModule(render, symbols, key);

  const links: Record<string, ParsedBundle | ParsedModule> = {};
  for (const binding of constants) links[binding.uniform.name] = virtual;
  for (const binding of storages) links[binding.uniform.name] = virtual;
  for (const lambda of lambdas) links[lambda.uniform.name] = lambda.lambda!;

  return links;
};

export const makeStorageAccessor = (
  ns: string,
  set: number | string,
  binding: number | string,
  type: string,
  name: string,
  args: string[] = INT_ARG,
) => `
layout (std430, set = ${set}, binding = ${binding}) readonly buffer ${ns}${name}Type {
  ${type} data[];
} ${ns}${name}Storage;

${type} ${ns}${name}(int index) {
  return ${ns}${name}Storage.data[index];
}
`;

export const makeUniformBlockLayout = (
  ns: string,
  set: number | string,
  binding: number | string,
  members: string[],
) => `
layout (set = ${set}, binding = ${binding}) uniform ${ns}Type {
  ${members.map(m => `${m};`).join('\n  ')}
} ${ns}Uniform;
`;

export const makeUniformFieldAccessor = (
  ns: string,
  type: string,
  name: string,
  args: string[] = INT_ARG,
) => `
${type} ${ns}${name}(${args.join(', ')}) {
  return ${ns}Uniform.${name};
}
`;
