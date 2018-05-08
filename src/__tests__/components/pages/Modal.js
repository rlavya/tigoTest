import Modal from "../../../components/pages/Modal";
import renderer from "react-test-renderer";
import Enzyme, { shallow, render, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import React from "react";
import store from "../../../store";
import { Provider } from "react-redux";

Enzyme.configure({ adapter: new Adapter() });

describe('Modal component', () => {

  it("renders correctly", () => {
    const component = shallow(
      <Modal />
    );

    expect(component).toMatchSnapshot();
  });

});
