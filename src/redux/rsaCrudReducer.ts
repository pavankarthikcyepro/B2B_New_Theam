import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import { showToast } from "../utils/toast";
import URL from "../networking/endpoints";

interface DropDownModelNew {
  key: string;
  value: string;
  id?: string;
  orgId?: string;
}

interface PersonalIntroModel {
  key: string;
  text: string;
}

export const createRsa = createAsyncThunk(
  "SERVICE_RSA_CRUD_SLICE/createRsa",
  async (payload, { rejectWithValue }) => {
    const { tenantId, rsaData } = payload;
    const response = await client.post(URL.CREATE_RSA(tenantId), rsaData);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

const initialState = {
  isLoading: false,
  showDatepicker: false,
  datePickerKeyId: "",
  reason: "",
  remarks: "",
  amount: "",
  rsaDate: "",
  technician: "",
  address: "",
  area: "",
  landmark: "",
  pincode: "",
  createRsaResponseStatus: "pending",
};

const rsaCrudReducer = createSlice({
  name: "SERVICE_RSA_CRUD_SLICE",
  initialState: JSON.parse(JSON.stringify(initialState)),
  reducers: {
    clearStateData: () => JSON.parse(JSON.stringify(initialState)),
    setDropDownData: (state, action: PayloadAction<DropDownModelNew>) => {
      const { key, value } = action.payload;
      switch (key) {
        case "TECHNICIAN":
          state.technician = value;
          break;
      }
    },
    setDatePicker: (state, action) => {
      switch (action.payload) {
        case "RSA_DATE":
          state.minDate = new Date();
          state.maxDate = null;
          break;
        default:
          state.minDate = null;
          state.maxDate = null;
          break;
      }
      state.datePickerKeyId = action.payload;
      state.showDatepicker = !state.showDatepicker;
    },
    updateSelectedDate: (state, action: PayloadAction<PersonalIntroModel>) => {
      const { key, text } = action.payload;
      const keyId = key ? key : state.datePickerKeyId;
      switch (keyId) {
        case "RSA_DATE":
          state.rsaDate = text;
          break;
      }
      state.showDatepicker = !state.showDatepicker;
    },
    setInputInfo: (state, action: PayloadAction<PersonalIntroModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "REASON":
          state.reason = text;
          break;
        case "REMARKS":
          state.remarks = text;
          break;
        case "AMOUNT":
          state.amount = text;
          break;
        case "ADDRESS":
          state.address = text;
          break;
        case "AREA":
          state.area = text;
          break;
        case "LANDMARK":
          state.landmark = text;
          break;
        case "PINCODE":
          state.pincode = text;
          break;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRsa.pending, (state, action) => {
        state.isLoading = true;
        state.createRsaResponseStatus = "pending";
      })
      .addCase(createRsa.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.createRsaResponseStatus = "success";
        }
      })
      .addCase(createRsa.rejected, (state, action) => {
        state.isLoading = false;
        state.createRsaResponseStatus = "failed";
        if (action.payload.message) {
          showToast(`${action.payload.message}`);
        } else {
          showToast(`Something went wrong`);
        }
      });
  },
});

export const {
  clearStateData,
  setDropDownData,
  setDatePicker,
  updateSelectedDate,
  setInputInfo,
} = rsaCrudReducer.actions;
export default rsaCrudReducer.reducer;