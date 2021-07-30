import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from '../networking/client';
import URL from "../networking/endpoints";

export const getPreEnquiryData = createAsyncThunk('PRE_ENQUIRY/getPreEnquiryData', async (endUrl) => {

  let url = URL.LEADS_LIST_API() + endUrl;
  const response = await client.get(url);
  return response
})

export const preEnquirySlice = createSlice({
  name: "PRE_ENQUIRY",
  initialState: {
    pre_enquiry_list: [],
    modelVisible: false,
    sortAndFilterVisible: false,
    pageNumber: 0,
    totalPages: 1,
    isLoading: false,
    status: ""
  },
  reducers: {
    callPressed: (state, action) => {
      state.modelVisible = !state.modelVisible;
    },
    sortAndFilterPressed: (state, action) => {
      state.sortAndFilterVisible = !state.sortAndFilterVisible;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getPreEnquiryData.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(getPreEnquiryData.fulfilled, (state, action) => {
      console.log('res: ', action.payload);
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.totalPages = dmsEntityObj.leadDtoPage.totalPages;
        state.pre_enquiry_list = dmsEntityObj.leadDtoPage.content;
      }
      state.isLoading = false;
    })
    builder.addCase(getPreEnquiryData.rejected, (state) => {
      state.isLoading = false;
    })
  }
});

export const { callPressed, sortAndFilterPressed } = preEnquirySlice.actions;
export default preEnquirySlice.reducer;
