import {defer} from './live';
import {render} from './tree';

it("mounts", () => {
  
  const Root = (context: LiveContext<any>) => () => {
    return defer(Node)();
  };
  
  const Node = (context: LiveContext<any>) => () => {
    return;
  };
  
  const result = render(defer(Root)());
  expect(result.call.f).toBe(Root);
  expect(result.mounts.get(0).call.f).toBe(Node);
  
});