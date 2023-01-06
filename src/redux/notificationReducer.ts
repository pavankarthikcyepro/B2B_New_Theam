import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";

export const getNotificationList = createAsyncThunk(
  "Notifications/getNotificationList",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.get(URL.NOTIFICATION_LIST(payload.empId));
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

const newData = [
  {
    title: "Today",
    data: [
      {
        name: "You have been assigned a target for Aug 20",
        date: "2 hours ago",
      },
      {
        name: "General visitor request created for Aziz Khan @ 1PM",
        date: "5 hours ago",
      },
      {
        name: "You have a new missed activity under general tasks due for 3 days",
        date: "5 hours ago",
      },
      {
        name: "General visitor request created for Aziz Khan @ 1PM",
        date: "7 hours ago",
      },
    ],
  },
  {
    title: "Yesterday",
    data: [
      {
        name: "You have been assigned a target for Aug 20",
        date: "6 hours ago",
      },
      {
        name: "General visitor request created for Aziz Khan @ 1PM",
        date: "3 hours ago",
      },
      {
        name: "You have a new missed activity under general tasks due for 3 days",
        date: "4 hours ago",
      },
    ],
  },
  {
    title: "July 7",
    data: [
      {
        name: "You have been assigned a target for Aug 20",
        date: "1 hours ago",
      },
      {
        name: "General visitor request created for Aziz Khan @ 1PM",
        date: "2 hours ago",
      },
      {
        name: "You have a new missed activity under general tasks due for 3 days",
        date: "3 hours ago",
      },
    ],
  },
];

export const notificationSlice = createSlice({
  name: "NOTIFICATIONS",
  initialState: {
    tableData: newData,
    notificationlist: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotificationList.pending, (state) => {
        state.notificationlist = [];
      })
      .addCase(getNotificationList.fulfilled, (state, action) => {
        const dataObj = action.payload;
        state.notificationlist = dataObj;
        // if (action.payload.success) {
        //   showToast("Successfully updated");
        // }
      })
      .addCase(getNotificationList.rejected, (state, action) => {
        state.notificationlist = [];
      });
  },
});

export const {} = notificationSlice.actions;
export default notificationSlice.reducer;
