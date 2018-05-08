// @flow

import type { RouteData } from "../router";
import deepEqual from "deep-equal";

export class Responder {
  params: any;
  store: Object;
  routeData: RouteData;
  context: any;

  static params(routeData: RouteData): any {
    return routeData;
  }

  constructor(params: any, store: Object, routeData: RouteData, context: any) {
    this.params = params;
    this.store = store;
    this.routeData = routeData;
    this.context = context;
  }

  start(): void {}

  restart(): void {}

  stop(): void {}

  routeChanged(prevRouteData: RouteData, routeData: RouteData): void {}
}

export function managedResponder(ResponderClass: Function, context: any) {
  let currentInstance = null;
  let manager = (
    store: Object,
    routeData: RouteData,
    prevRouteData: RouteData,
    restart: boolean = false
  ) => {
    const newParams = ResponderClass.params(routeData);
    const hasNewParams = !(
      newParams === null || typeof newParams === "undefined"
    );

    if (currentInstance && restart) {
      currentInstance.restart();
      return;
    }

    if (!currentInstance && hasNewParams) {
      currentInstance = new ResponderClass(
        newParams,
        store,
        routeData,
        context
      );
      currentInstance.start();
      return;
    }

    if (currentInstance && !hasNewParams) {
      currentInstance.stop();
      currentInstance = null;
      return;
    }

    if (
      currentInstance &&
      hasNewParams &&
      !deepEqual(currentInstance.params, newParams)
    ) {
      currentInstance.stop();
      currentInstance = new ResponderClass(
        newParams,
        store,
        routeData,
        context
      );
      currentInstance.start();
      return;
    }

    if (
      currentInstance &&
      hasNewParams &&
      deepEqual(currentInstance.params, newParams)
    ) {
      currentInstance.routeChanged(prevRouteData || {}, routeData);
      return;
    }
  };

  manager.getCurrentInstance = () => currentInstance;

  return manager;
}
