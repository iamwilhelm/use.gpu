import { makeActionScheduler, makeDependencyTracker, makeDisposalTracker, makePaintRequester, compareFibers, isSubNode } from './util';

it("schedules actions", () => {
  let run = {a: 0, b: 0} as Record<string, number>;
  let flushed = [] as any[];

  let fiber = {} as any;

  const scheduler = makeActionScheduler();
  scheduler.bind((as: any[]) => flushed = as);

  scheduler.schedule(fiber, () => run.a++);
  scheduler.schedule(fiber, () => run.b++);

  scheduler.flush();

  expect(run.a).toBe(1);
  expect(run.b).toBe(1);
  expect(flushed.length).toBe(2);

  scheduler.flush();

  expect(run.a).toBe(1);
  expect(run.b).toBe(1);
  expect(flushed.length).toBe(0);
})

it("tracks disposal actions", () => {
  let run = {a: 0, b: 0} as Record<string, number>;

  let fiber = {} as any;

  const trash = makeDisposalTracker();
  trash.track(fiber, () => run.a++);
  trash.track(fiber, () => run.b++);

  trash.dispose(fiber);

  expect(run.a).toBe(1);
  expect(run.b).toBe(1);

  trash.dispose(fiber);

  expect(run.a).toBe(1);
  expect(run.b).toBe(1);

});

it("tracks dependencies", () => {
  let root = {} as any;
  let fiber1 = {} as any;
  let fiber2 = {} as any;

  const dependency = makeDependencyTracker();
  dependency.depend(fiber1, root);
  dependency.depend(fiber2, root);

  let visit = new Set(dependency.traceDown(root));
  expect(visit.size).toBe(2);
  expect(visit.has(fiber1)).toBe(true);
  expect(visit.has(fiber2)).toBe(true);

  dependency.undepend(fiber1, root);

  visit = new Set(dependency.traceDown(root));
  expect(visit.size).toBe(1);
  expect(visit.has(fiber2)).toBe(true);

});

it("requests paints", (done) => {
  let run = {a: 0, b: 0} as Record<string, number>;
  let requested = 0;

  const raf = (f: any) => {
    requested++;
    setTimeout(f, 10);
  };
  const request = makePaintRequester(raf);
  
  request(() => run.a++);
  request(() => run.b++);

  setTimeout(() => {
    expect(requested).toBe(1);
    expect(run.a).toBe(1);
    expect(run.b).toBe(1);
    done();
  }, 30);
});

it("resolves node ancestry", () => {
  
  const n1  = {depth: 0, path: [0]} as any;
  const n11 = {depth: 1, path: [0, 0]} as any;
  const n12 = {depth: 1, path: [0, 1]} as any;

  const n111 = {depth: 2, path: [0, 0, 0]} as any;
  const n1111 = {depth: 3, path: [0, 0, 0]} as any;

  const n11111 = {depth: 4, path: [0, 0, 0, 0]} as any;
  const n11112 = {depth: 4, path: [0, 0, 0, 1]} as any;

  expect(isSubNode(n1, n11)).toBe(true);
  expect(isSubNode(n1, n12)).toBe(true);
  expect(isSubNode(n1, n111)).toBe(true);
  expect(isSubNode(n1, n1111)).toBe(true);
  expect(isSubNode(n1, n11111)).toBe(true);
  expect(isSubNode(n1, n11112)).toBe(true);

  expect(isSubNode(n11, n1)).toBe(false);
  expect(isSubNode(n12, n1)).toBe(false);
  expect(isSubNode(n111, n1)).toBe(false);
  expect(isSubNode(n1111, n1)).toBe(false);
  expect(isSubNode(n11111, n1)).toBe(false);
  expect(isSubNode(n11112, n1)).toBe(false);

  expect(isSubNode(n11, n12)).toBe(false);
  expect(isSubNode(n12, n11)).toBe(false);

  expect(isSubNode(n11, n111)).toBe(true);
  expect(isSubNode(n11, n1111)).toBe(true);
  expect(isSubNode(n11, n11111)).toBe(true);
  expect(isSubNode(n11, n11112)).toBe(true);

  expect(isSubNode(n12, n111)).toBe(false);
  expect(isSubNode(n12, n1111)).toBe(false);
  expect(isSubNode(n12, n11111)).toBe(false);
  expect(isSubNode(n12, n11112)).toBe(false);

  expect(isSubNode(n111, n1111)).toBe(true);
  expect(isSubNode(n111, n11111)).toBe(true);
  expect(isSubNode(n111, n11112)).toBe(true);

  expect(isSubNode(n1111, n111)).toBe(false);
  expect(isSubNode(n11111, n111)).toBe(false);
  expect(isSubNode(n11112, n111)).toBe(false);

});

it("sorts fibers", () => {

  const n1  = {depth: 0, path: [0]} as any;
  const n11 = {depth: 1, path: [0, 0]} as any;
  const n12 = {depth: 1, path: [0, 1]} as any;
  const n1k = {depth: 1, path: [0, 'key']} as any;

  const n111 = {depth: 2, path: [0, 0, 0]} as any;
  const n1111 = {depth: 3, path: [0, 0, 0]} as any;

  const n11111 = {depth: 4, path: [0, 0, 0, 0]} as any;
  const n11112 = {depth: 4, path: [0, 0, 0, 1]} as any;

  const list = [n11111, n1k, n11112, n1, n12, n11, n111, n1111];
  const sorted = [n1, n11, n111, n1111, n11111, n11112, n12, n1k];

  list.sort(compareFibers);
  expect(list).toEqual(sorted);
});
