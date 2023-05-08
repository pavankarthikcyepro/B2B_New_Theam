import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";
import { showToast } from "../utils/toast";

export const getWebCallUri = createAsyncThunk(
  "WEB_CALL_SLICE/getWebCallUri",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(URL.GET_CALL_URI(), payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const slice = createSlice({
  name: "WEB_CALL_SLICE",
  initialState: {
    isLoading: false,
    webCallUriResponse: "",
    webCallUri: "",
  },
  reducers: {
    clearState: (state, action) => {
      state.isLoading = false;
      state.webCallUriResponse = "";
      state.webCallUri = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWebCallUri.pending, (state) => {
        state.isLoading = true;
        state.webCallUriResponse = "pending";
      })
      .addCase(getWebCallUri.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action?.payload?.token) {
          state.webCallUri = action.payload.token;
          state.webCallUriResponse = "success";
        } else {
          showToast("Not connecting..");
        }
      })
      .addCase(getWebCallUri.rejected, (state, action) => {
        state.isLoading = false;
        state.webCallUriResponse = "failed";
        if (action.payload.message) {
          showToast(`${action.payload.message}`);
        } else {
          showToast(`Something went wrong`);
        }
      });
  },
});

export const { clearState } = slice.actions;
export default slice.reducer;