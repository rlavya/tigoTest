import {
  STATUSES,
  CHANGE_AUTH_STATUS_ACTION,
  UPDATE_REQUEST_OTP_PHONE_ACTION,
  UPDATE_OTP_CODE_ACTION,
  UPDATE_POS_DMSID_ACTION,
  UPDATE_POS_PIN_ACTION,
  LOGOUT_ACTION,
  UPDATE_BALANCE_ACTION,
  UPDATE_OLD_PIN_ACTION,
  UPDATE_NEW_PIN_ACTION,
  CLEAR_CHANGE_PIN_ACTION,
  UPDATE_BALANCE_EPIN_POPUP_ACTION,
  UPDATE_BALANCE_EPIN_ACTION,
  DMSID_FETCHED_ACTION,
  CLEAR_PIN_ACTION
} from "../actionCreators/auth";

import { cleanPin, cleanDmsid, cleanOtp } from "../util";

const logoutUser = state => {
  const newState = { ...state };

  newState.status = STATUSES.LOGIN_READY;
  delete newState.login;
  delete newState.dmsid;
  delete newState.pin;
  delete newState.balance;
  delete newState.pinChange;
  delete newState.epin;

  return newState;
};

const clearChangePin = state => {
  const newState = { ...state };
  delete newState.pinChange;
  return newState;
};

const clearPin = state => {
  const newState = { ...state };
  delete newState.pin;
  return newState;
};

export default function(
  state = { status: STATUSES.PENDING /*dmsid: 123456, pin: 3030 */ },
  action
) {
  switch (action.type) {
    case CHANGE_AUTH_STATUS_ACTION:
      return { ...state, ...action.payload };
    case UPDATE_REQUEST_OTP_PHONE_ACTION:
      return { ...state, otpRequestPhoneNumber: action.payload.phoneNumber };
    case UPDATE_OTP_CODE_ACTION:
      return { ...state, otpCode: cleanOtp(action.payload.otpCode) };
    case UPDATE_POS_DMSID_ACTION:
      return { ...state, dmsid: cleanDmsid(action.payload.dmsid) };
    case UPDATE_POS_PIN_ACTION:
      return { ...state, pin: cleanPin(action.payload.pin) };
    case UPDATE_BALANCE_ACTION:
      return { ...state, ...action.payload };
    case UPDATE_OLD_PIN_ACTION:
      return {
        ...state,
        pinChange: { ...state.pinChange, old: cleanPin(action.payload.pin) }
      };
    case UPDATE_NEW_PIN_ACTION:
      return {
        ...state,
        pinChange: { ...state.pinChange, new: cleanPin(action.payload.pin) }
      };
    case UPDATE_BALANCE_EPIN_ACTION:
      return {
        ...state,
        ...action.payload
      };
    case CLEAR_CHANGE_PIN_ACTION:
      return clearChangePin(state);
    case UPDATE_BALANCE_EPIN_POPUP_ACTION:
      return {
        ...state,
        ...action.payload
      };
    case LOGOUT_ACTION:
      return logoutUser(state);
    case DMSID_FETCHED_ACTION:
      return {
        ...state,
        dmsidData: action.payload
      };
    case CLEAR_PIN_ACTION:
      return clearPin(state);
    default:
      return state;
  }
}
