import { ACTION_TYPE } from "./constants";
console.log("action");
export const getPage = ({ page }: any) => ({
  type: ACTION_TYPE.GET_MAIN_DATA,
  payload: {
    page,
  },
});

export const getDataPending = (args: any) => ({
  type: ACTION_TYPE.GET_MAIN_DATA_PENDING,
  payload: {
    args,
  },
});

export const getDataFulfilled = (result: any) => ({
  type: ACTION_TYPE.GET_MAIN_DATA_FULFILLED,
  payload: result,
});

export const getDataRejected = (error: any, args: any) => ({
  type: ACTION_TYPE.GET_MAIN_DATA_REJECTED,
  error,
  meta: {
    args,
  },
});

export const sentProductListV2Response = ({ sku, name, primaryUnit }: any) => ({
  type: ACTION_TYPE.GET_PRODUCT_LIST_V2,
  payload: {
    sku,
    name,
    primaryUnit,
  },
});

export const getProductListV2 = ({ page = 1, per_page = 10 }: any) => ({
  type: ACTION_TYPE.GET_PRODUCT_LIST_V2,
  payload: {
    page,
    per_page,
  },
});
export const getProductListV2Pending = (args: any) => ({
  type: ACTION_TYPE.GET_PRODUCT_LIST_V2_PENDING,
  payload: {
    args,
  },
});

export const getProductListV2Fulfilled = (result: any) => ({
  type: ACTION_TYPE.GET_PRODUCT_LIST_V2_FULFILLED,
  payload: result,
});

export const getProductListV2Rejected = (error: any, args: any) => ({
  type: ACTION_TYPE.GET_PRODUCT_LIST_V2_REJECTED,
  error,
  meta: {
    args,
  },
});
