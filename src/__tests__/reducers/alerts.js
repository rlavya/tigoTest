import alertsReducer from "../../reducers/alerts";

describe('alerts reducer', () => {
  it('should return the initial state on unknown action', () => {
    const alerts = [{type:'error', message:'none'}];
    expect(alertsReducer(alerts, {type:'unknown'})).toEqual(alerts);
  });

  it('should add a new alert', () => {
    const alerts = [{type:'error', message:'none'}];
    const newAlert = {type:'success', message: 'none'};

    expect(alertsReducer(alerts, {type:"alert/ADD", payload:{type:'success', message: 'none'}})).toEqual([
      {type:'error', message:'none'},
      {type: 'success', message:'none'}
    ]);
  });

  it('should remove alert by index', () => {
    const alerts = [
      {type:'error', message:'none'},
      {type:'success', message:'none'}
    ];
    expect(alertsReducer(alerts, {type:"alert/REMOVE", payload:{index: 0}})).toEqual(
      [{type:'success', message:'none'}]
    );
  });
});
