import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import URL from "../networking/endpoints";
import { client } from '../networking/client';

export const getEnquiryList = createAsyncThunk("ENQUIRY/getEnquiryList", async (payload, { rejectWithValue }) => {

  console.log("PAYLOAD EN: ", JSON.stringify(payload));

  const response = await client.post(URL.LEADS_LIST_API_FILTER(), payload);
  const json = await response.json()
  console.log("ENQ LIST:", JSON.stringify(json));

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
  reducers: {
    clearEnqState: (state, action) => {
      state.enquiry_list =  [],
      state.pageNumber =  0,
      state.totalPages =  1,
      state.isLoading =  false,
      state.isLoadingExtraData =  false,
      state.status =  ""
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getEnquiryList.pending, (state) => {
      state.totalPages = 1
      state.pageNumber = 0
      state.enquiry_list = []
      state.isLoading = true;
    })
    builder.addCase(getEnquiryList.fulfilled, (state, action) => {
      console.log('res: ', action.payload);
      const dmsEntityObj = action.payload?.dmsEntity;
      state.totalPages = 1
      state.pageNumber = 0
      state.enquiry_list = []
      if (dmsEntityObj) {
        state.totalPages = dmsEntityObj.leadDtoPage.totalPages;
        state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
        // state.enquiry_list = dmsEntityObj.leadDtoPage.content;
      }
      state.isLoading = false;
      state.status = "sucess";
    })
    builder.addCase(getEnquiryList.rejected, (state, action) => {
      state.totalPages = 1
      state.pageNumber = 0
      state.enquiry_list = []
      state.isLoading = false;
      state.status = "failed";
    })
    builder.addCase(getMoreEnquiryList.pending, (state) => {
      state.totalPages = 1
      state.pageNumber = 0
      state.isLoadingExtraData = true;
    })
    builder.addCase(getMoreEnquiryList.fulfilled, (state, action) => {
      // console.log('res: ', action.payload);
      const dmsEntityObj = action.payload?.dmsEntity;
      state.totalPages = 1
      state.pageNumber = 0
      if (dmsEntityObj) {
        state.totalPages = dmsEntityObj.leadDtoPage.totalPages;
        state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
        const content = dmsEntityObj.leadDtoPage.content;
        // state.enquiry_list = [...state.enquiry_list, ...content];
      }
      state.status = "sucess";
      state.isLoadingExtraData = false;

    })
    builder.addCase(getMoreEnquiryList.rejected, (state, action) => {
      state.isLoadingExtraData = false;
      state.status = "failed";
    })
  }
});

export const { clearEnqState } = enquirySlice.actions;
export default enquirySlice.reducer;
