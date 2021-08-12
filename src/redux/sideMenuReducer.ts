import { createSlice } from "@reduxjs/toolkit";
import { SETTINGS, SCHEDULE_FILL } from "../assets/svg";

const data = [
  {
    title: "Home",
    icon: SCHEDULE_FILL,
    screen: 99,
  },
  {
    title: "Upcoming Deliveries",
    icon: SETTINGS,
    screen: 100,
  },
  {
    title: "Complaints",
    icon: SCHEDULE_FILL,
    screen: 101,
  },
  {
    title: "Settings",
    icon: SETTINGS,
    screen: 102,
  },
  {
    title: "Event Management",
    icon: SCHEDULE_FILL,
    screen: 103,
  },
  {
    title: "Pre Booking",
    icon: SCHEDULE_FILL,
    screen: 104,
  },
];

export const sideMenuSlice = createSlice({
  name: "SIDE_MENU",
  initialState: {
    tableData: data,
  },
  reducers: {},
});

export const { } = sideMenuSlice.actions;
export default sideMenuSlice.reducer;
