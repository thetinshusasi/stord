import { combineReducers } from "redux";
import { ACTION_TYPE } from "./constants";

export const viewData = (state = {}, action: any) => {
  // console.log("reducer code", state, action.type);
  // console.log("reducer code", state, ACTION_TYPE.GET_MAIN_DATA_FULFILLED);
  switch (action.type) {
    case ACTION_TYPE.GET_MAIN_DATA_FULFILLED: {
      // console.log("action.payload", action.payload);
      return {
        ...state,
        data: action.payload
      };
    }
    default:
      return state;
  }
};
export const viewDropdownData = (state = {}, action: any) => {
  console.log("reducer code", state, action.type);
  console.log("reducer code", state, ACTION_TYPE.GET_DROPDOWN_DATA);
  switch (action.type) {
    case ACTION_TYPE.GET_DROPDOWN_DATA: {
      // console.log("state");
      return {
        ...state,
        data: action.payload
      };
    }
    default:
      return state;
  }
};

export const rootReducer = () =>
  combineReducers({
    viewData,
    viewDropdownData
  });
