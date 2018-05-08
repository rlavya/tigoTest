import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "basscss/css/basscss.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import { startRouter } from "./router";
import routeResponders from "./routeResponders";
import tigoBaseTheme from "./tigoBaseTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";

startRouter(store, [[":page", { page: "MainMenu" }]], routeResponders);

ReactDOM.render(
  <MuiThemeProvider muiTheme={getMuiTheme(tigoBaseTheme)}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);
