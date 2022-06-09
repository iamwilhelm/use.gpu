import { LC, LiveElement } from '@use-gpu/live/types';
import { GLTF } from './types';

import { use, gather, memo, useMemo, useOne } from '@use-gpu/live';
import { GLTFNode } from './gltf-node';

type GLTFModelProps = {
  gltf: GLTF,

  scene?: number,
  node?: number | string,
  nodes?: (number | string)[],
};

const NO_ROOTS: number[] = [];

const toArray = (t?: T | T[] | null) => Array.isArray(t) ? t : t != null ? [t] : [];
const seq = (n: number, start: number = 0, step: number = 1) => Array.from({length: n}).map((_, i) => start + i * step);

export const GLTFModel: LC<GLTFModelProps> = memo((props) => {
  const {
    gltf,
    scene: propScene,
    node: propNode,
    nodes: propNodes,
  } = props;

  return useMemo(() => {
    const {scenes, nodes} = gltf;

    const getNodeIndex = (id: number | string) => {
      if (typeof id === 'number') return id;
      const i = nodes.findIndex(({name}) => name === id);
      return i >= 0 ? i : null;
    };

    let roots = NO_ROOTS;
    if (propNode != null) roots = toArray(getNodeIndex(propNode));
    else if (propNodes != null) root = propNodes.map(node => getNodeIndex(node)).filter(n => n != null);
    else {
      const s = propScene ?? gltf.scene;
      if (s != null) roots = scenes[s]?.nodes ?? NO_ROOTS;
      else roots = seq(nodes.length);
    }

    return Array.from(roots).map(root => use(GLTFNode, {gltf, node: root}));
  }, [gltf, propNode, propScene]);
}, 'GLTFModel');
