import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import URL from "../networking/endpoints";
import { client } from '../networking/client';

export const getEnquiryList = createAsyncThunk("ENQUIRY/getEnquiryList", async (endUrl) => {

  let url = URL.LEADS_LIST_API() + endUrl;
  const response = await client.get(url);
  return response
})

const enquirySlice = createSlice({
  name: "ENQUIRY",
  initialState: {
    enquiry_list: [],
    pageNumber: 0,
    totalPages: 1,
    isLoading: false,
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
        state.enquiry_list = dmsEntityObj.leadDtoPage.content;
      }
      state.isLoading = false;
      state.status = "sucess";
    })
    builder.addCase(getEnquiryList.rejected, (state, action) => {
      state.isLoading = false;
      state.status = "failed";
    })
  }
});

export const { } = enquirySlice.actions;
export default enquirySlice.reducer;
