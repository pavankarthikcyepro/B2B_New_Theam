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
import upcomingDeliveriesReducer from "./upcomingDeliveriesReducer";
import targetSettingsReducer from "./targetSettingsReducer";
import taskThreeSixtyReducer from "./taskThreeSixtyReducer";
import bookingReducer from "./bookingReducer";
import bookingFormReducer from "./bookingFormReducer";
import proceedToBookingReducer from "./proceedToBookingReducer";
import appReducer from "./appReducer";
import callRecordingReducer from "./callRecordingReducer";
import taskTransferReducer from "./taskTransferReducer";
import leaddropReducer from "./leaddropReducer";
import liveLeadsReducer from "./liveLeadsReducer";
import settingReducer from "./settingReducer";
import myStockReducer from "./myStockReducer";
import complaintTrackerReducer from "./complaintTrackerReducer";
import digitalPaymentReducer from "./digitalPaymentReducer";
import liveLeadsReducerReceptionist from "./liveLeadsReducerReceptionist";
import digitalDashboardReducer from "./digitalDashboardReducer";
import webCallReducer from "./webCallReducer";
import recordedCallsReducer from "./recordedCallsReducer";
import emiCalculatorReducer from "./emiCalculatorReducer";

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
  createEnquiryReducer,
  upcomingDeliveriesReducer,
  targetSettingsReducer,
  taskThreeSixtyReducer,
  leaddropReducer,
  bookingReducer,
  bookingFormReducer,
  proceedToBookingReducer,
  appReducer,
  callRecordingReducer,
  taskTransferReducer,
  liveLeadsReducer,
  settingReducer,
  myStockReducer,
  complaintTrackerReducer,
  digitalPaymentReducer,
  liveLeadsReducerReceptionist,
  digitalDashboardReducer,
  webCallReducer,
  recordedCallsReducer,
  emiCalculatorReducer,
});

const createDebugger = require("redux-flipper").default;

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => __DEV__ ?
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(createDebugger()) :
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
  devTools: false,
});

export default store;
