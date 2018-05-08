import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import tigoBaseTheme from "../../../tigoBaseTheme";
import { PackagesConfirmation } from "../../../components/pages/PackagesConfirmation";
import renderer from "react-test-renderer";
import React from "react";
import store from "../../../store";
import { Provider } from "react-redux";

it("renders correctly", () => {
  const rendered = renderer.create(
    <MuiThemeProvider muiTheme={getMuiTheme(tigoBaseTheme)}>
      <Provider store={store}>
        <PackagesConfirmation
          items={{ state: "loaded" }}
          package={{name: 'TEST'}}
        />
      </Provider>

    </MuiThemeProvider>
  );
  expect(rendered.toJSON()).toMatchSnapshot();
});
