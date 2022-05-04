import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from '../networking/client';
import URL from "../networking/endpoints";

export const getBookingData = createAsyncThunk('BOOKING_SLICE/getBookingData', async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.LEADS_LIST_API_FILTER(), payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getMoreBookingData = createAsyncThunk('BOOKING_SLICE/getMoreBookingData', async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.LEADS_LIST_API_FILTER(), payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

const slice = createSlice({
  name: "BOOKING_SLICE",
  initialState: {
    booking_list: [],
    pageNumber: 0,
    totalPages: 1,
    isLoading: false,
    isLoadingExtraData: false,
    status: ""
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBookingData.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(getBookingData.fulfilled, (state, action) => {
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.totalPages = dmsEntityObj.leadDtoPage.totalPages;
        state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
        state.booking_list = dmsEntityObj.leadDtoPage.content;
      }
      state.isLoading = false;
      state.status = "success";
    })
    builder.addCase(getBookingData.rejected, (state, action) => {
      state.isLoading = false;
      state.status = "failed";
    })
    // getMorePreBookingData api response
    builder.addCase(getMoreBookingData.pending, (state) => {
      state.isLoadingExtraData = true;
    })
    builder.addCase(getMoreBookingData.fulfilled, (state, action) => {
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
        const content = dmsEntityObj.leadDtoPage.content;
        state.booking_list = [...state.booking_list, ...content];
      }
      state.isLoadingExtraData = false;
      state.status = "success";
    })
    builder.addCase(getMoreBookingData.rejected, (state, action) => {
      state.isLoadingExtraData = false;
      state.status = "failed";
    })
  }
});

export const { } = slice.actions;
export default slice.reducer;
