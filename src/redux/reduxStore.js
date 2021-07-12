import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import loginReducer from './loginSlice';
import preEnquiryReducer from './preEnquirySlice';
import sideMenuReducer from './sideMenuSlice';
import homeReducer from './homeSlice';
import mytaskReducer from './mytaskSlice';
import notificationReducer from './notificationSlice';

const reducer = combineReducers({
    loginReducer: loginReducer,
    preEnquiryReducer: preEnquiryReducer,
    sideMenuReducer,
    homeReducer,
    mytaskReducer,
    notificationReducer
})

const store = configureStore({
    reducer
});

export default store;