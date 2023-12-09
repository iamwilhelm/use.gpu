import { useOne } from '@use-gpu/live';
import { useProp, getProp } from './useProp';
import { ArrowFunction, TraitDefinition, Trait, TraitCombinator, InputTypes, OutputTypes, UseTrait } from './types'; 

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
) => {
  for (const parse of traits) parse(input, output);
};

export const makeUseTrait = <A, B>(
  t: Trait<A, B>,
): UseTrait<A, B> => (props) => useTrait(props, t);

export const makeParseTrait = <A, B>(
  t: Trait<A, B>,
): UseTrait<A, B> => (props) => parseTrait(props, t);

const useTrait = <A, B>(
  props: A,
  t: Trait<A, B>,
): B => {
  const parsed: any = useOne(makeObject);
  t(props, parsed);
  return parsed as B;
};

const parseTrait = <A, B>(
  props: A,
  t: Trait<A, B>,
): B => {
  const parsed: any = {};
  t(props, parsed);
  return parsed as B;
};
