
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomerDetailsModel {
    key: string;
    text: string;
}

const slice = createSlice({
    name: "PRE_BOOKING_FORM",
    initialState: {

    },
    reducers: {
        setCustomerDetails: (state, action: PayloadAction<CustomerDetailsModel>) => {

        }
    }
})

export const { setCustomerDetails } = slice.actions;
export default slice.reducer;