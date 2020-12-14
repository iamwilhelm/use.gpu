import {LiveContext, Live} from './types';
import {live, makeContext} from './live';

type StringFormatter = (foo: string) => string;
type NumberReturner = () => number;

it('returns a value', async () => {

  const F: Live<StringFormatter> = (context: LiveContext) => (foo: string) => {
    return foo;
  };

  const result = await live(F)('wat');

  expect(result).toBe('wat');
})

it('holds state', async () => {

  const F: Live<NumberReturner> = (context: LiveContext) => () => {
    let foo = context.getStateAt(0);

    if (foo === undefined) {
      foo = Math.random();
      context.setStateAt(0, foo);
    }

    return foo;
  };

  {
    const result1 = await live(F)();
    const result2 = await live(F)();

    expect(result1).not.toBe(result2);
  }

  {
    const context = makeContext();
    const result1 = await live(F, context)();
    const result2 = await live(F, context)();

    expect(result1).toBe(result2);
    console.log(context.getState())
  }
})

