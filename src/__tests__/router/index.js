import { Router } from "../../router";

let mockStore = {
  dispatch(action) {},
};

it("correctly deparams the URL", () => {
  let r = new Router(mockStore, [[":page", { page: "index" }]], []);

  r.setRouteData("foo.Bar");
  expect(r.get("page")).toEqual("foo.Bar");

  r.setRouteData("");
  expect(r.get("page")).toEqual("index");

  r.setRouteData("foo.Bar?where=there");
  expect(r.get("page")).toEqual("foo.Bar");
  expect(r.get("where")).toEqual("there");

  r = new Router(
    mockStore,
    [[":page/:bar", { page: "index", bar: "foo" }]],
    []
  );

  r.setRouteData("foo.Bar/?where=there");
  expect(r.get("page")).toEqual("foo.Bar");
  expect(r.get("bar")).toEqual("foo");
  expect(r.get("where")).toEqual("there");

  r = new Router(mockStore, [[":foo/bar/:baz"]]);

  r.setRouteData("one/bar/two?qux=1&test=success");
  expect(r.get("foo")).toEqual("one");
  expect(r.get("baz")).toEqual("two");
  expect(r.get("qux")).toEqual("1");
  expect(r.get("test")).toEqual("success");
});

it("correctly deparams the URL with only the query string", () => {
  let r = new Router(mockStore, [], []);

  r.setRouteData("?foo=bar&baz=qux");

  expect(r.get("foo")).toEqual("bar");
  expect(r.get("baz")).toEqual("qux");
});

it("ignores the invalid URL parts", () => {
  let r = new Router(
    mockStore,
    [
      [
        "pages/:var1/:var2/:var3",
        { var1: "default1", var2: "default2", var3: "default3" },
      ],
    ],
    []
  );

  r.setRouteData("pages//");

  expect(r.get("var1")).toEqual(undefined);
  expect(r.get("var2")).toEqual(undefined);
  expect(r.get("var3")).toEqual(undefined);

  r.setRouteData("pages/val1/val2/val3?invalid-param");

  expect(r.get("var1")).toEqual("val1");
  expect(r.get("var2")).toEqual("val2");
  expect(r.get("var3")).toEqual("val3");
  expect(r.get("invalid-param")).toEqual(undefined);
});

it("generates correct the URLs from the params", () => {
  let r = new Router(mockStore, [["pages/:page", { page: "index" }]], []);

  expect(r.urlFor({ page: "foo" })).toEqual("#!pages/foo");
  expect(r.urlFor({ page: "foo", index: "bar" })).toEqual(
    "#!pages/foo?index=bar"
  );

  r.setRouteData("pages/test?index=bar");
  expect(r.urlFor({ index: "baz" }, true)).toEqual("#!pages/test?index=baz");
  expect(r.urlFor({ page: "test2" }, true)).toEqual("#!pages/test2?index=bar");

  r = new Router(mockStore, [
    ["pages/:page", { page: "index" }],
    ["pages/:page/:foo", { page: "index", foo: "bar" }],
  ]);

  expect(r.urlFor({ page: "foo", foo: "bar", where: "there" })).toEqual(
    "#!pages/foo/?where=there"
  );

  r = new Router(mockStore, [], []);
  expect(r.urlFor({ page: "foo", bar: "baz", where: "there" })).toEqual(
    "#!?page=foo&bar=baz&where=there"
  );
});

it("generates the correct URL and deparams it correctly", () => {
  const r = new Router(mockStore, [], []);
  const inputData = {
    page: "=&[]",
    nestedArray: ["a"],
    nested: { a: "b" },
  };
  const url = r.urlFor(inputData);

  expect(url).toEqual(
    "#!?page=%3D%26%5B%5D&nestedArray%5B%5D=a&nested%5Ba%5D=b"
  );

  r.setRouteData(url.substring(2));

  expect(r.get("page")).toEqual("=&[]");
  expect(r.get("nestedArray")).toEqual(["a"]);
  expect(r.get("nested")).toEqual({ a: "b" });
});

it("will not include the param in the URL if it's equal to a default", () => {
  const r = new Router(mockStore, [["pages/:p1", { p2: "foo" }]]);
  const url = r.urlFor({ p1: "index", p2: "foo" });

  expect(url).toEqual("#!pages/index");

  r.setRouteData(url.substring(2));

  expect(r.get("p1")).toEqual("index");
  expect(r.get("p2")).toEqual("foo");
});

it("can go back and forth", () => {
  let r = new Router(mockStore, [
    [":page/:type", { page: "index", type: "foo" }],
  ]);

  let url = r.urlFor({
    page: "foo.Bar",
    type: "document",
    bar: "baz",
    where: "there",
  });
  expect(url).toEqual("#!foo.Bar/document?bar=baz&where=there");

  r.setRouteData(url.substring(2));
  expect(r.get("page")).toEqual("foo.Bar");
  expect(r.get("type")).toEqual("document");
  expect(r.get("bar")).toEqual("baz");
  expect(r.get("where")).toEqual("there");

  url = r.urlFor({
    page: "foo.Bar",
    type: "foo",
    bar: "baz",
    where: "there",
  });
  expect(url).toEqual("#!foo.Bar/?bar=baz&where=there");

  r.setRouteData(url.substring(2));
  expect(r.get("page")).toEqual("foo.Bar");
  expect(r.get("type")).toEqual("foo");
  expect(r.get("bar")).toEqual("baz");
  expect(r.get("where")).toEqual("there");

  url = r.urlFor({
    page: "index",
    type: "foo",
    bar: "baz",
    where: "there",
  });
  expect(url).toEqual("#!/?bar=baz&where=there");

  r.setRouteData(url.substring(2));
  expect(r.get("page")).toEqual("index");
  expect(r.get("type")).toEqual("foo");
  expect(r.get("bar")).toEqual("baz");
  expect(r.get("where")).toEqual("there");

  r = new Router(mockStore, [], []);
  url = r.urlFor({ page: "foo", bar: "baz", where: "there" });

  expect(url).toEqual("#!?page=foo&bar=baz&where=there");

  r.setRouteData(url.substring(2));

  expect(r.get("page")).toEqual("foo");
  expect(r.get("bar")).toEqual("baz");
  expect(r.get("where")).toEqual("there");

  r = new Router(mockStore, [[":foo/:bar", { foo: "1", bar: "2" }]], []);
  url = r.urlFor({ foo: "1", bar: "2" });

  expect(url).toEqual("#!/");

  r.setRouteData(url.substring(2));

  expect(r.get("foo")).toEqual("1");
  expect(r.get("bar")).toEqual("2");
});

it("will follow the correct precedence rules", () => {
  let r = new Router(
    mockStore,
    [[":who", { who: "index" }], ["search/:search"]],
    []
  );

  r.setRouteData("foo.Bar");
  expect(r.get("who")).toEqual("foo.Bar");

  r.setRouteData("search/foo.Bar");
  expect(r.get("search")).toEqual("foo.Bar");

  expect(r.urlFor({ who: "foo.Bar" })).toEqual("#!foo.Bar");
  expect(r.urlFor({ search: "foo.Bar" })).toEqual("#!search/foo.Bar");

  r = new Router(mockStore, [[":type", { who: "index" }], [":type/:id"]], []);

  r.setRouteData("foo/bar");
  expect(r.get("type")).toEqual("foo");
  expect(r.get("id")).toEqual("bar");
  expect(r.get("who")).toEqual(undefined);

  expect(r.urlFor({ type: "foo", id: "bar" })).toEqual("#!foo/bar");
});
