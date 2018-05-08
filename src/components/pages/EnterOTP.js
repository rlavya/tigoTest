import React, { Component } from "react";
import PageTitle from "../components/PageTitle";
import { lightBlue200 } from "material-ui/styles/colors";
import RaisedButton from "material-ui/RaisedButton";
import get from "lodash/get";
import { connect } from "react-redux";
import TextField from "material-ui/TextField";
import styled from "styled-components";

import {
  requestOtpAction,
  updateOTPCodeAction,
  validateOTPCodeAction
} from "../../actionCreators/auth.js";

import { onEnterAction } from "../../util";

const TextFieldWrap = styled.div`
  margin: 0 auto;
  width: 157px;
`;

export class EnterOTP extends Component {
  render() {
    const onEnter = onEnterAction(() => {
      this.props.validateCode();
    });
    return (
      <PageTitle page="OTP">
        <div className="max-width-4 mx-auto">
          <div className="center">
            <h1 className="light text-primary h2">
              Ingresa el código <br />de verificación
            </h1>
            <div className="mt3">
              <p className="regular text-primary inline">
                Te enviamos un SMS al{" "}
              </p>
              <p className="bold text-primary inline">+{this.props.msisdn}</p>
            </div>
            <TextFieldWrap>
              <TextField
                value={this.props.otpCode}
                onChange={this.props.updateCode}
                id="validate-otp"
                className="mt4 mb1"
                type="tel"
                pattern="[0-9]*"
                fullWidth={true}
                onKeyDown={onEnter}
                underlineStyle={{
                  backgroundImage: "url(/images/segmented_inactive.png)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "2px 0px",
                  height: "2px",
                  border: "none",
                  bottom: "1px"
                }}
                underlineFocusStyle={{
                  backgroundImage: "url(/images/segmented_active.png)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "2px 0px",
                  height: "2px",
                  border: "none",
                  bottom: "1px"
                }}
                inputStyle={{
                  fontSize: "2.5rem",
                  fontFamily: "'Roboto Mono', monospace",
                  letterSpacing: "2px"
                }}
              />
            </TextFieldWrap>
            <br />
            <RaisedButton
              label="Continuar"
              secondary={true}
              className="mt2 mb3"
              disabledBackgroundColor="#CAF1F6"
              disabledLabelColor="#FFF"
              disabled={this.props.otpCode.length < 6}
              onClick={this.props.validateCode}
            />
            <br />
            <p className="inline text-primary mt2">¿No recibiste el código?</p>
            <p
              className="inline pointer"
              style={{ color: lightBlue200 }}
              onClick={this.props.requestNewCode}
            >
              {" "}
              Enviar de nuevo.
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
      msisdn: get(state, "auth.otp.msisdn") || "",
      otpCode: get(state, "auth.otpCode") || ""
    };
  },
  dispatch => {
    return {
      updateCode: (e, value) => {
        return dispatch(updateOTPCodeAction((value || "").trim()));
      },
      validateCode: () => {
        return dispatch(validateOTPCodeAction());
      },
      requestNewCode: () => {
        return dispatch(requestOtpAction({}));
      }
    };
  }
)(EnterOTP);
