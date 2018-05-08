import { Responder } from "../util/routeResponder";

export default class UserGetter extends Responder {
  static params(routeData) {
    return true;
  }

  start() {
    this.store.dispatch({
      type: "USER_LOADED",
      payload: { id: 1, username: "retro" },
    });
  }
}
