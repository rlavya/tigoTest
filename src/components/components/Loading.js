import React from "react";
import map from "lodash/map";
import { TableRow, TableRowColumn } from "material-ui/Table";

const LoadingBar = ({ width }) => {
  return (
    <div
      style={{
        height: "10px",
        background: "#ccc",
        width: width + "%",
        borderRadius: "5px"
      }}
    />
  );
};

export const renderTransactionSummaryLoading = () => {
  return map(new Array(5), (v, i) => {
    return (
      <TableRow selectable={false} key={"loader" + i}>
        <TableRowColumn>
          <LoadingBar width={95} />
        </TableRowColumn>
        <TableRowColumn>
          <LoadingBar width={70} />
        </TableRowColumn>
        <TableRowColumn>
          <LoadingBar width={70} />
        </TableRowColumn>
      </TableRow>
    );
  });
};

export const renderCommissionSummaryLoading = renderTransactionSummaryLoading;
