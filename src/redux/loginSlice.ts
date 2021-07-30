import React from "react";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../networking/client';
import URL from '../networking/endpoints';
import * as AsyncStore from '../asyncStore';

interface LoginState {
    employeeId: string,
    password: string,
    securePassword: boolean,
    showLoginErr: boolean,
    showPasswordErr: boolean,
    loginErrMessage: string,
    passwordErrMessage: string,
    isLoading: boolean,
    status: string,
    authToken: string,
    userName: string,
}

interface ErrorMessage {
    key: string,
    message: string
}

const initialState: LoginState = {
    employeeId: "EG_S5237",
    password: "Bharat@123",
    securePassword: true,
    showLoginErr: false,
    showPasswordErr: false,
    loginErrMessage: "",
    passwordErrMessage: "",
    isLoading: false,
    status: "",
    authToken: "",
    userName: ""
}

export const postUserData = createAsyncThunk('LOGIN_SLICE/postUserData', async (inputData) => {

    const response = await client.post(URL.LOGIN(), inputData)
    return response
})

export const loginSlice = createSlice({
    name: 'LOGIN_SLICE',
    initialState,
    reducers: {
        clearState: (state, action) => {
            state.authToken = "";
            state.userName = "";
            state.status = "";
            state.isLoading = false;
        },
        updateEmployeeId: (state, action: PayloadAction<string>) => {
            let employeeId = action.payload;
            if (employeeId.length < 4) {
                state.showLoginErr = false;
                state.loginErrMessage = "";
            }
            state.employeeId = employeeId;
        },
        updatePassword: (state, action: PayloadAction<string>) => {

            let password = action.payload;
            if (password.length < 4) {
                state.showPasswordErr = true;
                state.passwordErrMessage = "Password max length is 6 chars";
            } else {
                state.showPasswordErr = false;
                state.passwordErrMessage = "";
            }
            state.password = password;
        },
        updateSecurePassword: (state) => {
            state.securePassword = !state.securePassword;
        },
        showErrorMessage: (state, action: PayloadAction<ErrorMessage>) => {
            if (action.payload.key === "EMPLOYEEID") {
                state.showLoginErr = true;
                state.loginErrMessage = action.payload.message;
            } else {
                state.showPasswordErr = true;
                state.passwordErrMessage = action.payload.message;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(postUserData.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
            })
            .addCase(postUserData.fulfilled, (state, action) => {
                console.log('res2: ', action.payload);
                const dataObj = action.payload;
                AsyncStore.storeData(AsyncStore.Keys.USER_NAME, dataObj.userName);
                AsyncStore.storeData(AsyncStore.Keys.USER_TOKEN, dataObj.idToken);
                AsyncStore.storeData(AsyncStore.Keys.ORG_ID, dataObj.orgId);
                AsyncStore.storeData(AsyncStore.Keys.REFRESH_TOKEN, dataObj.refreshToken);
                state.status = 'sucess';
                state.isLoading = false;
                state.authToken = dataObj.idToken;
                state.userName = dataObj.userName;
            })
            .addCase(postUserData.rejected, (state, action) => {
                console.log('res3: ', action.payload);
                state.status = 'failed';
                state.isLoading = false;
            })
    }
})


export const { clearState, updateEmployeeId, updatePassword, updateSecurePassword, showErrorMessage } = loginSlice.actions;

export default loginSlice.reducer;





// export const postUserData = createAsyncThunk('LOGIN_SLICE/postUserData', async () => {
//     const response = await client.get(ENDPOINT(KEYS.login))
//     return response.hostelList
// })