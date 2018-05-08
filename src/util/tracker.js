import get from "lodash/get";

export const identify = (userId, traits) => {
  if (process.env.REACT_APP_SEGMENT_TRACK === "TRUE") {
    if (userId) {
      console.log("IDENTIFYING SEGMENT", userId, traits);
      window.analytics.identify(userId, traits);
    } else {
      console.log("IDENTIFYING SEGMENT", traits);
      window.analytics.identify(traits);
    }
  } else {
    console.log("IDENTIFYING", userId, traits);
  }
};

export const identifyGenericInfo = () => {
  const defaultInfo = { useragent: navigator.userAgent };
  track("Permission Required Notified", { permission: "geolocation" });
  navigator.geolocation.getCurrentPosition(
    info => {
      track("Permission Required Granted", { permission: "geolocation" });
      identify(null, {
        ...defaultInfo,
        latitude: get(info, "coords.latitude"),
        longitude: get(info, "coords.longitude")
      });
    },
    () => {
      track("Permission Required Denied", { permission: "geolocation" });
      identify(null, defaultInfo);
    },
    { maximumAge: 300000 }
  );
};

export const track = (event, payload = {}) => {
  if (process.env.REACT_APP_SEGMENT_TRACK === "TRUE") {
    window.analytics.track(event, payload);
  }
  console.log("TRACK SEGMENT", event, payload);
};

let __LAST_PAGE__;

export const screen = page => {
  let resolvedPage = null;
  switch (page) {
    case "__LOGIN__":
      resolvedPage = "Login";
      break;
    case "ChangePin":
      resolvedPage = "Change password";
      break;
    case "MainMenu":
      resolvedPage = "Main Menu";
      break;
    case "TopupDataEntry":
      resolvedPage = "Top-up Data entry";
      break;
    case "TopupReview":
      resolvedPage = "Top-up Review";
      break;
    case "TopupConfirmation":
      resolvedPage = "Top-up - Confirmation";
      break;
    case "PackagesCategories":
      resolvedPage = "Products";
      break;
    case "PackagesPacks":
      resolvedPage = "Products - Promos - Packs";
      break;
    case "PackagesDetails":
      resolvedPage = "Products - Promos - Details";
      break;
    case "PackagesReview":
      resolvedPage = "Products - Promos - Review";
      break;
    case "PackagesConfirmation":
      resolvedPage = "Packages - Confirmation";
      break;
    default:
      resolvedPage = null;
  }

  if (resolvedPage && resolvedPage !== __LAST_PAGE__) {
    __LAST_PAGE__ = resolvedPage;
    if (process.env.REACT_APP_SEGMENT_TRACK === "TRUE") {
      window.analytics.page(resolvedPage);
    }
    console.log("SCREEN SEGMENT", resolvedPage);
  }
};
