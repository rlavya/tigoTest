import partial from "lodash/partial";
import get from "lodash/get";
import set from "lodash/set";

const DEFAULT_ERROR_MESSAGE =
  "Ha ocurrido un error. Por favor vuelve a intentarlo";

const AUTH = [
  [
    "003",
    "Timeout al servicio legado",
    "Ha ocurrido un error. Por favor vuelve a intentarlo"
  ],
  [
    "003",
    "Error de conexion a DB.",
    "Ha ocurrido un error. Por favor vuelve a intentarlo"
  ],
  [
    "001",
    "dmsId no existe en la DB.",
    "Código de Tienda incorrecto. Por favor vuelve a intentarlo"
  ],
  [
    "001",
    "PIN o posId invalido en pretups.",
    "PIN incorrecto. Por favor vuelve a intentarlo"
  ],
  [
    "001",
    "PIN invalido en pretups.",
    "PIN incorrecto. Por favor vuelve a intentarlo"
  ],
  [
    "001",
    "posId no existe en pretups.",
    "Número de teléfono inválido. Comunícate al 1515"
  ],
  [
    "001",
    "Token invalido.",
    "Ha ocurrido un error. Por favor vuelve a intentarlo"
  ],
  [
    "001",
    "Error en mensaje de entrada.",
    "Código de Tienda y/o PIN incorrectos. Por favor vuelve a intentarlo"
  ],
  [
    "001",
    "dmsId no esta activo.",
    "Código de Tienda ingresado no se encuentra activo. Comunícate al 1515"
  ],
  [
    "001",
    "MSISDN es diferente en DB y Pretups.",
    "Revisa que los datos ingresados estén correctos, o comunícate al 1515"
  ]
];

const POS_DATA = [
  [
    "003",
    "Error de conexion a DB.",
    "Ha ocurrido un error. Por favor vuelve a intentarlo"
  ],
  [
    "001",
    "Error en mensaje de entrada.",
    "Datos incorrectos. Por favor vuelve a intentarlo"
  ],
  [
    "001",
    "Token invalido.",
    "Ha ocurrido un error. Por favor vuelve a intentarlo"
  ],
  [
    "002",
    "La consulta no devuelve datos",
    "Ha ocurrido un error. Por favor vuelve a intentarlo"
  ]
];

const POS_BALANCE = [
  [
    "001",
    "Error en formato de mensaje",
    "Datos incorrectos. Por favor vuelve a intentarlo"
  ],
  [
    "069",
    "MSISDN de vendedor no existe",
    "Número de teléfono inválido. Comunícate al 1515"
  ],
  [
    "098",
    "No se pudo realizar la transaccion",
    "Ha ocurrido un error. Por favor vuelve a intentarlo"
  ],
  ["141", "Pin Incorrecto", "PIN incorrecto. Por favor vuelve a intentarlo"]
];

const POS_TRANSACTIONS = [
  [
    "001",
    "Error en mensaje de entrada.",
    "Datos incorrectos. Por favor vuelve a intentarlo"
  ],
  [
    "003",
    "No hay comunicacion con el servicio.",
    "Ha ocurrido un error. Por favor vuelve a intentarlo"
  ],
  [
    "002",
    "La consulta no devuelve datos",
    "Ha ocurrido un error. Por favor vuelve a intentarlo"
  ],
  [
    "001",
    "PIN o posId invalido en pretups.",
    "PIN incorrecto. Por favor vuelve a intentarlo"
  ],
  [
    "003",
    "Timeout al servicio legado",
    "Ha ocurrido un error. Por favor vuelve a intentarlo"
  ],
  [
    "001",
    "Token invalido.",
    "Ha ocurrido un error. Por favor vuelve a intentarlo"
  ]
];

const POS_CHANGE_PIN = [
  [
    "141",
    "Pin Incorrecto",
    "PIN actual incorrecto. Por favor vuelve a intentarlo"
  ],
  [
    "098",
    "PIN nuevo y confirmacion de PIN deben ser igual",
    "PIN no coincide con la confirmación. Por favor vuelve a intentarlo"
  ],
  [
    "069",
    "MSISDN de vendedor no existe",
    "Número de teléfono inválido. Comunícate al 1515"
  ],
  [
    "001",
    "Error en formato de mensaje",
    "Datos incorrectos. Por favor vuelve a intentarlo"
  ],
  [
    "098",
    "El nuevo PIN no debe ser igual a los ultimos 3 PINS utilizados.",
    "PIN nuevo incorrecto. Coincide con alguno de los 3 anteriores, por favor vuelve a intentarlo"
  ]
];

const POS_PRODUCTS = [
  [
    "001",
    "Error en formato de mensaje",
    "Datos incorrectos. Por favor vuelve a intentarlo"
  ],
  [
    "001",
    "Error en formato de mensaje",
    "Datos incorrectos. Por favor vuelve a intentarlo"
  ],
  [
    "001",
    "No aplica oferta",
    "El número no cuenta con paquetes disponibles. Ingresa un número Tigo Prepago"
  ],
  [
    "002",
    "Usuario no encontrado en BD",
    "Número inválido. Ingresa un número Tigo prepago para realizar la transacción"
  ],
  [
    "003",
    "Error interno backend",
    "Ha ocurrido un error. Por favor vuelve a intentarlo"
  ],
  [
    "004",
    "Consumidor no autorizado",
    "Número inválido. Ingresa un número Tigo prepago para realizar la transacción"
  ],
  [
    "067",
    "La consulta no retorno información",
    "El número no cuenta con paquetes disponibles"
  ]
];

const POS_SELL_RECHARGE = [
  [
    "117",
    "Saldo insuficiente",
    "Tu saldo es insuficiente. Recarga saldo a tu número para realizar la transacción"
  ],
  [
    "069",
    "MSISDN de vendedor no existe",
    "Número de teléfono inválido. Comunícate al 1515"
  ],
  ["141", "Pin Incorrecto", "PIN incorrecto. Por favor vuelve a intentarlo"],
  [
    "098",
    "El monto solicitado es invalido, este debe ser mayor que cero.",
    "Monto de recarga no válido. Ingresa un monto de recarga existente"
  ],
  [
    "099",
    "Número no válido para la transacción",
    "Número inválido. Ingresa un número Tigo prepago para realizar la transacción"
  ],
  [
    "098",
    "La cantidad solicitada Q10000 debe estar en el rango de Q1 y Q300",
    "Monto de recarga no válido. Ingresa un monto de recarga existente"
  ],
  [
    "001",
    "Error en formato de mensaje",
    "Datos incorrectos. Por favor vuelve a intentarlo"
  ],
  [
    "098",
    "No se pudo realizar la transaccion",
    "Error en la transacción. Por favor vuelve a intentarlo"
  ],
  [
    "001",
    "No aplica oferta",
    "El número no cuenta con paquetes disponibles. Ingresa un número Tigo Prepago"
  ]
];

const POS_SELL_PRODUCT = [
  [
    "117",
    "Saldo insuficiente",
    "Tu saldo es insuficiente. Recarga saldo a tu número para realizar la transacción"
  ],
  ["141", "Pin Incorrecto", "PIN incorrecto. Por favor vuelve a intentarlo"],
  [
    "142",
    "Paquete Invalido",
    "Este Paquetigo no se encuentra disponible en este momento"
  ],
  [
    "099",
    "Número no válido para la transacción",
    "Número inválido. Ingresa un número Tigo prepago para realizar la transacción"
  ],
  [
    "069",
    "MSISDN de vendedor no existe",
    "Número de teléfono inválido. Comunícate al 1515"
  ],
  [
    "098",
    "Service Selector interface mapping not exists.",
    "Este Paquetigo no se encuentra disponible en este momento"
  ],
  [
    "098",
    "El monto solicitado es invalido, este debe ser mayor que cero.",
    "Este Paquetigo no se encuentra disponible en este momento"
  ],
  [
    "001",
    "Error en formato de mensaje",
    "Datos incorrectos. Por favor vuelve a intentarlo"
  ],
  [
    "098",
    "No se pudo realizar la transaccion",
    "Error en la transacción. Por favor vuelve a intentarlo"
  ],
  [
    "001",
    "No aplica oferta",
    "El número no cuenta con paquetes disponibles. Ingresa un número Tigo Prepago"
  ]
];

const MSISDN = [
  [
    302,
    {
      error: "access_denied",
      error_description: "Invalid MSISDN Headers in request"
    },
    {
      error: "Acceso denegado",
      error_description: "Información inválida en la petición"
    }
  ],

  [
    302,
    {
      error: "access_denied",
      error_description: "Wrong MSISDN or SMS password"
    },
    {
      error: "Acceso denegado",
      error_description: "MSISDN o código inválido"
    }
  ],

  [
    302,
    {
      error: "invalid_request",
      error_description:
        "Invalid MSISDN parameter in request, NOT from Tigo Network"
    },
    {
      error: "Petición inválida",
      error_description:
        "Información inválida en la petición. El MSISDN no es de la red Tigo"
    }
  ],
  [
    500,
    {
      error: "server_error",
      error_description: "Missing Kannel configuration from KVM in environment"
    },
    {
      error: "Error de sevidor",
      error_description: "Error en el envío de SMS"
    }
  ],
  [
    302,
    {
      error: "access_denied",
      error_description: "Missing MSISDN Headers from Tigo Network"
    },
    {
      error: "Acceso denegado",
      error_description: "Información faltante desde la red de Tigo"
    }
  ],
  [
    400,
    {
      error: "invalid_request",
      error_description: "Redirect URI not valid"
    },
    {
      error: "Petición inválida",
      error_description: "URI de redirección inválida"
    }
  ],
  [
    404,
    {
      error: "invalid_request",
      error_description: "Unknown Resource"
    },
    {
      error: "Petición inválida",
      error_description: "Recurso desconocido"
    }
  ],
  [
    400,
    {
      error: "invalid_request",
      error_description: "TLS/SSL Security NOT supported in this endpoint"
    },
    {
      error: "Petición inválida",
      error_description: "TLS/SSL no soportado"
    }
  ],
  [
    400,
    {
      error: "invalid_request",
      error_description: "TLS/SSL Security Required"
    },
    {
      error: "Petición inválida",
      error_description: "TLS/SSL es requerido"
    }
  ],
  [
    500,
    {
      error: "server_error",
      error_description: "%error.message$"
    },
    {
      error: "Error de sevidor",
      error_description: "Ocurrió un error, intente más tarde"
    }
  ],
  [
    429,
    {
      error: "invalid_request",
      error_description: "Too many requests"
    },
    {
      error: "Petición inválida",
      error_description: "Ha excedido el límite de peticiones"
    }
  ]
];

const localizeApi = (localizations, e) => {
  const error = e || {};
  const newError = {
    ...error,
    description: DEFAULT_ERROR_MESSAGE,
    message: DEFAULT_ERROR_MESSAGE
  };

  const code = error.code + "";
  const description = (error.description || error.message || "")
    .trim()
    .toLowerCase();

  for (let i = 0; i < localizations.length; i++) {
    let localization = localizations[i];
    let [locCode, fromDescription, toDescription] = localization;

    locCode = locCode + "";
    fromDescription = (fromDescription || "").trim().toLowerCase();

    if (code === locCode && description === fromDescription) {
      newError.description = toDescription;
      newError.message = toDescription;
      return newError;
    }
  }
  return newError;
};

const localizeMsisdn = data => {
  let error = get(data, "error");
  let errorDescription = get(data, "error_description");

  if (!error && !errorDescription) {
    return data;
  }

  error = (error || "").trim().toLowerCase();
  errorDescription = (errorDescription || "").trim().toLowerCase();

  for (let i = 0; i < MSISDN.length; i++) {
    const [httpCode, from, to] = MSISDN[i];

    const fromError = (from.error || "").trim().toLowerCase();
    const fromErrorDescription = (from.error_description || "")
      .trim()
      .toLowerCase();

    if (error === fromError && errorDescription === fromErrorDescription) {
      set(data, "error_description", to.error_description);
      return data;
    }
  }
  set(data, "error_description", DEFAULT_ERROR_MESSAGE);
  return data;
};

export default {
  auth: partial(localizeApi, AUTH),
  posData: partial(localizeApi, POS_DATA),
  posBalance: partial(localizeApi, POS_BALANCE),
  posTransactions: partial(localizeApi, POS_TRANSACTIONS),
  posChangePin: partial(localizeApi, POS_CHANGE_PIN),
  posProducts: partial(localizeApi, POS_PRODUCTS),
  posSellRecharge: partial(localizeApi, POS_SELL_RECHARGE),
  posSellProduct: partial(localizeApi, POS_SELL_PRODUCT),
  msisdn: localizeMsisdn
};
