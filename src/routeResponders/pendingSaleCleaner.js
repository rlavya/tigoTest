// @flow

import { Responder } from "../util/routeResponder";

export default class PendingSaleCleaner extends Responder {
  static params(routeData: any) {
    if (
      routeData.page === "TopupReview" ||
      routeData.page === "PackageReview"
    ) {
      return true;
    }
  }

  stop() {
    this.store.dispatch({ type: "pendingSale/CLEAR" });
  }
}
