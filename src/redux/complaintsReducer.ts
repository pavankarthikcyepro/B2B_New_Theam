import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from '../networking/client';
import URL from "../networking/endpoints";


export const getComplaintsListApi = createAsyncThunk("COMPLAINTS/getComplaintsListApi", async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.GET_COMPLAINTS(), payload);
  const json = await response.json()
  console.log(json)
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getMoreComplaintsListApi = createAsyncThunk("COMPLAINTS/getMoreComplaintsListApi", async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.GET_COMPLAINTS(), payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})


export const complaintsSlice = createSlice({
  name: "COMPLAINTS",
  initialState: {
    page_number: 0,
    total_objects_count: 0,
    complaints_list: [],
    isLoading: false,
    isExtraLoading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    // Get Complaints List
    builder.addCase(getComplaintsListApi.pending, (state, action) => {
      state.isLoading = true;
    })
    builder.addCase(getComplaintsListApi.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        const dataObj = action.payload;
        state.total_objects_count = dataObj.totalCnt ? dataObj.totalCnt : 0;
        state.page_number = dataObj.pageNo ? dataObj.pageNo : 0;
        state.complaints_list = dataObj.data ? dataObj.data : [];
      }
    })
    builder.addCase(getComplaintsListApi.rejected, (state, action) => {
      state.isLoading = false;
    })
    // Get More Complaints List
    builder.addCase(getMoreComplaintsListApi.pending, (state, action) => {
      state.isExtraLoading = true;
    })
    builder.addCase(getMoreComplaintsListApi.fulfilled, (state, action) => {
      state.isExtraLoading = false;
      if (action.payload) {
        const dataObj = action.payload;
        state.page_number = dataObj.pageNo ? dataObj.pageNo : 0;
        const list = dataObj.data ? dataObj.data : [];
        state.complaints_list = [...state.complaints_list, ...list];
      }
    })
    builder.addCase(getMoreComplaintsListApi.rejected, (state, action) => {
      state.isExtraLoading = false;
    })
  }
});

export const { } = complaintsSlice.actions;
export default complaintsSlice.reducer;
