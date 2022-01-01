import { LiveFiber } from '@use-gpu/live/types';
import { formatNode, formatValue, traverseFiber, renderFibers } from '@use-gpu/live';
import { useUpdateState } from './cursor';
import { ExpandState, SelectState, PingState } from './types';

import React, { useEffect, useMemo, useState } from 'react';
import { Node } from './node';
import { FiberTree } from './fiber';
import { Props } from './props';
import { Call } from './call';
import { Shader } from './shader';
import { InspectContainer, InspectContainerCollapsed, InspectToggle, SplitRow, RowPanel, Panel, PanelFull, Scrollable, Inset } from './layout';
import { Button, Tab, Grid } from 'semantic-ui-react'
import "../theme.css";

const { Row, Column } = Grid;
const { Pane } = Tab;

const ICON = (s: string) => <span className="m-icon">{s}</span>

type InspectFiber = Record<string, any>;
type InspectMap = WeakMap<LiveFiber<any>, InspectFiber>;

type InspectProps = {
  fiber: LiveFiber<any>,
}

const TAB_STYLE = { secondary: true, pointing: true };

export const Inspect: React.FC<InspectProps> = ({fiber}) => {
  const expandCursor = useUpdateState<ExpandState>({});
  const selectedCursor = useUpdateState<SelectState>(null);
  const hoveredCursor = useUpdateState<SelectState>(null);

  const [open, updateOpen] = useUpdateState<boolean>(false);
  const toggleOpen = () => updateOpen(!open);

  const fibers = new Map<number, LiveFiber<any>>();
  const [selectedFiber, setSelected] = selectedCursor;
  const ping = usePingTracker(fiber);

  const panes = selectedFiber ? [
    {
      menuItem: 'Props',
      render: () => <Props fiber={selectedFiber} fibers={fibers} />
    },
    {
      menuItem: 'Fiber',
      render: () => <Call fiber={selectedFiber} fibers={fibers} />
    },
  ] : [];

  if (selectedFiber) {
    const inspect = selectedFiber.__inspect;
    if (inspect) {
      const {vertex, fragment} = inspect;
      if (vertex) {
        panes.push({
          menuItem: 'Vertex',
          render: () => <Shader shader={vertex} />
        });
      }
      if (fragment) {
        panes.push({
          menuItem: 'Fragment',
          render: () => <Shader shader={fragment} />
        });
      }
    }
  }

  const Container = selectedFiber ? InspectContainer : InspectContainerCollapsed;

  const tree = (
    <Scrollable onClick={() => setSelected(null)}>
      <Inset>
        <FiberTree
          fiber={fiber}
          fibers={fibers}
          ping={ping}
          expandCursor={expandCursor}
          selectedCursor={selectedCursor}
          hoveredCursor={hoveredCursor}
        />
      </Inset>
    </Scrollable>
  );

  const props = (
    <Scrollable>
      <Inset>
        <Tab menu={TAB_STYLE} panes={panes} />
      </Inset>
    </Scrollable>
  );

  // Avoid text selection on double click
  const onMouseDown = (e: any) => {
    if (e.detail > 1) {
      e.preventDefault();
    }
  };

  return (<>
    {open  ? <Container onMouseDown={onMouseDown} className="ui inverted">
      {selectedFiber ? (
        <SplitRow>
          <RowPanel style={{width: '34%'}}>
            <PanelFull>
              {tree}
            </PanelFull>
          </RowPanel>
          <RowPanel style={{width: '66%'}}>
            <Panel>
              {props}
            </Panel>
          </RowPanel>
        </SplitRow>
      ) : (<>
        <PanelFull>
          {tree}
        </PanelFull>
      </>)}
    </Container> : null}
    <InspectToggle onClick={toggleOpen}>
      <Button>{open ? ICON("close") : ICON("bug_report")}</Button>
    </InspectToggle>
  </>);
}

// Track update pings to show highlights in tree
type Timer = ReturnType<typeof setTimeout>;
const usePingTracker = (fiber: LiveFiber<any>) => {
  const [ping, setPing] = useState<PingState>({});

  const [ref] = useState({ ping });
  ref.ping = ping;

  useEffect(() => {
    let uTimer: Timer | null = null;
    let rTimer: Timer | null = null;

    let update: Record<string, number> = {};
    let reset: Record<string, number> = {};

    const flush = () => {
      const u = update;
      uTimer = null;
      update = {};
      setPing((s) => ({...s, ...u}));

      for (let k in u) reset[k] = 0;
      if (!rTimer) rTimer = setTimeout(() => {
        const r = reset;
        rTimer = null;
        reset = {};
        setPing((s) => ({...s, ...r}))
      }, 500);
    }

    if (!fiber.host) return;
    
    fiber.host.__ping = (fiber: LiveFiber<any>) => {
      reset[fiber.id] = update[fiber.id] = ((ref.ping[fiber.id] || 0) % 256) + 1;      
      if (!uTimer) uTimer = setTimeout(flush, 0);
    };
    return () => {
      if (fiber.host) fiber.host.__ping = () => {};
    };
  }, [ref]);

  return ping;
}
