import 'regenerator-runtime/runtime';

(Array.prototype as any).findLast = function (f: (el: any, index: number) => boolean) {
  const n = this.length;
  for (let i = n - 1; i >= 0; --i) if (f(this[i], i)) return this[i];
  return null;
};
