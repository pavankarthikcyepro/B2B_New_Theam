import { createSlice } from "@reduxjs/toolkit";
//import { SETTINGS, SCHEDULE_FILL, EVENT_MANAGEMENT, CUSTOMER_RELATIONSHIP, DIGITAL_PAYMENT,DOCUMENT_WALLET, HOME_LINE, BOOKING_TRACKER } from "../assets/svg";

export const HOME_LINE_STR = "HOME_LINE";
export const BOOKING_TRACKER_STR = "BOOKING_TRACKER";
export const DOCUMENT_WALLET_STR = "DOCUMENT_WALLET";
export const CUSTOMER_RELATIONSHIP_STR = "CUSTOMER_RELATIONSHIP";
export const DROP_ANALYSIS = 'DROP_ANALYSIS';
export const EVENT_MANAGEMENT_STR = "EVENT_MANAGEMENT";
export const DIGITAL_PAYMENT_STR = "DIGITAL_PAYMENT"
export const QR_CODE_STR = "QR_CODE"
export const GROUP_STR = "GROUP"
export const TRANSFER_STR = "TRANSFER"

const data = [
  {
    title: "Home",
    icon: BOOKING_TRACKER_STR,
    screen: 99,
    pngIcon: require('../assets/images/Home-01.png')
  },
  {
    title: "Target Planning",
    icon: CUSTOMER_RELATIONSHIP_STR,
    screen: 106,
    pngIcon: require('../assets/images/Target_Planning-01.png')
  },
  {
    title: "Task Management",
    icon: CUSTOMER_RELATIONSHIP_STR,
    screen: 108,
    pngIcon: require('../assets/images/Task_Management-01.png')
  },
  // {
  //   title: "Upcoming Deliveries",
  //   icon: BOOKING_TRACKER_STR,
  //   screen: 100,
  //   pngIcon: require('../assets/images/Upcoming_Deliveries-01.png')
  // },
  // {
  //   title: "Event Management",
  //   icon: EVENT_MANAGEMENT_STR,
  //   screen: 103,
  //   pngIcon: require('../assets/images/Event_Management-01.png')
  // },
  {
    title: "Task Transfer",
    icon: TRANSFER_STR,
    screen: 109,
    pngIcon: require('../assets/images/Task_Trasnfer-01.png')
  },
  // {
  //   title: "Team Shuffle",
  //   icon: GROUP_STR,
  //   screen: 109,
  //   pngIcon: require('../assets/images/Team_Shuffle-01.png')
  // },
  {
    title: "Digital Payment",
    icon: BOOKING_TRACKER_STR,
    screen: 105,
    pngIcon: require('../assets/images/Digital_Payment-01.png')
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
    pngIcon: require('../assets/images/Help_Desk-01.png')
  },
  {
    title: "Settings",
    icon: CUSTOMER_RELATIONSHIP_STR,
    screen: 102,
    pngIcon: require('../assets/images/Settings-01.png')
  },
  // {
  //   title: "ETVBRL Report",
  //   icon: CUSTOMER_RELATIONSHIP_STR,
  //   screen: 111,
  //   pngIcon: require('../assets/images/Reports-01.png')
  // },
  {
    title: "Drop Analysis",
    icon: DROP_ANALYSIS,
    screen: 113,
  },
  {
    title: "Sign Out",
    icon: CUSTOMER_RELATIONSHIP_STR,
    screen: 112,
    pngIcon: require('../assets/images/Signout-01.png')
  },
];

const dataForManager = [
  {
    title: "Home",
    icon: HOME_LINE_STR,
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
  // {
  //   title: "Upcoming Deliveries",
  //   icon: BOOKING_TRACKER_STR,
  //   screen: 100,
  // },
  // {
  //   title: "Event Management",
  //   icon: EVENT_MANAGEMENT_STR,
  //   screen: 103,
  // },
  // {
  //   title: "Task Transfer",
  //   icon: CUSTOMER_RELATIONSHIP_STR,
  //   screen: 109,
  // },
  // {
  //   title: "Team Shuffle",
  //   icon: CUSTOMER_RELATIONSHIP_STR,
  //   screen: 109,
  // },
  {
    title: "Digital Payment",
    icon: QR_CODE_STR,
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
    title: "Drop Analysis",
    icon: DROP_ANALYSIS,
    screen: 113,
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
    managerData: dataForManager,
    normalData: data,
    isManager: false
  },
  reducers: {
    updateData: (state, action) => {
      state.tableData = action.payload;
    },
    updateIsManager: (state, action) => {
      state.isManager = action.payload;
    },
  },
});

export const { updateData, updateIsManager } = sideMenuSlice.actions;
export default sideMenuSlice.reducer;
