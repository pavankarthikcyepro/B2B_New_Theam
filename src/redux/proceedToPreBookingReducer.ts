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

export const getTaskDetailsApi = createAsyncThunk("PROCEED_TO_PRE_BOOKING_SLICE/getTaskDetailsApi", async (taskId, { rejectWithValue }) => {

    const response = await client.get(URL.GET_TASK_DETAILS(taskId));
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const updateTaskApi = createAsyncThunk("PROCEED_TO_PRE_BOOKING_SLICE/updateTaskApi", async (body, { rejectWithValue }) => {
    const response = await client.put(URL.ASSIGN_TASK(), body)
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getEnquiryDetailsApi = createAsyncThunk("PROCEED_TO_PRE_BOOKING_SLICE/getEnquiryDetailsApi", async (universalId, { rejectWithValue }) => {

    const response = await client.get(URL.ENQUIRY_DETAILS(universalId));
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const updateEnquiryDetailsApi = createAsyncThunk("PROCEED_TO_PRE_BOOKING_SLICE/updateEnquiryDetailsApi", async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.UPDATE_ENQUIRY_DETAILS(), payload);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const changeEnquiryStatusApi = createAsyncThunk("PROCEED_TO_PRE_BOOKING_SLICE/changeEnquiryStatusApi", async (endUrl, { rejectWithValue }) => {
    const url = URL.CHANGE_ENQUIRY_STATUS() + endUrl;
    const response = await client.post(url, {})
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const dropEnquiryApi = createAsyncThunk("PROCEED_TO_PRE_BOOKING_SLICE/dropEnquiryApi", async (payload, { rejectWithValue }) => {

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
        task_details_response: null,
        update_task_response_status: null,
        change_enquiry_status: null,
        enquiry_details_response: null,
        update_enquiry_details_response: "",
        enquiry_drop_response_status: null,
        isLoading: false,
    },
    reducers: {
        clearState: (state, action) => {
            state.task_details_response = null;
            state.update_task_response_status = null;
            state.change_enquiry_status = null;
            state.enquiry_details_response = null;
            state.update_enquiry_details_response = "";
            state.enquiry_drop_response_status = null;
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
        // Get Task Details
        builder.addCase(getTaskDetailsApi.pending, (state, action) => {
            state.isLoading = true;
            state.task_details_response = null;
        })
        builder.addCase(getTaskDetailsApi.fulfilled, (state, action) => {
            if (action.payload.success === true && action.payload.dmsEntity) {
                state.task_details_response = action.payload.dmsEntity.task;
            }
            state.isLoading = false;
        })
        builder.addCase(getTaskDetailsApi.rejected, (state, action) => {
            state.task_details_response = null;
            state.isLoading = false;
        })
        // Update Task Details
        builder.addCase(updateTaskApi.pending, (state, action) => {
            state.isLoading = true;
            state.update_task_response_status = null;
        })
        builder.addCase(updateTaskApi.fulfilled, (state, action) => {
            state.update_task_response_status = "success";
            state.isLoading = false;
        })
        builder.addCase(updateTaskApi.rejected, (state, action) => {
            state.update_task_response_status = "failed";
            state.isLoading = false;
        })
        // Get Prebooking Details
        builder.addCase(getEnquiryDetailsApi.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(getEnquiryDetailsApi.fulfilled, (state, action) => {
            if (action.payload.dmsEntity) {
                state.enquiry_details_response = action.payload.dmsEntity;
            }
            state.isLoading = false;
        })
        builder.addCase(getEnquiryDetailsApi.rejected, (state, action) => {
            state.isLoading = false;
        })
        // Update Prebooking Details
        builder.addCase(updateEnquiryDetailsApi.pending, (state, action) => {
            state.isLoading = true;
            state.update_enquiry_details_response = "";
        })
        builder.addCase(updateEnquiryDetailsApi.fulfilled, (state, action) => {
            if (action.payload.success == true) {
                state.update_enquiry_details_response = "success";
            }
            state.isLoading = false;
        })
        builder.addCase(updateEnquiryDetailsApi.rejected, (state, action) => {
            state.update_enquiry_details_response = "failed";
            state.isLoading = false;
        })
        // Change Enquiry Status
        builder.addCase(changeEnquiryStatusApi.pending, (state, action) => {
            state.isLoading = true;
            state.change_enquiry_status = null;
        })
        builder.addCase(changeEnquiryStatusApi.fulfilled, (state, action) => {
            if (action.payload.success === true) {
                state.change_enquiry_status = "success";
            }
            state.isLoading = false;
        })
        builder.addCase(changeEnquiryStatusApi.rejected, (state, action) => {
            state.change_enquiry_status = "failed";
            state.isLoading = false;
        })
        // Drop Enquiry
        builder.addCase(dropEnquiryApi.pending, (state, action) => {
            state.isLoading = true;
            state.enquiry_drop_response_status = null;
        })
        builder.addCase(dropEnquiryApi.fulfilled, (state, action) => {
            if (action.payload.status === "SUCCESS") {
                state.enquiry_drop_response_status = "success";
            }
            state.isLoading = false;
        })
        builder.addCase(dropEnquiryApi.rejected, (state, action) => {
            state.enquiry_drop_response_status = "failed";
            state.isLoading = false;
        })
    }
});

export const {
    clearState,
    setDataDetails,
} = slice.actions;
export default slice.reducer;
