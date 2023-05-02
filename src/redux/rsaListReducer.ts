import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";
import { showToast } from "../utils/toast";

export const getRsaList = createAsyncThunk(
  "SERVICE_RSA_LIST_SLICE/getRsaList",
  async (payload, { rejectWithValue }) => {
    const { tenantId } = payload;
    const response = await client.get(URL.GET_SERVICE_RSA_LIST(tenantId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

const initialState = {
  isLoading: false,
  rsaList: [],
};

const rsaListReducer = createSlice({
  name: "SERVICE_RSA_LIST_SLICE",
  initialState: JSON.parse(JSON.stringify(initialState)),
  reducers: { clearStateData: () => JSON.parse(JSON.stringify(initialState)) },
  extraReducers: (builder) => {
    // Get Booking List
    builder
      .addCase(getRsaList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getRsaList.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.rsaList = action.payload.body.content;
        }
      })
      .addCase(getRsaList.rejected, (state, action) => {
        state.addCustomerResponseStatus = "failed";
        state.isLoading = false;
        if (action.payload.message) {
          showToast(`${action.payload.message}`);
        } else {
          showToast(`Something went wrong`);
        }
      });
  },
});

export const { clearStateData } = rsaListReducer.actions;
export default rsaListReducer.reducer;
