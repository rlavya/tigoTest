import animatePage from "../../reducers/animatePage";

describe('animatePage reducer', () => {
  it('should return the initial state', ()=>{
    expect(animatePage(undefined, {})).toEqual(null);
  });

  it('should return the action payload', () => {
    expect(animatePage(null, {type:"ANIMATE_PAGE", payload:{}})).toEqual({});
  });

  it('should clear the state', () => {
    expect(animatePage(null, {type:"CLEAR_ANIMATE_PAGE", payload:{}})).toEqual(null);
  });
});
