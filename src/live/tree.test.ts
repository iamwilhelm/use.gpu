import {Task} from './types';
import {defer, useState} from './live';
import {render} from './tree';

it("mounts", () => {
  
  const Root = (context: LiveContext<any>) => () => defer(Node)();
  const Node = (context: LiveContext<any>) => () => {};
  
  const result = render(defer(Root)());
  expect(result.call.f).toBe(Root);
  expect(result.mounts.get(0).call.f).toBe(Node);
  
});

it("mounts multiple", () => {
  
  const Root = (context: LiveContext<any>) => () => [
    defer(Node, '1')(),
    defer(Node, '2')(),
  ];
  
  const Node = (context: LiveContext<any>) => () => {};
  
  const result = render(defer(Root)());
  expect(result.call.f).toBe(Root);
  expect(result.mounts.get('1').call.f).toBe(Node);
  expect(result.mounts.get('2').call.f).toBe(Node);
  
});

it("reacts on the root", () => {

  let rendered = {
    root: 0,
    node: 0,
  };
  let trigger = null as Task | null;
  const setTrigger = (f: Task) => trigger = f;

  const Root = (context: LiveContext<any>) => () => {
    rendered.root++;

    const [value, setValue] = useState<number>(context, 0)(0);
    setTrigger(() => setValue(1));

    return defer(Node)();
  };
  
  const Node = (context: LiveContext<any>) => () => {
    rendered.node++;
  };

  const result = render(defer(Root)());
  const {host: {__flush: flush}} = result;

  expect(result.call.f).toBe(Root);
  expect(result.mounts.get(0).call.f).toBe(Node);
  expect(rendered.root).toBe(1);
  expect(rendered.node).toBe(1);

  if (trigger) trigger();
  if (flush) flush();

  expect(result.call.f).toBe(Root);
  expect(result.mounts.get(0).call.f).toBe(Node);
  expect(rendered.root).toBe(2);
  expect(rendered.node).toBe(2);
    
});

it("reacts and remounts on the root", () => {

  let rendered = {
    root: 0,
    node: 0,
  };
  let trigger = null as Task | null;
  const setTrigger = (f: Task) => trigger = f;

  const Root = (context: LiveContext<any>) => () => {
    const [value, setValue] = useState<number>(context, 0)(0);
    setTrigger(() => setValue(1));

    rendered.root++;
    return [
      defer(Node, '1')(),
      defer(Node, '2')(),
      defer(Node, '3' + rendered.root)(),
    ];
  };

  const Node = (context: LiveContext<any>) => () => {
    rendered.node++;
  };

  const result = render(defer(Root)());
  const {host: {__flush: flush, __stats: stats}} = result;

  expect(result.call.f).toBe(Root);
  expect(result.mounts.get('1').call.f).toBe(Node);
  expect(result.mounts.get('2').call.f).toBe(Node);
  expect(result.mounts.get('31').call.f).toBe(Node);
  expect(result.mounts.get('32')).toBe(undefined);

  expect(rendered.root).toBe(1);
  expect(rendered.node).toBe(3);

  expect(stats.mounts).toBe(4);
  expect(stats.unmounts).toBe(0);
  expect(stats.updates).toBe(0);

  if (trigger) trigger();
  if (flush) flush();

  expect(result.call.f).toBe(Root);
  expect(result.mounts.get('1').call.f).toBe(Node);
  expect(result.mounts.get('2').call.f).toBe(Node);
  expect(result.mounts.get('31')).toBe(undefined);
  expect(result.mounts.get('32').call.f).toBe(Node);

  expect(rendered.root).toBe(2);
  expect(rendered.node).toBe(6);

  expect(stats.mounts).toBe(5);
  expect(stats.unmounts).toBe(1);
  expect(stats.updates).toBe(3);
    
});

it("reacts and remounts a sub tree", () => {

  let rendered = {
    root: 0,
    subroot: 0,
    node: 0,
  };
  let trigger = null as Task | null;
  const setTrigger = (f: Task) => trigger = f;

  const Root = (context: LiveContext<any>) => () => {
    rendered.root++;
    return [
      defer(SubRoot, 'subroot')(),
    ];
  };

  const SubRoot = (context: LiveContext<any>) => () => {
    const [value, setValue] = useState<number>(context, 0)(0);
    setTrigger(() => setValue(1));

    rendered.subroot++;
    return [
      defer(Node, '1')(),
      defer(Node, '2')(),
      defer(Node, '3' + rendered.subroot)(),
    ];
  };

  const Node = (context: LiveContext<any>) => () => {
    rendered.node++;
    return;
  };

  const result = render(defer(Root)());
  const {host: {__flush: flush, __stats: stats}} = result;

  expect(result.call.f).toBe(Root);
  expect(result.mounts.get('subroot').call.f).toBe(SubRoot);
  expect(result.mounts.get('subroot').mounts.get('31').call.f).toBe(Node);

  expect(rendered.root).toBe(1);
  expect(rendered.subroot).toBe(1);
  expect(rendered.node).toBe(3);

  expect(stats.mounts).toBe(5);
  expect(stats.unmounts).toBe(0);
  expect(stats.updates).toBe(0);

  if (trigger) trigger();
  if (flush) flush();

  expect(result.call.f).toBe(Root);
  expect(result.mounts.get('subroot').call.f).toBe(SubRoot);
  expect(result.mounts.get('subroot').mounts.get('32').call.f).toBe(Node);

  expect(rendered.root).toBe(1);
  expect(rendered.subroot).toBe(2);
  expect(rendered.node).toBe(6);

  expect(stats.mounts).toBe(6);
  expect(stats.unmounts).toBe(1);
  expect(stats.updates).toBe(3);
    
});
