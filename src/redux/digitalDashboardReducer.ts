import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";


const digitalDashboardReducer = createSlice({
    name: "DIGITAL_DASHBOARD_REDUCER",
    initialState:{

    },
    reducers: {
        clearState: (state, action) => {
            
        },
    },
    extraReducers: (builder) => {
      
    },
})


export const { clearState } = digitalDashboardReducer.actions;
export default digitalDashboardReducer.reducer;