import React, { Component } from "react";
import PageTitle from "../components/PageTitle";

import filter from "lodash/filter";
import get from "lodash/get";
import { connect } from "react-redux";
import { siteTree } from "../../siteTree";
import { dataForId, configToId } from "../../util/db";

import { Table, TableBody, TableRow, TableRowColumn } from "material-ui/Table";

const formatPhoneNumber = (phoneNumber = "") => {
  return phoneNumber.substr(3, 4) + " " + phoneNumber.substr(7);
};

export class SalesDetail extends Component {
  render() {
    return (
      <PageTitle
        page="SalesDetail"
        backParams={{
          page: "SalesSummary"
        }}
      >
        <div className="max-width-4 mx-auto">
          <div className="flex justify-between p2">
            <Table>
              <TableBody displayRowCheckbox={false}>
                <TableRow>
                  <TableRowColumn style={{ paddingLeft: 0, width: "150px" }}>
                    <span className="text-medium ">Fecha y hora</span>
                  </TableRowColumn>
                  <TableRowColumn style={{ paddingLeft: 0 }}>
                    <span className="text-medium text-fw-100">
                      {this.props.sale.transactionDate}
                    </span>
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn style={{ paddingLeft: 0, width: "150px" }}>
                    <span className="text-medium ">Descripción</span>
                  </TableRowColumn>
                  <TableRowColumn style={{ paddingLeft: 0 }}>
                    <span className="text-medium text-fw-100">
                      {this.props.sale.transactionSubType}
                    </span>
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn style={{ paddingLeft: 0, width: "150px" }}>
                    <span className="text-medium ">Valor</span>
                  </TableRowColumn>
                  <TableRowColumn style={{ paddingLeft: 0 }}>
                    <span className="text-medium text-fw-100">
                      {this.props.sale.transactionCurrency}{" "}
                      {this.props.sale.transactionAmount}
                    </span>
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn style={{ paddingLeft: 0, width: "150px" }}>
                    <span className="text-medium ">MSISDN</span>
                  </TableRowColumn>
                  <TableRowColumn style={{ paddingLeft: 0 }}>
                    <span className="text-medium text-fw-100">
                      {formatPhoneNumber(this.props.sale.msisdn)}
                    </span>
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn style={{ paddingLeft: 0, width: "150px" }}>
                    <span className="text-medium ">ID</span>
                  </TableRowColumn>
                  <TableRowColumn style={{ paddingLeft: 0 }}>
                    <span className="text-medium text-fw-100">
                      {this.props.sale.transactionId}
                    </span>
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn style={{ paddingLeft: 0, width: "150px" }}>
                    <span className="text-medium ">Tipo de Transacción</span>
                  </TableRowColumn>
                  <TableRowColumn style={{ paddingLeft: 0 }}>
                    <span className="text-medium text-fw-100">
                      {this.props.sale.transactionType}
                    </span>
                  </TableRowColumn>
                </TableRow>
                <TableRow>
                  <TableRowColumn style={{ paddingLeft: 0, width: "150px" }}>
                    <span className="text-medium ">Estatus</span>
                  </TableRowColumn>
                  <TableRowColumn style={{ paddingLeft: 0 }}>
                    <span className="text-medium text-fw-100">
                      {this.props.sale.transactionStatus === "SUCCESS"
                        ? "OK"
                        : "ERROR"}
                    </span>
                  </TableRowColumn>
                </TableRow>
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
  const id = get(state, "route.id");

  const sale =
    filter(sales.data, p => {
      return p.id === id;
    })[0] || {};

  return {
    pageName: siteTree.SalesDetail.name,

    sale: sale
  };
})(SalesDetail);
