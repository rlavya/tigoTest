import { connect } from "react-redux";
import { siteTree } from "../../siteTree";
import { dataForId, configToId } from "../../util/db";
import TransactionsOrCommissionsSummary from "../components/TransactionsOrCommissionsSummary";

export default connect(state => {
  const commissions = dataForId(state, configToId("Commission", "list", true));

  return {
    items: commissions,
    pageName: siteTree.CommissionsSummary.name,
    detailViewPageName: siteTree.CommissionsDetail.name
  };
})(TransactionsOrCommissionsSummary);
