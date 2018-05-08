// @flow

type SimplePage = {
  name: string,
  parent?: string,
  back?: string
};

export type Page = {
  name: string,
  parent?: Page,
  back?: string,
  children?: Page[]
};

export type SiteTree = { [string]: Page };

export const pages: SimplePage[] = [
  { name: "Frontpage" },
  { name: "Login" },
  { name: "Modal", parent: "Frontpage" },
  { name: "MainMenu" },
  { name: "TopupDataEntry", parent: "MainMenu" },
  { name: "TopupReview", parent: "TopupDataEntry" },
  { name: "TopupConfirmation", parent: "TopupReview", back: "TopupDataEntry" },
  { name: "PackagesCategories", parent: "MainMenu" },
  { name: "PackagesPacks", parent: "PackagesCategories" },
  { name: "PackagesDetails", parent: "PackagesPacks" },
  { name: "PackagesReview", parent: "PackagesDetails" },
  {
    name: "PackagesConfirmation",
    parent: "PackagesReview",
    back: "PackagesDetails"
  },
  { name: "TransactionsSummary", parent: "MainMenu" },
  { name: "TransactionsDetail", parent: "TransactionsSummary" },
  { name: "CommissionsSummary", parent: "MainMenu" },
  { name: "CommissionsDetail", parent: "CommissionsSummary" },
  { name: "SalesSummary", parent: "MainMenu" },
  { name: "SalesDetail", parent: "SalesSummary" },
  { name: "ChangePin", parent: "MainMenu" }
];

export const buildSiteTree = (pages: SimplePage[]): SiteTree => {
  let tree = {};
  for (let i = 0; i < pages.length; i++) {
    let page = pages[i];
    tree[page.name] = page;
  }

  for (let i = 0; i < pages.length; i++) {
    let page = pages[i];
    let parentName = page.parent;

    if (parentName) {
      let parent = tree[parentName];
      page.parent = parent;
      parent.children = parent.children || [];

      parent.children.push(page);
    }
  }
  return tree;
};

export const siteTree: SiteTree = buildSiteTree(pages);

export const parentFor = (pageName: string): Page | void => {
  const page: Page = siteTree[pageName];
  if (page) {
    return page.parent;
  }
};

export const backFor = (pageName: string): Page | Object => {
  let page: Page = siteTree[pageName];
  if (page && page.back) {
    return siteTree[page.back] || {};
  }
  return parentFor(pageName) || {};
};
