import {LiveContext, Live} from './types';
import {live, useCallback, useMemo, useState} from './live';

type StringFormatter = (foo: string) => string;
type NumberReturner = () => number;
type FunctionReturner = () => () => any;

it('returns a value', () => {

  const F: Live<StringFormatter> = (context: LiveContext<StringFormatter>) => (foo: string) => {
    return foo;
  };

  const result = live(F)('wat');

  expect(result).toBe('wat');
})

it('holds state (hook)', () => {

  const F: Live<NumberReturner> = (context: LiveContext<NumberReturner>) => (): number => {

    const [foo, setFoo] = useState(context)(() => Math.random());

    return foo;
  };

  {
    const result1 = live(F)();
    const result2 = live(F)();

    expect(result1).not.toBe(result2);
  }

  {
    const bound = live(F);
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
    const result1 = live(F)();
    const result2 = live(F)();

    expect(result1).not.toBe(result2);
  }

  {
    const bound = live(F);
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
    const result1 = live(F)();
    const result2 = live(F)();

    expect(result1).not.toBe(result2);
  }

  {
    const bound = live(F);
    const result1 = bound();
    const result2 = bound();

    expect(result1).toBe(result2);
  }
})
