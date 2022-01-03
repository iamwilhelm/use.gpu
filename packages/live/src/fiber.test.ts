import { LiveFunction, LiveComponent, DeferredCall } from './types';
import { use } from './builtin';
import { bind, makeFiber, renderFiber } from './fiber';

type FooProps = { foo: string };
type StringFormatter = (foo: string) => string;
type NumberReturner = () => number;

it('returns a value', () => {

  const F: LiveFunction<StringFormatter> = () => (foo: string) => {
    return `hello ${foo}`;
  };

  const result = bind(F)('wat');

  expect(result).toBe('hello wat');
})

it('returns a deferred call', () => {

  const G: LiveFunction<StringFormatter> = () => (foo: string) => {
    return `hello ${foo}`;
  };

  const F: LiveComponent<FooProps> = () => ({foo}) => {
    return use(G)(foo);
  };

  const result = bind(F)({foo: 'wat'}) as any as DeferredCall<any>;
  expect(result).toBeTruthy();
  expect(result.f).toEqual(G);
  expect(result.args).toEqual(['wat']);
});


it("renders a fiber recursively", () => {

  const Root = () => () => use(Node)();
  const Node = () => () => {};

  const fiber = makeFiber(Root, null);

  renderFiber(fiber);

  expect(fiber.f).toBe(Root);
  expect(fiber.mount).toBeTruthy();

  if (fiber.mount) {
    const node = fiber.mount;
    expect(node && node.f).toBe(Node);
  }

});
