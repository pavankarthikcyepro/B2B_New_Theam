import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from '../networking/client';
import URL from "../networking/endpoints";

const data = [
  {
    eventID: "EVE-19006672",
    eventName: "Mega event",
    startDate: "17-July-2021",
    endDate: "22-July-2021",
    location: "Gachibowli",
    eventType: "Bank",
    participiants: "List of employee with Designation",
  },
  {
    eventID: "EVE-19006672",
    eventName: "Mega event",
    startDate: "17-July-2021",
    endDate: "22-July-2021",
    location: "Gachibowli",
    eventType: "Bank",
    participiants: "List of employee with Designation",
  },
];

export const getEventsListApi = createAsyncThunk('EVENT_MANAGEMENT/getEventsListApi', async (payload: any, { rejectWithValue }) => {

  let endUrl = `?startdate=${payload.startDate}&enddate=${payload.endDate}&managerId=${payload.managerId}&pageNo=${payload.pageNo}&pageSize=10`;
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

export const getMoreEventsListApi = createAsyncThunk('EVENT_MANAGEMENT/getMoreEventsListApi', async (endUrl, { rejectWithValue }) => {

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
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getEventsListApi.pending, (state, action) => {
      state.isLoading = true;
      state.totalPages = 0;
      state.pageNumber = 0;
      state.eventList = [];
    })
    builder.addCase(getEventsListApi.fulfilled, (state, action) => {
      // console.log('S getEventsListApi: ', JSON.stringify(action.payload));
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
  }
});

export const { } = eventmanagementSlice.actions;
export default eventmanagementSlice.reducer;
