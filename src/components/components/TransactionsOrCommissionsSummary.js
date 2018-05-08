import React, { Component } from "react";
import PageTitle from "./PageTitle";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import FlatButton from "material-ui/FlatButton";
import { redirectTo } from "../../router";
//import { renderTransactionSummaryLoading } from "./Loading";
//import map from "lodash/map";

/*const renderItems = items => {
  return map(items, item => {
    return (
      <TableRow selectable={false} key={item.id}>
        <TableRowColumn>{item.period}</TableRowColumn>
        <TableRowColumn>{item.detail}</TableRowColumn>
        <TableRowColumn>{item.value}</TableRowColumn>
      </TableRow>
    );
  });
};*/

export default class TransactionsOrComissionsSummary extends Component {
  render() {
    /*let body;

    if (this.props.items.state === "loading") {
      body = renderTransactionSummaryLoading();
    } else {
      body = renderItems(this.props.items.data);
    }*/

    return (
      <div>
        <PageTitle page={this.props.pageName} />
        <Table fixedHeader={false} style={{ tableLayout: "auto" }}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow selectable={false}>
              <TableHeaderColumn
                style={{ fontWeight: "bold", color: "#00377b" }}
              >
                Miércoles 23 de agosto
              </TableHeaderColumn>
              <TableHeaderColumn />
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            <TableRow selectable={false}>
              <TableRowColumn>Saldo inical del día</TableRowColumn>
              <TableRowColumn style={{ width: "50px" }}>Q123.18</TableRowColumn>
            </TableRow>
            <TableRow selectable={false}>
              <TableRowColumn>Ventas hasta el momento</TableRowColumn>
              <TableRowColumn style={{ width: "50px" }}>Q89.11</TableRowColumn>
            </TableRow>
            <TableRow selectable={false}>
              <TableRowColumn>Disponibile</TableRowColumn>
              <TableRowColumn style={{ width: "50px" }}>Q34.07</TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
        <div className="center">
          <FlatButton
            secondary={true}
            label="Detalles"
            onClick={() => {
              redirectTo({ page: this.props.detailViewPageName });
            }}
          />
        </div>
      </div>
    );
  }
}
