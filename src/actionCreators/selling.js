import { getPackageById, getTopupById } from "../util/index";
import { redirectTo } from "../router";
import API from "../api";
import get from "lodash/get";
import { addAlertAction } from "./alerts";
import { identify, track } from "../util/tracker";
import { clearPinAction, getBalanceAction } from "./auth";

export const CLEAR_CURRENT_USER_ACTION = "sell/CLEAR_CURRENT_USER";
const WRONG_PIN_ERROR_CODE = "141";

const getReferenceNumber = () => {
  return Date.now();
};

export const sellPendingAction = () => {
  return (dispatch, getState) => {
    const state = getState();
    const pendingSale = state.pendingSale;
    console.log("PENDING SALE");
    if (pendingSale) {
      pendingSale();
    }
  };
};

export const sellTopupAction = tData => {
  return (dispatch, getState) => {
    const trackableData = { ...tData };
    const state = getState();
    const topupId = get(state, "route.id");
    const topup = getTopupById(state, topupId);
    const msisdn = get(state, "auth.token.msisdn");
    const clientPhoneNumber = get(state, "clientPhone.phoneNumber");
    const pin = get(state, "auth.pin");
    const referenceNumber = getReferenceNumber();

    if (!pin) {
      return dispatch({
        type: "pendingSale/ADD",
        payload: () => {
          dispatch(sellTopupAction(trackableData));
        }
      });
    }

    trackableData.order_id = referenceNumber;
    trackableData.checkout_id = referenceNumber;

    const trackTopup = (event, additionalData = {}) => {
      navigator.geolocation.getCurrentPosition(
        info => {
          track(event, {
            ...trackableData,
            ...additionalData,
            latitude: get(info, "coords.latitude"),
            longitude: get(info, "coords.longitude")
          });
        },
        () => {
          track(event, { ...trackableData, ...additionalData });
        },
        { maximumAge: 300000 }
      );
    };

    trackTopup("Order Confirmation");

    API.sellTopup({
      msisdn,
      clientPhoneNumber,
      pin,
      amount: topup.price,
      currency: topup.currency,
      referenceNumber
    }).then(
      res => {
        identify(msisdn, {
          msisdn: process.env.REACT_APP_COUNTRY_PREFIX + clientPhoneNumber
        });
        dispatch(getBalanceAction());
        trackTopup("Order Completed");
        trackTopup("PoS Authentication succeeded");
        redirectTo({ page: "TopupConfirmation", id: topupId });
      },
      err => {
        trackTopup("Order Failed", { error: get(err, "response.data.error") });
        trackTopup("PoS Authentication failed", {
          error: get(err, "response.data.error")
        });
        const error = get(err, "response.data.error.message");
        const errorCode = get(err, "response.data.error.code") + "";
        dispatch(addAlertAction("error", error));
        if (errorCode === WRONG_PIN_ERROR_CODE) {
          dispatch(clearPinAction());
          dispatch({
            type: "pendingSale/ADD",
            payload: () => {
              console.log("PENDING SALE CALLED");
              dispatch(sellTopupAction(trackableData));
            }
          });
        } else {
          dispatch({ type: "pendingSale/CLEAR" });
        }
      }
    );
  };
};

export const sellPackageAction = tData => {
  return (dispatch, getState) => {
    const trackableData = { ...tData };
    const state = getState();
    const packageId = get(state, "route.id");
    const pack = getPackageById(state, packageId);
    const msisdn = get(state, "auth.token.msisdn");
    const clientPhoneNumber = get(state, "clientPhone.phoneNumber");
    const pin = get(state, "auth.pin");

    if (!pin) {
      return dispatch({
        type: "pendingSale/ADD",
        payload: () => {
          dispatch(sellPackageAction(trackableData));
        }
      });
    }

    const referenceNumber = getReferenceNumber();

    trackableData.order_id = referenceNumber;
    trackableData.checkout_id = referenceNumber;

    const trackPackage = (event, additionalData = {}) => {
      navigator.geolocation.getCurrentPosition(
        info => {
          track(event, {
            ...trackableData,
            ...additionalData,
            latitude: get(info, "coords.latitude"),
            longitude: get(info, "coords.longitude")
          });
        },
        () => {
          track(event, { ...trackableData, ...additionalData });
        },
        { maximumAge: 300000 }
      );
    };

    trackPackage("Order Confirmation");

    API.sellPackage({
      msisdn,
      clientPhoneNumber,
      pin,
      packageId: pack.productId,
      amount: pack.price,
      currency: pack.currency,
      referenceNumber
    }).then(
      res => {
        identify(msisdn, {
          msisdn: process.env.REACT_APP_COUNTRY_PREFIX + clientPhoneNumber
        });
        dispatch(getBalanceAction());
        trackPackage("Order Completed");
        trackPackage("PoS Authentication succeeded");
        redirectTo({ page: "PackagesConfirmation", id: packageId });
      },
      err => {
        const error = get(err, "response.data.error.message");
        const errorCode = get(err, "response.data.error.code") + "";
        trackPackage("Order Failed", {
          error: get(err, "response.data.error")
        });
        trackPackage("PoS Authentication failed", {
          error: get(err, "response.data.error")
        });

        dispatch(addAlertAction("error", error));
        if (errorCode === WRONG_PIN_ERROR_CODE) {
          dispatch(clearPinAction());
          dispatch({
            type: "pendingSale/ADD",
            payload: () => {
              dispatch(sellPackageAction(trackableData));
            }
          });
        } else {
          dispatch({ type: "pendingSale/CLEAR" });
        }
      }
    );
  };
};

export const clearCurrentUserAction = () => {
  return dispatch => {
    dispatch({
      type: CLEAR_CURRENT_USER_ACTION
    });
    redirectTo({ page: "MainMenu" });
  };
};
