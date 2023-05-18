import type { LiveFiber } from '@use-gpu/live';
import type { ExpandState, SelectState, HoverState, OptionState, PingState, InspectAddIns } from './types';

import { formatNode, formatValue, YEET } from '@use-gpu/live';
import { useUpdateState, useRefineCursor, $apply } from '@use-gpu/state';

import React, { memo, useCallback, useLayoutEffect, useEffect, useMemo, useState, SetStateAction } from 'react';

import { makeUseLocalState } from '../hooks/useLocalState';
import { AddInProvider } from '../providers/add-in-provider';
import { PingProvider } from '../providers/ping-provider';

import { Node } from './node';
import { FiberTree } from './fiber';
import { Options } from './options';
import { Panels } from './panels';
import { IconItem, SVGInspect, SVGPickElement, SVGClose } from './svg';
import {
  InspectContainer, InspectToggle, Button, SmallButton, TreeControls, TreeView, Spacer, Grow,
  SplitRow, RowPanel, Panel, PanelFull, PanelAbsolute, PanelScrollable, Inset, InsetColumnFull,
} from './layout';

const getOptionsKey = (id: string, sub?: string = 'root') => `liveInspect[${sub}][${id}]`;

type InspectFiber = Record<string, any>;
type InspectMap = WeakMap<LiveFiber<any>, InspectFiber>;

type InspectProps = {
  fiber: LiveFiber<any>,
  sub?: string,
  addIns: InspectAddIns,
  onInspect?: (b: boolean) => void,
}

export const Inspect: React.FC<InspectProps> = ({
  fiber,
  sub,
  addIns,
  onInspect,
}) => {
  const expandCursor = useUpdateState<ExpandState>({});
  const selectedCursor = useUpdateState<SelectState>(null);
  const optionCursor = useUpdateState<OptionState>(
    {
      open: false,
      depth: 10,
      counts: false,
      fullSize: false,
      builtins: false,
      highlight: true,
      inspect: false,
    },
    makeUseLocalState(getOptionsKey('state', sub))
  );
  const hoveredCursor = useUpdateState<HoverState>(() => ({
    fiber: null, by: null, deps: [], precs: [], root: null, depth: 0,
  }));
  
  const useOption = useRefineCursor(optionCursor);

  const fibers = new Map<number, LiveFiber<any>>();

  const [selectedFiber, setSelected] = selectedCursor;
  const [depthLimit] = useOption<number>('depth');
  const [runCounts] = useOption<boolean>('counts');
  const [fullSize] = useOption<boolean>('fullSize');
  const [builtins] = useOption<boolean>('builtins');
  const [highlight] = useOption<boolean>('highlight');
  const [inspect, updateInspect] = useOption<boolean>('inspect');
  const [{fiber: hoveredFiber}, updateHovered] = hoveredCursor;

  const [open, updateOpen] = useOption<number>('open');
  const toggleOpen = () => updateOpen(!open);
  const toggleInspect = useCallback(() => {
    console.log('toggleInspect')
    updateInspect($apply(s => {
      onInspect && onInspect(!s);
      return !s;
    }));
  }, [onInspect]);

  useLayoutEffect(() => {
    const el = document.querySelector('#use-gpu .canvas');
    if (!el || !open) return;
    
    (el as any).style.left = '34%';
    return () => {
      (el as any).style.left = '0';
    };
  }, [open]);

  useLayoutEffect(() => {
    const setHovered = hoveredFiber?.__inspect?.setHovered;
    if (!setHovered || !highlight) return;
    
    setHovered(true);
    return () => setHovered(false);
  }, [hoveredFiber, highlight])
  
  const {host} = fiber;
  useLayoutEffect(() => {
    if (!host) return;

    host.__highlight = (id: number | null, active?: boolean) => {
      const fiber = fibers.get(id ?? 0);
      if (fiber) {
        if (active) {
          toggleInspect();
          return setSelected({ $set: fiber });
        }

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

    return () => { host.__highlight = () => {}; }
  }, [host, fibers]);

  const tree = (
    <InsetColumnFull>
      <TreeControls>
        <Options cursor={optionCursor} toggleInspect={toggleInspect} />
      </TreeControls>
      <TreeView>
        <FiberTree
          fiber={fiber}
          fibers={fibers}
          depthLimit={depthLimit}
          runCounts={runCounts}
          builtins={builtins}
          highlight={highlight}
          expandCursor={expandCursor}
          selectedCursor={selectedCursor}
          hoveredCursor={hoveredCursor}
        />
      </TreeView>
    </InsetColumnFull>
  );

  // Avoid text selection on double click
  const onMouseDown = (e: any) => {
    if (e.detail > 1) {
      e.preventDefault();
    }
  };

  return (<div className="LiveInspect">
    {open ? (
      <PingProvider fiber={fiber}>
        <AddInProvider addIns={addIns}>
          <InspectContainer onMouseDown={onMouseDown} className="ui inverted">
            <div style={fullSize
                ? {display: 'flex', flexDirection: 'column', width: '100%', minHeight: 0, height: '100%', maxHeight: '100%', flexGrow: 1}
                : {display: 'flex', height: '100%'}}>
              <RowPanel style={fullSize ? {position: 'relative', flexGrow: 1, minHeight: 0} : {position: 'relative', width: '34%'}}>
                <PanelAbsolute onClick={() => setSelected(null)}>
                  {tree}
                </PanelAbsolute>
              </RowPanel>
              {selectedFiber ? (
                <RowPanel style={fullSize ? {position: 'relative', maxHeight: '30%', zIndex: 10, flexShrink: 0, background: '#000'} : {width: '66%'}}>
                  <PanelScrollable>
                    <Panels fiber={selectedFiber} fibers={fibers} />
                  </PanelScrollable>
                </RowPanel>
              ) : null}
            </div>
          </InspectContainer>
        </AddInProvider>
      </PingProvider>
    ) : null}
    <InspectToggle onClick={toggleOpen}>
      <Button style={{width: 58, height: 37}}>{open
        ? <IconItem height={20} top={-2}><SVGClose size={20} /></IconItem>
        : <IconItem height={20} top={-4}><SVGInspect size={24} /></IconItem>
      }</Button>
    </InspectToggle>
  </div>);
}

