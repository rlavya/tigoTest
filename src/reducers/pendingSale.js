export default (state = null, action) => {
  switch (action.type) {
    case "pendingSale/CLEAR":
      return null;
    case "pendingSale/ADD":
      return action.payload;
    default:
      return state;
  }
};
