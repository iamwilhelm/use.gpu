import type { LiveFiber, Task } from './types';
import { use, keyed, detach, provide, gather, reconcile, yeet, quote, unquote, PROVIDE, makeContext } from './builtin';
import { renderFiber } from './fiber';
import { memoArgs, useState, useContext } from './hooks';
import { renderSync } from './tree';
import { formatTree } from './debug';

it("mounts", () => {

  const Root = () => use(Node);
  const Node = () => {};

  const result = renderSync(use(Root));

  expect(result.host).toBeTruthy();
  if (!result.host) return;

  expect(result.f).toBe(Root);
  expect(result.mount).toBeTruthy();
  if (!result.mount) return;

  const node = result.mount;
  expect(node && node.f).toBe(Node);
});

it("mounts multiple", () => {

  const Root = () => [
    keyed(Node, '1'),
    keyed(Node, '2'),
  ];

  const Node = () => {};

  const result = renderSync(use(Root));
  expect(result.f).toBe(Root);
  expect(result.mounts).toBeTruthy();
  if (!result.mounts) return;

  const node1 = result.mounts.get('1');
  const node2 = result.mounts.get('2');
  expect(node1 && node1.f).toBe(Node);
  expect(node2 && node2.f).toBe(Node);
});

it("detaches a subfiber", () => {

  let captureSubFiber: LiveFiber<any> | null = null;

  const Root = () =>
    detach(use(Sub), (render: () => void, mount: LiveFiber<any>) => {
      captureSubFiber = mount;
      render();
    });

  const Sub = () => use(Node);
  const Node = () => {};

  const result = renderSync(use(Root));
  expect(result.f).toBe(Root);

  expect(result.mount).toBeTruthy();
  expect(result.mount!.next).toBeTruthy();

  expect(captureSubFiber).toBeTruthy();
  if (captureSubFiber != null) {
    const {mount} = captureSubFiber;
    // @ts-ignore
    expect(captureSubFiber.f).toBe(Sub);
    // @ts-ignore
    expect(mount && mount.f).toBe(Node);
  }

});

it("reacts on the root (setter form)", () => {

  const rendered = {
    root: 0,
    node: 0,
  };
  let trigger = null as Task | null;
  const setTrigger = (f: Task) => trigger = f;

  const Root = () => {
    rendered.root++;

    const [, setValue] = useState(0);
    setTrigger(() => setValue(1));

    return keyed(Node, Math.random());
  };

  const Node = (x?: number) => {
    rendered.node++;
  };

  const result = renderSync(use(Root));
  expect(result.host).toBeTruthy();
  expect(result.mount).toBeTruthy();
  if (!result.host) return;
  if (!result.mount) return;

  const {host: {flush}} = result;

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

it("reacts on the root (reducer form)", () => {

  const rendered = {
    root: 0,
    node: 0,
  };
  let trigger = null as Task | null;
  const setTrigger = (f: Task) => trigger = f;

  const Root = () => {
    rendered.root++;

    const [, setValue] = useState(0);
    setTrigger(() => setValue((s: number) => s + 1));

    return keyed(Node, Math.random());
  };

  const Node = (x?: number) => {
    rendered.node++;
  };

  const result = renderSync(use(Root));
  expect(result.host).toBeTruthy();
  expect(result.mount).toBeTruthy();
  if (!result.host) return;
  if (!result.mount) return;

  const {host: {flush}} = result;

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

  const Root = () => {
    const [, setValue] = useState(0);
    setTrigger(() => setValue(1));

    rendered.root++;
    return [
      keyed(Node, '1', Math.random()),
      keyed(Node, '2', Math.random()),
      keyed(Node, '3' + rendered.root, Math.random()),
    ];
  };

  const Node = (x?: number) => {
    rendered.node++;
  };

  const result = renderSync(use(Root));
  expect(result.host).toBeTruthy();
  if (!result.host) return;

  const {host: {flush, __stats: stats}} = result;

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
  expect(stats.dispatch).toBe(1);

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
  expect(stats.updates).toBe(2);
  expect(stats.dispatch).toBe(2);

});

it("reacts and remounts a sub tree", () => {

  const rendered = {
    root: 0,
    subroot: 0,
    node: 0,
  };
  let trigger = null as Task | null;
  const setTrigger = (f: Task) => trigger = f;

  const Root = () => {
    rendered.root++;
    return [
      keyed(SubRoot, 'subroot'),
    ];
  };

  const SubRoot = () => {
    const [, setValue] = useState(0);
    setTrigger(() => setValue(1));

    rendered.subroot++;
    return [
      keyed(Node, '1', Math.random()),
      keyed(Node, '2', Math.random()),
      keyed(Node, '3' + rendered.subroot, Math.random()),
    ];
  };

  const Node = (x?: number) => {
    rendered.node++;
    return;
  };

  const result = renderSync(use(Root));
  expect(result.host).toBeTruthy();
  expect(result.mounts).toBeTruthy();
  if (!result.host) return;
  if (!result.mounts) return;

  const {host: {flush, __stats: stats}} = result;

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
  expect(stats.dispatch).toBe(1);

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
  expect(stats.updates).toBe(2);
  expect(stats.dispatch).toBe(2);

});

it("coalesces updates", () => {

  const rendered = {
    root: 0,
    node: 0,
  };
  let trigger1 = null as Task | null;
  let trigger2 = null as Task | null;
  const setTrigger1 = (f: Task) => trigger1 = f;
  const setTrigger2 = (f: Task) => trigger2 = f;

  const Root = () => {
    rendered.root++;

    const [, setValue] = useState(0);
    setTrigger1(() => setValue(1));

    return keyed(Node, Math.random());
  };

  const Node = (x?: number) => {
    rendered.node++;

    const [, setValue] = useState(0);
    setTrigger2(() => setValue(1));
  };

  const result = renderSync(use(Root));
  expect(result.host).toBeTruthy();
  expect(result.mount).toBeTruthy();
  if (!result.host) return;
  if (!result.mount) return;

  const {host: {flush}} = result;

  expect(result.f).toBe(Root);
  const node1 = result.mount;
  expect(node1 && node1.f).toBe(Node);

  expect(rendered.root).toBe(1);
  expect(rendered.node).toBe(1);

  if (trigger1) trigger1();
  if (trigger2) trigger2();
  if (flush) flush();

  expect(result.f).toBe(Root);
  const node2 = result.mount;
  expect(node2 && node2.f).toBe(Node);

  expect(rendered.root).toBe(2);
  expect(rendered.node).toBe(2);

});

it("updates with memo in the way", () => {

  const rendered = {
    root: 0,
    memo: 0,
    node: 0,
  };
  let trigger1 = null as Task | null;
  let trigger2 = null as Task | null;
  const setTrigger1 = (f: Task) => trigger1 = f;
  const setTrigger2 = (f: Task) => trigger2 = f;

  const Root = () => {
    rendered.root++;

    const [, setValue] = useState(0);
    setTrigger1(() => setValue(1));

    return use(Memo);
  };

  const Memo = memoArgs(() => {
    rendered.memo++;

    return keyed(Node, Math.random());
  });

  const Node = (x?: number) => {
    rendered.node++;

    const [, setValue] = useState(0);
    setTrigger2(() => setValue(1));
  };

  const result = renderSync(use(Root));
  expect(result.host).toBeTruthy();
  expect(result.mount).toBeTruthy();
  expect(result.mount!.mount).toBeTruthy();
  if (!result.host) return;
  if (!result.mount) return;
  if (!result.mount.mount) return;

  const {host: {flush}} = result;

  expect(result.f).toBe(Root);
  const memo1 = result.mount;
  expect(memo1 && memo1.f).toBe(Memo);
  const node1 = result.mount.mount;
  expect(node1 && node1.f).toBe(Node);

  expect(rendered.root).toBe(1);
  expect(rendered.memo).toBe(1);
  expect(rendered.node).toBe(1);

  if (trigger1) trigger1();
  if (trigger2) trigger2();
  if (flush) flush();

  expect(result.f).toBe(Root);
  const memo2 = result.mount;
  expect(memo2 && memo2.f).toBe(Memo);
  const node2 = result.mount.mount;
  expect(node2 && node2.f).toBe(Node);

  expect(rendered.root).toBe(2);
  expect(rendered.memo).toBe(1);
  expect(rendered.node).toBe(2);

});

it("updates context with memo in the way", () => {

  const context = makeContext<number>(-1);

  const rendered = {
    root: 0,
    memo: 0,
    node: 0,
    value: -1,
  };
  let trigger = null as Task | null;
  const setTrigger = (f: Task) => trigger = f;

  const Root = () => {
    rendered.root++;

    const [value, setValue] = useState(0);
    setTrigger(() => setValue(1));

    return provide(context, value, use(Memo));
  };

  const Memo = memoArgs(() => {
    rendered.memo++;

    return use(Node);
  });

  const Node = () => {
    rendered.node++;
    const value = useContext(context);
    rendered.value = value;
  };

  const result = renderSync(use(Root));
  expect(result.host).toBeTruthy();
  expect(result.mount).toBeTruthy();
  expect(result.mount!.mount).toBeTruthy();
  if (!result.host) return;
  if (!result.mount) return;
  if (!result.mount.mount) return;

  const {host: {flush}} = result;

  expect(result.f).toBe(Root);
  const provide1 = result.mount;
  expect(provide1 && provide1.f).toBe(PROVIDE);
  const memo1 = result.mount.mount;
  expect(memo1 && memo1.f).toBe(Memo);
  const node1 = result.mount.mount.mount;
  expect(node1 && node1.f).toBe(Node);

  expect(rendered.root).toBe(1);
  expect(rendered.memo).toBe(1);
  expect(rendered.node).toBe(1);
  expect(rendered.value).toBe(0);

  if (trigger) trigger();
  if (flush) flush();

  expect(result.f).toBe(Root);
  const provide2 = result.mount;
  expect(provide2 && provide2.f).toBe(PROVIDE);
  const memo2 = result.mount.mount;
  expect(memo2 && memo2.f).toBe(Memo);
  const node2 = result.mount.mount.mount;
  expect(node2 && node2.f).toBe(Node);

  expect(rendered.root).toBe(2);
  expect(rendered.memo).toBe(1);
  expect(rendered.node).toBe(2);
  expect(rendered.value).toBe(1);

});

it("does not update context if value is the same", () => {

  const context = makeContext<number>(-1);

  const rendered = {
    root: 0,
    memo: 0,
    node: 0,
    value: -1,
  };
  let trigger = null as Task | null;
  const setTrigger = (f: Task) => trigger = f;

  const Root = () => {
    rendered.root++;

    const [value, setValue] = useState(0);
    setTrigger(() => setValue(1));

    return provide(context, 0, memoChild);
  };

  const Memo = memoArgs(() => {
    rendered.memo++;

    return use(Node);
  });

  const Node = () => {
    rendered.node++;
    const value = useContext(context);
    rendered.value = value;
  };

  const memoChild = use(Memo);

  const result = renderSync(use(Root));
  expect(result.host).toBeTruthy();
  expect(result.mount).toBeTruthy();
  expect(result.mount!.mount).toBeTruthy();
  if (!result.host) return;
  if (!result.mount) return;
  if (!result.mount.mount) return;

  const {host: {flush}} = result;

  expect(result.f).toBe(Root);
  const provide1 = result.mount;
  expect(provide1 && provide1.f).toBe(PROVIDE);
  const memo1 = result.mount.mount;
  expect(memo1 && memo1.f).toBe(Memo);
  const node1 = result.mount.mount.mount;
  expect(node1 && node1.f).toBe(Node);

  expect(rendered.root).toBe(1);
  expect(rendered.memo).toBe(1);
  expect(rendered.node).toBe(1);
  expect(rendered.value).toBe(0);

  if (trigger) trigger();
  if (flush) flush();

  expect(result.f).toBe(Root);
  const provide2 = result.mount;
  expect(provide2 && provide2.f).toBe(PROVIDE);
  const memo2 = result.mount.mount;
  expect(memo2 && memo2.f).toBe(Memo);
  const node2 = result.mount.mount.mount;
  expect(node2 && node2.f).toBe(Node);

  expect(rendered.root).toBe(2);
  expect(rendered.memo).toBe(1);
  expect(rendered.node).toBe(1);
  expect(rendered.value).toBe(0);

});

it("gathers yeeted values", () => {
  
  const Root = () => {
    return gather([
      yeet(1),
      use(Value),
      yeet(3),
    ], (values: number[]) => use(Node, values));
  };

  const Value = () => {
    return yeet(2);
  };

  const Node = () => {};
  
  const result = renderSync(use(Root));
  if (!result.host) return;

  const {host: {flush}} = result;
  if (flush) flush();
  
  expect(formatTree(result)).toMatchSnapshot();
});

it("renders quoted tree", () => {
  
  const Root = () => {
    return [
      use(Node),
      quote(use(Tree)),
      use(Node),
    ];
  };

  const Tree = () => use(Node, use(Node, use(Node)));

  const Node = (children) => {
    return children;
  };
  
  const result = renderSync(use(Root));
  if (!result.host) return;

  const {host: {flush}} = result;
  if (flush) flush();
  
  expect(formatTree(result)).toMatchSnapshot();
});

it("renders quoted/unquoted trees", () => {
  
  const Root = () => {
    return [
      quote(
        use(Second,
          use(Second,
            unquote(use(First, quote(use(Second, unquote(use(First, use(First, quote(use(Second)))))))))
          )
        )
      ),
    ];
  };

  const First = (children) => children;
  const Second = (children) => children;
  
  const result = renderSync(use(Root));
  if (!result.host) return;

  const {host: {flush}} = result;
  if (flush) flush();
  
  expect(formatTree(result)).toMatchSnapshot();
});

it("renders quote/unquote pairs", () => {
  
  const Root = () => {
    return use(First,
      quote(
        use(Second,
          use(Second,
            unquote(quote(use(Second, unquote(
              use(First, quote(unquote(use(First, use(First, quote(
                use(Second)
              ))))))
            ))))
          )
        )
      ),
    );
  };

  const First = (children) => children;
  const Second = (children) => children;
  
  const result = renderSync(use(Root));
  if (!result.host) return;

  const {host: {flush}} = result;
  if (flush) flush();
  
  expect(formatTree(result)).toMatchSnapshot();
});

it("optimizes root quote/unquote pair", () => {
  
  const Root = () => {
    return quote(unquote(use(First, quote(use(Second, unquote(use(First, quote(use(Second)))))))));
  };

  const First = (children) => children;
  const Second = (children) => children;
  
  const result = renderSync(use(Root));
  if (!result.host) return;

  const {host: {flush}} = result;
  if (flush) flush();
  
  expect(formatTree(result)).toMatchSnapshot();
});
