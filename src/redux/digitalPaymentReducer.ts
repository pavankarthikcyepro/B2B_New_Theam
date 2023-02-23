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

export const deleteQrCode = createAsyncThunk(
  "DIGITAL_PAYMENT_SLICE/deleteQrCode",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(URL.QR_DELETE(), payload);
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
    saveQrCodeSuccess: "",
    deleteQrCodeSuccess: "",
  },
  reducers: {
    clearSaveApiRes: (state, action) => {
      state.saveQrCodeSuccess = "";
    },
    clearDeleteApiRes: (state, action) => {
      state.deleteQrCodeSuccess = "";
    },
    clearState: (state, action) => {
      state.branches = [];
      state.isLoading = false;
      state.saveQrCodeSuccess = "";
      state.deleteQrCodeSuccess = "";
    },
  },
  extraReducers: (builder) => {
    // Get branch list
    builder.addCase(getBranchesList.pending, (state, action) => {
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
      state.saveQrCodeSuccess = "";
    });
    builder.addCase(saveQrCode.fulfilled, (state, action) => {
      state.isLoading = false;
      state.saveQrCodeSuccess = "success";
    });
    builder.addCase(saveQrCode.rejected, (state, action) => {
      state.isLoading = false;
      state.saveQrCodeSuccess = "";
    });

    // Delete QR code
    builder.addCase(deleteQrCode.pending, (state, action) => {
      state.isLoading = true;
      state.deleteQrCodeSuccess = "";
    });
    builder.addCase(deleteQrCode.fulfilled, (state, action) => {
      state.isLoading = false;
      state.deleteQrCodeSuccess = "success";
    });
    builder.addCase(deleteQrCode.rejected, (state, action) => {
      state.isLoading = false;
      state.deleteQrCodeSuccess = "";
    });
  },
});

export const { clearSaveApiRes, clearDeleteApiRes, clearState } = digitalPaymentReducer.actions;
export default digitalPaymentReducer.reducer;
