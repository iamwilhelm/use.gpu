import { LiveComponent, LiveElement } from '@use-gpu/live/types';
import { yeet, useAsync, useMemo, useOne } from '@use-gpu/live';

type FetchAPIOptions = Parameters<typeof fetch>[1];

type FetchProps<T> = {
  url?: string,
  request?: Request,
  options?: FetchAPIOptions,
  version?: number,

  type?: 'buffer',
  loading?: T,
  fallback?: T,

  render?: (t: T) => LiveElement<any>,
};

export const Fetch: LiveComponent<FetchProps<any>> = (props: FetchProps<any>) => {
  const {url, request, options, version, type, loading, fallback, render} = props;

  const run = useMemo(() => async () => {
    try {
      const response = await fetch(url ?? request, options);
      if (type === 'buffer') return response.arrayBuffer();
      return response;
    } catch (e) {
      console.error(e);
      return fallback;
    }
  }, [url, request, JSON.stringify(options), type, version]);

  const resolved = useAsync(run, run);
  const result = resolved !== undefined ? resolved : loading;

  return result !== undefined ? (render ? render(result) : yeet(result)) : null;
};


