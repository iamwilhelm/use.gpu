import { LiveComponent, LiveElement } from '@use-gpu/live/types';

import { memo, yeet, resume, provide, gather, useContext, useMemo } from '@use-gpu/live';
import { LayoutContext } from '../providers/layout-provider';

export type LayoutProps = {
  render?: () => LiveElement<any>,
  children?: LiveElement<any>,
};

export const Layout: LiveComponent<LayoutProps> = memo((fiber) => (props) => {
  const {render, children} = props;
  return gather(children ?? (render ? render() : null), Resume);
}, 'Layout');

const Resume = resume((fiber: LiveFiber<any>) => (ls: LayoutHandler[]) => {
  const layout = useContext(LayoutContext);

  const out = [] as LiveElement[];
  for (let l of ls) {
    const {box, element, key} = l(layout);
    out.push(provide(LayoutContext, box, element, key));
  }

  return out;
}, 'Layout');
