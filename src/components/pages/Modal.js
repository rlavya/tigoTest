import React, { Component } from "react";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import PageTitle from "../components/PageTitle";
import { lightBlue200, indigo300 } from "material-ui/styles/colors";

import Dialog from "material-ui/Dialog";

class Modal extends Component {
  state = { open: true };
  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  render() {
    return (
      <PageTitle page="Login">
        <div className="max-width-4 mx-auto">
          <div className="clearfix center">
            <h1 className="regular text-primary h3">
              Ingresa tus credenciales
            </h1>

            <TextField
              underlineFocusStyle={{ borderColor: lightBlue200 }}
              floatingLabelStyle={{ color: indigo300 }}
              floatingLabelText="DMS ID"
              type="tel"
              pattern="[0-9]*"
            />
            <br />
            <TextField
              underlineFocusStyle={{ borderColor: lightBlue200 }}
              floatingLabelStyle={{ color: indigo300 }}
              floatingLabelText="ePIN"
              type="tel"
              pattern="[0-9]*"
            />
            <br />

            <RaisedButton
              className="mt2"
              secondary={true}
              label="Iniciar"
              onClick={this.handleOpen}
            />
          </div>
          <Dialog
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
            className="center"
          >
            <h2 className="light text-primary">Ingresa tu PIN:</h2>
            <TextField
              underlineFocusStyle={{ borderColor: lightBlue200 }}
              floatingLabelStyle={{ color: indigo300 }}
              floatingLabelText="PIN"
              type="tel"
              pattern="[0-9]*"
            />
            <div className="mt2">
              <RaisedButton
                label="Continuar"
                secondary={true}
                onClick={this.handleClose}
              />
              <br />
              <FlatButton
                label="Cancelar"
                secondary={true}
                keyboardFocused={true}
                onClick={this.handleClose}
              />
            </div>
          </Dialog>
        </div>
      </PageTitle>
    );
  }
}

export default Modal;
