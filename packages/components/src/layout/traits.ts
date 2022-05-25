import { makeUseTrait, makeParseTrait } from '../traits/useTrait';
import {
  optional,
  parseFloat,
  parseColor,
} from '../traits/parse';
import {
  parseAlignmentXY,
  parseAnchor,
  parseAnchorXY,
  parseDimension,
  parseFit,
  parseMargin,
  parseRepeat,
  parseTexture,
} from './parse';
import {
  BoxTrait,
  ElementTrait,
  ImageTrait,
} from './types';

const BOX_TRAIT = {
  grow: parseFloat,
  shrink: parseFloat,
  margin: parseMargin,
};

const BOX_DEFAULTS = {
};

const IMAGE_TRAIT = {
  width: optional(parseDimension),
  height: optional(parseDimension),
  texture: optional(parseTexture),
  fit: parseFit,
  repeat: parseRepeat,
  align: parseAnchorXY,
};

const IMAGE_DEFAULTS = {};

const ELEMENT_TRAIT = {
  width: optional(parseDimension),
  height: optional(parseDimension),
  
  radius: optional(parseMargin),
  border: optional(parseMargin),
  stroke: optional(parseColor),
  fill: optional(parseColor),

  image: optional(makeParseTrait(IMAGE_TRAIT, IMAGE_DEFAULTS)),
};

const ELEMENT_DEFAULTS = {};

export const useBoxTrait     = makeUseTrait<BoxTrait>(BOX_TRAIT, BOX_DEFAULTS);
export const useElementTrait = makeUseTrait<ElementTrait>(ELEMENT_TRAIT, ELEMENT_DEFAULTS);
export const useImageTrait   = makeUseTrait<ImageTrait>(IMAGE_TRAIT, IMAGE_DEFAULTS);
