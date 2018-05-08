export const update = phoneNumber => {
  return {
    type: "clientPhone/UPDATE",
    payload: { phoneNumber }
  };
};
