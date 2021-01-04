import {LiveContext, Live, Component} from './types';
import {bind, defer, memo, useCallback, useMemo, useState} from './live';

type StringFormatter = (foo: string) => string;
type NumberReturner = () => number;
type FunctionReturner = () => () => any;

it('returns a value', () => {

  const F: Live<StringFormatter> = (context: LiveContext<StringFormatter>) => (foo: string) => {
    return `hello ${foo}`;
  };

  const result = bind(F)('wat');

  expect(result).toBe('hello wat');
})

it('holds state (hook)', () => {

  const F: Live<NumberReturner> = (context: LiveContext<NumberReturner>) => (): number => {

    const [foo, setFoo] = useState(context)(() => Math.random());

    return foo;
  };

  {
    const result1 = bind(F)();
    const result2 = bind(F)();

    expect(result1).not.toBe(result2);
  }

  {
    const bound = bind(F);
    const result1 = bound();
    const result2 = bound();

    expect(result1).toBe(result2);
  }
})

it('holds memoized value (hook)', () => {

  const dep = 'static';

  const F: Live<NumberReturner> = (context: LiveContext<NumberReturner>) => (): number => {

    const foo = useMemo(context)(() => Math.random(), [dep]);

    return foo;
  };

  {
    const result1 = bind(F)();
    const result2 = bind(F)();

    expect(result1).not.toBe(result2);
  }

  {
    const bound = bind(F);
    const result1 = bound();
    const result2 = bound();

    expect(result1).toBe(result2);
  }
})

it('holds memoized callback (hook)', () => {

  const dep = 'static';

  const F: Live<FunctionReturner> = (context: LiveContext<FunctionReturner>) => (): () => number => {

    const x = Math.random();
    const foo = useCallback(context)(() => x, [dep]);

    return foo;
  };

  {
    const result1 = bind(F)();
    const result2 = bind(F)();

    expect(result1).not.toBe(result2);
  }

  {
    const bound = bind(F);
    const result1 = bound();
    const result2 = bound();

    expect(result1).toBe(result2);
  }
})

it('memoizes a function', () => {

  const F: Live<NumberReturner> = memo((context: LiveContext<NumberReturner>) => (): number => {
    return Math.random();
  });

  {
    const bound = bind(F);
    const result1 = bound();
    const result2 = bound();

    expect(result1).toBe(result2);
  }
})

it('returns a deferred call', () => {

  const G: Live<StringFormatter> = (context: LiveContext<StringFormatter>) => (foo: string) => {
    return `hello ${foo}`;
  };

  const F: Live<Component> = (context: LiveContext<Component>) => (foo: string) => {
    return defer(G)('wat');
  };

  const result = bind(F)('wat');
  expect(result.f).toEqual(G);
  expect(result.args).toEqual(['wat']);

})