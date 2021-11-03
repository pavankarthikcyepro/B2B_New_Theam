import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import URL from "../networking/endpoints";
import { client } from '../networking/client';

export const getEnquiryList = createAsyncThunk("ENQUIRY/getEnquiryList", async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.LEADS_LIST_API_FILTER(), payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getMoreEnquiryList = createAsyncThunk("ENQUIRY/getMoreEnquiryList", async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.LEADS_LIST_API_FILTER(), payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

const enquirySlice = createSlice({
  name: "ENQUIRY",
  initialState: {
    enquiry_list: [],
    pageNumber: 0,
    totalPages: 1,
    isLoading: false,
    isLoadingExtraData: false,
    status: ""
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getEnquiryList.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(getEnquiryList.fulfilled, (state, action) => {
      console.log('res: ', action.payload);
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.totalPages = dmsEntityObj.leadDtoPage.totalPages;
        state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
        state.enquiry_list = dmsEntityObj.leadDtoPage.content;
      }
      state.isLoading = false;
      state.status = "sucess";
    })
    builder.addCase(getEnquiryList.rejected, (state, action) => {
      state.isLoading = false;
      state.status = "failed";
    })
    builder.addCase(getMoreEnquiryList.pending, (state) => {
      state.isLoadingExtraData = true;
    })
    builder.addCase(getMoreEnquiryList.fulfilled, (state, action) => {
      // console.log('res: ', action.payload);
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
        const content = dmsEntityObj.leadDtoPage.content;
        state.enquiry_list = [...state.enquiry_list, ...content];
      }
      state.isLoadingExtraData = false;
      state.status = "sucess";
    })
    builder.addCase(getMoreEnquiryList.rejected, (state, action) => {
      state.isLoadingExtraData = false;
      state.status = "failed";
    })
  }
});

export const { } = enquirySlice.actions;
export default enquirySlice.reducer;
