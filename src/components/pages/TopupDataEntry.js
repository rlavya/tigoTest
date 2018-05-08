import React, { Component } from "react";
import PageTitle from "../components/PageTitle";
import FlatButton from "material-ui/FlatButton";
import { redirectTo } from "../../router";
import { lightBlue200 } from "material-ui/styles/colors";
import filter from "lodash/filter";
import map from "lodash/map";
import { connect } from "react-redux";
import { siteTree } from "../../siteTree";
import { dataForId, configToId } from "../../util/db";
import Checkbox from "material-ui/Checkbox";
import { Card, CardTitle, CardText } from "material-ui/Card";
import RadioButtonCheckedIcon from "material-ui/svg-icons/toggle/radio-button-checked";
import RadioButtonUncheckedIcon from "material-ui/svg-icons/toggle/radio-button-unchecked";
import styled from "styled-components";
import get from "lodash/get";
import { formatPhoneNumber } from "../../util/index";

const CardWrap = styled.div`
  padding: 15px;
`;

const ItemWrap = styled.div`
  width: 50%;
  float: left;
  font-size: 150%;
  padding: 5px 0;
`;

const Items = ({ items, selected }) => {
  return (
    <div className="clearfix">
      {map(items, i => {
        return (
          <ItemWrap key={i.id}>
            <Checkbox
              label={"Q" + i.price}
              checked={i.id === selected}
              checkedIcon={
                <RadioButtonCheckedIcon
                  style={{ color: lightBlue200, fill: lightBlue200 }}
                />
              }
              uncheckedIcon={
                <RadioButtonUncheckedIcon
                  style={{ color: lightBlue200, fill: lightBlue200 }}
                />
              }
              onCheck={() => {
                redirectTo({ id: i.id }, true);
              }}
            />
          </ItemWrap>
        );
      })}
    </div>
  );
};

const Loading = props => {
  return (
    <CardWrap>
      <Card>
        <CardTitle
          style={{ background: "#2e60aa", color: "white" }}
          subtitleColor="white"
          subtitle={"..."}
        />
        <CardText>
          <div className="clearfix">
            {map(new Array(3), (_, i) => {
              return (
                <ItemWrap key={i}>
                  <Checkbox
                    label={
                      <span
                        style={{
                          width: "60px",
                          height: "10px",
                          background: "#ccc",
                          display: "inline-block",
                          borderRadius: "5px"
                        }}
                      />
                    }
                    checkedIcon={
                      <RadioButtonCheckedIcon
                        style={{ color: lightBlue200, fill: lightBlue200 }}
                      />
                    }
                    uncheckedIcon={
                      <RadioButtonUncheckedIcon
                        style={{ color: lightBlue200, fill: lightBlue200 }}
                      />
                    }
                  />
                </ItemWrap>
              );
            })}
          </div>
        </CardText>
      </Card>
    </CardWrap>
  );
};

const RenderItemGroup = ({ title, items, selected }) => {
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
          <Items items={items} selected={selected} />
        </CardText>
      </Card>
    </CardWrap>
  );
};

export class TopupDataEntry extends Component {
  render() {
    return (
      <PageTitle page={this.props.pageName}>
        <div className="max-width-4 mx-auto">
          {this.props.items.state === "loading" ? (
            <Loading />
          ) : (
            <div>
              <RenderItemGroup
                title={"RECOMENDADOS PARA " + this.props.clientPhoneNumber}
                items={this.props.suggestedItems}
                selected={this.props.selected}
              />
              <RenderItemGroup
                title={"TODAS LAS RECARGAS"}
                items={this.props.notSuggestedItems}
                selected={this.props.selected}
              />
              {this.props.hasItems ? (
                <div className="center">
                  <FlatButton
                    secondary={true}
                    label="Siguiente"
                    disabled={!this.props.topupId}
                    onClick={() => {
                      redirectTo({
                        page: "TopupReview",
                        id: this.props.selected
                      });
                    }}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </PageTitle>
    );
  }
}

export default connect(state => {
  const topups = dataForId(state, configToId("Topup", "list", true));
  const topupId = get(state, "route.id");

  const hasItems = (get(topups, "data") || []).length > 0;

  const suggestedItems = filter(topups.data, t => {
    return t.suggested === "true";
  });

  const notSuggestedItems = filter(topups.data, t => {
    return t.suggested === "false";
  });

  const clientPhoneNumber = formatPhoneNumber(
    get(state, "clientPhone.phoneNumber")
  );

  return {
    items: topups,
    suggestedItems,
    notSuggestedItems,
    pageName: siteTree.TopupDataEntry.name,
    selected: state.route.id,
    clientPhoneNumber,
    topupId,
    hasItems
  };
})(TopupDataEntry);
