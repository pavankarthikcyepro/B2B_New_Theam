import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";
import { showToast } from "../utils/toast";

export const getBookingList = createAsyncThunk(
  "SERVICE_BOOKING_CRUD_SLICE/getBookingList",
  async (payload, { rejectWithValue }) => {
    const { tenantId, vehicleRegNumber } = payload;
    const response = await client.get(
      URL.GET_SERVICE_BOOKING_LIST(tenantId, vehicleRegNumber)
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

const initialState = {
  isLoading: false,
  bookingList: [],
};

const serviceBookingCrudReducer = createSlice({
  name: "SERVICE_BOOKING_CRUD_SLICE",
  initialState: JSON.parse(JSON.stringify(initialState)),
  reducers: { clearStateData: () => JSON.parse(JSON.stringify(initialState)) },
  extraReducers: (builder) => {
    // Get Booking List
    builder
      .addCase(getBookingList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getBookingList.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.bookingList = action.payload.body.content;
        }
      })
      .addCase(getBookingList.rejected, (state, action) => {
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

export const { clearStateData } = serviceBookingCrudReducer.actions;
export default serviceBookingCrudReducer.reducer;
