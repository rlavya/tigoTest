import EntityLoader, { SKIP_LOAD } from "./entityLoader";
import { configToId } from "../util/db";
import get from "lodash/get";

export default class TopupsLoader extends EntityLoader {
  static params(routeData) {
    if (
      routeData.page === "TopupDataEntry" ||
      routeData.page === "TopupReview" ||
      routeData.page === "TopupConfirmation"
    ) {
      return {};
    }
  }

  getId() {
    return configToId("Topup", "list", true);
  }

  load() {
    let state = this.store.getState();
    let dmsid = get(state, "auth.dmsid");
    let msisdn = get(state, "auth.login.msisdn");

    if (dmsid && msisdn) {
      return this.context.api.getTopups({
        ...this.params,
        dmsid,
        msisdn,
        clientPhoneNumber: state.clientPhone.phoneNumber
      });
    } else {
      return SKIP_LOAD;
    }
  }
}
