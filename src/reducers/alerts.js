import { ADD_ACTION, REMOVE_ACTION } from "../actionCreators/alerts";

const removeAlertByIndex = (state, index) => {
  const newState = [...state];
  newState.splice(index, 1);
  return newState;
};

const alertExists = (alerts, alert) => {
  for (let i = 0; i < alerts.length; i++) {
    let currentAlert = alerts[i];
    if (currentAlert.type === alert.type && currentAlert.text === alert.text) {
      return true;
    }
  }
  return false;
};

const addAlert = (state, newAlert) => {
  if (alertExists(state, newAlert)) {
    return state;
  }
  const newState = [...state];
  newState.push(newAlert);
  return newState;
};

export default (state = [], action) => {
  switch (action.type) {
    case ADD_ACTION:
      return addAlert(state, action.payload);
    case REMOVE_ACTION:
      return removeAlertByIndex(state, action.payload.index);
    default:
      return state;
  }
};
