import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from '../networking/client';
import URL from "../networking/endpoints";

export const getEventsListApi = createAsyncThunk('EVENT_MANAGEMENT/getEventsListApi', async (payload: any, { rejectWithValue }) => {

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

export const getMoreEventsListApi = createAsyncThunk('EVENT_MANAGEMENT/getMoreEventsListApi', async (payload: any, { rejectWithValue }) => {

  let endUrl = `?status=All&startdate=${payload.startDate}&enddate=${payload.endDate}&managerId=${payload.managerId}&pageNo=${payload.pageNo}&pageSize=10`;
  let url = URL.GET_EVENTS() + endUrl;
  const response = await client.get(url);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getPendingEventListApi = createAsyncThunk('EVENT_MANAGEMENT/getPendingEventListApi', async (payload: any, { rejectWithValue }) => {

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

export const getMorePendingEventListApi = createAsyncThunk('EVENT_MANAGEMENT/getMorePendingEventListApi', async (payload: any, { rejectWithValue }) => {

  let endUrl = `?status=Approval_Pending&startdate=${payload.startDate}&enddate=${payload.endDate}&managerId=${payload.managerId}&pageNo=${payload.pageNo}&pageSize=10`;
  let url = URL.GET_EVENTS() + endUrl;
  const response = await client.get(url);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getUpcomingEventListApi = createAsyncThunk('EVENT_MANAGEMENT/getUpcomingEventListApi', async (payload: any, { rejectWithValue }) => {

  let endUrl = `?status=Planning_Pending&startdate=${payload.startDate}&enddate=${payload.endDate}&managerId=${payload.managerId}&pageNo=${payload.pageNo}&pageSize=10`;
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

export const getMoreUpcomingEventListApi = createAsyncThunk('EVENT_MANAGEMENT/getMoreUpcomingEventListApi', async (payload: any, { rejectWithValue }) => {

  let endUrl = `?status=Planning_Pending&startdate=${payload.startDate}&enddate=${payload.endDate}&managerId=${payload.managerId}&pageNo=${payload.pageNo}&pageSize=10`;
  let url = URL.GET_EVENTS() + endUrl;
  const response = await client.get(url);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const eventmanagementSlice = createSlice({
  name: "EVENT_MANAGEMENT",
  initialState: {
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
  },
  reducers: {},
  extraReducers: (builder) => {
    // Get Event List
    builder.addCase(getEventsListApi.pending, (state, action) => {
      state.isLoading = true;
      state.totalPages = 0;
      state.pageNumber = 0;
      state.eventList = [];
    })
    builder.addCase(getEventsListApi.fulfilled, (state, action) => {
      if (action.payload) {
        state.totalPages = action.payload.totalPages;
        state.pageNumber = action.payload.pageable.pageNumber;
        state.eventList = action.payload.content;
      }
      state.isLoading = false;
    })
    builder.addCase(getEventsListApi.rejected, (state, action) => {
      state.isLoading = false;
      state.eventList = [];
    })
    // Get More Event List
    builder.addCase(getMoreEventsListApi.pending, (state) => {
      state.isLoadingExtraData = true;
    })
    builder.addCase(getMoreEventsListApi.fulfilled, (state, action) => {
      console.log('res: ', action.payload);
      if (action.payload) {
        state.pageNumber = action.payload.pageable.pageNumber;
        const content = action.payload.content;
        state.eventList = [...state.eventList, ...content];
      }
      state.isLoadingExtraData = false;
    })
    builder.addCase(getMoreEventsListApi.rejected, (state) => {
      state.isLoadingExtraData = false;
    })
    // Get Pending Event List
    builder.addCase(getPendingEventListApi.pending, (state, action) => {
      state.p_isLoading = true;
      state.p_totalPages = 0;
      state.p_pageNumber = 0;
      state.pending_event_list = [];
    })
    builder.addCase(getPendingEventListApi.fulfilled, (state, action) => {
      if (action.payload) {
        state.p_totalPages = action.payload.totalPages;
        state.p_pageNumber = action.payload.pageable.pageNumber;
        state.pending_event_list = action.payload.content;
      }
      state.p_isLoading = false;
    })
    builder.addCase(getPendingEventListApi.rejected, (state, action) => {
      state.p_isLoading = false;
      state.pending_event_list = [];
    })
    // Get More Pending Event List
    builder.addCase(getMorePendingEventListApi.pending, (state, action) => {
      state.p_isLoadingExtraData = true;
    })
    builder.addCase(getMorePendingEventListApi.fulfilled, (state, action) => {
      if (action.payload) {
        state.p_pageNumber = action.payload.pageable.pageNumber;
        const content = action.payload.content;
        state.pending_event_list = [...state.pending_event_list, ...content];
      }
      state.p_isLoadingExtraData = false;
    })
    builder.addCase(getMorePendingEventListApi.rejected, (state, action) => {
      state.p_isLoadingExtraData = false;
    })
    // Get Upcoming Event List
    builder.addCase(getUpcomingEventListApi.pending, (state, action) => {
      state.u_isLoading = true;
      state.u_totalPages = 0;
      state.u_pageNumber = 0;
      state.upcoming_event_list = [];
    })
    builder.addCase(getUpcomingEventListApi.fulfilled, (state, action) => {
      if (action.payload) {
        state.u_totalPages = action.payload.totalPages;
        state.u_pageNumber = action.payload.pageable.pageNumber;
        state.upcoming_event_list = action.payload.content;
      }
      state.u_isLoading = false;
    })
    builder.addCase(getUpcomingEventListApi.rejected, (state, action) => {
      state.u_isLoading = false;
      state.upcoming_event_list = [];
    })
    // Get More Upcoming Event List
    builder.addCase(getMoreUpcomingEventListApi.pending, (state, action) => {
      state.u_isLoadingExtraData = true;
    })
    builder.addCase(getMoreUpcomingEventListApi.fulfilled, (state, action) => {
      if (action.payload) {
        state.u_pageNumber = action.payload.pageable.pageNumber;
        const content = action.payload.content;
        state.upcoming_event_list = [...state.upcoming_event_list, ...content];
      }
      state.u_isLoadingExtraData = false;
    })
    builder.addCase(getMoreUpcomingEventListApi.rejected, (state, action) => {
      state.u_isLoadingExtraData = false;
    })
  }
});

export const { } = eventmanagementSlice.actions;
export default eventmanagementSlice.reducer;
