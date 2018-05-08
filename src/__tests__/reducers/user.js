import user from "../../reducers/user";

describe('user reducer', () => {
  it('should return the initial state', () => {
    expect(user(undefined, {})).toEqual(null);
  });

  it('should return the action payload / user data', () => {
    const payload = {name: 'test'};
    expect(user(null, {type:"USER_LOADED", payload:payload})).toEqual(payload);
  });

});
