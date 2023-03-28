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

export const getLeadAge = createAsyncThunk("TASK_360_SLICE/getLeadAge", async (universalId, { rejectWithValue }) => {

    const response = await client.get(URL.GET_ASSIGNED_TASKS_AT_PRE_BOOKING(universalId));
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getTaskThreeSixtyHistory = createAsyncThunk(
  "TASK_360_SLICE/getTaskThreeSixtyHistory",
  async (universalId, { rejectWithValue }) => {    
    const response = await client.get(URL.GET_TASK_360_HISTORY(universalId));
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);


export const getFollowUPCount  = createAsyncThunk(
    "TASK_360_SLICE/getFollowUPCount",
    async (universalId, { rejectWithValue }) => {
        const response = await client.get(URL.GET_FOLLOWUP_COUNT(universalId));
        const json = await response.json();

        if (!response.ok) {
            return rejectWithValue(json);
        }
        return json;
    }
);


export const getTestDriveHistoryCount = createAsyncThunk("TASK_360_SLICE/getTestDriveHistoryCount", async (universalId, { rejectWithValue }) => {

    const response = await client.get(URL.GET_TEST_HISTORY_COUNT(universalId));
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
    wrokflow_response: [],
    wrokflow_response_status: "",
    enquiry_leadDto_response: {},
    enquiry_leadDto_response_status: "",
    leadAge: 0,
    taskThreeSixtyHistory: [],
    followUpCount: [],
    followUpcount_Status: "",
    testDrivCount: 0,
  },
  reducers: {
    clearState: (state, action) => {
      state.leadAge = 0;
      state.taskThreeSixtyHistory = [];
      state.followUpcount_Status = "";
      state.testDrivCount = 0;
    },
    clearListData: (state, action) => {
      state.enquiry_leadDto_response = {};
      state.enquiry_leadDto_response_status = "";
      state.wrokflow_response = [];
      state.wrokflow_response_status = "pending";
      state.taskThreeSixtyHistory = [];
    },
  },
  extraReducers: (builder) => {
    // Get Workflow Details Api
    builder.addCase(getWorkFlow.pending, (state, action) => {
      state.wrokflow_response_status = "pending";
      state.isLoading = true;
    });
    builder.addCase(getWorkFlow.fulfilled, (state, action) => {
      if (action.payload?.dmsEntity) {
        if (action.payload.dmsEntity?.tasks) {
          state.wrokflow_response = action.payload.dmsEntity.tasks;
        }
      }
      state.wrokflow_response_status = "success";
      state.isLoading = false;
    });
    builder.addCase(getWorkFlow.rejected, (state, action) => {
      state.wrokflow_response_status = "failed";
      state.isLoading = false;
    });
    // Get Enquiry Details Api
    builder.addCase(getEnquiryDetails.pending, (state, action) => {
      state.enquiry_leadDto_response_status = "pending";
      state.isLoading = true;
    });
    builder.addCase(getEnquiryDetails.fulfilled, (state, action) => {
      if (action.payload?.dmsEntity) {
        if (action.payload.dmsEntity?.dmsLeadDto) {
          state.enquiry_leadDto_response = action.payload.dmsEntity.dmsLeadDto;
        }
      }
      state.enquiry_leadDto_response_status = "success";
    //   state.isLoading = false;
    });
    builder.addCase(getEnquiryDetails.rejected, (state, action) => {
      state.enquiry_leadDto_response_status = "failed";
      state.isLoading = false;
    });

    builder.addCase(getLeadAge.pending, (state, action) => {
      state.leadAge = 0;
    });
    builder.addCase(getLeadAge.fulfilled, (state, action) => {
      if (action.payload?.leadAge) {
        state.leadAge = action.payload?.leadAge;
      }
    });
    builder.addCase(getLeadAge.rejected, (state, action) => {
      state.leadAge = 0;
    });

    builder.addCase(getTaskThreeSixtyHistory.pending, (state, action) => {
      state.taskThreeSixtyHistory = [];
      state.isLoading = true;
    });
    builder.addCase(getTaskThreeSixtyHistory.fulfilled, (state, action) => {
      if (action?.payload?.dmsEntity?.taskss) {
        state.taskThreeSixtyHistory = action.payload.dmsEntity.taskss;
      }
      state.isLoading = false;
    });
    builder.addCase(getTaskThreeSixtyHistory.rejected, (state, action) => {
      state.taskThreeSixtyHistory = [];
      state.isLoading = false;
    });

    builder.addCase(getFollowUPCount.pending, (state, action) => {
      state.followUpCount = [];
      state.isLoading = true;
      state.followUpcount_Status = "pending";
    });
    builder.addCase(getFollowUPCount.fulfilled, (state, action) => {
      state.followUpCount = action.payload;
      state.followUpcount_Status = "fulfilled";
      state.isLoading = false;
    });
    builder.addCase(getFollowUPCount.rejected, (state, action) => {
      state.followUpCount = [];
      state.isLoading = false;
      state.followUpcount_Status = "rejected";
    });

    builder.addCase(getTestDriveHistoryCount.pending, (state, action) => {
      state.testDrivCount = 0;
      state.isLoading = true;
      // state.followUpcount_Status = "pending"
    });
    builder.addCase(getTestDriveHistoryCount.fulfilled, (state, action) => {
      state.testDrivCount = action.payload.count;
      // state.followUpcount_Status = "fulfilled"
      state.isLoading = false;
    });
    builder.addCase(getTestDriveHistoryCount.rejected, (state, action) => {
      state.testDrivCount = 0;
      state.isLoading = false;
      // state.followUpcount_Status = "rejected"
    });
  },
});

export const { clearState, clearListData } = taskThreeSixtySlice.actions;
export default taskThreeSixtySlice.reducer;
