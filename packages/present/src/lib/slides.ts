import type { SlideInfo, ResolvedSlide } from './types';

export const resolveSlides = (slides: SlideInfo[]) => {
  const out: ResolvedSlide[] = [];
  const ordered = slides.slice();
  ordered.sort(({order: a}, {order: b}) => (a ?? 1e8) - (b ?? 1e8));

  let accum = 0;
  const summed = ordered.reduce((list, {steps = 1}) => {
    if (steps) {
      list.push(accum += steps);
    }
    return list;
  }, [0]);
  
  const n = summed.length;
  const last = summed[summed.length - 1];

  let i = 0;
  for (const {id, steps = 1, stay = 0, slides, sticky} of ordered) {
    const from = summed[i];
    const to = stay
      ? summed[i + stay] ?? (last + stay - (n - i))
      : sticky
        ? last
        : summed[i + 1];

    const shift = from + 1;
    out.push({id, from, to});
    if (slides) {
      out.push(...slides.map(({from, to, ...rest}) => ({
        ...rest,
        from: from + shift,
        to: to + shift,
      })));
    }

    if (steps) i++;
  }

  return {resolved: out, length: last};
};
