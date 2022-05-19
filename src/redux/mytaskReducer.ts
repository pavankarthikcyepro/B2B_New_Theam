import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from '../networking/client';
import URL from "../networking/endpoints";


export const getCurrentTasksListApi = createAsyncThunk("MY_TASKS/getCurrentTasksListApi", async (endUrl, { rejectWithValue }) => {

  const url = URL.GET_CURRENT_TASK_LIST() + endUrl;
  const response = await client.get(url);
  const json = await response.json()
  console.log(json)
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getPendingTasksListApi = createAsyncThunk("MY_TASKS/getPendingTasksListApi", async (endUrl, { rejectWithValue }) => {

  const url = URL.GET_FEATURE_PENDING_TASK_LIST() + endUrl;
  const response = await client.get(url);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getMoreCurrentTasksListApi = createAsyncThunk("MY_TASKS/getMoreCurrentTasksListApi", async (endUrl, { rejectWithValue }) => {

  const url = URL.GET_CURRENT_TASK_LIST() + endUrl;
  const response = await client.get(url);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getMorePendingTasksListApi = createAsyncThunk("MY_TASKS/getMorePendingTasksListApi", async (endUrl, { rejectWithValue }) => {

  const url = URL.GET_FEATURE_PENDING_TASK_LIST() + endUrl;
  const response = await client.get(url);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getMyTasksListApi = createAsyncThunk("MY_TASKS/getMyTasksListApi", async (userId, { rejectWithValue }) => {

  const payload = {
    "loggedInEmpId": userId,
    "onlyForEmp": true
  }

  const url = URL.GET_MY_TASKS_NEW_DATA();
  const response = await client.post(url, payload);
  const json = await response.json()
  console.log(json)
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const mytaskSlice = createSlice({
  name: "MY_TASKS",
  initialState: {
    // Current Tasks
    currentTableData: [],
    currentPageNumber: 0,
    currnetTotalPages: 1,
    isLoadingForCurrentTask: false,
    isLoadingExtraDataForCurrentTask: false,
    // Pending Tasks
    pendingTableData: [],
    pendingPageNumber: 0,
    pendingTotalPages: 1,
    isLoadingForPendingTask: false,
    isLoadingExtraDataForPendingTask: false,
    mytasksLisResponse: {},
    myTasksListResponseStatus: ""
  },
  reducers: {},
  extraReducers: (builder) => {
    // Get Current Task List
    builder.addCase(getCurrentTasksListApi.pending, (state) => {
      state.isLoadingForCurrentTask = true;
    })
    builder.addCase(getCurrentTasksListApi.fulfilled, (state, action) => {
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.currnetTotalPages = dmsEntityObj.myTasks.totalPages;
        state.currentPageNumber = dmsEntityObj.myTasks.pageable.pageNumber;
        state.currentTableData = dmsEntityObj.myTasks.content;
      }
      state.isLoadingForCurrentTask = false;
    })
    builder.addCase(getCurrentTasksListApi.rejected, (state, action) => {
      state.isLoadingForCurrentTask = false;
    })
    // Get More Current Task List
    builder.addCase(getMoreCurrentTasksListApi.pending, (state) => {
      state.isLoadingExtraDataForCurrentTask = true;
    })
    builder.addCase(getMoreCurrentTasksListApi.fulfilled, (state, action) => {
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.currentPageNumber = dmsEntityObj.myTasks.pageable.pageNumber;
        state.currentTableData = [...state.currentTableData, ...dmsEntityObj.myTasks.content];
      }
      state.isLoadingExtraDataForCurrentTask = false;
    })
    builder.addCase(getMoreCurrentTasksListApi.rejected, (state, action) => {
      state.isLoadingExtraDataForCurrentTask = false;
    })
    // Get Pending Task List
    builder.addCase(getPendingTasksListApi.pending, (state) => {
      state.isLoadingForPendingTask = true;
    })
    builder.addCase(getPendingTasksListApi.fulfilled, (state, action) => {
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.pendingTotalPages = dmsEntityObj.myTasks.totalPages;
        state.pendingPageNumber = dmsEntityObj.myTasks.pageable.pageNumber;
        state.pendingTableData = dmsEntityObj.myTasks.content;
      }
      state.isLoadingForPendingTask = false;
    })
    builder.addCase(getPendingTasksListApi.rejected, (state, action) => {
      state.isLoadingForPendingTask = false;
    })
    // Get More Pending Task List
    builder.addCase(getMorePendingTasksListApi.pending, (state) => {
      state.isLoadingExtraDataForPendingTask = true;
    })
    builder.addCase(getMorePendingTasksListApi.fulfilled, (state, action) => {
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.pendingPageNumber = dmsEntityObj.myTasks.pageable.pageNumber;
        state.pendingTableData = [...state.pendingTableData, ...dmsEntityObj.myTasks.content];
      }
      state.isLoadingExtraDataForPendingTask = false;
    })
    builder.addCase(getMorePendingTasksListApi.rejected, (state, action) => {
      state.isLoadingExtraDataForPendingTask = false;
    })
    // Get My Tasks List
    builder.addCase(getMyTasksListApi.pending, (state) => {
      state.mytasksLisResponse = {};
      state.myTasksListResponseStatus = "pending";
    })
    builder.addCase(getMyTasksListApi.fulfilled, (state, action) => {
      state.mytasksLisResponse = action.payload;
      state.myTasksListResponseStatus = "success";
    })
    builder.addCase(getMyTasksListApi.rejected, (state, action) => {
      state.mytasksLisResponse = action.payload;
      state.myTasksListResponseStatus = "failed";
    })
  }
});

export const { } = mytaskSlice.actions;
export default mytaskSlice.reducer;
