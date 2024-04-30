import type { LiveComponent } from '@use-gpu/live';
import type { VectorLike } from '@use-gpu/traits';

import { makeUseTrait, shouldEqual, sameShallow } from '@use-gpu/traits/live';
import { adjustSchema, schemaToArchetype, schemaToAttributes, toCPUDims, getUniformDims } from '@use-gpu/core';
import { yeet, memo, use, useContext, useOne, useMemo } from '@use-gpu/live';
import { formatNumber } from '../util/format';
import { vec4 } from 'gl-matrix';

import { useInspectHoverable, useTransformContext, LABEL_SCHEMA, LayoutContext, LayerReconciler } from '@use-gpu/workbench';

import { LabelTraits } from '../traits';

const {quote} = LayerReconciler;

const useTraits = makeUseTrait(LabelTraits);

export type LabelProps = TraitProps<typeof LabelTraits>;

const toArrayMap = <T>(xs: VectorLike, map: (x: number) => T) => {
  const out = [];
  for (const x of xs) out.push(map(x));
  return out;
};

export const Label: LiveComponent<LabelProps> = memo((props) => {
  const parsed = useTraits(props);
  const {
    position,
    positions,
    color,
    colors,
    size,
    sizes,
    depth,
    depths,
    zIndex,
    zBias,
    zBiases,

    label,
    labels,
    precision = 3,
    formatter,
    values,

    id,
    ids,
    lookup,
    lookups,

    tensor = props.positions?.size,
    formats,

    sources,
    ...flags
  } = parsed;

  const z = (zIndex && zBias == null) ? zIndex : zBias;

  // Label Y flip
  const layout = useContext(LayoutContext);
  const flip = [1, 1];
  if (layout[2] < layout[0]) flip[0] = -1;
  if (layout[3] < layout[1]) flip[1] = -1;

  // Resolve label strings
  const resolvedFormatter = useMemo(() => formatter ?? (x => formatNumber(x, precision)), [formatter, precision]);
  const resolvedLabels = labels != null ? (
    useMemo(() => labels ?? [label], [labels, label])
  ) : (
    useMemo(() => toArrayMap(values, resolvedFormatter), [values, resolvedFormatter])
  );
  const resolvedSources = useMemo(() => ({...sources, labels: resolvedLabels}), [sources, resolvedLabels]);

  const hovered = useInspectHoverable();
  if (hovered) flags.mode = "debug";

  const context = useTransformContext();
  const {transform, nonlinear, matrix: refs} = context;

  const schema = useOne(() => adjustSchema(LABEL_SCHEMA, formats), formats);
  const attributes = schemaToAttributes(schema, parsed);
  const archetype = schemaToArchetype(schema, attributes, flags, refs, sources);

  const dims = toCPUDims(getUniformDims(schema.positions.format));
  const count = positions ? (attributes.positions?.length / dims) || 0 : 1;
  if (Number.isNaN(count)) debugger;
  if (!count || !(position || positions)) return;

  const shapes = {
    label: {
      count,
      archetype,
      attributes,
      flags,
      refs,
      schema,
      sources: resolvedSources,
      transform: nonlinear ?? context,
      zIndex,
    },
  };

  return quote(yeet(shapes));
}, shouldEqual({
  position: sameShallow(),
  color: sameShallow(),
}), 'Label');

/*
  const positions = useContext(DataContext) ?? undefined;
  const values = useContext(ValuesContext);
  const layout = useContext(LayoutContext);

  const flip = [1, 1];
  if (layout[2] < layout[0]) flip[0] = -1;
  if (layout[3] < layout[1]) flip[1] = -1;

  const count = useCallback(() => (positions as any)?.length || 0, [positions]);

  const parsed = useTraits(props);

  const {family, weight, style} = useFontTrait(props);
  const {labels, format, size, depth, expand} = useLabelTrait(props);
  const {placement, offset} = useAnchorTrait(props);

  const color = useColorTrait(props);
  const rop = useROPTrait(props);

  const strings = useMemo(() => {
    if (labels) return labels;
    if (values) {
      let v = values;
      if (!Array.isArray(v)) v = Array.from(v);
      if (format) return v.map(format);
      return v.map(v => formatNumber(v, 3));
    }
    return [];
  }, [labels, values, format])

  return (
    use(LabelLayer, {
      labels: strings,
      family,
      weight,
      style,

      positions,
      placement,
      offset,
      count,
      size,
      depth,
      color,
      expand,
      flip,
      ...rop,
    })
  );
};

*/