import { createStore, applyMiddleware } from "redux";
import { all } from "redux-saga/effects";
import { rootReducer } from "./redux/reducer";
import createSagaMiddleware from "redux-saga";
import { watcherSaga } from "./saga";
import { watcherProductSaga } from "./sagaProduct";
const sagaMiddlware = createSagaMiddleware();
const middleware = [sagaMiddlware];
const store = createStore(rootReducer(), {}, applyMiddleware(...middleware));
function* rootSaga() {
  yield all([watcherProductSaga(), watcherSaga()]);
}
sagaMiddlware.run(rootSaga);
export default store;
