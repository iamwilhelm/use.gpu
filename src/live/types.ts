export type LiveContext = {
  getState: <T>(index: number) => T | undefined,
  setState: <T>(index: number, value: T) => void,
};

export type Live<F extends Function> = (context: LiveContext) => F;