import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import loginReducer from "./loginSlice";
import preEnquiryReducer from "./preEnquirySlice";
import sideMenuReducer from "./sideMenuSlice";
import homeReducer from "./homeSlice";
import mytaskReducer from "./mytaskSlice";
import notificationReducer from "./notificationSlice";
import complaintsReducer from "./complaintsSlice";
import routeReducer from "./routeSlice";
import eventmanagementReducer from "./eventmanagementSlice";
import addPreEnquiryReducer from './addPreEnquirySlice';

const reducer = combineReducers({
  routeReducer,
  loginReducer: loginReducer,
  preEnquiryReducer: preEnquiryReducer,
  sideMenuReducer,
  homeReducer,
  mytaskReducer,
  notificationReducer,
  complaintsReducer,
  eventmanagementReducer,
  addPreEnquiryReducer
});

const store = configureStore({
  reducer,
});

export default store;
