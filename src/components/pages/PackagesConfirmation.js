import React, { Component } from "react";
import FlatButton from "material-ui/FlatButton";
import Divider from "material-ui/Divider";
import { getPackageById, formatPhoneNumber } from "../../util/index";
import get from "lodash/get";
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

export class PackagesConfirmation extends Component {
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

          <h2 className="h6 regular text-tertiary p0 mt3 mb0">Paquete</h2>
          <h3 className="regular h5 text-white p0 m0">
            {this.props.package.name}
          </h3>
          <h3 className="regular h5 text-tertiary  p0 m0">
            {this.props.package.description}
          </h3>

          <h2 className="h6 regular text-tertiary p0 mt2 mb0">Valor</h2>
          <h3 className="regular h5 text-white text-big p0 m0">
            {this.props.package.currency}
            {this.props.package.displayPrice}
          </h3>

          <h2 className="h6 regular text-tertiary p0 mt2 mb0">
            Teléfono del usuario
          </h2>
          <h3 className="regular h5 text-white text-big p0 m0 mb2">
            {this.props.clientPhoneNumber}
          </h3>

          <Divider
            style={{
              background: "#406A9C"
            }}
          />
          <br />
          <FlatButton
            secondary={true}
            label="Volver Al Inicio"
            onClick={this.props.clear}
          />
        </div>
      </BluePanel>
    );
  }
}

export default connect(
  state => {
    const pack = getPackageById(state, get(state, "route.id"));

    const clientPhoneNumber = formatPhoneNumber(
      get(state, "clientPhone.phoneNumber")
    );

    return {
      clientPhoneNumber,
      package: pack
    };
  },
  dispatch => {
    return {
      clear: () => dispatch(clearCurrentUserAction())
    };
  }
)(PackagesConfirmation);
