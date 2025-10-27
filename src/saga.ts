import { call, put, takeEvery } from "redux-saga/effects";
import {
  getDataPending,
  getDataFulfilled,
  getDataRejected
} from "./redux/actionCreators";

import { ACTION_TYPE } from "./redux/constants";
import { productApi } from "./api";

function* getDataSaga(action: any): Generator<any, void, any> {
  try {
    yield put(getDataPending(action.payload));
    console.log("get  action.payload", action.payload);
    if (action.payload) {
      const response = yield call(productApi, action?.payload?.page);
      console.log("response in sagas", response);
      if (response.data.length >= 1) {
        console.log("success in saga");
        yield put(getDataFulfilled(response));
      } else {
        yield put(getDataRejected("No Data To display", action.payload));
      }
    }
  } catch (error) {
    yield put(getDataRejected(error, action.payload));
  }
}
export function* watcherSaga(): Generator<any, void, any> {
  yield takeEvery(ACTION_TYPE.GET_MAIN_DATA, getDataSaga);
}
