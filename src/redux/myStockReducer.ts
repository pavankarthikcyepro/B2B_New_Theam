import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";

export const getEventsListApi = createAsyncThunk(
  "EVENT_MANAGEMENT/getEventsListApi",
  async (payload: any, { rejectWithValue }) => {
    let endUrl = `?status=All&startdate=${payload.startDate}&enddate=${payload.endDate}&managerId=${payload.managerId}&pageNo=${payload.pageNo}&pageSize=10`;
    let url = URL.GET_EVENTS() + endUrl;
    const customHeaders = {
      branchid: payload.branchId,
      orgid: payload.orgId,
    };
    const response = await client.get(url, customHeaders);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const myStockSlice = createSlice({
  name: "MY_STOCK",
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
    currentScreen: "OVERVIEW",
    dealerCode: {},
  },
  reducers: {
    updateCurrentScreen: (state, action) => {
      state.currentScreen = action.payload;
    },
    updateSelectedDealerCode: (state, action) => {
      state.dealerCode = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Get Event List
    builder.addCase(getEventsListApi.pending, (state, action) => {
      state.isLoading = true;
      state.totalPages = 0;
      state.pageNumber = 0;
      state.eventList = [];
    });
    builder.addCase(getEventsListApi.fulfilled, (state, action) => {
      if (action.payload) {
        state.totalPages = action.payload.totalPages;
        state.pageNumber = action.payload.pageable.pageNumber;
        state.eventList = action.payload.content;
      }
      state.isLoading = false;
    });
    builder.addCase(getEventsListApi.rejected, (state, action) => {
      state.isLoading = false;
      state.eventList = [];
    });
  },
});

export const { updateCurrentScreen, updateSelectedDealerCode } = myStockSlice.actions;
export default myStockSlice.reducer;
