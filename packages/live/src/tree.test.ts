import { LiveFiber, Mounts, Task } from './types';
import { use, detach, RECONCILE } from './live';
import { renderFiber, makeSubFiber } from './fiber';
import { useState } from './hooks';
import { renderSync } from './tree';

it("mounts", () => {
  
  const Root = () => () => use(Node)();
  const Node = () => () => {};
  
  const result = renderSync(use(Root)());

  expect(result.host).toBeTruthy();
  if (!result.host) return;

  expect(result.f).toBe(Root);
  expect(result.mount).toBeTruthy();
  if (!result.mount) return;

  const node = result.mount;
  expect(node && node.f).toBe(Node);
});

it("mounts multiple", () => {
  
  const Root = () => () => [
    use(Node, '1')(),
    use(Node, '2')(),
  ];
  
  const Node = () => () => {};
  
  const result = renderSync(use(Root)());
  expect(result.f).toBe(Root);
  expect(result.mounts).toBeTruthy();
  if (!result.mounts) return;

  const node1 = result.mounts.get('1');
  const node2 = result.mounts.get('2');
  expect(node1 && node1.f).toBe(Node);
  expect(node2 && node2.f).toBe(Node);
});

it("mounts a subfiber", () => {

  let captureSubFiber: LiveFiber<any> | null = null;

  const Root = (fiber: LiveFiber<any>) => () =>
    detach(use(Sub)(), (mount: LiveFiber<any>) => {
      captureSubFiber = mount;
      renderFiber(mount);
    });

  const Sub = () => () => use(Node)();
  const Node = () => () => {};
  
  const result = renderSync(use(Root)());
  expect(result.f).toBe(Root);

  expect(result.mount).toBeTruthy();
  expect(result.mount.mount).toBeTruthy();

  expect(captureSubFiber).toBeTruthy();
  if (captureSubFiber != null) {
    const {mount} = captureSubFiber;
    expect(mount && mount.f).toBe(Node);
  }
  
});

it("reacts on the root (setter)", () => {

  const rendered = {
    root: 0,
    node: 0,
  };
  let trigger = null as Task | null;
  const setTrigger = (f: Task) => trigger = f;

  const Root = (fiber: LiveFiber<any>) => () => {
    rendered.root++;

    const [, setValue] = useState(fiber, 0)(0);
    setTrigger(() => setValue(1));

    return use(Node)();
  };
  
  const Node = () => () => {
    rendered.node++;
  };

  const result = renderSync(use(Root)());
  expect(result.host).toBeTruthy();
  expect(result.mount).toBeTruthy();
  if (!result.host) return;
  if (!result.mount) return;

  const {host: {__flush: flush}} = result;

  expect(result.f).toBe(Root);
  const node1 = result.mount;
  expect(node1 && node1.f).toBe(Node);

  expect(rendered.root).toBe(1);
  expect(rendered.node).toBe(1);

  if (trigger) trigger();
  if (flush) flush();

  expect(result.f).toBe(Root);
  const node2 = result.mount;
  expect(node2 && node2.f).toBe(Node);

  expect(rendered.root).toBe(2);
  expect(rendered.node).toBe(2);
    
});

it("reacts on the root (reducer)", () => {

  const rendered = {
    root: 0,
    node: 0,
  };
  let trigger = null as Task | null;
  const setTrigger = (f: Task) => trigger = f;

  const Root = (fiber: LiveFiber<any>) => () => {
    rendered.root++;

    const [, setValue] = useState(fiber, 0)(0);
    setTrigger(() => setValue((s: number) => s + 1));

    return use(Node)();
  };
  
  const Node = () => () => {
    rendered.node++;
  };

  const result = renderSync(use(Root)());
  expect(result.host).toBeTruthy();
  expect(result.mount).toBeTruthy();
  if (!result.host) return;
  if (!result.mount) return;

  const {host: {__flush: flush}} = result;

  expect(result.f).toBe(Root);
  const node1 = result.mount;
  expect(node1 && node1.f).toBe(Node);

  expect(rendered.root).toBe(1);
  expect(rendered.node).toBe(1);

  if (trigger) trigger();
  if (flush) flush();

  expect(result.f).toBe(Root);
  const node2 = result.mount;
  expect(node2 && node2.f).toBe(Node);

  expect(rendered.root).toBe(2);
  expect(rendered.node).toBe(2);
    
});

it("reacts and remounts on the root", () => {

  const rendered = {
    root: 0,
    node: 0,
  };
  let trigger = null as Task | null;
  const setTrigger = (f: Task) => trigger = f;

  const Root = (fiber: LiveFiber<any>) => () => {
    const [, setValue] = useState(fiber, 0)(0);
    setTrigger(() => setValue(1));

    rendered.root++;
    return [
      use(Node, '1')(),
      use(Node, '2')(),
      use(Node, '3' + rendered.root)(),
    ];
  };

  const Node = () => () => {
    rendered.node++;
  };

  const result = renderSync(use(Root)());
  expect(result.host).toBeTruthy();
  if (!result.host) return;

  const {host: {__flush: flush, __stats: stats}} = result;

  expect(result.f).toBe(Root);
  expect(result.mounts).toBeTruthy();
  if (result.mounts) {
    const node1 = result.mounts.get('1');
    const node2 = result.mounts.get('2');
    const node3 = result.mounts.get('31');
    const node4 = result.mounts.get('32');
    expect(node1 && node1.f).toBe(Node);
    expect(node2 && node2.f).toBe(Node);
    expect(node3 && node3.f).toBe(Node);
    expect(node4).toBe(undefined);
  }

  expect(rendered.root).toBe(1);
  expect(rendered.node).toBe(3);

  expect(stats.mounts).toBe(4);
  expect(stats.unmounts).toBe(0);
  expect(stats.updates).toBe(0);

  if (trigger) trigger();
  if (flush) flush();

  expect(result.f).toBe(Root);
  expect(result.mounts).toBeTruthy();
  if (result.mounts) {
    const node1 = result.mounts.get('1');
    const node2 = result.mounts.get('2');
    const node3 = result.mounts.get('31');
    const node4 = result.mounts.get('32');
    expect(node1 && node1.f).toBe(Node);
    expect(node2 && node2.f).toBe(Node);
    expect(node3).toBe(undefined);
    expect(node4 && node4.f).toBe(Node);
  }

  expect(rendered.root).toBe(2);
  expect(rendered.node).toBe(6);

  expect(stats.mounts).toBe(5);
  expect(stats.unmounts).toBe(1);
  expect(stats.updates).toBe(3);
    
});

it("reacts and remounts a sub tree", () => {

  const rendered = {
    root: 0,
    subroot: 0,
    node: 0,
  };
  let trigger = null as Task | null;
  const setTrigger = (f: Task) => trigger = f;

  const Root = () => () => {
    rendered.root++;
    return [
      use(SubRoot, 'subroot')(),
    ];
  };

  const SubRoot = (fiber: LiveFiber<any>) => () => {
    const [, setValue] = useState(fiber, 0)(0);
    setTrigger(() => setValue(1));

    rendered.subroot++;
    return [
      use(Node, '1')(),
      use(Node, '2')(),
      use(Node, '3' + rendered.subroot)(),
    ];
  };

  const Node = () => () => {
    rendered.node++;
    return;
  };

  const result = renderSync(use(Root)());
  expect(result.host).toBeTruthy();
  expect(result.mounts).toBeTruthy();
  if (!result.host) return;
  if (!result.mounts) return;

  const {host: {__flush: flush, __stats: stats}} = result;

  expect(result.f).toBe(Root);
  expect(result.mounts).toBeTruthy();

  const sub1 = result.mounts.get('subroot');
  const node1 = sub1 && sub1.mounts && sub1.mounts.get('31');
  expect(sub1 && sub1.f).toBe(SubRoot);
  expect(node1 && node1.f).toBe(Node);

  expect(rendered.root).toBe(1);
  expect(rendered.subroot).toBe(1);
  expect(rendered.node).toBe(3);

  expect(stats.mounts).toBe(5);
  expect(stats.unmounts).toBe(0);
  expect(stats.updates).toBe(0);

  if (trigger) trigger();
  if (flush) flush();

  expect(result.f).toBe(Root);
  expect(result.mounts).toBeTruthy();

  const sub2 = result.mounts.get('subroot');
  const node2 = sub2 && sub2.mounts && sub2.mounts.get('32');
  expect(sub2 && sub2.f).toBe(SubRoot);
  expect(node2 && node2.f).toBe(Node);

  expect(rendered.root).toBe(1);
  expect(rendered.subroot).toBe(2);
  expect(rendered.node).toBe(6);

  expect(stats.mounts).toBe(6);
  expect(stats.unmounts).toBe(1);
  expect(stats.updates).toBe(3);
    
});
