import { formatNodeName } from './debug';
import {
  capture, fence, gather, multiGather, mapReduce, morph, provide, yeet, quote, unquote,
  CAPTURE, FENCE, GATHER, MULTI_GATHER, MAP_REDUCE, MORPH, PROVIDE, YEET, SUSPEND, FRAGMENT, QUOTE, UNQUOTE,
} from './builtin';
import { getCurrentFiberID } from './current';
import { DeferredCall, ArrowFunction, LiveNode, LiveElement, ReactElementInterop } from './types';

const NO_PROPS: any[] = [{}];

const toChildren = <T>(t: T[]): T[] | T | undefined => {
  if (t.length === 1) return t[0];
  if (t.length) return t;
  return undefined;
};

type AnyF = (...args: any[]) => any;

export const Fragment = FRAGMENT as AnyF;
export const Fence = FENCE as AnyF;
export const Gather = GATHER as AnyF;
export const MultiGather = MULTI_GATHER as AnyF;
export const MapReduce = MAP_REDUCE as AnyF;
export const Provide = PROVIDE as AnyF;
export const Capture = CAPTURE as AnyF;
export const Yeet = YEET as AnyF;
export const Morph = MORPH as AnyF;
export const Suspend = SUSPEND as AnyF;
export const Quote = QUOTE as AnyF;
export const Unquote = UNQUOTE as AnyF;

export const React = {
  createElement: (type: ArrowFunction, props: any, ...children: any[]) => {
    const by = getCurrentFiberID();

    if ((type as any)?.isLiveBuiltin) {
      if (type === FRAGMENT) {
        return children;
      }
      if (type === FENCE) {
        return fence(toChildren(props?.children ?? children), props?.then, props?.fallback, props?.key);
      }
      if (type === GATHER) {
        return gather(toChildren(props?.children ?? children), props?.then, props?.fallback, props?.key);
      }
      if (type === MULTI_GATHER) {
        return multiGather(toChildren(props?.children ?? children), props?.then, props?.fallback, props?.key);
      }
      if (type === MAP_REDUCE) {
        return mapReduce(toChildren(props?.children ?? children), props?.map, props?.reduce, props?.then, props?.fallback, props?.key);
      }
      if (type === PROVIDE) {
        return provide(props?.context, props?.value, toChildren(props?.children ?? children), props?.key);
      }
      if (type === CAPTURE) {
        return capture(props?.context, toChildren(props?.children ?? children), props?.then, props?.key);
      }
      if (type === YEET) {
        return yeet((props?.children ?? children)[0], props?.key);
      }
      if (type === SUSPEND) {
        return yeet(SUSPEND, props?.key);
      }
      if (type === QUOTE) {
        return quote(toChildren(props?.children ?? children), props?.key);
      }
      if (type === UNQUOTE) {
        return unquote(toChildren(props?.children ?? children), props?.key);
      }
      if (type === MORPH) {
        const c = props?.children ?? children;
        if (c.length === 1) return morph(c[0]);
        return c.map(morph);
      }
      throw new Error("Builtin `${formatNodeName({f: type})}` unsupported in JSX. Use raw function syntax instead.");
    }

    if (props) {
      if (props.children == null) props.children = toChildren(children);
      return {f: type, args: [props], key: props.key, by};
    }
    else if (children.length) {
      return {f: type, args: [{children: toChildren(children)}], key: undefined, by};
    }
    else {
      return {f: type, args: NO_PROPS, key: undefined, by};
    }
  },
  Fragment,
  Gather,
  MultiGather,
  MapReduce,
  Provide,
  Capture,
  Yeet,
  Morph,
};

export default React;
