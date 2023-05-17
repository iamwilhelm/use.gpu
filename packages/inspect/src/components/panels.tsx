import type { LiveFiber } from '@use-gpu/live';
import type { InspectAddIns } from './types';
import React, { FC, useState } from 'react';

import { Inset } from './layout';
import { useAddIns } from '../providers/add-in-provider';
import { usePingContext } from '../providers/ping-provider';
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

  usePingContext();

  const active = panels.filter((panel) => panel.enabled(fiber, fibers));
  let [tab, setTab] = useState<string>(first.id);
  
  if (!active.find((panel) => panel.id === tab)) tab = first.id;

  return (
    <Inset>
      <Tabs.Root value={tab} onValueChange={setTab}>
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
