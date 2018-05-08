import { Responder } from "../util/routeResponder";
import { clearChangePinAction } from "../actionCreators/auth.js";

export default class ChangePinLoader extends Responder {
  static params({ page }) {
    if (page === "ChangePin") {
      return {};
    }
  }

  start() {
    this.store.dispatch(clearChangePinAction());
  }
}
