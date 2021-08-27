import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from '../networking/client';
import URL from "../networking/endpoints";

export const getPreBookingData = createAsyncThunk('PRE_BOOKING_SLICE/getPreBookingData', async (endUrl) => {

  let url = URL.LEADS_LIST_API() + endUrl;
  const response = await client.get(url);
  return response;
})

const slice = createSlice({
  name: "PRE_BOOKING_SLICE",
  initialState: {},
  reducers: {},
});

export const { } = slice.actions;
export default slice.reducer;
