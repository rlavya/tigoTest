import { connect } from "react-redux";
import { siteTree } from "../../siteTree";
import { dataForId, configToId } from "../../util/db";
import { redirectTo } from "../../router";
import TransactionsOrCommissionsDetail from "../components/TransactionsOrCommissionsDetail";

export default connect(
  state => {
    const items = dataForId(
      state,
      configToId("CommissionDetail", "list", true)
    );
    return {
      items,
      pageName: siteTree.TransactionsDetail.name,
      periodFilter: state.route.periodFilter || "hora",
      transactionFilter: state.route.transactionFilter || "todas"
    };
  },
  dispatch => {
    return {
      changePeriodFilter(filter) {
        redirectTo({ periodFilter: filter }, true);
      },
      changeTransactionFilter(filter) {
        redirectTo({ transactionFilter: filter }, true);
      }
    };
  }
)(TransactionsOrCommissionsDetail);
