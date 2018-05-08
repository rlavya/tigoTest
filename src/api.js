import Promise from "bluebird";
import map from "lodash/map";
import { cleanPhoneNumber } from "./util";
import axios from "axios";
import hash from "object-hash";
import qs from "qs";
import get from "lodash/get";
import set from "lodash/set";
//import fixtures from "./fixtures";
import { track } from "./util/tracker";
import errorMessages from "./errorMessages";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

/*if (process.env.REACT_APP_USE_FIXTURES === "TRUE") {
  fixtures();
}*/

const apiURL = url => {
  return process.env.REACT_APP_USE_FIXTURES === "TRUE"
    ? url
    : process.env.REACT_APP_API_HOST + url;
};

const localize = (e, localizationFn) => {
  const path = "response.data.error";
  const error = get(e, path);
  set(e, path, localizationFn(error));
  return e;
};

const localizeMsisdn = res => {
  console.log("AAAA");
  const path = "data.queryParamters";
  const qs = get(res, path);
  set(res, path, errorMessages.msisdn(qs));
  return res;
};

const getNetCode = params => {
  // track("Loading or Wait Started");
  const URL =
    "http://millicom-nonprod-prod.apigee.net/v1/tigo/mobile/msisdnAuth/net_code";
  return axios
    .get(
      URL +
        "?" +
        qs.stringify({
          client_id: CLIENT_ID,
          response_type: "code",
          scope: "msisdn_auth",
          state: "appSpecificState",
          redirect_uri: "https://tigo-proxy.herokuapp.com/redirect"
        })
    )
    .then(res => {
      // track("Loading or Wait Finished");
      return get(localizeMsisdn(res), "data.queryParamters");
    });
};

const requestOTP = params => {
  // track("Loading or Wait Started");
  const URL = "/v1/tigo/mobile/msisdnAuth/sms_otp";
  return axios
    .post(
      apiURL(URL),
      qs.stringify({
        client_id:
          process.env.REACT_APP_DEVELOPMENT === "TRUE"
            ? "snEO0U7aSy5GYYxHY7a8HHJ56sAgt4xS"
            : "snEO0U7aSy5GYYxHY7a8HHJ56sAgt4xS",
        msisdn:
          process.env.REACT_APP_COUNTRY_PREFIX +
          cleanPhoneNumber(params.phoneNumber || ""),
        state: "appSpecificState"
      })
    )
    .then(res => {
      // track("Loading or Wait Finished");
      return get(localizeMsisdn(res), "data.queryParamters");
    });
};

const validateOTP = params => {
  // track("Loading or Wait Started");
  const URL = "/validate_sms_code";

  return axios
    .get(
      apiURL(URL) +
        "?" +
        qs.stringify({
          msisdn:
            process.env.REACT_APP_COUNTRY_PREFIX +
            cleanPhoneNumber(params.msisdn || ""),
          sms_password: params.smsPassword
        })
    )
    .then(res => {
      // track("Loading or Wait Finished");
      const code = get(res, "data.queryParamters.code");
      const error = get(
        localizeMsisdn(res),
        "data.queryParamters.error_description"
      );

      if (error) {
        return { error };
      }
      return { code };
    });
};

const authPOSWithCode = params => {
  // track("Loading or Wait Started");
  const URL = "/v1/tigo/mobile/msisdnAuth/token";
  return axios
    .post(
      apiURL(URL),
      qs.stringify({
        code: params.code,
        grant_type: "authorization_code"
      })
    )
    .then(res => {
      // track("Loading or Wait Finished");
      const error = get(res, "data.queryParamters.error_description");

      if (error) {
        track("Fetch Account Failed", { reason: error });
      }

      return get(localizeMsisdn(res), "data");
    });
};

const login = params => {
  // track("Loading or Wait Started");
  const URL = "/v1/tigo/sales/gt/pos/login";
  return axios
    .post(apiURL(URL), {
      msisdn: params.msisdn,
      dmsId: params.dmsid,
      pin: params.pin
    })
    .then(
      data => {
        track("Login Succeded", {
          input_msisdn: params.msisdn,
          input_DMSID: params.dmsid
        });
        return get(data, "data");
      },
      e => {
        const error = get(e, "response.data.error.description");
        // track("Loading or Wait Finished");
        navigator.geolocation.getCurrentPosition(
          info => {
            track("Login authentication pin failed", {
              input_msisdn: params.msisdn,
              input_DMSID: params.dmsid,
              reason: error,
              latitude: get(info, "coords.latitude"),
              longitude: get(info, "coords.longitude")
            });
          },
          () => {
            track("Login authentication pin failed", {
              input_msisdn: params.msisdn,
              input_DMSID: params.dmsid,
              reason: error
            });
          },
          { maximumAge: 300000 }
        );
        return Promise.reject(localize(e, errorMessages.auth));
      }
    );
};

const getPackages = params => {
  if (!params.clientPhoneNumber) return [];

  // track("Loading or Wait Started");

  const URL =
    "/v1/tigo/sales/gt/pos/retailers/" +
    params.msisdn +
    "/subscribers/" +
    process.env.REACT_APP_COUNTRY_PREFIX +
    cleanPhoneNumber(params.clientPhoneNumber) +
    "/products?dmsId=" +
    params.dmsid;

  return axios.get(apiURL(URL)).then(
    ({ data }) => {
      const products = map(data.products, p => {
        p.id = hash(p);
        return p;
      });

      return products;
    },
    e => {
      const error = get(e, "response.data.error.message");
      // track("Loading or Wait Finished");
      track("Fetch Products Failed", { reason: error });
      return Promise.reject(localize(e, errorMessages.posProducts));
    }
  );
};

const getDmsidData = params => {
  const URL = "/v1/tigo/sales/gt/pos/retailers/dmsid/" + params.dmsid;

  return axios.get(apiURL(URL)).then(
    ({ data }) => {
      return data;
    },
    e => {
      return Promise.reject(localize(e, errorMessages.posData));
    }
  );
};

const getTopups = params => {
  if (!params.clientPhoneNumber) return [];

  // track("Loading or Wait Started");

  const URL =
    "/v1/tigo/sales/gt/pos/retailers/" +
    params.msisdn +
    "/subscribers/" +
    process.env.REACT_APP_COUNTRY_PREFIX +
    cleanPhoneNumber(params.clientPhoneNumber) +
    "/topups?dmsId=" +
    params.dmsid;

  return axios.get(apiURL(URL)).then(
    ({ data }) => {
      // track("Loading or Wait Finished");
      const amounts = map(data.amounts, a => {
        a.id = hash(a);
        return a;
      });

      return amounts;
    },
    e => {
      return Promise.reject(localize(e, errorMessages.posProducts));
    }
  );
};

const sellPackage = params => {
  // track("Loading or Wait Started");
  const URL =
    "/v1/tigo/sales/gt/pos/retailers/" +
    params.msisdn +
    "/subscribers/" +
    process.env.REACT_APP_COUNTRY_PREFIX +
    cleanPhoneNumber(params.clientPhoneNumber) +
    "/products/" +
    params.packageId;
  return axios
    .post(apiURL(URL), {
      amount: params.amount,
      retailerPin: params.pin,
      referenceNumber: params.referenceNumber
    })
    .then(
      data => {
        // track("Loading or Wait Finished");
        return data;
      },
      e => {
        return Promise.reject(localize(e, errorMessages.posSellProduct));
      }
    );
};

const sellTopup = params => {
  // track("Loading or Wait Started");
  const URL =
    "/v1/tigo/sales/gt/pos/retailers/" +
    params.msisdn +
    "/subscribers/" +
    process.env.REACT_APP_COUNTRY_PREFIX +
    cleanPhoneNumber(params.clientPhoneNumber) +
    "/topups";
  return axios
    .post(apiURL(URL), {
      amount: params.amount,
      retailerPin: params.pin,
      currency: params.currency,
      referenceNumber: params.referenceNumber
    })
    .then(
      data => {
        // track("Loading or Wait Finished");
        return data;
      },
      e => {
        return Promise.reject(localize(e, errorMessages.posSellRecharge));
      }
    );
};

const getBalance = params => {
  const retailerBalance = get(params, "currentBalance");
  // track("Loading or Wait Started");
  track("Balance Refresh Started", {
    retailerMsisdn: params.msisdn,
    retailerBalance
  });
  const URL = "/v1/tigo/sales/gt/pos/retailers/" + params.msisdn + "/balances";
  return axios.post(apiURL(URL), { pin: params.pin }).then(
    res => {
      const balance = get(res, "data.balances");
      track("Balance Updated", {
        retailerMsisdn: params.msisdn,
        retailerBalance: balance.balance
      });
      return balance;
    },
    e => {
      const error = get(e, "response.data.error.message");
      track("Balance Failed", {
        retailerMsisdn: params.msisdn,
        reason: error,
        retailerBalance
      });
      // track("Loading or Wait Finished");
      return Promise.reject(localize(e, errorMessages.posBalance));
    }
  );
};

const changePin = params => {
  // track("Loading or Wait Started");
  const URL = "/v1/tigo/sales/gt/pos/credentials";
  return axios
    .put(apiURL(URL), {
      pin: params.pin,
      newPin: params.newPin,
      msisdn: params.msisdn
    })
    .then(
      res => {
        // track("Loading or Wait Finished");
        track("Change Password Succeded", {
          input_msisdn: params.msisdn,
          input_DMSID: params.dmsid
        });
        return res;
      },
      e => {
        const error = get(e, "response.data.error.message");
        track("Change Password Failed", {
          input_msisdn: params.msisdn,
          input_DMSID: params.dmsid,
          reason: error
        });
        // track("Loading or Wait Finished");
        return Promise.reject(localize(e, errorMessages.posChangePin));
      }
    );
};

const logout = params => {
  const URL = "/logout/" + params.msisdn;
  return axios.post(apiURL(URL), {});
};

const getMonth = date => {
  const month = date.getMonth() + 1;
  if (month < 10) {
    return "0" + month;
  }
  return month;
};


const getSales = params => {
  const date = new Date();
  const URL = "/v1/tigo/sales/gt/pos/retailers/" + params.msisdn + "/sales";
  const startDate = date.getFullYear() + "-01-01";

  const dateVal = (date.getDate() < 10 ? "0" : "") + date.getDate();
  const endDate = date.getFullYear() + "-" + getMonth(date) + "-" + dateVal;

  return axios
    .post(apiURL(URL), {
      pin: params.pin,
      maxReturnRows: 100,
      startDate,
      endDate
    })
    .then(
      ({ data }) => {
        // track("Loading or Wait Finished");
        const sales = map(data.sales, s => {
          s.id = s.transactionId;
          return s;
        });

        return sales;
      },
      e => {
        return Promise.reject(localize(e, errorMessages.posProducts));
      }
    );
};

export default {
  getPackages,
  getTopups,
  getSales,
  requestOTP,
  validateOTP,
  authPOSWithCode,
  getNetCode,
  login,
  sellPackage,
  sellTopup,
  getBalance,
  changePin,
  getDmsidData,
  logout
};
