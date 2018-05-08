import route from "../../reducers/route";

describe('route reducer', () => {
  it('should return the initial state', () => {
    expect(route(undefined, {})).toEqual({});
  });

  it('should return the action payload / route data', () => {
    const payload = {data: 'test'};
    expect(route(null, {type:"ROUTE_CHANGED", payload:payload})).toEqual(payload);
  });

});
