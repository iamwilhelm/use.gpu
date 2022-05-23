import { LiveFiber } from '@use-gpu/live/types';
import { formatNode, formatValue, renderFibers, YEET } from '@use-gpu/live';
import { useUpdateState } from './cursor';
import { ExpandState, SelectState, HoverState, PingState } from './types';

import React, { memo, useLayoutEffect, useEffect, useMemo, useState } from 'react';
import { Node } from './node';
import { FiberTree } from './fiber';
import { Props } from './panels/props';
import { Call } from './panels/call';
import { Shader } from './panels/shader';
import { Layout } from './panels/layout';
import {
  InspectContainer, InspectToggle, Button, TreeControls,
  SplitRow, RowPanel, Panel, PanelFull, PanelScrollable, Inset, InsetColumnFull,
} from './layout';
import { PingProvider } from './ping';
import { DetailSlider } from './detail';

import * as Tabs from '@radix-ui/react-tabs';

const ICON = (s: string) => <span className="m-icon">{s}</span>

type InspectFiber = Record<string, any>;
type InspectMap = WeakMap<LiveFiber<any>, InspectFiber>;

type InspectProps = {
  fiber: LiveFiber<any>,
}

export const Inspect: React.FC<InspectProps> = ({fiber}) => {
  const expandCursor = useUpdateState<ExpandState>({});
  const selectedCursor = useUpdateState<SelectState>(null);
  const depthCursor = useUpdateState<number>(10);
  const hoveredCursor = useUpdateState<HoverState>(() => ({ fiber: null, by: null, deps: [], precs: [], root: null, depth: 0 }));

  const [open, updateOpen] = useUpdateState<boolean>(false);
  const toggleOpen = () => updateOpen(!open);

  const fibers = new Map<number, LiveFiber<any>>();
  const [selectedFiber, setSelected] = selectedCursor;
  const [depthLimit, setDepthLimit] = depthCursor;
  const [{fiber: hoveredFiber}, updateHovered] = hoveredCursor;

  useLayoutEffect(() => {
    const setHovered = hoveredFiber?.__inspect?.setHovered;
    if (!setHovered) return;
    
    setHovered(true);
    return () => setHovered(false);
  }, [hoveredFiber])
	
	const {host} = fiber;
	useLayoutEffect(() => {
		host.__highlight = (id: number | null, active?: boolean) => {
			const fiber = fibers.get(id);
			if (fiber) {
				if (active) return setSelected({ $set: fiber });

		    const root = fiber.yeeted && fiber.type === YEET ? fiber.yeeted.root : null;
				updateHovered({ $set: {
		      fiber,
		      by: fibers.get(fiber.by) ?? null,
		      deps: host ? Array.from(host.traceDown(fiber)) : [],
		      precs: host ? Array.from(host.traceUp(fiber)) : [],
		      root,
		      depth: 0,
		    } });
			}
			else {
				updateHovered({ $set: {
		      fiber: null,
		      by: null,
		      deps: [],
		      precs: [],
		      root: null,
		      depth: 0,
		    } });
			}
		};

		return () => host.__highlight = null;
	}, [host, fibers]);

  let vertexTab: React.ReactNode;
  let fragmentTab: React.ReactNode;
	let layoutTab: React.ReactNode;
  if (selectedFiber) {
    const inspect = selectedFiber.__inspect;
    if (inspect) {
      const {vertex, fragment, layout} = inspect;
      if (vertex) {
        vertexTab = <Shader type="vertex" fiber={selectedFiber} />;
      }
      if (fragment) {
        fragmentTab = <Shader type="fragment" fiber={selectedFiber} />;
      }
      if (layout) {
        layoutTab = <Layout fiber={selectedFiber} />;
      }
    }
  }

  const tree = (
    <InsetColumnFull>
      <TreeControls>
        <DetailSlider value={depthLimit} onChange={setDepthLimit} />
      </TreeControls>
      <FiberTree
        fiber={fiber}
        fibers={fibers}
        depthLimit={depthLimit}
        expandCursor={expandCursor}
        selectedCursor={selectedCursor}
        hoveredCursor={hoveredCursor}
      />
    </InsetColumnFull>
  );

  const props = (
    <Inset>
      <Tabs.Root defaultValue="props">
        <Tabs.List>
          <Tabs.Trigger value="props">Props</Tabs.Trigger>
          <Tabs.Trigger value="fiber">Fiber</Tabs.Trigger>
          {vertexTab ? <Tabs.Trigger value="vertex">Vertex</Tabs.Trigger> : null}
          {fragmentTab ? <Tabs.Trigger value="fragment">Fragment</Tabs.Trigger> : null}
          {layoutTab ? <Tabs.Trigger value="layout">Layout</Tabs.Trigger> : null}
        </Tabs.List>
        <Tabs.Content value="props">{selectedFiber ? <Props fiber={selectedFiber} fibers={fibers} /> : null}</Tabs.Content>
        <Tabs.Content value="fiber">{selectedFiber ? <Call fiber={selectedFiber} fibers={fibers} /> : null}</Tabs.Content>
        {vertexTab ? <Tabs.Content value="vertex">{vertexTab}</Tabs.Content> : null }
        {fragmentTab ? <Tabs.Content value="fragment">{fragmentTab}</Tabs.Content> : null }
        {layoutTab ? <Tabs.Content value="layout">{layoutTab}</Tabs.Content> : null }
      </Tabs.Root>
    </Inset>
  );

  // Avoid text selection on double click
  const onMouseDown = (e: any) => {
    if (e.detail > 1) {
      e.preventDefault();
    }
  };

  return (<>
    {open ? (
      <PingProvider fiber={fiber}>  
        <InspectContainer onMouseDown={onMouseDown} className="ui inverted">
          <SplitRow>
            <RowPanel style={{width: '34%'}}>
              <PanelFull onClick={() => setSelected(null)}>
                {tree}
              </PanelFull>
            </RowPanel>
            {selectedFiber ? (
              <RowPanel style={{width: '66%'}}>
                <PanelScrollable>
                  {props}
                </PanelScrollable>
              </RowPanel>
            ) : null}
          </SplitRow>
        </InspectContainer>
      </PingProvider>
    ) : null}
    <InspectToggle onClick={toggleOpen}>
      <Button>{open ? ICON("close") : ICON("bug_report")}</Button>
    </InspectToggle>
  </>);
}
