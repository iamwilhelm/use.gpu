import { VectorLike } from '@use-gpu/core';

export type Ease = 'cosine' | 'linear' | 'zero' | 'auto' | 'bezier';

export type Tracks = Record<string, Keyframe<any>[]>;

export type Keyframe<T = number | VectorLike> = 
| [
  T,
]
| [
  T,
  Ease,
]
| [
  T,
  Ease,
  [number, number] | null | undefined,
  [number, number] | null | undefined,
]
| [
  T,
  Ease,
  [number, number] | null | undefined,
  [number, number] | null | undefined,
  T | null | undefined,
  T | null | undefined,
];
