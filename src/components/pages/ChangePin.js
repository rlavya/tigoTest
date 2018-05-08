import React, { Component } from "react";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import PageTitle from "../components/PageTitle";
import { lightBlue200, indigo300 } from "material-ui/styles/colors";
import get from "lodash/get";
import { connect } from "react-redux";
import {
  updateNewPinAction,
  updateOldPinAction,
  changePinAction
} from "../../actionCreators/auth.js";
import { onEnterAction } from "../../util";
import styled from "styled-components";

const InputWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    display: block;
    margin-bottom: -23px;
    margin-right: 10px;
    margin-left: -30px;
  }
`;

export class ChangePin extends Component {
  render() {
    const changePinIfValid = onEnterAction(() => {
      if (this.props.oldPin.trim() !== "" && this.props.newPin.trim() !== "") {
        this.props.changePin();
      }
    });

    return (
      <PageTitle page="ChangePin">
        <div className="max-width-4 mx-auto">
          <div className="clearfix center">
            <h1 className="light text-primary h2">Ingresa tus credenciales:</h1>

            <div className="masked-input">
              <InputWrap>
                <img src="/images/icn-password.png" alt="" />
                <TextField
                  underlineFocusStyle={{ borderColor: lightBlue200 }}
                  floatingLabelStyle={{ color: indigo300 }}
                  floatingLabelText="PIN ACTUAL"
                  type="tel"
                  pattern="[0-9]*"
                  id="oldPin"
                  value={this.props.oldPin}
                  onChange={this.props.updateOldPin}
                  onKeyDown={changePinIfValid}
                />
              </InputWrap>
            </div>
            <br />
            <div className="masked-input">
              <InputWrap>
                <img src="/images/icn-password-new.png" alt="" />
                <TextField
                  underlineFocusStyle={{ borderColor: lightBlue200 }}
                  floatingLabelStyle={{ color: indigo300 }}
                  floatingLabelText="PIN NUEVO"
                  type="tel"
                  pattern="[0-9]*"
                  id="newPin"
                  value={this.props.newPin}
                  onChange={this.props.updateNewPin}
                  onKeyDown={changePinIfValid}
                />
              </InputWrap>
            </div>
            <br />

            <RaisedButton
              className="mt2"
              secondary={true}
              label="Cambiar"
              onClick={this.props.changePin}
              disabledBackgroundColor="#CAF1F6"
              disabledLabelColor="#FFF"
              disabled={
                this.props.oldPin.trim() === "" ||
                this.props.newPin.trim() === ""
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
      oldPin: get(state, "auth.pinChange.old") || "",
      newPin: get(state, "auth.pinChange.new") || ""
    };
  },
  dispatch => {
    return {
      updateOldPin: (e, value) => {
        return dispatch(updateOldPinAction(value));
      },
      updateNewPin: (e, value) => {
        return dispatch(updateNewPinAction(value));
      },
      changePin: (e, value) => {
        return dispatch(changePinAction());
      }
    };
  }
)(ChangePin);
