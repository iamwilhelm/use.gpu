import { DeferredCall } from './types';

export const formatNode = <T>(node: DeferredCall<T>) => {
  const name = node.f?.name || 'Node';
  const args = node.args?.map(x => formatValue(x));
  if (args?.length) args.unshift('');
  return `<${name}${args ? args.join(' ') : ''}>`;
}

export const formatValue = (x: any, seen: WeakMap<object, boolean> = new WeakMap()) => {
  if (!x) return x;
  if (Array.isArray(x)) return x.map((x) => formatValue(x, seen));
  if (typeof x === 'boolean') return x;
  if (typeof x === 'number') return x;
  if (typeof x === 'symbol') return x;
  if (typeof x === 'string') return x;
  if (typeof x === 'function') return `${x.name}(...)`;
  if (typeof x === 'object') {
    if (seen.get(x)) return '[Circular]';
    seen.set(x, true);

    const out = [];
    for (let k in x) if (x.hasOwnProperty(k)) out.push(`${k}: ${formatValue(x[k], seen)}`);
    return '{' + out.join(', ') + '}';
  }
  return '' + x;
}
