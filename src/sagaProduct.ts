import { call, put, takeEvery } from "redux-saga/effects";
import {
  getProductListV1Pending,
  getProductListV1Fulfilled,
  getProductListV1Rejected,
  getProductListV2Pending,
  getProductListV2Fulfilled,
  getProductListV2Rejected,
  createProductPending,
  createProductFulfilled,
  createProductRejected,
  deleteProductPending,
  deleteProductFulfilled,
  deleteProductRejected,
} from "./redux/actionCreators";

import { ACTION_TYPE } from "./redux/constants";
import {
  productList,
  productListV1,
  createProduct,
  deleteProduct,
} from "./api";

function* getProductListV1Saga(action: any): Generator<any, void, any> {
  try {
    console.log("get product list v1 saga", action.payload);
    yield put(getProductListV1Pending(action.payload));
    console.log("get product list v1", action.payload);
    console.log("response in sagas");
    const response: any = yield call(productListV1, action.payload);
    console.log("response in product list v1", response);
    console.log("success in saga");
    if (response && response.data) {
      yield put(getProductListV1Fulfilled(response));
    } else {
      yield put(
        getProductListV1Rejected(
          "No product list v1 data available",
          action.payload
        )
      );
    }
  } catch (error: any) {
    console.error("Error in getProductListV1Saga:", error);
    console.log("Dispatching rejected action with error:", error.message);
    yield put(
      getProductListV1Rejected(
        error.message || "Failed to fetch product list v1 data",
        action.payload
      )
    );
  }
}

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
function* createProductSaga(action: any): Generator<any, void, any> {
  try {
    console.log("create product saga", action.payload);
    yield put(createProductPending(action.payload));
    const response: any = yield call(createProduct, action.payload);
    console.log("create product response", response);
    if (response) {
      yield put(createProductFulfilled(response));
    } else {
      yield put(
        createProductRejected("Failed to create product", action.payload)
      );
    }
  } catch (error: any) {
    console.error("Error in createProductSaga:", error);
    yield put(
      createProductRejected(
        error.message || "Failed to create product",
        action.payload
      )
    );
  }
}

function* deleteProductSaga(action: any): Generator<any, void, any> {
  try {
    console.log("delete product saga", action.payload);
    yield put(deleteProductPending(action.payload));
    const response: any = yield call(deleteProduct, action.payload.productId);
    console.log("delete product response", response);
    if (response) {
      yield put(deleteProductFulfilled(response));
    } else {
      yield put(
        deleteProductRejected("Failed to delete product", action.payload)
      );
    }
  } catch (error: any) {
    console.error("Error in deleteProductSaga:", error);
    yield put(
      deleteProductRejected(
        error.message || "Failed to delete product",
        action.payload
      )
    );
  }
}

export function* watcherProductSaga(): Generator<any, void, any> {
  yield takeEvery(ACTION_TYPE.GET_PRODUCT_LIST_V1, getProductListV1Saga);
  yield takeEvery(ACTION_TYPE.GET_PRODUCT_LIST_V2, getProductListV2Saga);
  yield takeEvery(ACTION_TYPE.CREATE_PRODUCT, createProductSaga);
  yield takeEvery(ACTION_TYPE.DELETE_PRODUCT, deleteProductSaga);
}
