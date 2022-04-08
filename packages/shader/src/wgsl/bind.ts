import { ShaderModule, ShaderDefine, LambdaSource, DataBinding } from './types';

import { defineConstants } from './shader';
import { makeBindingAccessors, makeUniformBlock } from './gen';
import { makeBindModule, makeBindBundle, makeResolveBindings, namespaceBinding, getBindingArgument } from '../util/bind';
import { VIRTUAL_BINDGROUP } from './constants';

const NO_SYMBOLS = [] as any[];

const getVirtualBindGroup = (
  defines?: Record<string, ShaderDefine>
) => defines ? getBindingArgument(defines[VIRTUAL_BINDGROUP]) : "VIRTUAL";

export const bindingToModule = (
  binding: DataBinding,
): ShaderModule => {
  const {uniform: {name}, lambda} = binding;
  const links = makeBindingAccessors([binding]);
  const module = links[name];
  return {...module, entry: !lambda ? name : undefined };
}

export const bindingsToLinks = (
  bindings: DataBinding[],
): Record<string, ShaderModule> => {
  return makeBindingAccessors(bindings);
}

export const sourceToModule = <T>(
  source: ShaderModule | LambdaSource<T>,
): ShaderModule | null => {
  const s = source as any;
  if (s.shader) return s.shader as ShaderModule;
  else if (s.table || s.libs) return source as ShaderModule;
  return null;
}

export const bindModule = makeBindModule(defineConstants);

export const bindBundle = makeBindBundle(bindModule);

export const resolveBindings = makeResolveBindings(makeUniformBlock, getVirtualBindGroup);
