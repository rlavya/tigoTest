import { Responder, managedResponder } from "../../util/routeResponder";

const mockStore = {};

class Responder1 extends Responder {
  static params(routeParams) {
    if (routeParams.page === "articles") {
      return { page: routeParams.page, id: routeParams.id };
    }
  }
}

const responder1Start = jest.fn();
const responder1Stop = jest.fn();
const responder1RouteChanged = jest.fn();

Responder1.prototype.start = responder1Start;
Responder1.prototype.stop = responder1Stop;
Responder1.prototype.routeChanged = responder1RouteChanged;

it("will correctly run all the lifecycle functions", () => {
  let managedResponder1 = managedResponder(Responder1);

  managedResponder1(mockStore, { page: "articles" }, {});
  expect(managedResponder1.getCurrentInstance()).toBeTruthy();
  expect(managedResponder1.getCurrentInstance().params).toEqual({
    page: "articles",
  });
  expect(responder1Start.mock.calls.length).toBe(1);
  expect(responder1Stop.mock.calls.length).toBe(0);
  expect(responder1RouteChanged.mock.calls.length).toBe(0);

  managedResponder1(mockStore, { page: "news" }, {});
  expect(responder1Start.mock.calls.length).toBe(1);
  expect(responder1Stop.mock.calls.length).toBe(1);
  expect(responder1RouteChanged.mock.calls.length).toBe(0);

  managedResponder1(mockStore, { page: "articles" }, {});
  expect(responder1Start.mock.calls.length).toBe(2);
  expect(responder1Stop.mock.calls.length).toBe(1);
  expect(responder1RouteChanged.mock.calls.length).toBe(0);

  managedResponder1(mockStore, { page: "articles", id: 1 });
  expect(responder1Start.mock.calls.length).toBe(3);
  expect(responder1Stop.mock.calls.length).toBe(2);
  expect(responder1RouteChanged.mock.calls.length).toBe(0);
  expect(managedResponder1.getCurrentInstance().params).toEqual({
    page: "articles",
    id: 1,
  });

  managedResponder1(mockStore, { page: "articles", id: 1, foo: "bar" });
  expect(responder1Start.mock.calls.length).toBe(3);
  expect(responder1Stop.mock.calls.length).toBe(2);
  expect(responder1RouteChanged.mock.calls.length).toBe(1);
  expect(responder1RouteChanged.mock.calls[0][0]).toEqual({});
  expect(responder1RouteChanged.mock.calls[0][1]).toEqual({
    page: "articles",
    id: 1,
    foo: "bar",
  });
  expect(managedResponder1.getCurrentInstance().params).toEqual({
    page: "articles",
    id: 1,
  });

  managedResponder1(mockStore, { page: "foo" });
  expect(managedResponder1.getCurrentInstance()).toBe(null);
});
