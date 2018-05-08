import React, { Component } from "react";
import { red400, lightGreen500, orange500 } from "material-ui/styles/colors";
import CONSTANTS from "./../../config/appConstants";

class StatusMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHideNotification: false,
      layoutConfig: {
        type: "error",
        backgroundColor: red400,
        imageIcon: "/images/icn-failure.png"
      }
    };
  }

  componentDidMount() {
    this.configLayoutData();

    setTimeout(() => {
      if(this.props.onClose) {
        this.props.onClose();
      } else {
        this.setState({ isHideNotification: true });
      }
      
    }, CONSTANTS.TIME_THRESHOLD);
  }

  configLayoutData() {
    let configObj = {};
    switch (this.props.type) {
      case "error":
        configObj.backgroundColor = red400;
        configObj.imageIcon = "/images/icn-failure.png";
        configObj.type = this.props.type;
        break;
      case "success":
        configObj.backgroundColor = lightGreen500;
        configObj.imageIcon = "/images/icn-success-white.png";
        configObj.type = this.props.type;
        break;
      case "warning":
        configObj.backgroundColor = orange500;
        configObj.imageIcon = "/images/icn-warning.png";
        configObj.type = this.props.type;
        break;
      default:
    }
  }

  // Rendering Notification layout
  renderMessageLayout() {
    return (
      <div
        className="max-width-4 flex justify-between py2 px1 light text-white"
        style={{ backgroundColor: this.state.layoutConfig.backgroundColor }}
      >
        <div className="flex text-content">
          <img
            alt=""
            src={this.state.layoutConfig.imageIcon}
            className="mr2 flex-none"
            width="31"
            height="31"
          />
          <div className="h5 regular"> {this.props.text}</div>
        </div>
        <div
          onClick={this.props.onClose}
          dangerouslySetInnerHTML={{ __html: "&times;" }}
        />
      </div>
    );
  }

  render() {
    if (!this.state.isHideNotification) {
      return this.renderMessageLayout();
    } else {
      return null;
    }
  }
}

export default StatusMessage;