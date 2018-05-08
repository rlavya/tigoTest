import StatusMessage from "../../../components/components/StatusMessage";
import renderer from "react-test-renderer";
import React from "react";

describe('StatusMessage component', () => {

  it('should render error', () => {
    const component = renderer.create(
      <StatusMessage type={"error"}/>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render success', () => {
    const component = renderer.create(
      <StatusMessage type={"success"}/>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render warning', () => {
    const component = renderer.create(
      <StatusMessage type={"warning"}/>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

});
