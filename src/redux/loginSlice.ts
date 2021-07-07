import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../networking/client';
import { ENDPOINT, KEYS } from '../networking/endpoints';

interface LoginState {
    employeeId: string,
    password: string,
    securePassword: boolean,
    showLoginErr: boolean,
    showPasswordErr: boolean,
    loginErrMessage: string,
    passwordErrMessage: string
}

interface ErrorMessage {
    key: string,
    message: string
}

const initialState: LoginState = {
    employeeId: "",
    password: "",
    securePassword: true,
    showLoginErr: false,
    showPasswordErr: false,
    loginErrMessage: "",
    passwordErrMessage: ""
}

export const postUserData = createAsyncThunk('LOGIN_SLICE/postUserData', async (inputData) => {

    const response = await client.post(ENDPOINT(KEYS.login), inputData)
    console.log('response: ', response);
    return response
})

export const loginSlice = createSlice({
    name: 'LOGIN_SLICE',
    initialState,
    reducers: {
        updateEmployeeId: (state, action: PayloadAction<string>) => {
            let employeeId = action.payload;
            if (employeeId.length > 6) {
                state.showLoginErr = false;
                state.loginErrMessage = "";
            }
            state.employeeId = employeeId;
        },
        updatePassword: (state, action: PayloadAction<string>) => {

            let password = action.payload;
            if (password.length > 6) {
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
        builder.addCase(postUserData.pending, (state, action) => {

        })
        builder.addCase(postUserData.fulfilled, (state, action) => {

        })
        builder.addCase(postUserData.rejected, (state, action) => {

        })
    }
})



export const { updateEmployeeId, updatePassword, updateSecurePassword, showErrorMessage } = loginSlice.actions;

export default loginSlice.reducer;





// export const postUserData = createAsyncThunk('LOGIN_SLICE/postUserData', async () => {
//     const response = await client.get(ENDPOINT(KEYS.login))
//     return response.hostelList
// })