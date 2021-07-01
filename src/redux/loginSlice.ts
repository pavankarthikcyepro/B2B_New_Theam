import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginState {
    employeeId: string,
    password: string
}

const initialState: LoginState = {
    employeeId: "3456",
    password: ""
}

export const loginSlice = createSlice({
    name: 'LOGIN_SLICE',
    initialState,
    reducers: {
        updateEmployeeId: (state, action: PayloadAction<string>) => {
            state.employeeId = action.payload;
        },
        updatePassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        }
    }
})

export const { updateEmployeeId, updatePassword } = loginSlice.actions;

export default loginSlice.reducer;