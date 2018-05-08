import { Responder } from "../util/routeResponder";
import { identifyGenericInfo, identify, track } from "../util/tracker";
import {
  requestOtpAction,
  loginReadyUserAction
} from "../actionCreators/auth.js";
import API from "../api";
import get from "lodash/get";
import { redirectTo } from "../router";

export default class AuthLoader extends Responder {
  static params(routeData) {
    return true;
  }

  start() {
    const routeData = { ...get(this, "routeData") };
    const netCode = get(this, "routeData.netCode");
    const code = get(netCode, "code");

    if (!netCode) {
      console.log("REDIRECTING:", process.env.REACT_APP_NETCODE_URL);
      window.location.href = process.env.REACT_APP_NETCODE_URL;
      return;
    }

    delete routeData.netCode;

    identifyGenericInfo();
    redirectTo(routeData);

    if (code) {
      identify(null, { connectionType: "MOBILE" });
      return API.authPOSWithCode({ code }).then(
        tokenData => {
          identify(get(tokenData, "msisdn"), {
            country: get(tokenData, "country")
          });
          this.store.dispatch(loginReadyUserAction({ token: tokenData }));
        },
        () => {
          track("MSISDN Identification Failed", {
            reason: "Wrong auth token"
          });
          this.store.dispatch(requestOtpAction({}));
        }
      );
    } else {
      identify(null, { connectionType: "WIFI" });
      track("MSISDN Identification Failed", { reason: "WIFI Connection" });
      this.store.dispatch(requestOtpAction({}));
    }
  }
}
