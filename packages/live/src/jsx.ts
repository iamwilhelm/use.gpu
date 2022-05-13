import { formatNodeName } from './debug';
import { gather, provide, yeet, FRAGMENT, GATHER, PROVIDE, YEET } from './builtin';
import { getCurrentFiberID } from './fiber';
import { DeferredCall, ArrowFunction, LiveNode, LiveElement, ReactElementInterop } from './types';

const NO_PROPS: any[] = [{}];

const toChildren = <T>(t: T[]): T[] | T | undefined => {
  if (t.length === 1) return t[0];
  if (t.length) return t;
  return undefined;
};

export const React = {
  createElement: (type: ArrowFunction, props: any, ...children: any[]) => {
    const by = getCurrentFiberID();

    if ((type as any)?.isLiveBuiltin) {
      if (type === FRAGMENT) {
        return children;
      }
      if (type === GATHER) {
        return gather(children[0], children[1], props?.key);
      }
      if (type === PROVIDE) {
        return provide(props.context, props.value, toChildren(children), props?.key);
      }
      if (type === YEET) {
        return yeet(children[0], props?.key);
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
};

type AnyF = (...args: any[]) => any;

export const Fragment = FRAGMENT as AnyF;
export const Gather = GATHER as AnyF;
export const Provide = PROVIDE as AnyF;
export const Yeet = YEET as AnyF;

export default React;
