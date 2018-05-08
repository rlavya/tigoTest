import React, { Component } from "react";
import "./App.css";
import { connect } from "react-redux";
import { Motion, spring } from "react-motion";
import classNames from "classnames";

import Login from "./components/pages/Login";
import MainMenu from "./components/pages/MainMenu";
import TopupDataEntry from "./components/pages/TopupDataEntry";
import TopupReview from "./components/pages/TopupReview";
import TopupConfirmation from "./components/pages/TopupConfirmation";
import PackagesCategories from "./components/pages/PackagesCategories";
import PackagesPacks from "./components/pages/PackagesPacks";
import PackagesDetails from "./components/pages/PackagesDetails";
import PackagesReview from "./components/pages/PackagesReview";
import PackagesConfirmation from "./components/pages/PackagesConfirmation";
import SalesSummary from "./components/pages/SalesSummary";
import SalesDetail from "./components/pages/SalesDetail";
import RequestOTP from "./components/pages/RequestOTP";
import EnterOTP from "./components/pages/EnterOTP";
import Modal from "./components/pages/Modal";
import ChangePin from "./components/pages/ChangePin";

import { STATUSES } from "./actionCreators/auth";
import { screen } from "./util/tracker";

class RenderPage extends Component {
  render() {
    switch (this.props.page) {
      case "__REQUEST_OTP__":
        return <RequestOTP />;
      case "__ENTER_OTP__":
        return <EnterOTP />;
      case "__LOGIN__":
        return <Login />;
      case "MainMenu":
        return <MainMenu />;
      case "TopupDataEntry":
        return <TopupDataEntry />;
      case "TopupReview":
        return <TopupReview />;
      case "TopupConfirmation":
        return <TopupConfirmation />;
      case "PackagesCategories":
        return <PackagesCategories />;
      case "PackagesPacks":
        return <PackagesPacks />;
      case "PackagesDetails":
        return <PackagesDetails />;
      case "PackagesReview":
        return <PackagesReview />;
      case "PackagesConfirmation":
        return <PackagesConfirmation />;
      case "SalesSummary":
        return <SalesSummary />;
      case "SalesDetail":
        return <SalesDetail />;
      case "ChangePin":
        return <ChangePin />;
      case "Login":
        return <Login />;

      case "Modal":
        return <Modal />;
      case "Loading":
        return <div />;

      default:
        return <div>404</div>;
    }
  }
}

class Panels extends Component {
  render() {
    if (this.props.animatePage) {
      let direction = this.props.animatePage.direction;
      let prevPage = this.props.animatePage.prev.page;
      let nextPage = this.props.animatePage.next.page;

      let leftPanelPage = direction === "left" ? prevPage : nextPage;
      let rightPanelPage = direction === "left" ? nextPage : prevPage;

      screen(nextPage);

      return (
        <div>
          <div
            className="App-panel-left"
            key={leftPanelPage}
            id={leftPanelPage}
          >
            <RenderPage page={leftPanelPage} />
          </div>
          <Motion
            defaultStyle={{ left: direction === "left" ? 110 : 0 }}
            style={{
              left: spring(direction === "left" ? 0 : 110, {
                stiffness: 210,
                damping: 25
              })
            }}
            key={rightPanelPage}
            onRest={this.props.animationDone}
            id={rightPanelPage}
          >
            {interpolatingStyle => {
              return (
                <div
                  className={classNames("App-panel-right", {
                    "App-panel-right-direction-left": direction === "left",
                    "App-panel-right-direction-right": direction === "right"
                  })}
                  style={{
                    transform: `translateX(${interpolatingStyle.left}%)`
                  }}
                >
                  <RenderPage page={rightPanelPage} />
                </div>
              );
            }}
          </Motion>
        </div>
      );
    } else {
      screen(this.props.page);
      return (
        <div>
          <div
            className="App-panel-left"
            key={this.props.page}
            id={this.props.page}
          >
            <RenderPage page={this.props.page} />
          </div>
        </div>
      );
    }
  }
}

const ConnectedPanels = connect(
  state => {
    let page = state.route.page;
    let isChangePinPage = page === "ChangePin";
    let animatePage = state.animatePage;

    if (state.auth.status === STATUSES.PENDING) {
      page = "Loading";
      animatePage = false;
    } else if (state.auth.status === STATUSES.REQUEST_OTP) {
      page = "__REQUEST_OTP__";
      animatePage = false;
    } else if (state.auth.status === STATUSES.REQUESTED_OTP) {
      page = "__ENTER_OTP__";
      animatePage = false;
    } else if (state.auth.status === STATUSES.LOGIN_READY) {
      page = isChangePinPage ? page : "__LOGIN__";
      animatePage = false;
    }

    return { page, animatePage };
  },
  dispatch => {
    return {
      animationDone() {
        dispatch({ type: "CLEAR_ANIMATE_PAGE" });
      }
    };
  }
)(Panels);

class App extends Component {
  render() {
    return (
      <div className="App">
        <ConnectedPanels />
      </div>
    );
  }
}

export default App;
