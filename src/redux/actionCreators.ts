import { ACTION_TYPE } from "./constants";
console.log("action");
export const getPage = ({ page }: any) => ({
  type: ACTION_TYPE.GET_MAIN_DATA,
  payload: {
    page
  }
});

export const getDataPending = (args: any) => ({
  type: ACTION_TYPE.GET_MAIN_DATA_PENDING,
  payload: {
    args
  }
});

export const getDataFulfilled = (result: any) => ({
  type: ACTION_TYPE.GET_MAIN_DATA_FULFILLED,
  payload: result
});

export const getDataRejected = (error: any, args: any) => ({
  type: ACTION_TYPE.GET_MAIN_DATA_REJECTED,
  error,
  meta: {
    args
  }
});

export const sentDropdownResponse = ({ sku, name, primaryUnit }: any) => ({
  type: ACTION_TYPE.GET_DROPDOWN_DATA,
  payload: {
    sku,
    name,
    primaryUnit
  }
});
export const getDropdownDataPending = (args: any) => ({
  type: ACTION_TYPE.GET_DROPDOWN_DATA_PENDING,
  payload: {
    args
  }
});

export const getDropdownFulfilled = (result: any) => ({
  type: ACTION_TYPE.GET_DROPDOWN_DATA_FULFILLED,
  payload: result
});

export const getDropdownRejected = (error: any, args: any) => ({
  type: ACTION_TYPE.GET_DROPDOWN_DATA_REJECTED,
  error,
  meta: {
    args
  }
});
