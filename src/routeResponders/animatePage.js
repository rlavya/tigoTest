// @flow
import type { RouteData } from "../router";
import type { Page } from "../siteTree";

import { Responder } from "../util/routeResponder";
import { siteTree } from "../siteTree";

const isNextPageChild = (page: Page, nextPage: Page) => {
  let children = page.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (child === nextPage) {
        return true;
      }
      if (isNextPageChild(child, nextPage)) {
        return true;
      }
    }
  }

  return false;
};

const animatePageAction = (prev, next, direction) => {
  return {
    type: "ANIMATE_PAGE",
    payload: {
      prev,
      next,
      direction
    }
  };
};

export const clearAnimatePageAction = () => {
  return { type: "CLEAR_ANIMATE_PAGE" };
};

export default class AnimatePage extends Responder {
  static params(routeData: any) {
    return true;
  }

  routeChanged(prevRouteData: RouteData, nextRouteData: RouteData) {
    let prevPage: string = prevRouteData.page;
    let nextPage: string = nextRouteData.page;
    let prevPageData: Page = siteTree[prevPage];
    let nextPageData: Page = siteTree[nextPage];

    if (prevPage === nextPage) {
      return;
    }

    if (prevPageData && nextPageData) {
      let isChild = isNextPageChild(prevPageData, nextPageData);
      this.store.dispatch(
        animatePageAction(
          prevRouteData,
          nextRouteData,
          isChild ? "left" : "right"
        )
      );
    } else {
      this.store.dispatch(clearAnimatePageAction());
    }
  }
}
