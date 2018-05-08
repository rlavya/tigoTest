import React, { Component } from "react";
import PageTitle from "../components/PageTitle";
import FlatButton from "material-ui/FlatButton";
import { redirectTo } from "../../router";
import Divider from "material-ui/Divider";

import filter from "lodash/filter";
import get from "lodash/get";
import { connect } from "react-redux";
import { siteTree } from "../../siteTree";
import { dataForId, configToId } from "../../util/db";

export class PackagesDetails extends Component {
  render() {
    return (
      <PageTitle
        page="PackagesDetails"
        backParams={{
          page: "PackagesPacks",
          category: this.props.package.category
        }}
      >
        <div className="max-width-4 mx-auto">
          <div className="flex justify-between p2">
            <div>
              <h1 className="h5 regular text-primary">
                {this.props.package.name}
              </h1>
            </div>
            <div>
              <h2 className="regular h2 text-primary p0 m0 mt1">
                {this.props.package.currency}
                {this.props.package.displayPrice}
              </h2>
            </div>
          </div>
          <p className="h5 px2 text-tertiary">
            {this.props.package.description}
          </p>
          <Divider />
          <div className="center">
            <FlatButton
              secondary={true}
              label="Siguiente"
              onClick={() => {
                redirectTo({
                  page: "PackagesReview",
                  id: this.props.package.id
                });
              }}
            />
          </div>
        </div>
      </PageTitle>
    );
  }
}
export default connect(state => {
  const packages = dataForId(state, configToId("Package", "list", true));
  const id = get(state, "route.id");

  const pack =
    filter(packages.data, p => {
      return p.id === id;
    })[0] || {};

  const phoneNumber = state.clientPhone.phoneNumber || "";
  let clientPhoneNumber = phoneNumber;

  if (phoneNumber.length > 4) {
    clientPhoneNumber = phoneNumber.slice(0, 4) + " " + phoneNumber.slice(4);
  }

  return {
    pageName: siteTree.PackagesReview.name,
    clientPhoneNumber,
    package: pack
  };
})(PackagesDetails);
