import { combineReducers } from "redux";
import route from "./reducers/route";
import user from "./reducers/user";
import animatePage from "./reducers/animatePage";
import db from "./reducers/db";
import clientPhone from "./reducers/clientPhone";
import auth from "./reducers/auth";
import alerts from "./reducers/alerts";
import pendingSale from "./reducers/pendingSale";

export default combineReducers({
  route,
  user,
  animatePage,
  db,
  clientPhone,
  auth,
  alerts,
  pendingSale
});
