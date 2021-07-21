import { createSlice } from '@reduxjs/toolkit';

const routeSlice = createSlice({
    name: "ROUTE",
    initialState: {
        isLoading: false,
        userToken: "",
    },
    reducers: {

    }
})

export const { } = routeSlice.actions;
export default routeSlice.reducer;