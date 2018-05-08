import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunk from "redux-thunk";
import reducer from "./reducer";

const getMiddleware = () => {
  return applyMiddleware(createLogger(), thunk);
};

const store = createStore(reducer, composeWithDevTools(getMiddleware()));

export default store;
