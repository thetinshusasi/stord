import { call, put, takeEvery } from "redux-saga/effects";
import {
  getDropdownDataPending,
  getDropdownFulfilled,
  getDropdownRejected,
  sentDropdownResponse
} from "./redux/actionCreators";

import { ACTION_TYPE } from "./redux/constants";
import { productList } from "./api";

function* getDropdownDataSaga(action: any): Generator<any, void, any> {
  try {
    yield put(getDropdownDataPending(action.payload));
    console.log("get dropdown", action.payload);
    console.log("response in sagas");
    const response: any = yield call(productList, action.payload);
    console.log("response in dropdown", response);
    console.log("success in saga");
    //yield put(sentDropdownResponse(response));
  } catch (error) {
    yield put(getDropdownRejected(error, action.payload));
  }
}
export function* watcherProductSaga(): Generator<any, void, any> {
  yield takeEvery(ACTION_TYPE.GET_DROPDOWN_DATA, getDropdownDataSaga);
}
