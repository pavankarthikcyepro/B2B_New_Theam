import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import loginReducer from "./loginReducer";
import preEnquiryReducer from "./preEnquiryReducer";
import sideMenuReducer from "./sideMenuReducer";
import homeReducer from "./homeReducer";
import mytaskReducer from "./mytaskReducer";
import notificationReducer from "./notificationReducer";
import complaintsReducer from "./complaintsReducer";
import routeReducer from "./routeReducer";
import eventmanagementReducer from "./eventManagementReducer";
import addPreEnquiryReducer from "./addPreEnquiryReducer";
import enquiryFormReducer from "./enquiryFormReducer";
import enquiryReducer from "./enquiryReducer";
import preBookingFormReducer from "./preBookingFormReducer";
import preBookingReducer from "./preBookingReducer";
import homeVisitReducer from "./homeVisitReducer";
import testDriveReducer from "./testDriveReducer";
import enquiryFollowUpReducer from "./enquiryFollowUpReducer";
import confirmedPreEnquiryReducer from "./confirmedPreEnquiryReducer";
import proceedToPreBookingReducer from "./proceedToPreBookingReducer";
import createEnquiryReducer from "./createEnquiryReducer";

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
  enquiryFormReducer,
  enquiryReducer,
  preBookingFormReducer,
  preBookingReducer,
  homeVisitReducer,
  testDriveReducer,
  enquiryFollowUpReducer,
  confirmedPreEnquiryReducer,
  proceedToPreBookingReducer,
  createEnquiryReducer
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
  devTools: false,
});

export default store;
