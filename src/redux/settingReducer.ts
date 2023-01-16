import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";

export const callDeallocate = createAsyncThunk(
  "SETTING/callDeallocate",
  async (empId, { rejectWithValue }) => {
    const response = await client.post(URL.CALL_DEALLOCATE(empId), {});
    const json = await response.json();
    if (response.status != 200) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const settingSlice = createSlice({
  name: "SETTING",
  initialState: {
    deallocateResponseStatus: "",
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(callDeallocate.pending, (state, action) => {
        state.deallocateResponseStatus = "";
        state.loading = true;
      })
      .addCase(callDeallocate.fulfilled, (state, action) => {
        state.deallocateResponseStatus = "success";
        state.loading = false;
      })
      .addCase(callDeallocate.rejected, (state, action) => {
        state.deallocateResponseStatus = "failed";
        state.loading = false;
      });
  },
});

export default settingSlice.reducer;
