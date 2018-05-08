export const ADD_ACTION = "alert/ADD";
export const REMOVE_ACTION = "alert/REMOVE";

export const addAlertAction = (alertType, text) => {
  return {
    type: ADD_ACTION,
    payload: { type: alertType, text: text }
  };
};

export const removeAlertAction = index => {
  return {
    type: REMOVE_ACTION,
    payload: { index: index }
  };
};
