import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";
import { showToast } from "../utils/toast";

export const getQueryList = createAsyncThunk(
  "SERVICE_QUERY_LIST_SLICE/getQueryList",
  async (payload, { rejectWithValue }) => {
    const { tenantId } = payload;
    const response = await client.get(URL.GET_SERVICE_QUERY_LIST(tenantId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

const initialState = {
  isLoading: false,
  queryList: [],
};

const queryListReducer = createSlice({
  name: "SERVICE_QUERY_LIST_SLICE",
  initialState: JSON.parse(JSON.stringify(initialState)),
  reducers: { clearStateData: () => JSON.parse(JSON.stringify(initialState)) },
  extraReducers: (builder) => {
    // Get Booking List
    builder
      .addCase(getQueryList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getQueryList.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.queryList = action.payload.body.content;
        }
      })
      .addCase(getQueryList.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload.message) {
          showToast(`${action.payload.message}`);
        } else {
          showToast(`Something went wrong`);
        }
      });
  },
});

export const { clearStateData } = queryListReducer.actions;
export default queryListReducer.reducer;
