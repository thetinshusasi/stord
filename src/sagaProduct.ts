import { call, put, takeEvery } from "redux-saga/effects";
import {
  getProductListV2Pending,
  getProductListV2Fulfilled,
  getProductListV2Rejected,
  sentProductListV2Response,
} from "./redux/actionCreators";

import { ACTION_TYPE } from "./redux/constants";
import { productList } from "./api";

function* getProductListV2Saga(action: any): Generator<any, void, any> {
  try {
    console.log("get product list v2 saga", action.payload);
    yield put(getProductListV2Pending(action.payload));
    console.log("get product list v2", action.payload);
    console.log("response in sagas");
    const response: any = yield call(productList, action.payload);
    console.log("response in product list v2", response);
    console.log("success in saga");
    if (response && response.data) {
      yield put(getProductListV2Fulfilled(response));
    } else {
      yield put(
        getProductListV2Rejected(
          "No product list v2 data available",
          action.payload
        )
      );
    }
  } catch (error: any) {
    console.error("Error in getProductListV2Saga:", error);
    console.log("Dispatching rejected action with error:", error.message);
    yield put(
      getProductListV2Rejected(
        error.message || "Failed to fetch product list v2 data",
        action.payload
      )
    );
  }
}
export function* watcherProductSaga(): Generator<any, void, any> {
  yield takeEvery(ACTION_TYPE.GET_PRODUCT_LIST_V2, getProductListV2Saga);
}
