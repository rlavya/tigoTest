import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import tigoBaseTheme from "../../../tigoBaseTheme";
import { TopupDataEntry } from "../../../components/pages/TopupDataEntry";
import renderer from "react-test-renderer";
import React from "react";
import store from "../../../store";
import { Provider } from "react-redux";

it("renders correctly", () => {
  const rendered = renderer.create(
    <MuiThemeProvider muiTheme={getMuiTheme(tigoBaseTheme)}>
      <Provider store={store} >
        <TopupDataEntry items={{state: "loaded"}}/>
      </Provider>
    </MuiThemeProvider>
  );
  expect(rendered.toJSON()).toMatchSnapshot();
});
