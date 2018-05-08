export default function(state = null, action) {
  switch (action.type) {
    case "USER_LOADED":
      return action.payload;
    default:
      return state;
  }
}
