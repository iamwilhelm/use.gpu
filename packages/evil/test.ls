import { LiveComponent, use, useState } from '@use-gpu/live';

type OuterProps = {
  foo: string,
};

type InnerProps = {
  foo: string,
};

export const Outer: LiveComponent<OuterProps> = live (props) => {
  const {foo} = props;
  const bar = mount use(Inner)();
};

export const Inner: LiveComponent<InnerProps> = live (props) => {
  const [state, setState] = useState<number>(0);
  const {foo} = props;
  return bar;
};
