import { useOne } from '@use-gpu/live';
import { getProp } from './useProp';
import {
  ArrowFunction,
  TraitDefinition, Trait, TraitCombinator,
  InputTypes, OutputTypes,
  UseHooks, UseMemo, UseOne, UseProp, UseTrait,
} from './types'; 

const makeObject = () => ({});

// Make parsed value optional
export const optional = <A, B>(parse: (t?: A) => B) => (t?: A): B | undefined => t !== undefined ? parse(t) : undefined;

// Make derived trait from prop definition + defaults
export const trait = <
  P extends TraitDefinition,
>(
  propDef: P,
  defaultValues?: Partial<InputTypes<P>>,
): Trait<InputTypes<P>, OutputTypes<P>> => {
  // Parse default inputs to default outputs
  const defaults: Record<string, any> = {};
  if (defaultValues) for (const k in propDef) defaults[k] = (propDef as any)[k]((defaultValues as any)[k]);

  // Parse input and save to output
  return (
    input: Partial<InputTypes<P>>,
    output: OutputTypes<P>,
    {useProp}: UseHooks,
  ) => {
    for (const k in propDef) {
      const v = (input as any)[k];
      const p = useProp(v, (propDef as any)[k], defaults ? defaults[k] : undefined);
      (output as any)[k] = p;
    }
  };
};

// Combine traits into new trait
export const combine: TraitCombinator = (
  ...traits: Trait<any, any>[]
): Trait<any, any> => (
  input: any,
  output: any,
  hooks: UseHooks,
) => {
  for (const parse of traits) parse(input, output, hooks);
};

/**
 * Make a parser for the given trait.
 */
export const makeParseTrait = <A, B>(
  t: Trait<A, B>,
): UseTrait<A, B> => (props) => parseTrait(props, t);

/**
 * Make a hook to extract props for the given trait. (Live/React polyglot)
 */
export const injectMakeUseTrait = (
  hooks: UseHooks,
) => <A, B>(
  t: Trait<A, B>,
): UseTrait<A, B> => {
  const useTrait = injectUseTrait(hooks);
  return (props) => useTrait(props, t);
};

/**
 * useTrait() implementation. (Live/React polyglot)
 *
 * Note: Always returns the same object. Unpack/clone it before memoizing.
 */
export const injectUseTrait = (
  hooks: UseHooks,
) => {
  return (<A, B>(
    props: Partial<A>,
    t: Trait<A, B>,
  ): B => {
    const parsed: any = useOne(makeObject);
    t(props, parsed, hooks);
    return parsed as B;
  });
};

const apply = (f: ArrowFunction) => f();
const NO_HOOKS = {useMemo: apply, useOne: apply, useProp: getProp};

/**
 * Parse a trait from given props.
 *
 * Returns new object instance.
 */
export const parseTrait = <A, B>(
  props: Partial<A>,
  t: Trait<A, B>,
): B => {
  const parsed: any = {};
  t(props, parsed, NO_HOOKS);
  return parsed as B;
};
