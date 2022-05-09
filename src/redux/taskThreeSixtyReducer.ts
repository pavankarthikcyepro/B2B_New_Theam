import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import moment from "moment";
import { client } from "../networking/client";
import URL from "../networking/endpoints";

export const getWorkFlow = createAsyncThunk("TASK_360_SLICE/getWorkFlow", async (universalId, { rejectWithValue }) => {

    const response = await client.get(URL.GET_WORK_FLOW_TASKS(universalId));
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getEnquiryDetails = createAsyncThunk("TASK_360_SLICE/getEnquiryDetails", async (universalId, { rejectWithValue }) => {

    const response = await client.get(URL.ENQUIRY_DETAILS(universalId));
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

const taskThreeSixtySlice = createSlice({
    name: "TASK_360_SLICE",
    initialState: {
        status: "",
        isLoading: false,
        wrokflow_response: {},
        wrokflow_response_status: "",
        enquiry_leadDto_response: {},
        enquiry_leadDto_response_status: ""
    },
    reducers: {
        clearState: (state, action) => {
    
        },
    },
    extraReducers: (builder) => {
        // Get Workflow Details Api
        builder.addCase(getWorkFlow.pending, (state, action) => {
            state.wrokflow_response = [];
            state.isLoading = true;
            state.wrokflow_response_status = "pending";
        })
        builder.addCase(getWorkFlow.fulfilled, (state, action) => {
            console.log("S getWorkFlow: ", JSON.stringify(action.payload));
            if (action.payload?.dmsEntity) {
                if (action.payload.dmsEntity?.tasks) {
                    state.wrokflow_response = action.payload.dmsEntity.tasks;
                }
            }
            state.wrokflow_response_status = "success";
            state.isLoading = false;
        })
        builder.addCase(getWorkFlow.rejected, (state, action) => {
            console.log("F getWorkFlow: ", JSON.stringify(action.payload));
            state.wrokflow_response = [];
            state.wrokflow_response_status = "failed";
            state.isLoading = false;
        })
        // Get Enquiry Details Api
        builder.addCase(getEnquiryDetails.pending, (state, action) => {
            state.enquiry_leadDto_response = {};
            state.enquiry_leadDto_response_status = "pending";
            state.isLoading = true;
        })
        builder.addCase(getEnquiryDetails.fulfilled, (state, action) => {
            console.log("S getEnquiryDetails: ", JSON.stringify(action.payload));
            if (action.payload?.dmsEntity) {
                if (action.payload.dmsEntity?.dmsLeadDto) {
                    state.enquiry_leadDto_response = action.payload.dmsEntity.dmsLeadDto;
                }
            }
            state.enquiry_leadDto_response_status = "success";
            state.isLoading = false;
        })
        builder.addCase(getEnquiryDetails.rejected, (state, action) => {
            console.log("F getEnquiryDetails: ", JSON.stringify(action.payload));
            state.enquiry_leadDto_response = {};
            state.enquiry_leadDto_response_status = "failed";
            state.isLoading = false;
        })
    }
});

export const { clearState } = taskThreeSixtySlice.actions;
export default taskThreeSixtySlice.reducer;
