import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from '../networking/client';
import URL from "../networking/endpoints";

export const getPreBookingData = createAsyncThunk('PRE_BOOKING_SLICE/getPreBookingData', async (endUrl) => {

  let url = URL.LEADS_LIST_API() + endUrl;
  const response = await client.get(url);
  return response;
})

export const getMorePreBookingData = createAsyncThunk('PRE_BOOKING_SLICE/getMorePreBookingData', async (endUrl) => {

  let url = URL.LEADS_LIST_API() + endUrl;
  const response = await client.get(url);
  return response;
})

const slice = createSlice({
  name: "PRE_BOOKING_SLICE",
  initialState: {
    pre_booking_list: [],
    pageNumber: 0,
    totalPages: 1,
    isLoading: false,
    isLoadingExtraData: false,
    status: ""
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPreBookingData.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(getPreBookingData.fulfilled, (state, action) => {
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.totalPages = dmsEntityObj.leadDtoPage.totalPages;
        state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
        state.pre_booking_list = dmsEntityObj.leadDtoPage.content;
      }
      state.isLoading = false;
      state.status = "success";
    })
    builder.addCase(getPreBookingData.rejected, (state, action) => {
      state.isLoading = false;
      state.status = "failed";
    })
    // getMorePreBookingData api response
    builder.addCase(getMorePreBookingData.pending, (state) => {
      state.isLoadingExtraData = true;
    })
    builder.addCase(getMorePreBookingData.fulfilled, (state, action) => {
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
        const content = dmsEntityObj.leadDtoPage.content;
        state.pre_booking_list = [...state.pre_booking_list, ...content];
      }
      state.isLoadingExtraData = false;
      state.status = "success";
    })
    builder.addCase(getMorePreBookingData.rejected, (state, action) => {
      state.isLoadingExtraData = false;
      state.status = "failed";
    })
  }
});

export const { } = slice.actions;
export default slice.reducer;
