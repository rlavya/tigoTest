import React, { Component } from "react";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import PageTitle from "../components/PageTitle";
import { lightBlue200, indigo300 } from "material-ui/styles/colors";
import get from "lodash/get";
import { connect } from "react-redux";
import {
  updatePosPinAction,
  updatePosDMSIDAction,
  loginAction
} from "../../actionCreators/auth.js";
import styled from "styled-components";
import { urlFor } from "../../router";
import { onEnterAction } from "../../util";

const InputWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    display: block;
    margin-bottom: -23px;
    margin-right: 5px;
    margin-left: -15px;
  }
`;

export class Login extends Component {
  render() {
    const loginIfValid = onEnterAction(() => {
      if (this.props.pin.trim() !== "" && this.props.dmsid.trim() !== "") {
        this.props.login();
      }
    });

    return (
      <PageTitle page="Login">
        <div className="max-width-4 mx-auto">
          <div className="clearfix center">
            <h1 className="light text-primary h2">Ingresa tus credenciales:</h1>
            <InputWrap>
              <img src="/images/icn-DMSID.png" alt="" />
              <TextField
                underlineFocusStyle={{ borderColor: lightBlue200 }}
                floatingLabelStyle={{ color: indigo300 }}
                floatingLabelText="DMS ID"
                id="dmsid"
                value={this.props.dmsid}
                onChange={this.props.updateDMSID}
                type="tel"
                pattern="[0-9]*"
                onKeyDown={loginIfValid}
                inputStyle={{ fontSize: "1.5rem" }}
              />
            </InputWrap>
            <InputWrap>
              <img src="/images/icn-password.png" alt="" />
              <div className="masked-input">
                <TextField
                  underlineFocusStyle={{ borderColor: lightBlue200 }}
                  floatingLabelStyle={{ color: indigo300 }}
                  floatingLabelText="PIN"
                  id="password"
                  type="tel"
                  pattern="[0-9]*"
                  value={this.props.pin}
                  onChange={this.props.updatePin}
                  onKeyDown={loginIfValid}
                  inputStyle={{ fontSize: "1.5rem" }}
                />
              </div>
            </InputWrap>
            <br />

            <RaisedButton
              className="mt2"
              secondary={true}
              label="Iniciar"
              onClick={this.props.login}
              disabledBackgroundColor="#CAF1F6"
              disabledLabelColor="#FFF"
              disabled={
                this.props.pin.trim() === "" || this.props.dmsid.trim() === ""
              }
            />
            <br />
            <p>
              <a
                href={urlFor({ page: "ChangePin" })}
                className="text-secondary text-decoration-none light"
              >
                Cambiar PIN
              </a>
            </p>
          </div>
        </div>
      </PageTitle>
    );
  }
}

export default connect(
  state => {
    return {
      dmsid: get(state, "auth.dmsid") || "",
      pin: get(state, "auth.pin") || ""
    };
  },
  dispatch => {
    return {
      updatePin: (e, value) => {
        return dispatch(updatePosPinAction(value));
      },
      updateDMSID: (e, value) => {
        return dispatch(updatePosDMSIDAction(value));
      },
      login: (e, value) => {
        return dispatch(loginAction());
      }
    };
  }
)(Login);
