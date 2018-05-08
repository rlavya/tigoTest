import fixture from "can-fixture";
import { getRandomInRange } from "./util";
const HEADER_ENRICHMENT = false;

const POS_PHONE = "53185402";
const SMS_OTP = "202020";
const POS_DMSID = "123456";
const POS_PIN = "3030";

export default () => {
  fixture.delay = 300;

  // Net Code - With Header enrichment
  fixture(
    "GET /v1/tigo/mobile/msisdnAuth/net_code",
    (req, res, headers, ajaxSettings) => {
      let { client_id, response_type, scope, state } = req.data;

      if (
        !client_id ||
        response_type !== "code" ||
        scope !== "msisdn_auth" ||
        state !== "appSpecificState"
      ) {
        return res(500, {});
      }

      if (!HEADER_ENRICHMENT) {
        return res(403, {});
      }

      return {
        method: "GET",
        queryParamters: {
          code: "vVEJFozK", //***TOKEN THAT SHOULD BE USED IN THE token API***
          state: "appSpecificState"
        },
        headers: {
          Accept: "*/*",
          "accept-encoding": "gzip",
          "cache-control": "no-cache",
          Host: "test.api.tigo.com",
          "Postman-Token": "59b3ee97-26ec-4a92-97f7-046c8f7b846e",
          referer:
            "http://millicom-nonprod-prod.apigee.net/v1/tigo/mobile/msisdnAuth/net_code?client_id=snEO0U7aSy5GYYxHY7a8HHJ56sAgt4xS&response_type=code&scope=msisdn_auth&state=appSpecificState&redirect_uri=https://test.api.tigo.com/v1/tigo/diagnostics/callback",
          "User-Agent": "PostmanRuntime/6.4.1",
          "X-Forwarded-For": "190.53.144.197",
          "X-Forwarded-Port": "443",
          "X-Forwarded-Proto": "https",
          "X-MSISDN": process.env.REACT_APP_COUNTRY_PREFIX + POS_PHONE,
          "X-MSISDN-HASHED": "4Z5TmZYTc2/Jk3+OSVV4SQ=="
        },
        body: ""
      };
    }
  );

  // Request SMS OTP
  fixture(
    "POST /v1/tigo/mobile/msisdnAuth/sms_otp",
    (req, res, headers, ajaxSettings) => {
      let { msisdn } = req.data;

      if (msisdn !== process.env.REACT_APP_COUNTRY_PREFIX + POS_PHONE) {
        return res(500, {
          error: "server_error",
          error_description:
            "Execution of ServiceCallout Call-kannel-sendsms failed. Reason: timeout occurred in Call-kannel-sendsms",
          state: "appSpecificState"
        });
      }

      return {
        method: "GET",
        queryParamters: {
          result: "OK",
          state: "appSpecificState",
          msisdn: process.env.REACT_APP_COUNTRY_PREFIX + POS_PHONE
        },
        headers: {
          Accept: "*/*",
          "accept-encoding": "gzip",
          "cache-control": "no-cache",
          Host: "test.api.tigo.com",
          "Postman-Token": "ef2d32eb-2f75-4cbb-bf5d-a9f362a69379",
          referer:
            "https://test.api.tigo.com/v1/tigo/mobile/msisdnAuth/sms_otp",
          "User-Agent": "PostmanRuntime/6.4.1",
          "X-Forwarded-For": "190.53.144.197",
          "X-Forwarded-Port": "443",
          "X-Forwarded-Proto": "https"
        },
        body: ""
      };
    }
  );

  // Validate SMS OTP
  fixture("GET /validate_sms_code", (req, res, headers, ajaxSettings) => {
    let { msisdn, sms_password } = req.data;
    if (
      msisdn !== process.env.REACT_APP_COUNTRY_PREFIX + POS_PHONE ||
      sms_password !== SMS_OTP
    ) {
      return res(200, {
        queryParamters: {
          error: "server_error",
          error_description:
            "Missing Kannel configuration from KVM in environment",
          state: "appSpecificState"
        }
      });
    }

    return {
      method: "GET",
      queryParamters: { code: "LfHHA5Q6", state: "appSpecificState" },
      headers: {
        Accept: "*/*",
        "accept-encoding": "gzip",
        "cache-control": "no-cache",
        Host: "test.api.tigo.com",
        "Postman-Token": "c12b6d38-9567-4eab-970b-1418b580302a",
        referer:
          "https://test.api.tigo.com/v1/tigo/mobile/msisdnAuth/sms_code?client_id=snEO0U7aSy5GYYxHY7a8HHJ56sAgt4xS&response_type=code&scope=test&state=appSpecificState&redirect_uri=https://test.api.tigo.com/v1/tigo/diagnostics/callback&msisdn=503& + POS_PHONEsms_password=642162",
        "User-Agent": "PostmanRuntime/6.4.1",
        "X-Forwarded-For": "190.53.144.197",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
      },
      body: ""
    };
  });

  // GET TOKEN
  fixture(
    "POST /v1/tigo/mobile/msisdnAuth/token",
    (req, res, headers, ajaxSettings) => {
      return {
        refresh_token_expires_in: "2591999",
        country: "SV",
        refresh_token_status: "approved",
        api_product_list: "[DIGITAL PoS GT, MsisdnAuth]",
        api_product_list_json: ["DIGITAL PoS GT", "MsisdnAuth"],
        msisdn_verified_at: "1508773667988",
        organization_name: "millicom-nonprod",
        "developer.email": "danny@yeswearemad.com",
        token_type: "BearerToken",
        issued_at: "1508773830643",
        client_id: "snEO0U7aSy5GYYxHY7a8HHJ56sAgt4xS",
        access_token: "7O7UjO5J7INle8MfwvCQsIZypWGm",
        refresh_token: "JqSEabLZ9q9J64wN3J96j0wCcDNP6HoA",
        application_name: "3099062f-4fba-4dd0-aa9e-06dddb44fece",
        scope: "",
        msisdn_identification_method: "sms code",
        refresh_token_issued_at: "1508773830643",
        msisdn: process.env.REACT_APP_COUNTRY_PREFIX + POS_PHONE,
        expires_in: "172799",
        refresh_count: "0",
        status: "approved",
        msisdn_valid: "true",
        __cached1: {
          req: {
            msisdn: process.env.REACT_APP_COUNTRY_PREFIX + POS_PHONE,
            dmsId: 123456,
            pin: "3030"
          },
          res: {
            msisdn: process.env.REACT_APP_COUNTRY_PREFIX + POS_PHONE,
            status: "1",
            seller: 3,
            distributor: 152,
            expiresAt: Date.now() + 1000000
          }
        }
      };
    }
  );

  // Login
  fixture(
    "POST /v1/tigo/sales/gt/pos/login",
    (req, res, headers, ajaxSettings) => {
      let { msisdn, dmsId, pin } = req.data;

      if (
        msisdn !== process.env.REACT_APP_COUNTRY_PREFIX + POS_PHONE ||
        dmsId !== POS_DMSID ||
        pin !== POS_PIN
      ) {
        return res(401, {
          error: {
            statusCode: "401",
            code: "001",
            message: "PIN invalido en pretups.",
            developerMessage: "PIN invalido en pretups."
          },
          expiresAt: 1522091409033
        });
      }

      return {
        msisdn: process.env.REACT_APP_COUNTRY_PREFIX + POS_PHONE,
        status: "1",
        seller: 3,
        distributor: 152,
        expiresAt: Date.now() + 1000000
      };
    }
  );

  // GET PoS Data
  fixture(
    "/v1/tigo/sales/gt/pos/retailers/dmsid/{dmsid}",
    (req, res, headers, ajaxSettings) => {
      return {
        ownerName: "",
        ownerLastName: "",
        ownerDocumentType: "",
        ownerDocumentId: "",
        ownerGender: "",
        ownerEmail: "",
        ownerBirthDate: "",
        idDealer: 152,
        idSeller: 3,
        msisdn: "50240008861",
        storeAddress: "Calle principal a un costado de Policia Nacional Civil",
        storeDepartment: "Chiquimula",
        storeProvince: "Camotán",
        storeName: "Tienda La Frontera",
        storePicture: "",
        storeLongitud: "-89.227045",
        storeLatitud: "14.8578",
        status: 1,
        creationDate: "",
        roleList: [
          { id: 2327, name: "KITS" },
          { id: 2326, name: "MODEM" },
          { id: 2322, name: "TARJETA" },
          { id: 2323, name: "EPIN" },
          { id: 2325, name: "VASTRIX" },
          { id: 2324, name: "SIMCARD" }
        ]
      };
    }
  );

  // GET PoS Balance
  fixture(
    "GET /v1/tigo/sales/gt/pos/retailers/50231021596/balances",
    (req, res, headers, ajaxSettings) => {
      return {
        balances: {
          name: "ePIN",
          code: 101,
          balance: 97900,
          currency: "Q"
        }
      };
    }
  );

  // GET PoS Products
  fixture(
    "GET /v1/tigo/sales/gt/pos/retailers/{posMSISDN}/subscribers/{subscriberMSISDN}/products",
    (req, res, headers, ajaxSettings) => {
      if (
        req.data.dmsId !== POS_DMSID ||
        req.data.posMSISDN !==
          process.env.REACT_APP_COUNTRY_PREFIX + POS_PHONE ||
        req.data.subscriberMSISDN === "50240000000"
      ) {
        return res(403, {
          error: {
            statusCode: 403,
            code: "001",
            message: "Error en formato de mensaje",
            messageDeveloper: "NEG-PIN Incorrecto"
          }
        });
      }

      return {
        products: [
          {
            productId: "WAP",
            name: "SEMANA 800 MB",
            description: "SEMANA 800 MB",
            order: 1,
            category: "Internet",
            shortcode: 805,
            suggested: "true",
            price: 30,
            displayPrice: 30,
            currency: "Q"
          },
          {
            productId: "WAP",
            name: "DOS DIAS 300MB",
            description: "DOS DIAS 300MB",
            order: 2,
            category: "Internet",
            shortcode: 805,
            suggested: "true",
            price: 10,
            displayPrice: 10,
            currency: "Q"
          },
          {
            productId: "INT",
            name: "25 Mins + 25 SMS Tigo",
            description: "25 Mins + 25 SMS Tigo",
            order: 3,
            category: "Mixtos",
            shortcode: 800,
            suggested: "true",
            price: 5,
            displayPrice: 5,
            currency: "Q"
          },
          {
            productId: "WAP",
            name: "DIA 100MB",
            description: "DIA 100MB",
            order: 4,
            category: "Antenita Tigo Star",
            shortcode: 805,
            suggested: "false",
            price: 5,
            displayPrice: 5,
            currency: "Q"
          },
          {
            productId: "INT",
            name: "Semana Ilimitado a Tigo + 30 Mins a USA + 500MB",
            description: "Semana Ilimitado a Tigo + 30 Mins a USA + 500MB",
            order: 6,
            category: "Especiales",
            shortcode: 800,
            suggested: "false",
            price: 50,
            displayPrice: 50,
            currency: "Q"
          },
          {
            productId: "WAP",
            name: "SEMANA 800MB + 60 Mins Locales y USA",
            description: "SEMANA 800MB + 60 Mins Locales y USA",
            order: 9,
            category: "Internet",
            shortcode: 805,
            suggested: "false",
            price: 40,
            displayPrice: 40,
            currency: "Q"
          },
          {
            productId: "INT",
            name: "Ilimitado a Tigo + 500 SMS + 50 MB",
            description: "Ilimitado a Tigo + 500 SMS + 50 MB",
            order: 10,
            category: "Mixtos",
            shortcode: 800,
            suggested: "false",
            price: 10,
            displayPrice: 10,
            currency: "Q"
          },
          {
            productId: "INT",
            name: "Mes Ilimitado a Tigo + 3,000 Mins a Guate y USA + 4GB",
            description:
              "Mes Ilimitado a Tigo + 3,000 Mins a Guate y USA + 4GB",
            order: 11,
            category: "Mixtos",
            shortcode: 800,
            suggested: "false",
            price: 250,
            displayPrice: 250,
            currency: "Q"
          },
          {
            productId: "WAP",
            name: "60 Mins + 60 SMS a Tigo y USA",
            description: "60 Mins + 60 SMS a Tigo y USA",
            order: 12,
            category: "Mixtos",
            shortcode: 800,
            suggested: "false",
            price: 10,
            displayPrice: 10,
            currency: "Q"
          },
          {
            productId: "WAP",
            name: "3 DÃAS 400MB",
            description: "3 DÃAS 400MB",
            order: 13,
            category: "Internet",
            shortcode: 805,
            suggested: "true",
            price: 15,
            displayPrice: 15,
            currency: "Q"
          },
          {
            productId: "INT",
            name: "3 DÃ­as Ilimitado Tigo + 20 Mins a USA + 150MB",
            description: "3 DÃ­as Ilimitado Tigo + 20 Mins a USA + 150MB",
            order: 14,
            category: "Mixtos",
            shortcode: 800,
            suggested: "false",
            price: 25,
            displayPrice: 25,
            currency: "Q"
          }
        ]
      };
    }
  );

  // Get PoS TopUp Amounts
  fixture(
    "GET /v1/tigo/sales/gt/pos/retailers/{posMSISDN}/subscribers/{subscriberMSISDN}/topups",

    (req, res, headers, ajaxSettings) => {
      if (
        req.data.dmsId !== POS_DMSID ||
        req.data.posMSISDN !==
          process.env.REACT_APP_COUNTRY_PREFIX + POS_PHONE ||
        req.data.subscriberMSISDN === "50240000000"
      ) {
        return res(403, {
          error: {
            statusCode: 403,
            code: "001",
            message: "Error en formato de mensaje",
            messageDeveloper: "NEG-PIN Incorrecto"
          }
        });
      }

      return {
        amounts: [
          {
            name: "Recarga Q10",
            price: 10,
            order: 1,
            suggested: "false",
            currency: "Q"
          },
          {
            name: "Recarga Q100",
            price: 100,
            order: 2,
            suggested: "false",
            currency: "Q"
          },
          {
            name: "Recarga Q25",
            price: 25,
            order: 3,
            suggested: "false",
            currency: "Q"
          },
          {
            name: "Recarga Q50",
            price: 50,
            order: 4,
            suggested: "false",
            currency: "Q"
          }
        ]
      };
    }
  );

  // Sell TopUp
  fixture(
    "POST /v1/tigo/sales/gt/pos/retailers/{retailerMsisdn}/subscribers/{clientMsisdn}/topups",
    (req, res, headers, ajaxSettings) => {
      if (req.data.clientMsisdn === "50240000000") {
        res(403, {
          error: {
            code: "117",
            messageDeveloper: "NEG-Saldo insuficiente",
            message: "Saldo insuficiente",
            statusCode: 403
          }
        });
      } else if (req.data.clientMsisdn === "50240000001") {
        res(403, {
          error: {
            statusCode: 403,
            code: "141",
            message: "PIN Incorrecto",
            messageDeveloper: "NEG-PIN Incorrecto"
          }
        });
      }
      return {
        status: "OK",
        transactionId: "R171023.1857.610001"
      };
    }
  );

  fixture(
    "POST /v1/tigo/sales/gt/pos/retailers/{clientMsisdn}/sales",
    (req, res, headers, ajaxSettings) => {
      return {
        sales: [
          {
            transactionDate: "2018-03-19 10:59",
            transactionId: "R180319.1059.650003",
            transactionType: "C2S - Canal a suscriptor Tigo",
            transactionStatus: "SUCCESS",
            transactionAmount: "-5",
            transactionCurrency: "Q",
            msisdn: "50233333333",
            transactionSubType: "Recarga"
          },
          {
            transactionDate: "2018-03-16 11:46",
            transactionId: "R180316.1146.640009",
            transactionType: "C2S - Canal a suscriptor Tigo",
            transactionStatus: "SUCCESS",
            transactionAmount: "-5",
            transactionCurrency: "Q",
            msisdn: "50253194167",
            transactionSubType: "Recarga"
          },
          {
            transactionDate: "2018-03-16 11:41",
            transactionId: "V180316.1141.650020",
            transactionType: "C2S - Canal a suscriptor Tigo",
            transactionStatus: "SUCCESS",
            transactionAmount: "-4.99",
            transactionCurrency: "Q",
            msisdn: "50253194167",
            transactionSubType: "Paquete"
          }
        ]
      };
    }
  );

  // Sell Product
  fixture(
    "POST /v1/tigo/sales/gt/pos/retailers/{retailerMsisdn}/subscribers/{clientMsisdn}/products/{packageId}",
    (req, res, headers, ajaxSettings) => {
      if (req.data.clientMsisdn === "50240000000") {
        res(403, {
          error: {
            code: "117",
            messageDeveloper: "NEG-Saldo insuficiente",
            message: "Saldo insuficiente",
            statusCode: 403
          }
        });
      } else if (req.data.clientMsisdn === "50240000001") {
        res(403, {
          error: {
            statusCode: 403,
            code: "141",
            message: "PIN Incorrecto",
            messageDeveloper: "NEG-PIN Incorrecto"
          }
        });
      }
      return {
        status: "OK",
        transactionId: "R151202.1319.620023"
      };
    }
  );

  // Get Balance
  fixture(
    "POST /v1/tigo/sales/gt/pos/retailers/{retailerMsisdn}/balances",
    (req, res, headers, ajaxSettings) => {
      /*setTimeout(() => {
        res(401);
      }, 1000);
      return;*/
      return {
        balances: {
          name: "ePIN",
          code: 101,
          balance: getRandomInRange(100, 300),
          currency: "Q",
          isLow: false
        }
      };
    }
  );

  fixture("GET /low_balance", (req, res, headers, ajaxSettings) => {
    return {
      value: 250
    };
  });

  fixture(
    "PUT /v1/tigo/sales/gt/pos/credentials",
    (req, res, headers, ajaxSettings) => {
      console.log("CHANGE PIN", req.data);
      if (req.data.pin !== "3030") {
        return res(403, {
          error: {
            statusCode: 403,
            code: "141",
            message: "PIN Incorrecto",
            messageDeveloper: "NEG-PIN Incorrecto"
          }
        });
      }
      return {
        status: "OK"
      };
    }
  );

  fixture("POST /logout/{msisdn}", (req, res) => {
    return "";
  });
};
