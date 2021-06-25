import { LiveFiber, LiveComponent, Live, DeferredCall } from './types';

import { bind, use } from './live';
import { makeHostFiber } from './tree';
import { useCallback, useMemo, useOne, useResource, useState, memoArgs, memoProps } from './hooks';

type NullReturner = () => null;
type NumberReturner = () => number;
type FunctionReturner = () => () => any;

it('memoizes a function', () => {

  const F: Live<NumberReturner> = memoArgs(() => (): number => {
    return Math.random();
  });

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

it('memoizes a component', () => {

  const F: Live<NumberReturner> = memoProps(() => (props): number => {
    return Math.random();
  });

  {
    const bound = bind(F);
    const result1 = bound({foo: 1, bar: 1});
    const result2 = bound({foo: 1, bar: 2});

    expect(result1).not.toBe(result2);
  }

  {
    const bound = bind(F);
    const result1 = bound({foo: 1, bar: 1});
    const result2 = bound({foo: 1, bar: 1});

    expect(result1).toBe(result2);
  }
})

it('holds state (hook)', () => {

  const F: Live<NumberReturner> = (fiber: LiveFiber<NumberReturner>) => (): number => {
    const [foo] = useState(fiber)(() => Math.random());
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

  const F: Live<NumberReturner> = (fiber: LiveFiber<NumberReturner>) => (): number => {

    const foo = useMemo(fiber)(() => Math.random(), [dep]);

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

  const F: Live<NumberReturner> = (fiber: LiveFiber<NumberReturner>) => (): number => {

    const foo = useOne(fiber)(() => Math.random(), dep);

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

  const F: Live<FunctionReturner> = (fiber: LiveFiber<FunctionReturner>) => (): () => number => {

    const x = Math.random();
    const foo = useCallback(fiber)(() => x, [dep]);

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

  const F: Live<NullReturner> = (fiber: LiveFiber<NullReturner>): NullReturner => () => {

    useResource(fiber)((dispose) => {
      allocated++;
      dispose(() => { disposed++ });
    }, [dep]);

    return null;
  };

  const G: Live<NullReturner> = (fiber: LiveFiber<NullReturner>): NullReturner => () => {

    const x = Math.random();
    useResource(fiber)((dispose) => {
      allocated++;
      dispose(() => { disposed++ });
    }, [x]);

    return null;
  };

  const H: Live<NullReturner> = (fiber: LiveFiber<NullReturner>): NullReturner => () => {

    const x = Math.random();
    useResource(fiber)((dispose) => {
      allocated++;
      dispose(() => { disposed++ });
      return allocated;
    }, [x]);

    return null;
  };

  {
    allocated = 0;
    disposed = 0;

    const {fiber, tracker} = makeHostFiber(use(F)());
    fiber.bound();

    expect(allocated).toBe(1);
    expect(disposed).toBe(0);

    fiber.bound();

    expect(allocated).toBe(1);
    expect(disposed).toBe(0);

    tracker.dispose(fiber);

    expect(allocated).toBe(1);
    expect(disposed).toBe(1);

  }

  {
    allocated = 0;
    disposed = 0;

    const {fiber, tracker} = makeHostFiber(use(G)());
    fiber.bound();

    expect(allocated).toBe(1);
    expect(disposed).toBe(0);

    fiber.bound();

    expect(allocated).toBe(2);
    expect(disposed).toBe(1);

    tracker.dispose(fiber);

    expect(allocated).toBe(2);
    expect(disposed).toBe(2);

  }

  {
    allocated = 0;
    disposed = 0;

    const {fiber, tracker} = makeHostFiber(use(H)());
    fiber.bound();

    expect(allocated).toBe(1);
    expect(disposed).toBe(0);

    fiber.bound();

    expect(allocated).toBe(2);
    expect(disposed).toBe(1);

    tracker.dispose(fiber);

    expect(allocated).toBe(2);
    expect(disposed).toBe(2);

  }
})
