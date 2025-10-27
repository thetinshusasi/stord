import { combineReducers } from "redux";
import { ACTION_TYPE } from "./constants";

export const viewData = (state = {}, action: any) => {
  // console.log("reducer code", state, action.type);
  // console.log("reducer code", state, ACTION_TYPE.GET_MAIN_DATA_FULFILLED);
  switch (action.type) {
    case ACTION_TYPE.GET_MAIN_DATA_PENDING: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case ACTION_TYPE.GET_MAIN_DATA_FULFILLED: {
      // console.log("action.payload", action.payload);
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
      };
    }
    case ACTION_TYPE.GET_MAIN_DATA_REJECTED: {
      return {
        ...state,
        loading: false,
        error: action.error || "Failed to fetch data",
      };
    }
    default:
      return state;
  }
};
export const viewDropdownDataV1 = (state = {}, action: any) => {
  console.log("reducer code v1", state, action.type);
  switch (action.type) {
    case ACTION_TYPE.GET_PRODUCT_LIST_V1_PENDING: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case ACTION_TYPE.GET_PRODUCT_LIST_V1_FULFILLED: {
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
      };
    }
    case ACTION_TYPE.GET_PRODUCT_LIST_V1_REJECTED: {
      console.log("Reducer handling rejected action:", action.error);
      return {
        ...state,
        loading: false,
        error: action.error || "Failed to fetch product list v1",
      };
    }
    default:
      return state;
  }
};

export const viewDropdownData = (state = {}, action: any) => {
  console.log("reducer code", state, action.type);
  console.log("reducer code", state, ACTION_TYPE.GET_PRODUCT_LIST_V2);
  switch (action.type) {
    case ACTION_TYPE.GET_PRODUCT_LIST_V2_PENDING: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case ACTION_TYPE.GET_PRODUCT_LIST_V2: {
      // console.log("state");
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
      };
    }
    case ACTION_TYPE.GET_PRODUCT_LIST_V2_FULFILLED: {
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
      };
    }
    case ACTION_TYPE.GET_PRODUCT_LIST_V2_REJECTED: {
      console.log("Reducer handling rejected action:", action.error);
      return {
        ...state,
        loading: false,
        error: action.error || "Failed to fetch product list v2",
      };
    }
    case ACTION_TYPE.CREATE_PRODUCT_PENDING: {
      return {
        ...state,
        createLoading: true,
        createError: null,
      };
    }
    case ACTION_TYPE.CREATE_PRODUCT_FULFILLED: {
      return {
        ...state,
        createLoading: false,
        createError: null,
        createSuccess: true,
      };
    }
    case ACTION_TYPE.CREATE_PRODUCT_REJECTED: {
      return {
        ...state,
        createLoading: false,
        createError: action.error || "Failed to create product",
      };
    }
    case ACTION_TYPE.DELETE_PRODUCT_PENDING: {
      return {
        ...state,
        deleteLoading: true,
        deleteError: null,
      };
    }
    case ACTION_TYPE.DELETE_PRODUCT_FULFILLED: {
      return {
        ...state,
        deleteLoading: false,
        deleteError: null,
        deleteSuccess: true,
      };
    }
    case ACTION_TYPE.DELETE_PRODUCT_REJECTED: {
      return {
        ...state,
        deleteLoading: false,
        deleteError: action.error || "Failed to delete product",
      };
    }
    default:
      return state;
  }
};

export const rootReducer = () =>
  combineReducers({
    viewData,
    viewDropdownDataV1,
    viewDropdownData,
  });
