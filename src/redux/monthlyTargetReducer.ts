import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from '../networking/client';
import URL from "../networking/endpoints";
import * as AsyncStore from '../asyncStore';

export const getMainListApi = createAsyncThunk('MONTHLY_TARGET/getMainListApi', async (payload: any, { rejectWithValue }) => {

  let endUrl = `?status=All&startdate=${payload.startDate}&enddate=${payload.endDate}&managerId=${payload.managerId}&pageNo=${payload.pageNo}&pageSize=10`;
  let url = URL.GET_EVENTS() + endUrl;
  const customHeaders = {
    branchid: payload.branchId,
    orgid: payload.orgId
  }
  const response = await client.get(url, customHeaders);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getMoreMainListApi = createAsyncThunk('MONTHLY_TARGET/getMoreMainListApi', async (payload: any, { rejectWithValue }) => {

  let endUrl = `?status=All&startdate=${payload.startDate}&enddate=${payload.endDate}&managerId=${payload.managerId}&pageNo=${payload.pageNo}&pageSize=10`;
  let url = URL.GET_EVENTS() + endUrl;
  const response = await client.get(url);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getSupportingListApi = createAsyncThunk('MONTHLY_TARGET/getSupportingListApi', async (payload: any, { rejectWithValue }) => {

  let endUrl = `?status=Approval_Pending&startdate=${payload.startDate}&enddate=${payload.endDate}&managerId=${payload.managerId}&pageNo=${payload.pageNo}&pageSize=10`;
  let url = URL.GET_EVENTS() + endUrl;
  const customHeaders = {
    branchid: payload.branchId,
    orgid: payload.orgId
  }
  const response = await client.get(url, customHeaders);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getMoreSupportingListApi  = createAsyncThunk('MONTHLY_TARGET/getMoreSupportingListApi', async (payload: any, { rejectWithValue }) => {

  let endUrl = `?status=Approval_Pending&startdate=${payload.startDate}&enddate=${payload.endDate}&managerId=${payload.managerId}&pageNo=${payload.pageNo}&pageSize=10`;
  let url = URL.GET_EVENTS() + endUrl;
  const response = await client.get(url);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const monthlyTargetSlice = createSlice({
  name: "MONTHLY_TARGET",
  initialState: {
   st: [],
    eventList: [],
    pageNumber: 0,
    totalPages: 1,
    isLoading: false,
    isLoadingExtraData: false,
    // pending list
    pending_event_list: [],
    p_pageNumber: 0,
    p_totalPages: 1,
    p_isLoading: false,
    p_isLoadingExtraData: false,
    // upcoming list
    upcoming_event_list: [],
    u_pageNumber: 0,
    u_totalPages: 1,
    u_isLoading: false,
    u_isLoadingExtraData: false,
    //preenquiry data //
     pre_enquiry_list: [],
    modelVisible: false,
    status: ""
   
  },
  // reducers: {}, // //
  //      //
  reducers: {
    callPressed: (state, action) => {
      state.modelVisible = !state.modelVisible;
    },
    setPreEnquiryList: (state, action) => {
      state.pre_enquiry_list = JSON.parse(action.payload);
    }, 
  },
  extraReducers: (builder) => {
    // Get Event List
    builder.addCase(getMainListApi.pending, (state, action) => {
      state.isLoading = true;
      state.totalPages = 0;
      state.pageNumber = 0;
      state.eventList = [];
    })
    builder.addCase(getMainListApi.fulfilled, (state, action) => {
      if (action.payload) {
        state.totalPages = action.payload.totalPages;
        state.pageNumber = action.payload.pageable.pageNumber;
        state.eventList = action.payload.content;
      }
      state.isLoading = false;
    })
    builder.addCase(getMainListApi.rejected, (state, action) => {
      state.isLoading = false;
      state.eventList = [];
    })
    // Get More Event List
    builder.addCase(getMoreMainListApi.pending, (state) => {
      state.isLoadingExtraData = true;
    })
    builder.addCase(getMoreMainListApi.fulfilled, (state, action) => {
      console.log('res: ', action.payload);
      if (action.payload) {
        state.pageNumber = action.payload.pageable.pageNumber;
        const content = action.payload.content;
        state.eventList = [...state.eventList, ...content];
      }
      state.isLoadingExtraData = false;
    })
    builder.addCase(getMoreMainListApi.rejected, (state) => {
      state.isLoadingExtraData = false;
    })
    // Get Pending Event List
    builder.addCase(getSupportingListApi.pending, (state, action) => {
      state.p_isLoading = true;
      state.p_totalPages = 0;
      state.p_pageNumber = 0;
      state.pending_event_list = [];
    })
    builder.addCase(getSupportingListApi.fulfilled, (state, action) => {
      if (action.payload) {
        state.p_totalPages = action.payload.totalPages;
        state.p_pageNumber = action.payload.pageable.pageNumber;
        state.pending_event_list = action.payload.content;
      }
      state.p_isLoading = false;
    })
    builder.addCase(getSupportingListApi.rejected, (state, action) => {
      state.p_isLoading = false;
      state.pending_event_list = [];
    })
    // Get More Pending Event List
    builder.addCase(getMoreSupportingListApi.pending, (state, action) => {
      state.p_isLoadingExtraData = true;
    })
    builder.addCase(getMoreSupportingListApi.fulfilled, (state, action) => {
      if (action.payload) {
        state.p_pageNumber = action.payload.pageable.pageNumber;
        const content = action.payload.content;
        state.pending_event_list = [...state.pending_event_list, ...content];
      }
      state.p_isLoadingExtraData = false;
    })
    builder.addCase(getMoreSupportingListApi.rejected, (state, action) => {
      state.p_isLoadingExtraData = false;
    })
     
  }
});

export const { callPressed, setPreEnquiryList,} = monthlyTargetSlice.actions;

export default monthlyTargetSlice.reducer;


