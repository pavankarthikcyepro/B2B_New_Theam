import { createSlice } from "@reduxjs/toolkit";
import {
  SETTINGS,
  SCHEDULE_FILL,
  EVENT_MANAGEMENT,
  CUSTOMER_RELATIONSHIP,
  DOCUMENT_WALLET,
  HOME_LINE,
  BOOKING_TRACKER,
  DIGITAL_PAYMENT,

} from "../assets/svg";

const data = [
  {
    title: "Home",
    icon: HOME_LINE,
    screen: 99,
  },
  {
    title: "Upcoming Deliveries",
    icon: BOOKING_TRACKER,
    screen: 100,
  },
  {
    title: "Complaints",
    icon: DOCUMENT_WALLET,
    screen: 101,
  },
  {
    title: "Settings",
    icon: SETTINGS,
    screen: 102,
  },
  {
    title: "Event Management",
    icon: EVENT_MANAGEMENT,
    screen: 103,
  },
  {
    title: "Digital Payment",
    icon: DIGITAL_PAYMENT,
    screen: 105,
  },
  {
    title: "Monthly Target Planning",
    icon: CUSTOMER_RELATIONSHIP,
    screen: 106,
  },
  {
    title: "Helpdesk",
    icon: CUSTOMER_RELATIONSHIP,
    screen: 107,
  },
  {
    title: "Task Management",
    icon: CUSTOMER_RELATIONSHIP,
    screen: 108,
  },
  {
    title: "Task Transfer",
    icon: CUSTOMER_RELATIONSHIP,
    screen: 109,
  },
];

// {
//   title: "Pre Booking",
//   icon: SCHEDULE_FILL,
//   screen: 104,
// },

export const sideMenuSlice = createSlice({
  name: "SIDE_MENU",
  initialState: {
    tableData: data,
  },
  reducers: {},
});

export const { } = sideMenuSlice.actions;
export default sideMenuSlice.reducer;
