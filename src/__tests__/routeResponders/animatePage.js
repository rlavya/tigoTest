import AnimatePage from "../../routeResponders/animatePage";

const mockStore = () => {
  return {
    dispatch: jest.fn()
  };
};

it("will correctly calculate the animation direction", () => {
  const store = mockStore();
  const animatePage = new AnimatePage(AnimatePage.params({}), store, {}, {});

  animatePage.start();
  animatePage.routeChanged({ page: "Frontpage" }, { page: "Login" });
  animatePage.routeChanged({ page: "Login" }, { page: "Login" });
  animatePage.routeChanged({ page: "Login" }, { page: "TopupConfirmation" });
  animatePage.routeChanged({ page: "TopupConfirmation" }, { page: "Login" });
  animatePage.routeChanged({}, { page: "Frontpage" });

  expect(store.dispatch.mock.calls.length).toBe(4);
  expect(store.dispatch.mock.calls).toEqual([
    [
      {
        type: "ANIMATE_PAGE",
        payload: {
          prev: { page: "Frontpage" },
          next: { page: "Login" },
          direction: "right"
        }
      }
    ],
    [
      {
        type: "ANIMATE_PAGE",
        payload: {
          prev: { page: "Login" },
          next: { page: "TopupConfirmation" },
          direction: "right"
        }
      }
    ],
    [
      {
        type: "ANIMATE_PAGE",
        payload: {
          prev: { page: "TopupConfirmation" },
          next: { page: "Login" },
          direction: "right"
        }
      }
    ],
    [{ type: "CLEAR_ANIMATE_PAGE" }]
  ]);
});
