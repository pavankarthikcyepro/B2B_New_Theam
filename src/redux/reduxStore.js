import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import loginReducer from "./loginSlice";
import preEnquiryReducer from "./preEnquirySlice";
import sideMenuReducer from "./sideMenuSlice";
import mytaskReducer from "./mytaskSlice";
import complaintsReducer from "./complaintsSlice";

const reducer = combineReducers({
  loginReducer: loginReducer,
  preEnquiryReducer: preEnquiryReducer,
  sideMenuReducer,
  mytaskReducer,
  complaintsReducer,
});

const store = configureStore({
  reducer,
});

export default store;
