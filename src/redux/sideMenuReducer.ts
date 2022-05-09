import { createSlice } from "@reduxjs/toolkit";
//import { SETTINGS, SCHEDULE_FILL, EVENT_MANAGEMENT, CUSTOMER_RELATIONSHIP, DIGITAL_PAYMENT,DOCUMENT_WALLET, HOME_LINE, BOOKING_TRACKER } from "../assets/svg";

export const HOME_LINE_STR = "HOME_LINE";
export const BOOKING_TRACKER_STR = "BOOKING_TRACKER";
export const DOCUMENT_WALLET_STR = "DOCUMENT_WALLET";
export const CUSTOMER_RELATIONSHIP_STR = "CUSTOMER_RELATIONSHIP";
export const EVENT_MANAGEMENT_STR = "EVENT_MANAGEMENT";
export const DIGITAL_PAYMENT_STR = "DIGITAL_PAYMENT" 
export const QR_CODE_STR = "QR_CODE"

const data = [
  {
    title: "Home",
    icon: BOOKING_TRACKER_STR,
    screen: 99,
  },
  {
    title: "Target Planning",
    icon: CUSTOMER_RELATIONSHIP_STR,
    screen: 106,
  },
  {
    title: "Task Management",
    icon: CUSTOMER_RELATIONSHIP_STR,
    screen: 108,
  },
  {
    title: "Upcoming Deliveries",
    icon: BOOKING_TRACKER_STR,
    screen: 100,
  },
  {
    title: "Event Management",
    icon: EVENT_MANAGEMENT_STR,
    screen: 103,
  },
  {
    title: "Task Transfer",
    icon: CUSTOMER_RELATIONSHIP_STR,
    screen: 109,
  },
  {
    title: "Team Shuffle",
    icon: CUSTOMER_RELATIONSHIP_STR,
    screen: 109,
  },
  {
    title: "Digital Payment",
    icon: BOOKING_TRACKER_STR,
    screen: 105,
  },
  // {
  //   title: "Complaints",
  //   icon: DOCUMENT_WALLET_STR,
  //   screen: 101,
  // },
  {
    title: "Helpdesk",
    icon: CUSTOMER_RELATIONSHIP_STR,
    screen: 107,
  },
  {
    title: "Settings",
    icon: CUSTOMER_RELATIONSHIP_STR,
    screen: 102,
  },
  {
    title: "Sign Out",
    icon: CUSTOMER_RELATIONSHIP_STR,
    screen: 111,
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
