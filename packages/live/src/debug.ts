import type { DeferredCall, LiveElement, LiveFiber } from './types';
import { reactInterop } from './fiber';

const {prototype: {hasOwnProperty}} = Object;

export type LoggingOptions = {
  dispatch: boolean,
  fiber: boolean,
};

/** @hidden */
export const LOGGING = {
  dispatch: false,
  fiber: false,
} as Record<string, boolean>;

/** Turn on logging for the Live run-time. Very chatty.

- `dispatch`: All dispatches to roots and sub-roots.
- `fiber`: All updates to individual fibers.
*/
export const setLogging = (options: LoggingOptions) => {
  for (let k in options) LOGGING[k] = (options as any)[k];
};

export const formatSnapshot = (arg: any): string => {
  const args = Array.isArray(arg) ? arg : (arg !== undefined ? [arg] : []);
  return args.map(formatSnapshotArg).join(' ');
}

export const formatSnapshotArg = (arg: any): string => {
  if (Array.isArray(arg)) return '[' + arg.map(formatSnapshotArg) + ']';
  if (typeof arg === 'object' && arg) {
    if (arg.f && arg.args && arg.by) {
      return '<' + formatNodeName(arg) +'> ' + formatSnapshot(arg.args ?? arg.arg);
    }
    return '{' + Object.keys(arg).map(k => `${k}={${formatSnapshotArg(arg[k])}}`) + '}';
  }
  return `${arg}`;
}

export const formatTree = (root: LiveFiber<any>, depth: number = 0): string => {
  const {mount, mounts, order, next} = root;
  let out = [];

  const prefix = '  '.repeat(depth);
  
  out.push(prefix + '<' + formatNodeName(root) +'> '+ formatSnapshot(root.args));

  if (mount) {
    out.push(formatTree(mount, depth + 1));
  }

  if (mounts && order) {
    for (const key of order) {
      const sub = mounts.get(key);
      if (sub) out.push(formatTree(sub, depth + 1));
    }
  }

  if (next) {
    out.push(formatTree(next, depth + 1));
  }

  return out.join("\n");
}

export const formatNodeName = <F extends Function>(_node: LiveElement<F>): string => {
  const node = reactInterop(_node) as DeferredCall<F> | null;
  if (!node) return 'null';
  
  const {f, arg, args} = node;

  // @ts-ignore
  let name = (f?.displayName ?? f?.name) || 'Node';
  if (name === 'PROVIDE' && args) {
    const [context] = args;
    const value = formatValue(context.displayName);
    return `Provide(${value})`;
  }
  else if (name === 'CAPTURE' && args) {
    const [context] = args;
    const value = formatValue(context.displayName);
    return `Capture(${value})`;
  }
  else if (name === 'DETACH' && args) {
    const [call] = args;
    // @ts-ignore
    name = `Detach(${(call.f?.displayName ?? call.f?.name) || 'Node'})`;
  }
  else if (name === 'GATHER') {
    name = `Gather`;
  }
  else if (name === 'MULTI_GATHER') {
    name = `MultiGather`;
  }
  else if (name === 'FRAGMENT') {
    name = `Fragment`;
  }
  else if (name === 'MAP_REDUCE') {
    name = `MapReduce`;
  }
  else if (name === 'YEET') {
    name = `Yeet`;
  }
  else if (name === 'RECONCILE') {
    name = `Reconcile`;
  }
  else if (name === 'QUOTE') {
    name = `Quote`;
  }
  else if (name === 'UNQUOTE') {
    name = `Unquote`;
  }
  else if (name === 'SIGNAL') {
    name = `Signal`;
  }
  else if (name === 'MORPH') {
    name = `Morph`;
  }
  else if (name === 'FENCE') {
    name = `Fence`;
  }
  else if (name === 'DEBUG') {
    name = `Debug`;
  }

  return name;
}

export const formatNode = <F extends Function>(_node: LiveElement<F>): string => {
  const node = reactInterop(_node) as DeferredCall<F> | null;
  if (!node) return '<null />';

  const name = formatNodeName(node);

  const args = [] as string[];
  if (node.arg !== undefined) {
    args.push(formatValue(node.arg));
  }
  if (node.args !== undefined) {
    if (node.f) {
      if (node.f.name === 'REDUCE') {
        const [, reduce, initial] = node.args;
        args.push(formatValue({reduce, initial}));
      }
      else if (node.f.name === 'PROVIDE') {
        const [context,,, isMemo] = node.args;
        args.push(formatValue(context));
      }
      else if (node.f.name === 'MORPH') {
        args.push(formatValue(node.args));
      }
      else {
        if (Array.isArray(node.args)) {
          let list = node.args;
          if (list.length > 100) list = list.slice(0, 100);
          args.push(...list.map(x => formatValue(x)));
        }
      }
    }
    else {
      if (Array.isArray(node.args)) {
        let list = node.args;
        if (list.length > 100) list = list.slice(0, 100);
        args.push(...list.map(x => formatValue(x)));
      }
    }
  }
  if (args?.length) args.unshift('');

  return `<${name}${args ? args.join(' ') : ''}>`;
}

export const formatValue = (x: any, seen: WeakMap<object, boolean> = new WeakMap()): string => {
  if (!x) return '' + x;
  if (Array.isArray(x)) {
    if (seen.get(x)) return '[Repeated]';
    seen.set(x, true);

    const out = [];
    let n = Math.min(x.length, 100);
    for (let i = 0; i < n; ++i) {
      out.push(`${formatShortValue(x[i], seen)}`);
    }
    if (x.length > 100) out.push('…');
    return '[' + out.join(', ') + ']';
  }
  if (typeof x === 'object') {
    if (seen.get(x)) return '[Repeated]';
    seen.set(x, true);

    if (x.constructor.name.match(/Array/)) {
      if (x.length > 100) x = x.slice(0, 100);
    }

    const signature = Object.keys(x).join('/');
    if (signature === 'f/args/key/by' || signature === 'f/arg/key/by') return formatNode(x);

    const out = [];
    for (const k in x) if (hasOwnProperty.call(x, k)) {
      out.push(`${k}: ${formatShortValue(x[k], seen)}`);
    }
    
    const proto = x.__proto__ !== Object.prototype ? x.__proto__.constructor.name : '';
    const label = x.label;
    return proto + (label?.length ? ':' + label : '') + '{' + out.join(', ') + '}';
  }
  return formatShortValue(x, seen);
}

export const formatShortValue = (x: any, seen: WeakMap<object, boolean> = new WeakMap()): string => {
  if (!x) return '' + x;
  if (Array.isArray(x)) {
    let extra = '';
    if (x.length > 100) {
      x = x.slice(0, 100);
      extra = ', …';
    }
    return '[' + x.map((x: any) => formatShortValue(x, seen)).join(', ') + extra + ']';
  }
  if (typeof x === 'boolean') return x ? 'true' : 'false';
  if (typeof x === 'number') return formatNumber(x, 5);
  if (typeof x === 'symbol') return '(symbol)';
  if (typeof x === 'string') return x;
  if (typeof x === 'function') {
    if (x.name === '' && !x.displayName) x.displayName = '#' + Math.round(Math.random() * 10000);
    const name = x.displayName ?? x.name;
    const body = x.toString().split(/=>/)[1];
    return `${name}(…) ` + truncate(body, 40);
  }
  if (typeof x === 'object') {
    if (x.constructor.name.match(/Array/)) {
      if (x.length > 100) x = x.slice(0, 100);
    }

    const signature = Object.keys(x).join('/');
    if (signature === 'f/args/key' || signature === 'f/arg/key') return `<${formatNodeName(x)} …/>`;

    return '{...}';
  }
  return '' + x;
}

export const formatNumber = (x: number, precision: number = 5) => {
  if (Math.abs(x) < 1) return x.toPrecision(precision).replace(/(?:\.0+)$|(\.[0-9]*[1-9])0+$/, '$1');
  return x.toString();
};

const truncate = (s: string, n: number) => {
  if (typeof s !== 'string') return '' + s;
  s = s.replace(/\s+/g, ' ');
  if (s.length < n) return s;
  return s.slice(0, n) + '…';
}