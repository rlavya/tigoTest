import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import tigoBaseTheme from "../../../tigoBaseTheme";
import { Login } from "../../../components/pages/Login";
import renderer from "react-test-renderer";
import Enzyme, { shallow, render, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import React from "react";

import { startRouter } from "../../../router";

Enzyme.configure({ adapter: new Adapter() });


let mockStore = {
  dispatch(action) {},
};

startRouter(mockStore, [[":page", { page: "MainMenu" }]], []);

describe('Login component', () => {

  const urlFor = jest.fn();

  it("renders correctly", () => {
    const component = shallow(
      <Login dmsid="" pin=""/>
    );

    expect(component).toMatchSnapshot();
  });

});
