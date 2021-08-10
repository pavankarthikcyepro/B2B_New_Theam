import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
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
import enquiryDetailsOverViewReducer from './enquiryDetailsOverViewSlice';


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
  addPreEnquiryReducer,
  enquiryDetailsOverViewReducer
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false
  }),
  devTools: false
});

export default store;
