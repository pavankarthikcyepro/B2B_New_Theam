import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from '../networking/client';
import URL from "../networking/endpoints";


export const getMyTasksList = createAsyncThunk("MY_TASKS/getMyTasksList", async (endUrl) => {

  const url = URL.MY_TASKS() + endUrl;
  const response = await client.get(url);
  return response;
})

export const mytaskSlice = createSlice({
  name: "MY_TASKS",
  initialState: {
    tableData: [],
    pageNumber: 0,
    totalPages: 1,
    isLoading: false,
    status: ""
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMyTasksList.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(getMyTasksList.fulfilled, (state, action) => {
      //console.log("payload: ", action.payload);
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.totalPages = dmsEntityObj.myTasks.totalPages;
        state.pageNumber = dmsEntityObj.myTasks.pageable.pageNumber;
        const content = dmsEntityObj.myTasks.content;
        state.tableData = state.pageNumber === 0 ? content : [...state.tableData, ...content];
      }
      state.isLoading = false;
      state.status = "success";
    })
    builder.addCase(getMyTasksList.rejected, (state, action) => {
      state.isLoading = false;
      state.status = "failed";
    })
  }
});

export const { } = mytaskSlice.actions;
export default mytaskSlice.reducer;
