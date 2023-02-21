import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";

export const getBranchesList = createAsyncThunk(
  "DIGITAL_PAYMENT_SLICE/getBranchesList",
  async (orgId, { rejectWithValue }) => {
    const response = await client.get(URL.BRANCHES(orgId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const saveQrCode = createAsyncThunk(
  "DIGITAL_PAYMENT_SLICE/saveQrCode",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(URL.QR_SAVE(), payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

const digitalPaymentReducer = createSlice({
  name: "DIGITAL_PAYMENT_SLICE",
  initialState: {
    branches: [],
    isLoading: false,
    saveQrCodeSuccess: null,
  },
  reducers: {
    clearState: (state, action) => {
      state.branches = [];
      state.isLoading = false;
      state.saveQrCodeSuccess = null;
    },
  },
  extraReducers: (builder) => {
    // Get branch list
    builder.addCase(getBranchesList.pending, (state, action) => {
      state.saveQrCodeSuccess = true;
      state.branches = [];
    });
    builder.addCase(getBranchesList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.branches = action.payload;
    });
    builder.addCase(getBranchesList.rejected, (state, action) => {
      state.isLoading = false;
    });

    // Save QR code
    builder.addCase(saveQrCode.pending, (state, action) => {
      state.isLoading = true;
      state.saveQrCodeSuccess = false;
    });
    builder.addCase(saveQrCode.fulfilled, (state, action) => {
      state.isLoading = false;
      state.saveQrCodeSuccess = true;
    });
    builder.addCase(saveQrCode.rejected, (state, action) => {
      state.isLoading = false;
      state.saveQrCodeSuccess = false;
    });
  },
});

export const { clearState } = digitalPaymentReducer.actions;
export default digitalPaymentReducer.reducer;
