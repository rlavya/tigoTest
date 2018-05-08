import clientPhone from "../../reducers/clientPhone";
import { CLEAR_CURRENT_USER_ACTION } from "../../actionCreators/selling";

describe('clientPhone reducer', () => {

  it('should return the initial state', () => {
    const initialState = { isValid: false };
    expect(clientPhone(undefined, {})).toEqual(initialState);
  });

  it('should return the number is valid', () => {
    const payload = {phoneNumber: '5000 0000'};
    const initialState = { isValid: false };
    expect(clientPhone(initialState, {type:"clientPhone/UPDATE", payload:payload})).toEqual(
      {isValid: true, phoneNumber: '50000000'}
    );
  });

  it('should return the number is invalid', () => {
    const payload = { phoneNumber: '12345678' };
    const initialState = { isValid: false };
    expect(clientPhone(initialState, {type:"clientPhone/UPDATE", payload:payload})).toEqual(
      {isValid: false, phoneNumber: '12345678'}
    );
  });

  it('should return the number is invalid if empty', () => {
    const payload = {};
    const initialState = { isValid: false };
    expect(clientPhone(initialState, {type:"clientPhone/UPDATE", payload:payload})).toEqual(
      {isValid: false, phoneNumber: ''}
    );
  });

  it('should clear the state', () => {
    const initialState = { isValid: false, phoneNumber: '123 45 678' };
    expect(clientPhone(initialState, {type: CLEAR_CURRENT_USER_ACTION})).toEqual({});
  })

});
