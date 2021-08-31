import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import URL from "../networking/endpoints";
import { client } from '../networking/client';

export const getPreEnquiryDetails = createAsyncThunk("CONFIRMED_PRE_ENQUIRY/getPreEnquiryDetails", async (universalId) => {

    const response = client.get(URL.CONTACT_DETAILS(universalId))
    return response;
})

export const slice = createSlice({
    name: "CONFIRMED_PRE_ENQUIRY",
    initialState: {
        pre_enquiry_details: {},
        isLoading: true,
        status: ""
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getPreEnquiryDetails.fulfilled, (state, action) => {
            // console.log("res: ", JSON.stringify(action.payload));
            state.pre_enquiry_details = action.payload.dmsEntity;
            state.isLoading = false;
        })
        builder.addCase(getPreEnquiryDetails.rejected, (state, action) => {
            state.isLoading = false;
        })
    }
});

export const { } = slice.actions;
export default slice.reducer;
