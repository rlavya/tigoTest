import { Responder } from "../util/routeResponder";
import { urlFor } from "../router";

export default class UserCheck extends Responder {
  start() {
    const state = this.store.getState();
    const currentUser = state.user;
    const currentPage = state.route.page;

    if (
      !currentUser && !(currentPage === "Frontpage" || currentPage === "Login")
    ) {
      this.store.dispatch({
        type: "ROUTE_CHANGED",
        payload: { page: "Frontpage" },
      });
      this.context.redirect(urlFor({ page: "Frontpage" }));
    }
  }
}
