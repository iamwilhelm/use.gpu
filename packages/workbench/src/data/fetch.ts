import type { LiveComponent, LiveElement } from '@use-gpu/live';
import { yeet, suspend, useAwait, useMemo, useOne } from '@use-gpu/live';
import { useSuspenseContext } from '../providers/suspense-provider';
import { getRenderFunc } from '../hooks/useRenderProp';

const SLOW = 0;

export type FetchAPIOptions = Parameters<typeof fetch>[1];

export type FetchProps<T> = {
  url?: string,
  request?: Request,
  options?: FetchAPIOptions,
  version?: number,

  type?: keyof Response,
  loading?: T,
  fallback?: T,
  slow?: number,

  then?: (t: any) => T,

  render?: (t: T) => LiveElement,
  children?: (t: T) => Livelement,
};

export const Fetch: LiveComponent<FetchProps<any>> = (props: FetchProps<any>) => {
  const {
    url,
    request,
    options,
    version,
    type,
    loading,
    fallback,
    then,
    slow = SLOW,
  } = props;

  const suspense = useSuspenseContext();

  const run = useMemo(() => {
    const f = async () => {
      const response = await fetch((url ?? request)!, options);
      if (type != null && typeof response[type] === 'function') return (response[type] as any)();
      return response;
    };

    let go = (url ?? request) ? (slow ? () => delay(f(), slow) : f) : async () => null;
    return then ? async () => go().then(then) : go;
  }, [url, request, JSON.stringify(options), type, then, version]);

  const [resolved, error] = useAwait(run, [run]);
  useOne(() => error && console.warn(error), error);

  const result = resolved !== undefined ? resolved : (error !== undefined ? fallback ?? loading : loading);

  const render = getRenderFunc(props);
  return result !== undefined ? (render ? render(result) : yeet(result)) : (suspense ? suspend() : null);
};

const delay = <T>(promise: Promise<T>, time: number = 0) =>
  promise.then((value: T) =>
    new Promise((resolve) =>
      setTimeout(() => resolve(value), time)
    )
  )

