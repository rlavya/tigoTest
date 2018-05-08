// @flow

import { Responder } from "../util/routeResponder";
import Promise from "bluebird";
import get from "lodash/get";
import { addAlertAction } from "../actionCreators/alerts";

export const SKIP_LOAD = "__SKIP_LOAD__";

export default class EntityLoader extends Responder {
  _prevLoad: any;

  getId(): string {
    return "_";
  }
  load(): Promise<any> {}
  restart(): void {
    if (this._prevLoad === SKIP_LOAD) {
      this.start();
    }
  }
  start(): Promise<any> {
    const id = this.getId();
    let loading;

    this.store.dispatch({
      type: "DB_UPDATE_FOR_ID",
      payload: {
        state: "loading",
        id,
        params: this.params
      }
    });

    this._prevLoad = this.load();

    loading = Promise.resolve(
      this._prevLoad === SKIP_LOAD ? null : this._prevLoad
    );

    loading.then(
      data => {
        this.store.dispatch({
          type: "DB_UPDATE_FOR_ID",
          payload: {
            data,
            id,
            state: "loaded",
            params: this.params
          }
        });
      },
      error => {
        const errorMessage = get(error, "response.data.error.description");
        this.store.dispatch(addAlertAction("error", errorMessage));
        this.store.dispatch({
          type: "DB_UPDATE_FOR_ID",
          error: true,
          payload: {
            state: "error",
            id,
            data: [],
            error,
            params: this.params
          }
        });
      }
    );
    return loading;
  }
}
