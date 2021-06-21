import { LiveContext, LiveComponent, Live, DeferredCall } from './types';

import {
  bind, defer, memo,
  useCallback, useMemo, useOne, useResource, useState
} from './live';
import { prepareHostContext } from './tree';

type FooProps = { foo: string };
type StringFormatter = (foo: string) => string;
type NullReturner = () => null;
type NumberReturner = () => number;
type FunctionReturner = () => () => any;

it('returns a value', () => {

  const F: Live<StringFormatter> = () => (foo: string) => {
    return `hello ${foo}`;
  };

  const result = bind(F)('wat');

  expect(result).toBe('hello wat');
})

it('memoizes a function', () => {

  const F: Live<NumberReturner> = memo(() => (): number => {
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

  const G: Live<StringFormatter> = () => (foo: string) => {
    return `hello ${foo}`;
  };

  const F: LiveComponent<FooProps> = () => ({foo}) => {
    return defer(G)(foo);
  };

  const result = bind(F)({foo: 'wat'}) as any as DeferredCall<any>;
  expect(result).toBeTruthy();
  expect(result.f).toEqual(G);
  expect(result.args).toEqual(['wat']);
});

it('holds state (hook)', () => {

  const F: Live<NumberReturner> = (context: LiveContext<NumberReturner>) => (): number => {
    const [foo] = useState(context, 0)(() => Math.random());
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

    const foo = useMemo(context, 0)(() => Math.random(), [dep]);

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

it('holds memoized value with one dep (hook)', () => {

  const dep = 'static';

  const F: Live<NumberReturner> = (context: LiveContext<NumberReturner>) => (): number => {

    const foo = useOne(context, 0)(() => Math.random(), dep);

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
    const foo = useCallback(context, 0)(() => x, [dep]);

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

it('manages a dependent resource (hook)', () => {

  const dep = 'static';
  let allocated: number;
  let disposed: number;

  const F: Live<NullReturner> = (context: LiveContext<NullReturner>): NullReturner => () => {

    useResource(context, 0)((dispose) => {
      allocated++;
      dispose(() => { disposed++ });
    }, [dep]);

    return null;
  };

  const G: Live<NullReturner> = (context: LiveContext<NullReturner>): NullReturner => () => {

    const x = Math.random();
    useResource(context, 0)((dispose) => {
      allocated++;
      dispose(() => { disposed++ });
    }, [x]);

    return null;
  };

  const H: Live<NullReturner> = (context: LiveContext<NullReturner>): NullReturner => () => {

    const x = Math.random();
    useResource(context, 0)((dispose) => {
      allocated++;
      dispose(() => { disposed++ });
      return allocated;
    }, [x]);

    return null;
  };

  {
    allocated = 0;
    disposed = 0;

    const {context, tracker} = prepareHostContext(defer(F)());
    context.bound();

    expect(allocated).toBe(1);
    expect(disposed).toBe(0);

    context.bound();

    expect(allocated).toBe(1);
    expect(disposed).toBe(0);

    tracker.dispose(context);

    expect(allocated).toBe(1);
    expect(disposed).toBe(1);

  }

  {
    allocated = 0;
    disposed = 0;

    const {context, tracker} = prepareHostContext(defer(G)());
    context.bound();

    expect(allocated).toBe(1);
    expect(disposed).toBe(0);

    context.bound();

    expect(allocated).toBe(2);
    expect(disposed).toBe(1);

    tracker.dispose(context);

    expect(allocated).toBe(2);
    expect(disposed).toBe(2);

  }

  {
    allocated = 0;
    disposed = 0;

    const {context, tracker} = prepareHostContext(defer(H)());
    context.bound();

    expect(allocated).toBe(1);
    expect(disposed).toBe(0);

    context.bound();

    expect(allocated).toBe(2);
    expect(disposed).toBe(1);

    tracker.dispose(context);

    expect(allocated).toBe(2);
    expect(disposed).toBe(2);

  }
})
