import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    }
})

export const { updateEmployeeId, updatePassword, updateSecurePassword, showErrorMessage } = loginSlice.actions;

export default loginSlice.reducer;