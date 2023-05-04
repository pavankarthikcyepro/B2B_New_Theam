import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";

export const getRecordedCallList = createAsyncThunk(
  "RECORDED_CALLS_SLICE/getRecordedCallList",
  async (taskId: any, { rejectWithValue }) => {
    const response = await client.get(URL.GET_RECORDED_CALLS(taskId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

const initialState = {
  isLoading: false,
  recordedCallList: [],
};

export const recordedCallsReducer = createSlice({
  name: "RECORDED_CALLS_SLICE",
  initialState: JSON.parse(JSON.stringify(initialState)),
  reducers: {
    clearRecordedCallsData: () => JSON.parse(JSON.stringify(initialState)),
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRecordedCallList.pending, (state, action) => {
        state.recordedCallList = [];
        state.isLoading = true;
      })
      .addCase(getRecordedCallList.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action?.payload?.dmsEntity?.callhistory) {
          const { callhistory } = action.payload.dmsEntity;
          state.recordedCallList = callhistory;
        }
      })
      .addCase(getRecordedCallList.rejected, (state, action) => {
        state.isLoading = false;
        state.recordedCallList = [];
      });
  },
});

export const { clearRecordedCallsData } = recordedCallsReducer.actions;
export default recordedCallsReducer.reducer;
