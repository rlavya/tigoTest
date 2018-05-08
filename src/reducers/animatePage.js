export default (state = null, action) => {
  switch (action.type) {
    case "ANIMATE_PAGE":
      return action.payload;
    case "CLEAR_ANIMATE_PAGE":
      return null;
    default:
      return state;
  }
};
