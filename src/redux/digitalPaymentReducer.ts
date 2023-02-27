import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";

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
      state.isLoading = false;
      state.saveQrCodeSuccess = "";
      state.deleteQrCodeSuccess = "";
    },
  },
  extraReducers: (builder) => {
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
