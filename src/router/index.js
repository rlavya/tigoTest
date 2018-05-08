// @flow

import { HELPERS } from "./helpers";
import reduce from "lodash/reduce";

const H = HELPERS;
const QUERY_SEPARATOR = "?";

const URL = root => window.location.hash.substr(root.length);

export type RouteDefinition = {
  defaults: Object,
  length: number,
  names: string[],
  route: string,
  test: RegExp
};

export type RouteData = {
  route?: RouteDefinition,
  [string]: any
};
export type RouteStore = {
  [string]: RouteDefinition
};

const extractQueryParams = (
  url: string,
  start: string,
  parts: string[]
): Object => {
  let remainder = url.substr(
    start.length - (parts[parts.length - 1] === QUERY_SEPARATOR ? 1 : 0)
  );
  if (remainder && H.paramsMatcher.test(remainder)) {
    return H.deparam(remainder.slice(1));
  } else {
    return {};
  }
};

const extractNamesDefaultsAndGenerateRegExp = (
  url,
  defaults
): { names: string[], test: RegExp, defaults: Object } => {
  let names = [];
  let res;
  let test = "";
  let lastIndex = (H.matcher.lastIndex = 0);
  let next;
  let matchSlashes = false;

  defaults = { ...defaults };

  // eslint-disable-next-line
  while ((res = H.matcher.exec(url))) {
    names.push(res[1]);
    test += H.removeBackslash(
      url.substring(lastIndex, H.matcher.lastIndex - res[0].length)
    );
    next =
      "\\" +
      (H.removeBackslash(url.substr(H.matcher.lastIndex, 1)) ||
        QUERY_SEPARATOR + (matchSlashes ? "" : "|/"));
    test += "([^" + next + "]" + (defaults[res[1]] ? "*" : "+") + ")";
    lastIndex = H.matcher.lastIndex;
  }

  test += url.substr(lastIndex).replace("\\", "");

  return {
    names: names,
    defaults: defaults,
    test: new RegExp("^" + test + "($|" + H.wrapQuote(QUERY_SEPARATOR) + ")")
  };
};

const generateURLfromRoute = (
  route: RouteDefinition,
  data: { [string]: any }
): string => {
  let cpy = { ...data };
  let res = route.route
    .replace(H.matcher, function(whole, name) {
      delete cpy[name];
      return data[name] === route.defaults[name]
        ? ""
        : encodeURIComponent(data[name]);
    })
    .replace("\\", "");

  for (let name in route.defaults) {
    if (route.defaults.hasOwnProperty(name)) {
      let val = route.defaults[name];
      if (cpy[name] === val) {
        delete cpy[name];
      }
    }
  }

  let after = H.param(cpy);

  return res + (after ? "?" + after : "");
};

export class Router {
  _routes: RouteStore;
  _responders: Function[];
  _store: Object;
  _prevRouteData: RouteData;
  routeData: RouteData;
  root: string;
  stop: Function;

  constructor(store: Object, routes: Object[], responders: Function[]) {
    this._routes = {};
    this._store = store;
    this._responders = responders || [];

    routes.forEach(args => {
      let [route, defaults] = args;
      this.add(route, defaults);
    });

    this.root = "#!";
  }

  start(): void {
    let hashChangedHandler = _ => {
      this._prevRouteData = this.routeData;
      this.setRouteData(URL(this.root));
      this.dispatch();
      this._responders.forEach(r => {
        r(this._store, this.routeData, this._prevRouteData);
      });
    };

    this.stop = () => {
      window.removeEventListener("hashchange", hashChangedHandler);
    };

    window.addEventListener("hashchange", hashChangedHandler);
    hashChangedHandler();
  }

  restartResponders(): void {
    this._responders.forEach(r => {
      r(this._store, this.routeData, this._prevRouteData, true);
    });
  }

  dispatch(): void {
    this._store.dispatch({ type: "ROUTE_CHANGED", payload: this.routeData });
  }

  dataFor(data: Object, merge: boolean): Object {
    if (merge) {
      let routeData = { ...this.routeData };
      delete routeData.route;

      return {
        ...routeData,
        ...data
      };
    }

    return { ...data };
  }

  urlFor(data: Object, merge: boolean): string {
    return this.root + this.param(this.dataFor(data, merge));
  }

  setRouteData(url: string): void {
    this.routeData = this.deparam(url);
  }

  get(attr: string): any {
    let data = this.routeData;
    if (attr) {
      return data[attr];
    }
    return data;
  }

  param(data: Object): string {
    let routeName = data.route;
    let route: RouteDefinition;
    let matches: number;

    delete data.route;

    ({ route, matches } = reduce(
      this._routes,
      (acc, r) => {
        const matchCount = H.matchesData(r, data);
        if (matchCount > acc.matches) {
          return {
            matches: matchCount,
            route: r
          };
        }
        return acc;
      },
      {
        matches: 0,
        route: null
      }
    ));

    if (
      this._routes[routeName] &&
      H.matchesData(this._routes[routeName], data) === matches
    ) {
      route = this._routes[routeName];
    }

    if (route) {
      return generateURLfromRoute(route, data);
    }
    return Object.keys(data).length === 0 ? "" : "?" + H.param(data);
  }

  deparam(url: string): RouteData {
    const route: RouteDefinition = reduce(
      this._routes,
      (acc, r) => {
        let match = r.test.test(url);
        if (match && r.length > acc.length) {
          return r;
        }
        return acc;
      },
      { length: -1 }
    );

    if (route) {
      let parts: string[] = url.match(route.test) || [];
      let start = parts.shift();

      let routeData = {
        ...route.defaults,
        ...extractQueryParams(url, start, parts),
        route
      };

      return reduce(
        parts,
        (acc, part, i) => {
          if (part && part !== QUERY_SEPARATOR) {
            acc[route.names[i]] = decodeURIComponent(part);
          }
          return acc;
        },
        routeData
      );
    }
    if (url.charAt(0) !== QUERY_SEPARATOR) {
      url = QUERY_SEPARATOR + url;
    }
    return H.paramsMatcher.test(url) ? H.deparam(url.slice(1)) : {};
  }

  add(url: string, defaults: Object): void {
    if (url.indexOf("/") === 0) {
      url = url.substr(1);
    }

    let route: RouteDefinition = {
      length: url.split("/").length,
      route: url,
      ...extractNamesDefaultsAndGenerateRegExp(url, defaults || {})
    };

    this._routes[url] = route;
  }

  clear(): void {
    this._routes = {};
  }
}

let __ROUTER_CACHE__ = null;

export function startRouter(
  store: Object,
  routes: Object[],
  responders: Function[]
) {
  if (__ROUTER_CACHE__) {
    __ROUTER_CACHE__.stop();
  }

  __ROUTER_CACHE__ = new Router(store, routes, responders);
  __ROUTER_CACHE__.start();

  return __ROUTER_CACHE__;
}

export function urlFor(data: Object, merge: boolean) {
  if (!__ROUTER_CACHE__) {
    throw new Error("Router must be started!");
  }

  return __ROUTER_CACHE__.urlFor(data, merge);
}

export function restartResponders() {
  if (!__ROUTER_CACHE__) {
    throw new Error("Router must be started!");
  }

  return __ROUTER_CACHE__.restartResponders();
}

export function redirectTo(data: Object, merge: boolean) {
  window.location.hash = urlFor(data, merge);
}
