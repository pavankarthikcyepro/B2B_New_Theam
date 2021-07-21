import { createSlice } from "@reduxjs/toolkit";

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

export const homeSlice = createSlice({
  name: "HOME",
  initialState: {
    serchtext: "",
    tableData: data,
    datesData: dates,
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
});

export const { dateSelected, showDateModal } = homeSlice.actions;
export default homeSlice.reducer;
