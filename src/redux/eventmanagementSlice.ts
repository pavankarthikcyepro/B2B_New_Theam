import { createSlice } from "@reduxjs/toolkit";

const data = [
  {
    eventID: "EVE-19006672",
    eventName: "Mega event",
    startDate: "17-July-2021",
    endDate: "22-July-2021",
    location: "Gachibowli",
    eventType: "Bank",
    participiants: "List of employee with Designation",
  },
  {
    eventID: "EVE-19006672",
    eventName: "Mega event",
    startDate: "17-July-2021",
    endDate: "22-July-2021",
    location: "Gachibowli",
    eventType: "Bank",
    participiants: "List of employee with Designation",
  },
];

export const eventmanagementSlice = createSlice({
  name: "EVENTMANAGEMENT",
  initialState: {
    tableAry: data,
  },
  reducers: {},
});

export const {} = eventmanagementSlice.actions;
export default eventmanagementSlice.reducer;
