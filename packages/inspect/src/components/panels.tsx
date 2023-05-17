import type { LiveFiber } from '@use-gpu/live';
import type { InspectAddIns } from './types';
import React, { FC } from 'react';

import { Inset } from './layout';
import { useAddIns } from './add-ins';
import { usePingContext } from './ping';
import * as Tabs from '@radix-ui/react-tabs';

export type PanelsProps = {
  fiber: LiveFiber<any>,
  fibers: Map<number, LiveFiber<any>>,
};

export const Panels: FC<PanelsProps> = (props: PanelsProps) => {
  const {fiber, fibers} = props;
  
  const addIns = useAddIns();
  
  const {props: panels} = addIns;
  const [first] = panels;
  if (!first) return null;

  const active = panels.filter((panel) => panel.enabled(fiber, fibers));

  usePingContext();

  return (
    <Inset>
      <Tabs.Root defaultValue={first.id}>
        <Tabs.List>
          {active.map((panel) => (
            <Tabs.Trigger key={panel.id} value={panel.id}>
              {panel.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {active.map((panel) => (
          <Tabs.Content key={panel.id} value={panel.id}>
            {fiber ? panel.render(fiber, fibers) : null}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Inset>
  );
};
