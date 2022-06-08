import { LC, LiveElement } from '@use-gpu/live/types';
import { GLTF } from './types';

import { use, gather, useMemo, useOne } from '@use-gpu/live';
import { GLTFNode } from './gltf-node';

type GLTFModelProps = {
  gltf: GLTF,

  scene?: number,
  node?: number | string,
  nodes?: (number | string)[],
};

const toArray = (t?: T | T[] | null) => Array.isArray(t) ? t : t != null ? [t] : [];
const seq = (n: number, start: number = 0, step: number = 1) => Array.from({length: n}).map((_, i) => start + i * step);

export const GLTFModel: LC<GLTFModelProps> = (props) => {
  const {
    gltf,
    scene: propScene,
    node: propNode,
    nodes: propNodes,
  } = props;

  const roots = useMemo(() => {
    const {scenes, nodes} = gltf;

    const getNodeIndex = (id: number | string) => {
      if (typeof id === 'number') return id;
      const i = nodes.findIndex(({name}) => name === id);
      return i >= 0 ? i : null;
    };

    let roots;
    if (propNode != null) return toArray(getNodeIndex(propNode));
    if (propNodes != null) return propNodes.map(node => getNodeIndex(node)).filter(n => n != null);

    const s = propScene ?? gltf.scene;
    if (s != null) return scenes[s]?.nodes ?? [];

    return seq(nodes.length);
  }, [gltf, propNode, propScene]);

  return useOne(() => Array.from(roots).map(root => use(GLTFNode, {gltf, node: root})), roots);
};
