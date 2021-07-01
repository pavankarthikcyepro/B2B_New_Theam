import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import loginReducer from './loginSlice';


const reducer = combineReducers({
    loginReducer: loginReducer
})

const store = configureStore({
    reducer
});

export default store;