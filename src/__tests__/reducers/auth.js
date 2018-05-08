import auth from "../../reducers/auth";
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
  UPDATE_BALANCE_EPIN_ACTION
} from "../../actionCreators/auth";

describe('auth reducer', () => {

  it('should return the initial state on unknown action', () => {
    expect(auth(undefined, {type:'unknown'})).toEqual({status: STATUSES.PENDING});
  });

  it('should change auth status', () => {
    expect(auth({status: 'PENDING'}, {type:CHANGE_AUTH_STATUS_ACTION, payload: {status: 'REQUEST_OTP'}}))
    .toEqual({status: 'REQUEST_OTP'});
  });

  it('should update request otp phone number', () => {
    const state = {otpRequestPhoneNumber: null};
    const action = {type: UPDATE_REQUEST_OTP_PHONE_ACTION, payload: {phoneNumber: 12345678}}
    expect(auth(state, action)).toEqual({
      otpRequestPhoneNumber: 12345678
    });
  });

  it('should update request otp code', () => {
    const state = {otpCode: null};
    const action = {type: UPDATE_OTP_CODE_ACTION, payload: {otpCode: 1234}}
    expect(auth(state, action)).toEqual({
      otpCode: 1234
    });
  });

  it('should update pos dmsid', () => {
    const state = {dmsid: null};
    const action = {type: UPDATE_POS_DMSID_ACTION, payload: {dmsid: 1234}}
    expect(auth(state, action)).toEqual({
      dmsid: 1234
    });
  });

  it('should update pos pin', () => {
    const state = {pin: null};
    const action = {type: UPDATE_POS_PIN_ACTION, payload: {pin: 1234}}
    expect(auth(state, action)).toEqual({
      pin: 1234
    });
  });

  it('should update balance', () => {
    const payload = {balance: {
      name: "ePIN",
      code: 101,
      balance: 200,
      currency: "Q"
    }};
    const action = {type: UPDATE_BALANCE_ACTION, payload: payload};
    expect(auth({status: "LOGGED_IN"}, action)).toEqual({
      status: "LOGGED_IN",
      balance: {
        name: "ePIN",
        code: 101,
        balance: 200,
        currency: "Q"
      }
    });
  });

  it('should update old pin field', () => {
    const action = {type: UPDATE_OLD_PIN_ACTION, payload: {pin: 1234}}
    expect(auth({}, action)).toEqual({
      pinChange: {old: 1234}
    });
  });

  it('should update new pin field', () => {
    const action = {type: UPDATE_NEW_PIN_ACTION, payload: {pin: 1234}};
    expect(auth({}, action)).toEqual({
        pinChange: {new: 1234}
    });
  });

  it('should update balance epin', () => {
    const action = {type: UPDATE_BALANCE_EPIN_ACTION, payload: {epin: 1234}}
    expect(auth({}, action)).toEqual({
      epin: 1234
    });
  });

  it('should clear change pin fields', () => {
    const action = {type: CLEAR_CHANGE_PIN_ACTION};
    expect(auth({pinChange:{old:1234, new:1234}}, action)).toEqual({});
  });

  it('should open balance epin popup', () => {
    const action = {type: UPDATE_BALANCE_EPIN_POPUP_ACTION, payload: {balanceEpinOpen: true}};
    expect(auth({}, action)).toEqual({
      balanceEpinOpen: true
    });
  });

  it('should logout user', () => {
    const state = {status: "LOGGED_IN", dmsid: 123456, pin: 1234, login: {}, balance:{}}
    const action = {type: LOGOUT_ACTION }
    expect(auth(state, action)).toEqual({
      status: "LOGIN_READY"
    });
  });
});
