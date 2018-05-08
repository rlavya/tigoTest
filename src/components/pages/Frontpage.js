import React, { Component } from "react";
import { List, ListItem } from "material-ui/List";
import ChevronRight from "material-ui/svg-icons/navigation/chevron-right";
import Divider from "material-ui/Divider";
import { redirectTo } from "../../router";

export class Frontpage extends Component {
  render() {
    return (
      <div className="max-width-4 mx-auto bg-primary height100 flex flex-column">
        <img
          src="http://via.placeholder.com/250x250"
          width="250"
          height="250"
          className="mx-auto my2"
          alt=""
        />
        <List>
          <Divider style={{ backgroundColor: "#406A9C" }} />
          <ListItem
            primaryText={
              <div>
                <b>PDV</b> - Punto de Venta
              </div>
            }
            rightIcon={<ChevronRight color="#4CC5F2" />}
            onClick={() => {
              redirectTo({ page: "Login" });
            }}
            style={{ color: "#fafafa" }}
          />
          <Divider style={{ backgroundColor: "#406A9C" }} />
          <ListItem
            primaryText={
              <div>
                <b>PDA</b> - Punto de Activación
              </div>
            }
            rightIcon={<ChevronRight color="#4CC5F2" />}
            onClick={() => {
              redirectTo({ page: "Login" });
            }}
            style={{ color: "#fafafa" }}
          />
          <Divider style={{ backgroundColor: "#406A9C" }} />
        </List>
      </div>
    );
  }
}

export default Frontpage;
