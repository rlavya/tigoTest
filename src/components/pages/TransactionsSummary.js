import { connect } from "react-redux";
import { siteTree } from "../../siteTree";
import { dataForId, configToId } from "../../util/db";
import TransactionsOrCommissionsSummary from "../components/TransactionsOrCommissionsSummary";

export default connect(state => {
  const transactions = dataForId(
    state,
    configToId("Transaction", "list", true)
  );

  return {
    items: transactions,
    pageName: siteTree.TransactionsSummary.name,
    detailViewPageName: siteTree.TransactionsDetail.name
  };
})(TransactionsOrCommissionsSummary);
