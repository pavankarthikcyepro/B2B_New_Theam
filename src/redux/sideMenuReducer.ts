import { createSlice } from "@reduxjs/toolkit";
//import { SETTINGS, SCHEDULE_FILL, EVENT_MANAGEMENT, CUSTOMER_RELATIONSHIP, DIGITAL_PAYMENT,DOCUMENT_WALLET, HOME_LINE, BOOKING_TRACKER } from "../assets/svg";

export const HOME_LINE_STR = "HOME_LINE";
export const BOOKING_TRACKER_STR = "BOOKING_TRACKER";
export const DOCUMENT_WALLET_STR = "DOCUMENT_WALLET";
export const CUSTOMER_RELATIONSHIP_STR = "CUSTOMER_RELATIONSHIP";
export const DROP_ANALYSIS = "DROP_ANALYSIS";
export const EVENT_MANAGEMENT_STR = "EVENT_MANAGEMENT";
export const DIGITAL_PAYMENT_STR = "DIGITAL_PAYMENT";
export const QR_CODE_STR = "QR_CODE";
export const GROUP_STR = "GROUP";
export const TRANSFER_STR = "TRANSFER";
export const ATTENDANCE = "ATTENDANCE";
export const DROP_LOST_CANCEL = "DROP_LOST_CANCEL";
export const GEOLOCATION = "GEOLOCATION";
export const DIGITAL_DASHBOARD = "DIGITAL_DASHBOARD";
export const EVENT_DASHBOARD = "EVENT_DASHBOARD";
export const MY_STOCK = "MY_STOCK";
export const REPORT_DOWNLOAD = "REPORT_DOWNLOAD";
export const COMPLAINT_TRACKER = "REPORT_DOWNLOAD";
export const KNOWLEDGE_CENTER = "KNOWLEDGE_CENTER";

const data = [
  {
    title: "Home",
    icon: BOOKING_TRACKER_STR,
    screen: 99,
    pngIcon: require("../assets/images/Home-01.png"),
  },
  {
    title: "Live Leads",
    icon: HOME_LINE_STR,
    screen: 114,
    pngIcon: require("../assets/images/Help_Desk-01.png"),
  },
  {
    title: "Live Leads Receptionist",
    icon: HOME_LINE_STR,
    screen: 170,
    pngIcon: require("../assets/images/Help_Desk-01.png"),
  },
  {
    title: "Target Planning",
    icon: CUSTOMER_RELATIONSHIP_STR,
    screen: 106,
    pngIcon: require("../assets/images/Target_Planning-01.png"),
  },
  {
    title: "Digital Dashboard",
    icon: DIGITAL_DASHBOARD,
    screen: 118,
    pngIcon: require("../assets/images/analysis.png"),
  },
  {
    title: "Receptionist Dashboard",
    icon: DIGITAL_DASHBOARD,
    screen: 171,
    pngIcon: require("../assets/images/analytic.png"),
  },
  {
    title: "Event Dashboard",
    icon: EVENT_DASHBOARD,
    screen: 119,
    pngIcon: require("../assets/images/EventDashboardIcon.png"),
  },
  {
    title: "My Attendance",
    icon: ATTENDANCE,
    screen: 116,
    pngIcon: require("../assets/images/AttendanceIcon.png"),
  },
  {
    title: "My Stock",
    icon: MY_STOCK,
    screen: 120,
    pngIcon: require("../assets/images/ready-stock.png"),
  },
  // {
  //   title: "Download Report",
  //   icon: REPORT_DOWNLOAD,
  //   screen: 121,
  //   pngIcon: require("../assets/images/Target_Planning-01.png"),
  // },
  {
    title: "Geolocation",
    icon: GEOLOCATION,
    screen: 117,
    pngIcon: require("../assets/images/GeoLocationIcon.png"),
  },
  // {
  //   title: "Drop/Lost/Cancel",
  //   icon: DROP_LOST_CANCEL,
  //   screen: 115,
  //   pngIcon: require("../assets/images/Settings-01.png"),
  // },
  // {
  //   title: "Task Management",
  //   icon: CUSTOMER_RELATIONSHIP_STR,
  //   screen: 108,
  //   pngIcon: require("../assets/images/Task_Management-01.png"),
  // },
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
    pngIcon: require("../assets/images/Task_Trasnfer-01.png"),
  },
  // {
  //   title: "Team Shuffle",
  //   icon: GROUP_STR,
  //   screen: 109,
  //   pngIcon: require('../assets/images/Team_Shuffle-01.png')
  // },
  // {
  //   title: "Complaints",
  //   icon: DOCUMENT_WALLET_STR,
  //   screen: 101,
  // },
  {
    title: "EMI Calculator",
    icon: CUSTOMER_RELATIONSHIP_STR,
    screen: 125,
    pngIcon: require("../assets/images/emi.png"),
  },
  {
    title: "Helpdesk",
    icon: CUSTOMER_RELATIONSHIP_STR,
    screen: 107,
    pngIcon: require("../assets/images/Help_Desk-01.png"),
  },
  {
    title: "Settings",
    icon: CUSTOMER_RELATIONSHIP_STR,
    screen: 102,
    pngIcon: require("../assets/images/Settings-01.png"),
  },
  // {
  //   title: "ETVBRL Report",
  //   icon: CUSTOMER_RELATIONSHIP_STR,
  //   screen: 111,
  //   pngIcon: require('../assets/images/Reports-01.png')
  // },
  {
    title: "QR Code",
    icon: BOOKING_TRACKER_STR,
    screen: 105,
    pngIcon: require("../assets/images/Digital_Payment-01.png"),
  },
  {
    title: "Drop Analysis",
    icon: DROP_ANALYSIS,
    screen: 113,
    pngIcon: require("../assets/images/dropanalysis.png"),
  },
  {
    title: "Complaint Tracker",
    icon: COMPLAINT_TRACKER,
    screen: 123,
    pngIcon: require("../assets/images/review.png"),
  },
  {
    title: "Knowledge Center",
    icon: KNOWLEDGE_CENTER,
    screen: 124,
    pngIcon: require("../assets/images/knowledge.png"),
  },
  {
    title: "Sign Out",
    icon: CUSTOMER_RELATIONSHIP_STR,
    screen: 112,
    pngIcon: require("../assets/images/Signout-01.png"),
  },
];

const dataForManager = [
  {
    title: "Home",
    icon: HOME_LINE_STR,
    screen: 99,
  },
  {
    title: "Live Leads",
    icon: HOME_LINE_STR,
    screen: 114,
    pngIcon: require("../assets/images/Help_Desk-01.png"),
  },
  {
    title: "Target Planning",
    icon: CUSTOMER_RELATIONSHIP_STR,
    screen: 106,
  },
  {
    title: "My Attendance",
    icon: ATTENDANCE,
    screen: 116,
    pngIcon: require("../assets/images/AttendanceIcon.png"),
  },
  // {
  //   title: "Task Management",
  //   icon: CUSTOMER_RELATIONSHIP_STR,
  //   screen: 108,
  // },
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
  {
    title: "Task Transfer",
    icon: CUSTOMER_RELATIONSHIP_STR,
    screen: 109,
  },
  // {
  //   title: "Team Shuffle",
  //   icon: CUSTOMER_RELATIONSHIP_STR,
  //   screen: 109,
  // },
  {
    title: "QR Code",
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
  {
    title: "Complaint Tracker",
    icon: COMPLAINT_TRACKER,
    screen: 123,
    // pngIcon: require("../assets/images/review.png"),
  },
  {
    title: "Knowledge Center",
    icon: KNOWLEDGE_CENTER,
    screen: 124,
    pngIcon: require("../assets/images/Target_Planning-01.png"),
  },
  { title: "Sign Out", icon: CUSTOMER_RELATIONSHIP_STR, screen: 112 },
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
    isManager: false,
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
