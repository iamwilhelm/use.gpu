export type ArrowFunction = (...args: any[]) => any;

export type Props = Record<string, any>;
export type Parser<A, B> = (t?: A) => B;

export type TraitDefinition = Record<string, Parser<any, any>>;
export type InputTypes<T extends TraitDefinition> = {
  [P in keyof T]?: Parameters<T[P]>[0];
};
export type OutputTypes<T extends TraitDefinition> = {
  [P in keyof T]: ReturnType<T[P]>;
};

export type Trait<A, B> = (input: Partial<A>, output: B) => void;
export type UseTrait<I, O> = (props: Partial<I>) => O;

export type TraitProps<T> = T extends Trait<infer A, any> ? Partial<A> : never;

export type TraitCombinator = {
  <A, B, C, D>(a: Trait<A, B>, b: Trait<C, D>): Trait<A & C, B & D>;
  <A, B, C, D, E, F>(a: Trait<A, B>, b: Trait<C, D>, c: Trait<E, F>): Trait<A & C & E, B & D & F>;
  <A, B, C, D, E, F, G, H>(a: Trait<A, B>, b: Trait<C, D>, c: Trait<E, F>, d: Trait<G, H>): Trait<A & C & E & G, B & D & F & H>;
  <A, B, C, D, E, F, G, H, I, J>(a: Trait<A, B>, b: Trait<C, D>, c: Trait<E, F>, d: Trait<G, H>, e: Trait<I, J>): Trait<A & C & E & G & I, B & D & F & H & J>;
  <A, B, C, D, E, F, G, H, I, J, K, L>(a: Trait<A, B>, b: Trait<C, D>, c: Trait<E, F>, d: Trait<G, H>, e: Trait<I, J>, f: Trait<K, L>): Trait<A & C & E & G & I & K, B & D & F & H & J & L>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N>(a: Trait<A, B>, b: Trait<C, D>, c: Trait<E, F>, d: Trait<G, H>, e: Trait<I, J>, f: Trait<K, L>, g: Trait<M, N>): Trait<A & C & E & G & I & K & M, B & D & F & H & J & L & N>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(a: Trait<A, B>, b: Trait<C, D>, c: Trait<E, F>, d: Trait<G, H>, e: Trait<I, J>, f: Trait<K, L>, g: Trait<M, N>, h: Trait<O, P>): Trait<A & C & E & G & I & K & M & O, B & D & F & H & J & L & N & P>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>(a: Trait<A, B>, b: Trait<C, D>, c: Trait<E, F>, d: Trait<G, H>, e: Trait<I, J>, f: Trait<K, L>, g: Trait<M, N>, h: Trait<O, P>, i: Trait<Q, R>): Trait<A & C & E & G & I & K & M & O & Q, B & D & F & H & J & L & N & P & R>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T>(a: Trait<A, B>, b: Trait<C, D>, c: Trait<E, F>, d: Trait<G, H>, e: Trait<I, J>, f: Trait<K, L>, g: Trait<M, N>, h: Trait<O, P>, i: Trait<Q, R>, j: Trait<S, T>): Trait<A & C & E & G & I & K & M & O & Q & S, B & D & F & H & J & L & N & P & R & T>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V>(a: Trait<A, B>, b: Trait<C, D>, c: Trait<E, F>, d: Trait<G, H>, e: Trait<I, J>, f: Trait<K, L>, g: Trait<M, N>, h: Trait<O, P>, i: Trait<Q, R>, j: Trait<S, T>, k: Trait<U, V>): Trait<A & C & E & G & I & K & M & O & Q & S & U, B & D & F & H & J & L & N & P & R & T & V>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X>(a: Trait<A, B>, b: Trait<C, D>, c: Trait<E, F>, d: Trait<G, H>, e: Trait<I, J>, f: Trait<K, L>, g: Trait<M, N>, h: Trait<O, P>, i: Trait<Q, R>, j: Trait<S, T>, k: Trait<U, V>, l: Trait<W, X>): Trait<A & C & E & G & I & K & M & O & Q & S & U & W, B & D & F & H & J & L & N & P & R & T & V & X>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z>(a: Trait<A, B>, b: Trait<C, D>, c: Trait<E, F>, d: Trait<G, H>, e: Trait<I, J>, f: Trait<K, L>, g: Trait<M, N>, h: Trait<O, P>, i: Trait<Q, R>, j: Trait<S, T>, k: Trait<U, V>, l: Trait<W, X>, m: Trait<Y, Z>): Trait<A & C & E & G & I & K & M & O & Q & S & U & W & Y, B & D & F & H & J & L & N & P & R & T & V & X & Z>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, _A, _B>(a: Trait<A, B>, b: Trait<C, D>, c: Trait<E, F>, d: Trait<G, H>, e: Trait<I, J>, f: Trait<K, L>, g: Trait<M, N>, h: Trait<O, P>, i: Trait<Q, R>, j: Trait<S, T>, k: Trait<U, V>, l: Trait<W, X>, m: Trait<Y, Z>, n: Trait<_A, _B>): Trait<A & C & E & G & I & K & M & O & Q & S & U & W & Y & _A, B & D & F & H & J & L & N & P & R & T & V & X & Z & _B>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, _A, _B, _C, _D>(a: Trait<A, B>, b: Trait<C, D>, c: Trait<E, F>, d: Trait<G, H>, e: Trait<I, J>, f: Trait<K, L>, g: Trait<M, N>, h: Trait<O, P>, i: Trait<Q, R>, j: Trait<S, T>, k: Trait<U, V>, l: Trait<W, X>, m: Trait<Y, Z>, n: Trait<_A, _B>, o: Trait<_C, _D>): Trait<A & C & E & G & I & K & M & O & Q & S & U & W & Y & _A & _C, B & D & F & H & J & L & N & P & R & T & V & X & Z & _B & _D>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, _A, _B, _C, _D, _E, _F>(a: Trait<A, B>, b: Trait<C, D>, c: Trait<E, F>, d: Trait<G, H>, e: Trait<I, J>, f: Trait<K, L>, g: Trait<M, N>, h: Trait<O, P>, i: Trait<Q, R>, j: Trait<S, T>, k: Trait<U, V>, l: Trait<W, X>, m: Trait<Y, Z>, n: Trait<_A, _B>, o: Trait<_C, _D>, p: Trait<_E, _F>): Trait<A & C & E & G & I & K & M & O & Q & S & U & W & Y & _A & _C & _E, B & D & F & H & J & L & N & P & R & T & V & X & Z & _B & _D & _F>;
};
