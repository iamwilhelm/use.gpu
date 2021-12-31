import { LiveFiber, LiveComponent, LiveElement, Task } from '@use-gpu/live/types';
import { memo, makeContext, use, useContext, useOne, useMemo, provide } from '@use-gpu/live';
import { RouterContext, Route } from './router';

export type RouteState = {
  element: LiveElement<any>,
};

export const RouteContext = makeContext<RouterState>(null, 'RouteContext');

type Matcher = {
  regexp: RegExp,
  element: LiveElement<any>,
  base: string,
  routes?: Record<string, Route>,
};

export type RoutesProps = {
  base?: string,
  routes?: Record<string, Route>,
};

const NO_PATH = '';

const toArray = <T,>(x: T | T[]): T[] => Array.isArray(x) ? x : x ? [x] : []; 

const joinPath = (a: string, b: string) => {
  if (b[0] === '/') return b;
  if (a[a.length - 1] === '/') return a + b;
  return a + '/' + b;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const Outlet: LiveComponent<any> = (fiber) => () => {
  const context = useContext(RouteContext);
  return context.routes ? use(Routes)(context) : null;
}

const USE_OUTLET = use(Outlet)();

export const Routes: LiveComponent<RoutesProps> = memo((fiber) => (props) => {
  const {
    routes,
    base = NO_PATH,
  } = props;

  const {route: routeState} = useContext(RouterContext);
  const {path: currentPath} = routeState;

  const matchers = useMemo(() => {
    const matchers = [] as Matcher[];

    for (const path in routes) {
      const {element, routes: rs} = routes[path];

      const fullPath = joinPath(base, path);
      const isFolder = path[path.length - 1] === '/';
      const regexp = new RegExp('^' + escapeRegExp(fullPath) + (isFolder ? '' : '(/|$)'));

      matchers.push({
        regexp,
        element,
        base: fullPath,
        routes: rs,
      });
    }

    return matchers;
  }, [base, routes]);

  const [context, element] = useMemo(() => {
    let sub = base;
    let routes = null as Record<string, Route> | null;
    let element = null as LiveElement<any>;

    for (const matcher of matchers) {
      if (matcher.regexp.test(currentPath)) {
        if (matcher.routes) routes = matcher.routes;
        if (matcher.element) element = matcher.element;
        if (matcher.base) sub = matcher.base;
        break;
      }
    }

    return [{routes, base: sub}, element];
  }, [base, matchers, currentPath]);

  if (element) return provide(RouteContext, context, element);
  if (context.routes) return use(Routes)(context);
  return null;
}, 'Routes');
