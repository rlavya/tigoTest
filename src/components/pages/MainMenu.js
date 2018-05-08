import React, { Component } from "react";
import PageTitle from "../components/PageTitle";
import { List, ListItem } from "material-ui/List";
import TextField from "material-ui/TextField";
import ChevronRight from "material-ui/svg-icons/navigation/chevron-right";
import Divider from "material-ui/Divider";
import { redirectTo } from "../../router";
import styled from "styled-components";
import { connect } from "react-redux";
import { update as updateClientPhone } from "../../actionCreators/clientPhone";
import { Card } from "material-ui/Card";
import { lightBlue200, indigo300 } from "material-ui/styles/colors";
import get from "lodash/get";
import { convertMS } from "../../util";
import { clearCurrentUserAction } from "../../actionCreators/selling";
import {
  logoutAction,
  requestBalanceAction,
  toggleBalanceEpinPopup,
  updateBalanceEpin,
  getBalanceAction
} from "../../actionCreators/auth";
import FlatButton from "material-ui/FlatButton";
import Refresh from "material-ui/svg-icons/navigation/refresh.js";
import PinDialog from "../components/PinDialog";

import { track } from "../../util/tracker";

const ClientPhoneNumberWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  width: 230px;
  margin: 0 auto;
  img {
    margin-right: 5px;
    margin-left: -24px;
    margin-top: 4px;
  }
`;

const ClearButtonWrap = styled.div`
  width: 30px;
  margin-left: -30px;
  margin-bottom: -17px;
`;

const CardWrap = styled.div`
  padding: 15px;
`;

const BalanceWrap = styled.div`
  padding: 5px;
  text-align: right;
  position: relative;
  margin-top: -7px;
`;

const BalanceRequestedTimeWrap = styled.div`
  width: 150px;
  position: absolute;
  top: 45px;
  right: 40px;
  font-weight: 300;
  color: #839ebf;
`;

class BalanceRequestedTime extends Component {
  constructor(props) {
    super(props);
    this.state = { now: Date.now() };
  }
  tick() {
    this.setState({ now: Date.now() });
  }
  componentDidMount() {
    this.interval = setInterval(this.tick.bind(this), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  formatHours(h) {
    if (h === 1) {
      return h + " hora";
    }
    return h + " horas";
  }
  formatMinutes(m) {
    if (m === 1) {
      return m + " min";
    }
    return m + " mins";
  }
  render() {
    if (!this.props.receivedAt) {
      return null;
    }
    const diff = convertMS(this.state.now - this.props.receivedAt);
    let diffMessage;

    if (diff.h && diff.h > 0) {
      diffMessage = this.formatHours(Math.max(diff.h, 0));
    } else {
      diffMessage = this.formatMinutes(Math.max(diff.m, 0));
    }

    return (
      <BalanceRequestedTimeWrap className="text-small">
        Actualizado hace {diffMessage}
      </BalanceRequestedTimeWrap>
    );
  }
}

class Balance extends Component {
  renderBalance() {
    if (!this.props.balance) {
      return null;
    }
    return (
      <div className="text-white text-big">
        {this.props.balance.currency}
        {this.props.balance.balance}
      </div>
    );
  }
  render() {
    return (
      <BalanceWrap>
        <div className="left">
          <div className="text-white text-small">Tu Saldo</div>
          {this.renderBalance()}
        </div>
        <Refresh
          onClick={this.props.refresh}
          className="right mt1 pointer"
          color="#5CCAF9"
          style={{ width: "35px", height: "35px" }}
        />
        <BalanceRequestedTime
          receivedAt={get(this.props, "balance.receivedAt")}
        />
      </BalanceWrap>
    );
  }
}

const ConnectedBalance = connect(
  state => {
    return {
      balance: get(state, "auth.balance")
    };
  },
  dispatch => {
    return {
      refresh: () => dispatch(requestBalanceAction())
    };
  }
)(Balance);

export const ConnectedEpinDialog = connect(
  state => {
    return {
      open: !!get(state, "auth.balanceEpinOpen"),
      pin: get(state, "auth.pin") || ""
    };
  },
  dispatch => {
    return {
      onPinChange: (e, value) => dispatch(updateBalanceEpin(value)),
      handleClose: () => dispatch(toggleBalanceEpinPopup(false)),
      handleMainAction: () => {
        dispatch(toggleBalanceEpinPopup(false));
        dispatch(getBalanceAction());
      }
    };
  }
)(PinDialog);

class ClientPhoneNumber extends Component {
  render() {
    return (
      <ClientPhoneNumberWrap>
        <img alt="" src="/images/icn-ClientPhoneNumber-bigger.png" />
        <TextField
          id="client-phone"
          floatingLabelText="Ingresa el número telefónico del cliente:"
          floatingLabelFixed={true}
          onChange={this.props.onInputChange}
          value={this.props.clientPhoneNumber}
          underlineFocusStyle={{ borderColor: lightBlue200 }}
          floatingLabelStyle={{ color: indigo300, width: "320px" }}
          inputStyle={{ fontSize: "1.5rem" }}
          type="tel"
          pattern="[0-9]*"
        />
        <ClearButtonWrap>
          {this.props.clientPhoneNumber !== "" ? (
            <FlatButton
              secondary={true}
              label="×"
              onClick={this.props.clear}
              fullWidth={true}
              labelStyle={{ fontSize: "24px" }}
            />
          ) : null}
        </ClearButtonWrap>
      </ClientPhoneNumberWrap>
    );
  }
}

const ConnectedClientPhoneNumber = connect(
  state => {
    const clientPhoneNumber = get(state, "clientPhone.phoneNumber") || "";

    return {
      clientPhoneNumber
    };
  },
  dispatch => {
    return {
      onInputChange: (e, value) => {
        dispatch(updateClientPhone(value));
      },
      clear: () => dispatch(clearCurrentUserAction())
    };
  }
)(ClientPhoneNumber);

export class MainMenu extends Component {
  render() {
    let listItemStyle = this.props.clientPhone.isValid ? {} : { opacity: 0.5 };
    return (
      <PageTitle page="MainMenu" rightElement={<ConnectedBalance />}>
        <div>
          <CardWrap>
            <Card>
              <ConnectedClientPhoneNumber />
              <List>
                <Divider />
                <ListItem
                  leftAvatar={<img src="/images/icn-recharge-on.png" alt="" />}
                  primaryText="Recargas"
                  rightIcon={<ChevronRight color="#4CC5F2" />}
                  onClick={() => {
                    if (this.props.clientPhone.isValid) {
                      redirectTo({ page: "TopupDataEntry" });
                    } else {
                      this.props.trackClickOnDisabled(
                        this.props.msisdn,
                        this.props.dmsid
                      );
                    }
                  }}
                  style={listItemStyle}
                />
                <Divider />
                <ListItem
                  leftAvatar={<img src="/images/icn-packages-on.png" alt="" />}
                  primaryText="Paquetes"
                  rightIcon={<ChevronRight color="#4CC5F2" />}
                  onClick={() => {
                    if (this.props.clientPhone.isValid) {
                      redirectTo({ page: "PackagesCategories" });
                    } else {
                      this.props.trackClickOnDisabled(
                        this.props.msisdn,
                        this.props.dmsid
                      );
                    }
                  }}
                  style={listItemStyle}
                />
              </List>
            </Card>
          </CardWrap>
          <CardWrap>
            <Card>
              <List>
                <ListItem
                  primaryText="Ventas"
                  leftAvatar={<img src="/images/icn-sales.png" alt="" />}
                  rightIcon={<ChevronRight color="#4CC5F2" />}
                  onClick={() => {
                    redirectTo({ page: "SalesSummary" });
                  }}
                />
                <Divider />
                <ListItem
                  primaryText="Cambio de PIN"
                  leftAvatar={<img src="/images/icn-ChangePin.png" alt="" />}
                  rightIcon={<ChevronRight color="#4CC5F2" />}
                  onClick={() => {
                    redirectTo({ page: "ChangePin" });
                  }}
                />
                <Divider />
                <ListItem
                  leftAvatar={<img src="/images/icn-logout.png" alt="" />}
                  primaryText="Salir"
                  rightIcon={<ChevronRight color="#4CC5F2" />}
                  onClick={this.props.logout}
                />
              </List>
            </Card>
          </CardWrap>

          <ConnectedEpinDialog />
        </div>
      </PageTitle>
    );
  }
}

export default connect(
  state => {
    const msisdn = get(state, "auth.login.msisdn");
    const dmsid = get(state, "dmsid");
    const clientPhone = get(state, "clientPhone");
    return {
      clientPhone,
      dmsid,
      msisdn
    };
  },
  dispatch => {
    return {
      logout: () => dispatch(logoutAction()),
      trackClickOnDisabled: (posMsisdn, posDmsid) => {
        const event =
          "Home screen No Tigo MSISDN Recharge/Package sell attempt";
        navigator.geolocation.getCurrentPosition(
          info => {
            track(event, {
              posMsisdn,
              posDmsid,
              latitude: get(info, "coords.latitude"),
              longitude: get(info, "coords.longitude")
            });
          },
          () => {
            track(event, { posMsisdn, posDmsid });
          },
          { maximumAge: 300000 }
        );
      }
    };
  }
)(MainMenu);
