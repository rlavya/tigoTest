import React, { Component } from "react";
import Divider from "material-ui/Divider";
import FlatButton from "material-ui/FlatButton";
import get from "lodash/get";
import { getTopupById, formatPhoneNumber } from "../../util/index";
import { connect } from "react-redux";
import styled from "styled-components";
import { clearCurrentUserAction } from "../../actionCreators/selling";

const BluePanel = styled.div`
  background: #00377b;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
`;

export class TopupConfirmation extends Component {
  render() {
    return (
      <BluePanel className="max-width-4 mx-auto">
        <div className="clearfix center">
          <img
            alt=""
            src="/images/icn-sucess-green.png"
            className="mt2"
            style={{
              width: "35px",
              height: "35px"
            }}
          />
          <h1 className="h5 text-white text-big regular mb3 mt1">
            ¡Compra realizada<br />con éxito!
          </h1>
          <Divider
            style={{
              background: "#406A9C"
            }}
          />
          <h5 className="regular text-tertiary p0 m0 mt2">Valor</h5>
          <h4 className="regular text-white text-big p0 m0">
            {this.props.topup.currency}
            {this.props.topup.price}
          </h4>
          <h5 className="regular text-tertiary p0 m0 mt2">
            Teléfono del usuario
          </h5>
          <h4 className="regular text-white text-big p0 m0 mb2">
            {this.props.clientPhoneNumber}
          </h4>
          <Divider
            style={{
              background: "#406A9C"
            }}
          />
          <br />
          <FlatButton
            secondary={true}
            label="Ir Al Inicio"
            onClick={this.props.clear}
          />
        </div>
      </BluePanel>
    );
  }
}

export default connect(
  state => {
    const topup = getTopupById(state, get(state, "route.id"));
    const clientPhoneNumber = formatPhoneNumber(
      get(state, "clientPhone.phoneNumber")
    );

    return {
      topup,
      clientPhoneNumber
    };
  },
  dispatch => {
    return {
      clear: () => dispatch(clearCurrentUserAction())
    };
  }
)(TopupConfirmation);
