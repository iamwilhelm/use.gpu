import type { LiveComponent } from '@use-gpu/live';
import type { VirtualDraw } from '../../pass/types';

import { UIRender } from '../forward/ui';

export type UIRenderProps = VirtualDraw;

export const DeferredUIRender: LiveComponent<UIRenderProps> = (props: UIRenderProps) => {
  return UIRender({...props, mode: 'transparent'});
};
