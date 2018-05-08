import React, { Component } from "react";
import PageTitle from "../components/PageTitle";
import { redirectTo } from "../../router";
import map from "lodash/map";
import { connect } from "react-redux";
import { siteTree } from "../../siteTree";
import { dataForId, configToId } from "../../util/db";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";

const formatDateTime = (dateTime = "") => {
  const [date, time] = dateTime.split(" ");
  return [
    date
      .split("-")
      .reverse()
      .join("/"),
    time
  ];
};

const formatPhoneNumber = (phoneNumber = "") => {
  return phoneNumber.substr(3, 4) + " " + phoneNumber.substr(7);
};

const formatTransactionId = (transactionId = "") => {
  const parts = transactionId.split(".");
  const first = parts.shift();
  return [first + ".", parts.join(".")];
};

const renderItemsTable = items => {
  return map(items.data, i => {
    const [date, time] = formatDateTime(i.transactionDate);
    const formattedTransactionId = formatTransactionId(i.transactionId);
    return (
      <TableRow key={i.transactionId}>
        <TableRowColumn style={{ paddingLeft: 0 }}>
          <span className="text-medium text-fw-100">
            {date}
            <br />
            {time}
          </span>
        </TableRowColumn>
        <TableRowColumn style={{ paddingLeft: 0 }}>
          <span className="text-medium text-fw-100">
            {formattedTransactionId[0]}
            <br />
            {formattedTransactionId[1]}
          </span>
        </TableRowColumn>
        <TableRowColumn style={{ paddingLeft: 0 }}>
          <span className="text-medium text-fw-100">
            {formatPhoneNumber(i.msisdn)}
          </span>
        </TableRowColumn>
        <TableRowColumn style={{ paddingLeft: 0 }}>
          <span className="text-medium text-fw-100">{i.transactionAmount}</span>
        </TableRowColumn>
      </TableRow>
    );
  });
};

const renderLoadingTable = () => {
  return map(new Array(3), (_, i) => {
    return (
      <TableRow key={i}>
        <TableRowColumn style={{ paddingLeft: 0 }}>
          <span className="text-medium text-fw-100">
            <span
              style={{
                width: "60px",
                height: "10px",
                background: "#ccc",
                display: "inline-block",
                borderRadius: "5px"
              }}
            />
            <br />
            <span
              style={{
                width: "30px",
                height: "10px",
                background: "#ccc",
                display: "inline-block",
                borderRadius: "5px"
              }}
            />
          </span>
        </TableRowColumn>
        <TableRowColumn style={{ paddingLeft: 0 }}>
          <span className="text-medium text-fw-100">
            <span
              style={{
                width: "40px",
                height: "10px",
                background: "#ccc",
                display: "inline-block",
                borderRadius: "5px"
              }}
            />
            <br />
            <span
              style={{
                width: "80px",
                height: "10px",
                background: "#ccc",
                display: "inline-block",
                borderRadius: "5px"
              }}
            />
          </span>
        </TableRowColumn>
        <TableRowColumn style={{ paddingLeft: 0 }}>
          <span className="text-medium text-fw-100">
            <span
              style={{
                width: "60px",
                height: "10px",
                background: "#ccc",
                display: "inline-block",
                borderRadius: "5px"
              }}
            />
          </span>
        </TableRowColumn>
        <TableRowColumn style={{ paddingLeft: 0 }}>
          <span className="text-medium text-fw-100">
            <span
              style={{
                width: "30px",
                height: "10px",
                background: "#ccc",
                display: "inline-block",
                borderRadius: "5px"
              }}
            />
          </span>
        </TableRowColumn>
      </TableRow>
    );
  });
};

export class SalesSummary extends Component {
  render() {
    return (
      <PageTitle page={this.props.pageName}>
        <div className="max-width-4 mx-auto">
          <div className="p2">
            <div className="text-primary text-medium">
              Últimas 3 transacciones
            </div>
            <Table
              fixedHeader={false}
              style={{ tableLayout: "auto" }}
              selectable={false}
              onCellClick={(rowNum, columnId) => {
                redirectTo({
                  page: "SalesDetail",
                  id: this.props.items.data[rowNum].transactionId
                });
              }}
            >
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow selectable={false}>
                  <TableHeaderColumn
                    style={{
                      fontWeight: "bold",
                      color: "#00377b",
                      paddingLeft: 0
                    }}
                  >
                    Fecha y Hora
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    style={{
                      fontWeight: "bold",
                      color: "#00377b",
                      paddingLeft: 0
                    }}
                  >
                    ID
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    style={{
                      fontWeight: "bold",
                      color: "#00377b",
                      paddingLeft: 0
                    }}
                  >
                    Teléfono
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    style={{
                      fontWeight: "bold",
                      color: "#00377b",
                      paddingLeft: 0
                    }}
                  >
                    Valor
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {this.props.items.state === "loading"
                  ? renderLoadingTable()
                  : renderItemsTable(this.props.items)}
              </TableBody>
            </Table>
          </div>
        </div>
      </PageTitle>
    );
  }
}

export default connect(state => {
  const sales = dataForId(state, configToId("Sales", "list", true));

  return {
    items: sales,
    pageName: siteTree.SalesSummary.name
  };
})(SalesSummary);
