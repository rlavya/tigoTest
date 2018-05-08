import EntityLoader from "../../routeResponders/entityLoader";
import Promise from "bluebird";

const mockStore = () => {
  return {
    dispatch: jest.fn()
  };
};

class ResolveLoader extends EntityLoader {
  static params() {
    return { params: true };
  }
  getId() {
    return "MOCK_RESOLVE";
  }
  load() {
    return new Promise((resolve, reject) => {
      resolve({ foo: "bar" });
    });
  }
}

class RejectLoader extends EntityLoader {
  static params() {
    return { params: true };
  }
  getId() {
    return "MOCK_REJECT";
  }
  load() {
    return new Promise((resolve, reject) => {
      reject(new Error("Reject Loader"));
    });
  }
}

it("dispatches the correct events when the data is loaded", () => {
  const store = mockStore();
  const mock = new ResolveLoader(ResolveLoader.params(), store, {}, {});

  expect.assertions(3);

  return mock.start().then(data => {
    expect(store.dispatch.mock.calls.length).toBe(2);
    expect(store.dispatch.mock.calls[0]).toEqual([
      {
        type: "DB_UPDATE_FOR_ID",
        payload: {
          state: "loading",
          id: "MOCK_RESOLVE",
          params: ResolveLoader.params()
        }
      }
    ]);
    expect(store.dispatch.mock.calls[1]).toEqual([
      {
        type: "DB_UPDATE_FOR_ID",
        payload: {
          data: { foo: "bar" },
          state: "loaded",
          id: "MOCK_RESOLVE",
          params: ResolveLoader.params()
        }
      }
    ]);
  });
});

it("dispatches the correct events when the data is rejected", () => {
  const store = mockStore();
  const mock = new RejectLoader(ResolveLoader.params(), store, {}, {});

  expect.assertions(3);

  return mock.start().then(
    () => {},
    data => {
      expect(store.dispatch.mock.calls.length).toBe(2);
      expect(store.dispatch.mock.calls[0]).toEqual([
        {
          type: "DB_UPDATE_FOR_ID",
          payload: {
            state: "loading",
            id: "MOCK_REJECT",
            params: ResolveLoader.params()
          }
        }
      ]);
      expect(store.dispatch.mock.calls[1]).toEqual([
        {
          type: "DB_UPDATE_FOR_ID",
          error: true,
          payload: {
            data: [],
            state: "error",
            error: new Error("Reject Loader"),
            id: "MOCK_REJECT",
            params: ResolveLoader.params()
          }
        }
      ]);
    }
  );
});
