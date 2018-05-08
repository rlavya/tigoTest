import React, { Component } from "react";
import PageTitle from "../components/PageTitle";
import { urlFor } from "../../router";
import filter from "lodash/filter";
import map from "lodash/map";
import { connect } from "react-redux";
import { siteTree } from "../../siteTree";
import { dataForId, configToId } from "../../util/db";
import { Card, CardTitle, CardText } from "material-ui/Card";
import styled from "styled-components";
import Divider from "material-ui/Divider";
import get from "lodash/get";
import { formatPhoneNumber } from "../../util/index";
import { track } from "../../util/tracker";

const CardWrap = styled.div`
  padding: 15px;
`;

const PackageLink = styled.a`
  display: block;
`;

const Loading = props => {
  return <div className="center mt2">Loading...</div>;
};

const Items = ({ items, suggestedAmount }) => {
  return (
    <div>
      {map(items, i => {
        return (
          <PackageLink
            href={urlFor({ page: "PackagesReview", id: i.id })}
            key={i.id}
            className="text-decoration-none"
            onClick={() => {
              track("Product Clicked/tapped", {
                product_id: i.productId,
                category: i.category,
                name: i.name,
                variant: "PACKAGE",
                price: i.price,
                quantity: 1,
                currency: i.currency,
                suggested_amount: suggestedAmount
              });
            }}
          >
            <div className="flex justify-between items-center py2">
              <div className="text-primary">{i.name}</div>
              <div className="h2 text-secondary">
                {i.currency}
                {i.displayPrice}
              </div>
            </div>
            <Divider />
          </PackageLink>
        );
      })}
    </div>
  );
};

const ItemsCard = ({ title, items, suggestedAmount }) => {
  console.log(title, items);
  if (!items || !items.length) {
    return null;
  }
  return (
    <CardWrap>
      <Card>
        <CardTitle
          style={{ background: "#2e60aa", color: "white" }}
          subtitleColor="white"
          subtitle={title}
        />
        <CardText>
          <Items items={items} suggestedAmount={suggestedAmount} />
        </CardText>
      </Card>
    </CardWrap>
  );
};

export class PackagesPacks extends Component {
  render() {
    return (
      <PageTitle title={this.props.pageTitle} page={this.props.pageName}>
        <div className="max-width-4 mx-auto">
          {this.props.items.state === "loading" ? (
            <Loading />
          ) : (
            <div>
              <ItemsCard
                title={"RECOMENDADOS PARA " + this.props.clientPhoneNumber}
                items={this.props.suggestedItems}
                suggestedAmount={this.props.suggestedAmount}
              />
              <ItemsCard
                title={"PAQUETIGOS DISPONIBLES"}
                items={this.props.notSuggestedItems}
                suggestedAmount={this.props.suggestedAmount}
              />
            </div>
          )}
        </div>
      </PageTitle>
    );
  }
}

export default connect(state => {
  const packages = dataForId(state, configToId("Package", "list", true));

  const category = get(state, "route.category");
  const pageTitle = get(state, "route.category");

  const categoryPackages = filter(packages.data, p => {
    return p.category === category;
  });

  const suggestedItems = filter(categoryPackages, p => {
    return p.suggested === "true";
  });

  const notSuggestedItems = filter(categoryPackages, p => {
    return p.suggested === "false";
  });

  const clientPhoneNumber = formatPhoneNumber(
    get(state, "clientPhone.phoneNumber")
  );

  return {
    items: packages,
    suggestedItems,
    suggestedAmount: get(suggestedItems, "[0].price"),
    notSuggestedItems,
    pageTitle,
    pageName: siteTree.PackagesPacks.name,
    clientPhoneNumber
  };
})(PackagesPacks);
