// @flow

import { dataForId, configToId } from "./db";
import filter from "lodash/filter";

export const getRandomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const getTopupById = (state: any, id: string): any => {
  const topups: any = dataForId(state, configToId("Topup", "list", true)) || [];
  return filter(topups.data, t => t.id === id)[0] || {};
};

export const getPackageById = (state: any, id: string): any => {
  const packages: any =
    dataForId(state, configToId("Package", "list", true)) || [];
  return filter(packages.data, t => t.id === id)[0] || {};
};

export const formatPhoneNumber = (phoneNumber: string | null): string => {
  const _phoneNumber = phoneNumber || "";
  if (_phoneNumber.length > 4) {
    return _phoneNumber.slice(0, 4) + " " + _phoneNumber.slice(4);
  }
  return _phoneNumber;
};

export const isPhoneNumberStartingWithTheCorrectDigit = (digits: string) => {
  const firstDigit = digits[0];
  return (
    //firstDigit === "2" ||
    firstDigit === "1" ||
    firstDigit === "3" ||
    firstDigit === "4" ||
    firstDigit === "5" /*||
    firstDigit === "6" ||
    firstDigit === "7"*/
  );
};

export const isPhoneNumberValid = (phoneNumber: string) => {
  const digits = (phoneNumber || "").replace(/[^0-9]/g, "");

  return (
    digits.length === 8 && isPhoneNumberStartingWithTheCorrectDigit(digits)
  );
};

export const cleanPin = (pin: string | null) => {
  const digits = (pin || "").replace(/[^0-9]/g, "");
  return digits.substr(0, 4);
};

export const cleanDmsid = (dmsid: string | null) => {
  const digits = (dmsid || "").replace(/[^0-9]/g, "");
  return digits.substr(0, 6);
};

export const cleanOtp = (dmsid: string | null) => {
  const digits = (dmsid || "").replace(/[^0-9]/g, "");
  return digits.substr(0, 6);
};

export const cleanPhoneNumber = (phoneNumber: string | null) => {
  const digits = (phoneNumber || "").replace(/[^0-9]/g, "");
  console.log("CLEAN PH", phoneNumber, digits, digits.substr(0, 8));
  return digits.substr(0, 8);
};

export const onEnterAction = (action: Function) => {
  return (e: any) => {
    if (e && e.which === 13) {
      action();
    }
  };
};

export const convertMS = (ms: number) => {
  let d, h, m, s;
  s = Math.floor(ms / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;
  return { d: d, h: h, m: m, s: s };
};
