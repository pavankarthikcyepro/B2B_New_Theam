import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";
import * as AsyncStore from '../asyncStore';

const data = [
  {
    title: "Pre-Enquiry",
    count: 12,
  },
  {
    title: "My Task",
    count: 10,
  },
];

const dates = [
  {
    month: "MAY",
    date: 1,
    day: "Mon",
  },
  {
    month: "MAY",
    date: 2,
    day: "Tue",
  },
  {
    month: "MAY",
    date: 3,
    day: "Wed",
  },
  {
    month: "MAY",
    date: 4,
    day: "Thu",
  },
  {
    month: "MAY",
    date: 5,
    day: "Fri",
  },
];

export const getMenuList = createAsyncThunk("HOME/getMenuList", async (name) => {

  let url = URL.MENULIST_API() + name;
  const response = client.get(url)
  return response;
})

export const homeSlice = createSlice({
  name: "HOME",
  initialState: {
    serchtext: "",
    employeeId: "",
    tableData: data,
    datesData: dates,
    menuList: [],
    dateSelectedIndex: 0,
    dateModalVisible: false,
  },
  reducers: {
    dateSelected: (state, action) => {
      state.dateSelectedIndex = action.payload;
    },
    showDateModal: (state, action) => {
      state.dateModalVisible = !state.dateModalVisible;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMenuList.fulfilled, (state, action) => {
        console.log('payload: ', action.payload);
        const dmsEntityObj = action.payload.dmsEntity;
        const empId = dmsEntityObj.loginEmployee.empId;
        AsyncStore.storeData(AsyncStore.Keys.EMP_ID, empId);
        state.employeeId = empId;
      })
      .addCase(getMenuList.rejected, (state, action) => {

      })
  }
});

export const { dateSelected, showDateModal } = homeSlice.actions;
export default homeSlice.reducer;
