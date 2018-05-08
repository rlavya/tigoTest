/* eslint-disable */

const digitTest = /^\d+$/;
const isFunction = obj => !!(obj && obj.constructor && obj.call && obj.apply);
const isObject = obj =>
  0 !== obj &&
  (null === obj ||
    "object" === typeof obj ||
    Array.isArray(obj) ||
    isFunction(obj));
const keyBreaker = /([^\[\]]+)|(\[\])/g;
const matcher = /\:([\w\.]+)/g;
const paramsMatcher = /^(\?[^=]+=[^&]*)+/;
const paramTest = /([^?#]*)(#.*)?$/;
const prep = str => decodeURIComponent(str.replace(/\+/g, " "));
const removeBackslash = str => str.replace(/\\/g, "");
const wrapQuote = str =>
  (str + "").replace(/([.?*+\^$\[\]\\(){}|\-])/g, "\\$1");

const buildParam = (prefix, obj, add) => {
  if (Array.isArray(obj)) {
    for (let i = 0, l = obj.length; i < l; ++i) {
      add(prefix + "[]", obj[i]);
    }
  } else if (isObject(obj)) {
    for (let name in obj) {
      if (obj.hasOwnProperty(name)) {
        buildParam(prefix + "[" + name + "]", obj[name], add);
      }
    }
  } else {
    add(prefix, obj);
  }
};

const deparam = params => {
  let data = {},
    pairs,
    lastPart;
  if (params && paramTest.test(params)) {
    pairs = params.split("&");
    pairs.map(pair => {
      let parts = pair.split("=");
      let key = prep(parts.shift());
      let value = prep(parts.join("="));
      let current = data;
      if (key) {
        parts = key.match(keyBreaker);
        for (let j = 0, l = parts.length - 1; j < l; j++) {
          if (!current[parts[j]]) {
            current[parts[j]] =
              digitTest.test(parts[j + 1]) || parts[j + 1] === "[]" ? [] : {};
          }
          current = current[parts[j]];
        }
        lastPart = parts.pop();
        if (lastPart === "[]") {
          current.push(value);
        } else {
          current[lastPart] = value;
        }
      }
    });
  }
  return data;
};

const matchesData = (route, data) => {
  let count = 0;
  let defaults = {};

  for (let name in route.defaults) {
    if (route.defaults[name] === data[name]) {
      defaults[name] = 1;
      count++;
    }
  }
  for (let i = 0; i < route.names.length; i++) {
    if (!data.hasOwnProperty(route.names[i])) {
      return -1;
    }
    if (!defaults[route.names[i]]) {
      count++;
    }
  }

  return count;
};

const param = object => {
  const pairs = [];
  const add = (ke, value) => {
    pairs.push(encodeURIComponent(ke) + "=" + encodeURIComponent(value));
  };

  for (let name in object) {
    if (object.hasOwnProperty(name)) {
      buildParam(name, object[name], add);
    }
  }

  return pairs.join("&").replace(/%20/g, "+");
};

export const HELPERS = {
  deparam: deparam,
  matcher: matcher,
  matchesData: matchesData,
  param: param,
  paramsMatcher: paramsMatcher,
  removeBackslash: removeBackslash,
  wrapQuote: wrapQuote
};
