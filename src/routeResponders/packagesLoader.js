import EntityLoader, { SKIP_LOAD } from "./entityLoader";
import { configToId } from "../util/db";
import get from "lodash/get";

export default class PackagesLoader extends EntityLoader {
  static params({ page }) {
    if (
      page === "PackagesPacks" ||
      page === "PackagesCategories" ||
      page === "PackagesReview" ||
      page === "PackagesDetails" ||
      page === "PackagesConfirmation"
    ) {
      return {};
    }
  }

  getId() {
    return configToId("Package", "list", true);
  }

  load() {
    let state = this.store.getState();
    let dmsid = get(state, "auth.dmsid");
    let msisdn = get(state, "auth.login.msisdn");

    console.log("LOAD PACKAGES", dmsid, msisdn, state.clientPhone.phoneNumber);

    if (dmsid && msisdn) {
      return this.context.api.getPackages({
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
