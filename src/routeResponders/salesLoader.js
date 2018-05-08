import EntityLoader, { SKIP_LOAD } from "./entityLoader";
import { configToId } from "../util/db";
import get from "lodash/get";

export default class SalesLoader extends EntityLoader {
  static params({ page }) {
    if (page === "SalesSummary" || page === "SalesDetail") {
      return {};
    }
  }

  getId() {
    return configToId("Sales", "list", true);
  }

  load() {
    let state = this.store.getState();
    let msisdn = get(state, "auth.login.msisdn");
    let pin = get(state, "auth.pin");
    console.log("LOAD SALES", msisdn, pin);

    if (msisdn && pin) {
      return this.context.api.getSales({
        ...this.params,
        msisdn,
        pin
      });
    } else {
      return SKIP_LOAD;
    }
  }
}
