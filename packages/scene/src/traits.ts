import { optional, trait, makeUseTrait } from '@use-gpu/traits/live';
import {
  parseBoolean,
  parsePosition,
  parseRotation,
  parseQuaternion,
  parseScale,
  parseMatrix,
} from '@use-gpu/parse';

export const ObjectTrait = trait({
  position:   optional(parsePosition),
  scale:      optional(parseScale),
  quaternion: optional(parseQuaternion),
  rotation:   optional(parseRotation),
  matrix:     optional(parseMatrix),
  visible:    parseBoolean,
}, {
  visible: true,
});

export const useObjectTrait = makeUseTrait(ObjectTrait);