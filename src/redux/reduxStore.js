import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import loginReducer from './loginSlice';
import preEnquiryReducer from './preEnquirySlice';


const reducer = combineReducers({
    loginReducer: loginReducer,
    preEnquiryReducer: preEnquiryReducer
})

const store = configureStore({
    reducer
});

export default store;