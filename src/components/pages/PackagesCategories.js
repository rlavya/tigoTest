import React, { Component } from "react";
import PageTitle from "../components/PageTitle";
import { List, ListItem } from "material-ui/List";
import ChevronRight from "material-ui/svg-icons/navigation/chevron-right";
import Divider from "material-ui/Divider";
import { redirectTo } from "../../router";
import { connect } from "react-redux";
import { dataForId, configToId } from "../../util/db";
import reduce from "lodash/reduce";
import map from "lodash/map";

const CATEGORY_ICONS = {
  datos: "internet",
  voz: "calls",
  internet: "internet",
  mixtos: "mixtos",
  especiales: "especiales",
  "antenita tigo star": "antenitaTigoStar",
  __fallback: "misc"
};

const Categories = ({ categories }) => {
  return (
    <List>
      {map(categories, c => {
        const icon =
          CATEGORY_ICONS[(c || "").toLowerCase()] || CATEGORY_ICONS.__fallback;
        console.log(c, CATEGORY_ICONS[(c || "").toLowerCase()], CATEGORY_ICONS);
        return (
          <div key={c}>
            <ListItem
              primaryText={c}
              rightIcon={<ChevronRight color="#4CC5F2" />}
              leftAvatar={
                <img
                  src={"/images/icn-" + icon + ".png"}
                  alt=""
                  style={{ top: "3px" }}
                />
              }
              onClick={() => {
                redirectTo({ page: "PackagesPacks", category: c });
              }}
            />
            <Divider />
          </div>
        );
      })}
    </List>
  );
};

const Loading = props => {
  return (
    <List>
      {map(new Array(2), (_, i) => {
        return (
          <div key={i}>
            <ListItem
              primaryText={
                <span
                  style={{
                    width: "60px",
                    height: "11px",
                    background: "#ccc",
                    display: "inline-block",
                    borderRadius: "6px",
                    margin: "5px 0"
                  }}
                />
              }
              rightIcon={<ChevronRight />}
            />
            <Divider />
          </div>
        );
      })}
    </List>
  );
};

export class PackagesCategories extends Component {
  render() {
    return (
      <PageTitle page="PackagesCategories">
        <div className="max-width-4 mx-auto">
          {this.props.items.state === "loading" ? (
            <Loading />
          ) : (
            <Categories categories={this.props.categories} />
          )}
        </div>
      </PageTitle>
    );
  }
}

export default connect(state => {
  const packages = dataForId(state, configToId("Package", "list", true));

  const categories = reduce(
    packages.data,
    (acc, p) => {
      const category = p.category;
      if (acc.indexOf(category) === -1) {
        acc.push(category);
      }
      return acc;
    },
    []
  );

  return {
    items: packages,
    categories
  };
})(PackagesCategories);
