import { LiveComponent } from '@use-gpu/live/types';
import { useFiber, useResource, useNoResource } from '@use-gpu/live';

import React from 'react';
import ReactDOM from 'react-dom';

export type HTMLProps = {
  container: Element,
  style?: Record<string, any>,
  children?: React.ReactNode,
};

export const HTML = ({
  container = document.body,
  style,
  children,
}: HTMLProps) => {
  const fiber = useFiber();

  // Create wrapper div
  const div = useResource((dispose) => {

    const div = document.createElement('div');
    container.appendChild(div);

    dispose(() => {
      ReactDOM.unmountComponentAtNode(container);
      container.removeChild(div);
    });

    return div;
  }, [container]);

  // Apply/unapply styles
  if (style) {
    useResource((dispose) => {
      for (let k in style!) (div.style as any)[k] = style[k];
      dispose(() => {
        for (let k in style!) (div.style as any)[k] = 'unset';
      });
    }, [div, style]);
  }
  else {
    useNoResource();
  }

  if (children) {
    ReactDOM.render(children as any, div);
  }
  else {
    ReactDOM.render(React.createElement('div', {}, null), div);
  }

  const f = fiber as any;
  const i = f.__inspect = f.__inspect ?? {};
  const r = i.react = i.react ?? {root: null};
  r.root = (div as any)._reactRootContainer?._internalRoot;

  return null;
};
