import React, { Component } from "react";
import PageTitle from "../components/PageTitle";

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";

import { renderTransactionSummaryLoading } from "./Loading";
import map from "lodash/map";

const renderItems = items => {
  return map(items, item => {
    return (
      <TableRow selectable={false} key={item.id}>
        <TableRowColumn>{item.time}</TableRowColumn>
        <TableRowColumn>{item.id}</TableRowColumn>
        <TableRowColumn style={{ width: "120px" }}>
          {item.phoneNumber}
        </TableRowColumn>
        <TableRowColumn>{item.value}</TableRowColumn>
      </TableRow>
    );
  });
};

class TransactionsOrCommissionsDetail extends Component {
  render() {
    let body;

    if (this.props.items.state === "loading") {
      body = renderTransactionSummaryLoading();
    } else {
      body = renderItems(this.props.items.data);
    }
    return (
      <div>
        <PageTitle page={this.props.pageName} />
        <div className="text-primary p2">
          <b>Miércoles 23 de agosto</b>
        </div>
        <Table>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow selectable={false}>
              <TableHeaderColumn>Hora</TableHeaderColumn>
              <TableHeaderColumn>ID</TableHeaderColumn>
              <TableHeaderColumn>Teléfono</TableHeaderColumn>
              <TableHeaderColumn>Valor</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>{body}</TableBody>
        </Table>
      </div>
    );
  }
}

export default TransactionsOrCommissionsDetail;
