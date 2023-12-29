import {
  makeUseTrait,
  makeParseTrait,
  optional,
  trait,
} from '@use-gpu/traits/live';
import {
  parseNumber,
  parseInteger,
  parseColor,
} from '@use-gpu/parse';
import {
  parseAlignmentXY,
  parseAnchor,
  parseAnchorXY,
  parseBaseline,
  parseDimension,
  parseFit,
  parseMargin,
  parseRepeat,
  parseTexture,
} from './parse';

const BoxTrait = trait({
  grow: parseNumber,
  shrink: parseNumber,
  margin: parseMargin,
  inline: optional(parseBaseline),
  flex: optional(parseAnchor),
}, {
  shrink: 1,
});

const ImageTrait = trait({
  texture: optional(parseTexture),
  width: optional(parseDimension),
  height: optional(parseDimension),
  fit: parseFit,
  repeat: parseRepeat,
  align: parseAnchorXY,
});

const ElementTrait = trait({
  width: optional(parseDimension),
  height: optional(parseDimension),
  aspect: optional(parseNumber),

  radius: optional(parseMargin),
  border: optional(parseMargin),
  stroke: optional(parseColor),
  fill: optional(parseColor),

  image: optional(makeParseTrait(ImageTrait)),
  zIndex: parseInteger,
});

export const useBoxTrait     = makeUseTrait(BoxTrait);
export const useElementTrait = makeUseTrait(ElementTrait);
export const useImageTrait   = makeUseTrait(ImageTrait);
