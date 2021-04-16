import {LiveContext, Live} from './types';
import {useResource, defer} from './live';
import {prepareHostContext} from './tree';

type NullReturner = () => null;

it('manages a dependent resource (hook)', () => {

  const dep = 'static';
  let allocated: number;
  let disposed: number;

  const F: Live<NullReturner> = (context: LiveContext<NullReturner>): NullReturner => () => {

    useResource(context, 0)(() => {
      allocated++;
      return () => { disposed++ };
    }, [dep]);

    return null;
  };

  const G: Live<NullReturner> = (context: LiveContext<NullReturner>): NullReturner => () => {

    const x = Math.random();
    useResource(context, 0)(() => {
      allocated++;
      return () => { disposed++ };
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
})