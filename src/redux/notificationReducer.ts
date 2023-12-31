import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";

export const getNotificationList = createAsyncThunk(
  "Notifications/getNotificationList",
  async (empId: any, { rejectWithValue }) => {
    const response = await client.get(URL.NOTIFICATION_LIST(empId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const readNotification = createAsyncThunk(
  "Notifications/readNotification",
  async (notificationId: any, { rejectWithValue }) => {
    const response = await client.get(URL.READ_NOTIFICATION(notificationId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const notificationSlice = createSlice({
  name: "NOTIFICATIONS",
  initialState: {
    notificationList: [],
    loading: true,
    readNotificationResponseStatus: "",
    myTaskAllFilter: false,
    isManager: false,
  },
  reducers: {
    setNotificationMyTaskAllFilter: (state, action) => {
      state.myTaskAllFilter = action.payload;
    },
    setNotificationManager: (state, action) => {
      state.isManager = action.payload;
    },
    notificationClearState: (state, action) => {
      state.notificationList = [];
      state.loading = true;
      state.readNotificationResponseStatus = "";
      state.myTaskAllFilter = false;
    },
    notificationReadClearState: (state, action) => {
      state.readNotificationResponseStatus = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotificationList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotificationList.fulfilled, (state, action) => {
        const nonReadData = action.payload.filter((item, index) => {
          return item.isRead == "N";
        });
        const readData = action.payload.filter((item, index) => {
          return item.isRead == "Y";
        });
        state.notificationList = [...nonReadData, ...readData];
        state.loading = false;
      })
      .addCase(getNotificationList.rejected, (state, action) => {
        state.loading = false;
      });
    builder
      .addCase(readNotification.pending, (state) => {
        state.readNotificationResponseStatus = "";
      })
      .addCase(readNotification.fulfilled, (state, action) => {
        if (action?.payload == 1) {
          state.readNotificationResponseStatus = "success";
        }
      })
      .addCase(readNotification.rejected, (state, action) => {
        state.readNotificationResponseStatus = "";
      });
  },
});

export const {
  setNotificationMyTaskAllFilter,
  notificationClearState,
  notificationReadClearState,
  setNotificationManager,
} = notificationSlice.actions;
export default notificationSlice.reducer;
