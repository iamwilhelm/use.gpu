export const formatNode = <T>(node: DeferredCall<T>) => {
  const name = node.f?.name || 'Node';
  const args = node.args?.map(x => '' + x);
  if (args?.length) args.unshift('');
  return `<${name}${args ? args.join(' ') : ''}>`;
}

