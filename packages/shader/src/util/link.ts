import { ParsedModule } from '../types';

// Generate a new namespace
export const reserveNamespace = (
  module: ParsedModule,
  namespaces: Map<string, string>,
  force?: string,
): string => {
  const {name, table: {hash}} = module;
  let namespace = force;
  let n = 2;

  if (force == null) {
    namespace = '_' + ('00' + namespaces.size.toString(36)).slice(-2) + '_';
  }

  namespaces.set(name, namespace!);

  return namespace!;
}

// Get depth for each item in a graph, so its dependencies resolve correctly
export const getGraphOrder = (
  graph: Map<string, string[]>,
  name: string,
  depth: number = 0,
) => {
  const queue = [{name, depth: 0, path: [name]}];
  const depths = new Map<string, number>();

  while (queue.length) {
    const {name, depth, path} = queue.shift()!;
    depths.set(name, depth);

    const module = graph.get(name);
    if (!module) continue;

    const deps = module.map(name => {
      const i = path.indexOf(name);
      if (i >= 0) throw new Error("Cycle detected in module dependency graph: " + path.slice(i));
      return {name, depth: depth + 1, path: [...path, name]};
    });

    queue.push(...deps);
  }
  return depths;
}
