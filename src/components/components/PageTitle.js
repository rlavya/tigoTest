import React, { Component } from "react";
import AppBar from "material-ui/AppBar";
import { redirectTo } from "../../router";
import { backFor } from "../../siteTree";
import ArrowBack from "material-ui/svg-icons/navigation/arrow-back";
import IconButton from "material-ui/IconButton";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import map from "lodash/map";
import { connect } from "react-redux";
import StatusMessage from "./StatusMessage";
import { removeAlertAction } from "../../actionCreators/alerts";
import styled from "styled-components";

const LogoWrap = styled.span`
  display: inline-block;
  padding-top: 3px;
  padding-left: 10px;
  img {
    height: 22px;
  }
`;

const TitleWrap = styled.div`
  height: 64px;
  top: 0;
  left: 0;
  right: 0;
  position: fixed;
  z-index: 9;
`;

const InnerWrap = styled.div`
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
`;

const Logo = (
  <LogoWrap>
    <img src="/images/mi-tienda.png" alt="Mi Tienda" />
  </LogoWrap>
);

const pageTitles = {
  Login: Logo,
  TopupDataEntry: "Recarga",
  TopupReview: "Revisa tu información",
  TopupConfirmation: "Confirmación",
  PackagesCategories: "Categorías",
  PackagesPacks: "Llamadas",
  PackagesDetails: "Detalle",
  PackagesReview: "Revisión",
  PackagesConfirmation: "Confirmación",
  SalesSummary: "Ventas",
  SalesDetail: "Detalle de Ventas",
  MainMenu: Logo,
  OTP: Logo,
  ChangePin: "Cambio de PIN"
};

const pageTitlesWithTigoLogo = ["OTP", "Login"];

export class PageTitle extends Component {
  renderTitle() {
    let { page, title, backParams, rightElement } = this.props;
    let pageTitle = pageTitles[page];
    let backPage = backFor(page).name;
    let backParamsForPage = backPage ? { page: backPage } : null;
    let linkParams = backParams || backParamsForPage;

    if (pageTitlesWithTigoLogo.indexOf(page) > -1) {
      rightElement = (
        <img
          src="/images/logo-header.png"
          style={{
            marginTop: "-3px",
            height: "55px",
            marginRight: "8px"
          }}
          alt="TiGo"
        />
      );
    }

    if (title) {
      pageTitle = title;
    }

    if (linkParams && !isEmpty(linkParams)) {
      return (
        <TitleWrap>
          <AppBar
            title={pageTitle}
            onLeftIconButtonClick={() => {
              redirectTo(linkParams);
            }}
            iconElementLeft={
              <IconButton>
                <ArrowBack color="#4cc5f2" />
              </IconButton>
            }
            iconElementRight={rightElement}
          />
        </TitleWrap>
      );
    }
    return (
      <TitleWrap>
        <AppBar
          title={pageTitle}
          iconElementLeft={<span />}
          iconElementRight={rightElement}
        />
      </TitleWrap>
    );
  }
  renderAlerts() {
    if (this.props.alerts.length) {
      return (
        <div>
          {map(this.props.alerts, (a, i) => {
            return (
              <StatusMessage
                key={i}
                {...a}
                onClose={() => this.props.removeAlert(i)}
              />
            );
          })}
        </div>
      );
    } else {
      return null;
    }
  }
  componentDidUpdate() {
    //this.resetScroll();
  }
  resetScroll() {
    if (this.innerWrapEl) {
      setTimeout(() => {
        /*this.innerWrapEl.style["-webkit-overflow-scrolling"] = "auto";
        //alert("---> " + this.innerWrapEl.scrollTop);
        this.innerWrapEl.scrollTop = 200;
        this.innerWrapEl.style["-webkit-overflow-scrolling"] = "touch";*/
      }, 1000);
    }
  }
  render() {
    const title = this.renderTitle();
    const alerts = this.renderAlerts();
    return (
      <div>
        {title}
        <InnerWrap
          innerRef={el => {
            if (el) {
              this.innerWrapEl = el;
              this.resetScroll();
            }
          }}
        >
          {alerts}
          {this.props.children}
        </InnerWrap>
      </div>
    );
  }
}

export default connect(
  state => {
    return {
      alerts: get(state, "alerts") || []
    };
  },
  dispatch => {
    return {
      removeAlert: index => {
        dispatch(removeAlertAction(index));
      }
    };
  }
)(PageTitle);
