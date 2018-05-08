import { Responder } from "../util/routeResponder";
import { dataForId, configToId } from "../util/db";
import filter from "lodash/filter";
import map from "lodash/map";
import get from "lodash/get";
import { track } from "../util/tracker";

export default class TrackPackageListView extends Responder {
  static params({ page, category }) {
    if (page === "PackagesPacks" && category) {
      return { category };
    }
  }

  stop() {
    const state = this.store.getState();
    const packages = dataForId(state, configToId("Package", "list", true));

    const category = this.params.category;

    const categoryPackages = filter(packages.data, p => {
      return p.category === category;
    });

    const suggestedItems = filter(categoryPackages, p => {
      return p.suggested === "true";
    });

    const trackableProducts = map(categoryPackages, p => {
      return {
        product_id: p.productId,
        name: p.name,
        price: p.displayPrice,
        variant: "PACKAGE",
        category: p.category
      };
    });

    const trackableData = {
      list_id: category,
      category,
      products: trackableProducts,
      suggested_amount: get(suggestedItems, "[0].displayPrice")
    };

    navigator.geolocation.getCurrentPosition(
      info => {
        track("Product List Viewed", {
          ...trackableData,
          latitude: get(info, "coords.latitude"),
          longitude: get(info, "coords.longitude")
        });
      },
      () => {
        track("Product List Viewed", { ...trackableData });
      },
      { maximumAge: 300000 }
    );
  }
}
