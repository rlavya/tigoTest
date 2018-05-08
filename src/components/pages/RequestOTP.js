import React, { Component } from "react";
import PageTitle from "../components/PageTitle";
import TextField from "material-ui/TextField";
import { lightBlue200, indigo300 } from "material-ui/styles/colors";
import RaisedButton from "material-ui/RaisedButton";
import get from "lodash/get";
import {
  updateRequestOTPPhoneAction,
  requestOTPAction
} from "../../actionCreators/auth.js";
import { connect } from "react-redux";
import {
  isPhoneNumberValid,
  cleanPhoneNumber,
  onEnterAction
} from "../../util";

const styles = {
  styledHint: {
    color: indigo300,
    fontWeight: 300
  },
  underlineStyle: {
    border: "1px dashed",
    color: lightBlue200
  }
};

export class RequestOTP extends Component {
  render() {
    const onEnter = onEnterAction(() => {
      if (isPhoneNumberValid(cleanPhoneNumber(this.props.phoneNumber))) {
        this.props.onSubmit();
      }
    });

    return (
      <PageTitle page="OTP">
        <div className="max-width-4 mx-auto">
          <div className="center">
            <h1 className="light text-primary h2">
              Ayúdanos a identificar <br />tu número móvil Tigo
            </h1>
            <div className="">
              <img alt="" src="/images/icn-ClientPhoneNumber.png" />
              <TextField
                id="request-otp-phone"
                underlineFocusStyle={{ borderColor: lightBlue200 }}
                floatingLabelStyle={{ color: indigo300 }}
                hintStyle={styles.styledHint}
                floatingLabelText="Teléfono"
                hintText="xxxxxxxx"
                type="tel"
                pattern="[0-9]*"
                inputStyle={{ fontSize: "1.5rem" }}
                onChange={this.props.onInputChange}
                value={cleanPhoneNumber(this.props.phoneNumber) || ""}
                onKeyDown={onEnter}
              />
            </div>
            <br />
            <RaisedButton
              label="Continuar"
              secondary={true}
              className="mt2"
              onClick={this.props.onSubmit}
              disabledBackgroundColor="#CAF1F6"
              disabledLabelColor="#FFF"
              disabled={
                !isPhoneNumberValid(cleanPhoneNumber(this.props.phoneNumber))
              }
            />
          </div>
        </div>
      </PageTitle>
    );
  }
}

export default connect(
  state => {
    return {
      phoneNumber: get(state, "auth.otpRequestPhoneNumber") || ""
    };
  },
  dispatch => {
    return {
      onInputChange: (e, value) => {
        console.log("INPUT CHANGE", e, value);
        dispatch(updateRequestOTPPhoneAction(value));
      },
      onSubmit: (e, value) => {
        dispatch(requestOTPAction());
      }
    };
  }
)(RequestOTP);
