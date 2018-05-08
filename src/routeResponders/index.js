import map from "lodash/map";
import { managedResponder } from "../util/routeResponder";
import api from "../api";

import AnimatePage from "./animatePage";
import PackagesLoader from "./packagesLoader";
import TopupsLoader from "./topupsLoader";
import SalesLoader from "./salesLoader";
import AuthLoader from "./authLoader";
import ChangePinLoader from "./changePinLoader";
import PendingSaleCleaner from "./pendingSaleCleaner";
import TrackPackageListView from "./trackPackageListView";
import TrackPackageView from "./trackPackageView";

const responderContext = {
  redirect(url) {
    window.location.hash = url;
  },
  api
};

export default map(
  [
    AnimatePage,
    PackagesLoader,
    TopupsLoader,
    SalesLoader,
    AuthLoader,
    ChangePinLoader,
    PendingSaleCleaner,
    TrackPackageListView,
    TrackPackageView
  ],
  R => managedResponder(R, responderContext)
);
