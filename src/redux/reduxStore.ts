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
import complaintTrackerReducer from "./complaintTrackerReducer";
import digitalPaymentReducer from "./digitalPaymentReducer";
import customerInfoReducer from "./customerInfoReducer";
import searchCustomerReducer from "./searchCustomerReducer";
import serviceBookingReducer from "./serviceBookingReducer";
import serviceBookingCrudReducer from "./serviceBookingCrudReducer";
import queryListReducer from "./queryListReducer";

import liveLeadsReducerReceptionist from "./liveLeadsReducerReceptionist";
import digitalDashboardReducer from "./digitalDashboardReducer";

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
  complaintTrackerReducer,
  digitalPaymentReducer,
  customerInfoReducer,
  searchCustomerReducer,
  serviceBookingReducer,
  serviceBookingCrudReducer,
  queryListReducer,
  liveLeadsReducerReceptionist,
  digitalDashboardReducer
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
