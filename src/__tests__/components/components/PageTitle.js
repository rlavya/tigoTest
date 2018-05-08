import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import tigoBaseTheme from "../../../tigoBaseTheme";
import PageTitle from "../../../components/components/PageTitle";
import renderer from "react-test-renderer";
import React from "react";
import store from "../../../store";
import { Provider } from "react-redux";

describe('PageTitle component', () => {

  it('should render correctly', () => {
    const component = renderer.create(
      <MuiThemeProvider muiTheme={getMuiTheme(tigoBaseTheme)}>
        <Provider store={store}>
          <PageTitle title={"TEST"}/>
        </Provider>
      </MuiThemeProvider>
    );

    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render with back button', () => {
    const component = renderer.create(
      <MuiThemeProvider muiTheme={getMuiTheme(tigoBaseTheme)}>
        <Provider store={store}>
          <PageTitle backParams={{page:"MainMenu"}}/>
        </Provider>
      </MuiThemeProvider>
    );

    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render with alert', () => {
    const component = renderer.create(
      <MuiThemeProvider muiTheme={getMuiTheme(tigoBaseTheme)}>
        <Provider store={store}>
          <PageTitle
            backParams={{page:"MainMenu"}}
            alerts={[{type:"error"}]}
          />
        </Provider>
      </MuiThemeProvider>
    );

    expect(component.toJSON()).toMatchSnapshot();
  });

});
