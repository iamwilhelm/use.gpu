import type { LiveComponent, LiveNode, PropsWithChildren } from '@use-gpu/live';
import { makeContext, memo, provide, use, useContext, useMemo, useOne, useResource, useState } from '@use-gpu/live';
import { Routes } from './routes';
import { QueryParams, Route, RouterState, RouterLink, RouterAPI } from './types';

export const RouterContext = makeContext<RouterAPI>(undefined, 'RouterContext');

export type RouterProps = {
  source?: any,
  routes?: Record<string, Route>,
  base?: string, 
};

export const Router: LiveComponent<RouterProps> = memo(({
  source,
  routes,
  base,
  children,
}: PropsWithChildren<RouterProps>) => {

  const src = useOne(() => source ?? makeBrowserHistory(base), source);

  const [state, setState] = useState<RouterState>({
    path: src.path(),
    query: src.query(),
  });

  useResource((dispose) => {
    src.resource(() =>
      setState((s) => ({
        ...s,
        path: src.path(),
        query: src.query(),
      }))
    );
    dispose(() => src.resource(() => {}));
  }, [src]);

  const api = useMemo(() => ({
    route: state,
    back: src.back,
    forward: src.forward,
    go: src.go,
    push: src.push,
    replace: src.replace,
    linkTo: src.linkTo,
  }), [state, src]);

  if (routes) children = use(Routes, { routes });

  return provide(RouterContext, api, children);
}, 'Router');

export const useRouterContext = () => useContext(RouterContext);

export const makeRelativeURL = (base: string, path: string, query?: QueryParams | string) => {
  path = base + path.replace(/^\//, '');
  if (typeof query === 'string') {
    if (query.length) return path + '?' + query.replace(/^\?/, '');
    return path;
  }
  if (query) {
    let i = 0;
    for (let k in query) {
      const vs = query[k];
      path = path + (i++ ? '?' : '&') + encodeURIComponent(k) + '=' + encodeURIComponent(vs);
    }
  }
  return path;
};

export const makeBrowserHistory = (base: string = '') => {
  const {history, location} = window;

  // Normalize to `/foo/bar/`
  base = base.replace(/^\/|\/$/g, '');
  base = '/' + base + base.length ? '/' : '';

  // Initialize from #!/ in URL for static SPA.
  if (location.hash.match(/^#!\//)) {
    const [path, query] = location.hash.slice(2).split('?');
    history.replaceState({path, query}, document.title, makeRelativeURL(base, path, query));
  }

  const notifyPopState = () => {
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  let self = {
    resource: (callback: any) => {
      const handlePopState = (e?: PopStateEvent) => callback(e);
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    },

    path: () => {
      if (location.pathname.indexOf(base) === 0) return '/' + location.pathname.slice(base.length);
      return location.pathname;
    },
    
    query: () => {
      const out = {} as Record<string, string>;
      const {search} = location;
      if (search.length) {
        const params = new URLSearchParams(search);
        for (const k of (params as any).keys()) out[k] = params.get(k)!;
      }
      return out;
    },

    back: () => history.back(),
    forward: () => history.forward(),
    go: (n: number) => history.go(n),
    push: (path: string, query?: QueryParams | string) => {
      history.pushState({path, query}, document.title, makeRelativeURL(base, path, query));
      notifyPopState();
    },
    replace: (path: string, query?: QueryParams | string) => {
      history.replaceState({path, query}, document.title, makeRelativeURL(base, path, query));
      notifyPopState();
    },

    linkTo: (path: string, query?: QueryParams | string) => {
      debugger;
      const href = makeRelativeURL(base, path, query);
      const onClick = (e: any) => {
        if (e?.ctrlKey || e?.button !== 0) return;

        e?.preventDefault();
        self.push(path, query);
      }
      return {href, onClick};
    },
  };
  
  return self;
};
