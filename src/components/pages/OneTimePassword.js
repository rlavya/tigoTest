import React, { Component } from "react";
import PageTitle from "../components/PageTitle";
import TextField from "material-ui/TextField";
import { lightBlue200, indigo300 } from "material-ui/styles/colors";
import RaisedButton from "material-ui/RaisedButton";
import StatusMessage from "../components/StatusMessage";

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

class OneTimePassword extends Component {
  render() {
    return (
      <PageTitle page="OTP">
        <div className="max-width-4 mx-auto">
          <StatusMessage
            type="error"
            text="El código de verificación no es correcto, por favor ingrésalo de nuevo."
          />
          <StatusMessage
            type="success"
            text="El código se ha reenviado con éxito."
          />
          <StatusMessage
            type="warning"
            text="Tu saldo disponsible es muy bajo. No olvides recargar para seguir vendiendo!"
          />
          <div className="center">
            <h1 className="light text-primary h2">
              Ayúdanos a identificar <br />tu número móvil Tigo
            </h1>
            <TextField
              underlineFocusStyle={{ borderColor: lightBlue200 }}
              floatingLabelStyle={{ color: indigo300 }}
              hintStyle={styles.styledHint}
              floatingLabelText="Teléfono"
              hintText="xxxx-xxxx"
              type="tel"
              pattern="[0-9]*"
            />
            <br />
            <RaisedButton label="Continuar" secondary={true} className="mt2" />
          </div>
          <div className="center">
            <h1 className="light text-primary h2">
              Ingresa el código <br />de verificación
            </h1>
            <div className="mt3">
              <p className="regular text-primary inline">
                Te enviamos un SMS al
              </p>
              <p className="bold text-primary inline">+502 2569 2587</p>
            </div>
            <TextField
              underlineFocusStyle={{ borderColor: lightBlue200 }}
              floatingLabelStyle={{ color: indigo300 }}
              underlineStyle={styles.underlineStyle}
              type="tel"
              pattern="[0-9]*"
              style={{ fontSize: "2.5rem", textAlign: "center" }}
              className="mt2"
            />
            <br />
            <RaisedButton label="Continuar" secondary={true} className="my2" />
            <br />
            <p className="inline">?No recibiste el código?</p>
            <p className="inline pointer" style={{ color: lightBlue200 }}>
              {" "}
              Enviar de nuevo.
            </p>
          </div>
        </div>
      </PageTitle>
    );
  }
}

export default OneTimePassword;
