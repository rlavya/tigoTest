import { Responder } from "../util/routeResponder";
import { dataForId, configToId } from "../util/db";
import filter from "lodash/filter";
import map from "lodash/map";
import get from "lodash/get";
import { track } from "../util/tracker";
import { getPackageById } from "../util";

export default class TrackPackageView extends Responder {
  static params({ page, id }) {
    if (page === "PackagesDetails") {
      return { id };
    }
  }

  stop() {
    const state = this.store.getState();
    const p = getPackageById(state, this.params.id);
    const packages = dataForId(state, configToId("Package", "list", true));
    const category = p.category;

    const categoryPackages = filter(packages.data, p => {
      return p.category === category;
    });

    const suggestedItems = filter(categoryPackages, p => {
      return p.suggested === "true";
    });

    const categoryPackagesNames = map(packages, p => p.name);
    const position = categoryPackagesNames.indexOf(p.name) + 1;

    const trackableData = {
      product_id: p.productId,
      category: p.category,
      name: p.name,
      brand: "Tigo Guatemala",
      variant: "PACKAGE",
      price: p.displayPrice,
      quantity: 1,
      currency: p.currency,
      position: position,
      suggested_amount: get(suggestedItems, "[0].displayPrice")
    };

    navigator.geolocation.getCurrentPosition(
      info => {
        track("Product Viewed", {
          ...trackableData,
          latitude: get(info, "coords.latitude"),
          longitude: get(info, "coords.longitude")
        });
      },
      () => {
        track("Product Viewed", { ...trackableData });
      },
      { maximumAge: 300000 }
    );
  }
}
