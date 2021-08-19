import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from 'moment';

interface PreBookingFollowUpModel {
  key: string;
  text: string;
}

const preBookingFollowUpSlice = createSlice({
  name: "PREBOOKING_FOLLOWUP_SLICE",
  initialState: {
    status: "",
    isLoading: false,
    showDatepicker: false,
    datePickerKeyId: "",
    dropDownData: "",
    reason: "",
    customer_remarks: "",
    employee_remarks: "",
    actual_start_time: "",
    actual_end_time: "",
  },
  reducers: {
    setPreBookingFollowUpDetails: (
      state,
      action: PayloadAction<PreBookingFollowUpModel>
    ) => {
      const { key, text } = action.payload;
      switch (key) {
        case "REASON":
          state.reason = text;
          break;
        case "CUSTOMER_REMARKS":
          state.customer_remarks = text;
          break;
        case "EMPLOYEE_REMARKS":
          state.employee_remarks = text;
          break;
      }
    },
    setDatePicker: (state, action) => {
      state.datePickerKeyId = action.payload;
      state.showDatepicker = !state.showDatepicker;
    },
    updateSelectedDate: (
      state,
      action: PayloadAction<PreBookingFollowUpModel>
    ) => {
      const { key, text } = action.payload;
      const selectedDate = convertDateToTime(text);
      switch (state.datePickerKeyId) {
        case "ACTUAL_START_TIME":
          state.actual_start_time = selectedDate;
          break;
        case "ACTUAL_END_TIME":
          state.actual_end_time = selectedDate;
          break;
      }
      state.showDatepicker = !state.showDatepicker;
    },
  },
});

const convertDateToTime = (isoDate) => {
  const date = moment(isoDate).format("h:mm a");
  return date;
}

export const {
  setDatePicker,
  updateSelectedDate,
  setPreBookingFollowUpDetails,
} = preBookingFollowUpSlice.actions;
export default preBookingFollowUpSlice.reducer;
