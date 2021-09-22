import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { convertTimeStampToDateString, convertToTime } from "../utils/helperFunctions";
import URL from "../networking/endpoints";
import { client } from "../networking/client";

interface EnquiryFollowUpTextModel {
    key: string;
    text: string;
}

interface CustomerDetailModel {
    key: string;
    text: string;
}

export const getPrebookingDetailsApi = createAsyncThunk("PROCEED_TO_PRE_BOOKING_SLICE/getPrebookingDetailsApi", async (universalId, { rejectWithValue }) => {

    const response = await client.get(URL.ENQUIRY_DETAILS(universalId));
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const updatePrebookingDetailsApi = createAsyncThunk("PROCEED_TO_PRE_BOOKING_SLICE/updatePrebookingDetailsApi", async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.UPDATE_ENQUIRY_DETAILS(), payload);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const dropPreBooingApi = createAsyncThunk("PROCEED_TO_PRE_BOOKING_SLICE/dropPreBooingApi", async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.DROP_ENQUIRY(), payload);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})


const slice = createSlice({
    name: "PROCEED_TO_PRE_BOOKING_SLICE",
    initialState: {
        pre_booking_details_response: null,
        update_pre_booking_details_response: "",
        pre_booking_drop_response_status: null,
    },
    reducers: {
        clearState: (state, action) => {
            state.pre_booking_details_response = null;
            state.update_pre_booking_details_response = "";
            state.pre_booking_drop_response_status = null;
        },
        setDataDetails: (state, action: PayloadAction<EnquiryFollowUpTextModel>) => {
            const { key, text } = action.payload;
            switch (key) {
                case "REASON":
                    break;
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getPrebookingDetailsApi.fulfilled, (state, action) => {
            //console.log("S getPrebookingDetailsApi: ", JSON.stringify(action.payload));
            if (action.payload.dmsEntity) {
                state.pre_booking_details_response = action.payload.dmsEntity;
            }
        })
        builder.addCase(getPrebookingDetailsApi.rejected, (state, action) => {
            //console.log("F getPrebookingDetailsApi: ", JSON.stringify(action.payload));
        })
        builder.addCase(updatePrebookingDetailsApi.pending, (state, action) => {
            state.update_pre_booking_details_response = "";
        })
        builder.addCase(updatePrebookingDetailsApi.fulfilled, (state, action) => {
            console.log("S updatePrebookingDetailsApi: ", JSON.stringify(action.payload));
            if (action.payload.success == true) {
                state.update_pre_booking_details_response = "success";
            }
        })
        builder.addCase(updatePrebookingDetailsApi.rejected, (state, action) => {
            console.log("F updatePrebookingDetailsApi: ", JSON.stringify(action.payload));
            state.update_pre_booking_details_response = "failed";
        })
        builder.addCase(dropPreBooingApi.fulfilled, (state, action) => {
            //console.log("S dropPreBooingApi: ", JSON.stringify(action.payload));
            if (action.payload.status === "SUCCESS") {
                state.pre_booking_drop_response_status = "success";
            }
        })
    }
});

export const {
    clearState,
    setDataDetails,
} = slice.actions;
export default slice.reducer;
