import {LiveContext, Live} from './types';
import {useResource, defer} from './live';
import {prepareHostContext} from './tree';

type NullReturner = () => null;

it('holds a resource (hook)', () => {

  const dep = 'static';
  let allocated;
  let disposed;

  const F: Live<FunctionReturner> = (context: LiveContext<FunctionReturner>) => (): NullReturner => {

    const foo = useResource(context, 0)(() => {
      allocated++;
      return () => { disposed++ };
    }, [dep]);

    return null;
  };

  const G: Live<FunctionReturner> = (context: LiveContext<FunctionReturner>) => (): NullReturner => {

    const x = Math.random();
    const foo = useResource(context, 0)(() => {
      allocated++;
      return () => { disposed++ };
    }, [x]);

    return null;
  };

  {
    allocated = 0;
    disposed = 0;

    const {context, host, tracker} = prepareHostContext(defer(F)());
    const result1 = context.bound();
    const result2 = context.bound();

    expect(allocated).toBe(1);
    expect(disposed).toBe(0);

    tracker.dispose(context);

    expect(allocated).toBe(1);
    expect(disposed).toBe(1);

  }

  {
    allocated = 0;
    disposed = 0;

    const {context, host, tracker} = prepareHostContext(defer(G)());
    const result1 = context.bound();
    const result2 = context.bound();

    expect(allocated).toBe(2);
    expect(disposed).toBe(1);

    tracker.dispose(context);

    expect(allocated).toBe(2);
    expect(disposed).toBe(2);

  }
})