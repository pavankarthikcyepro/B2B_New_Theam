import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    actual_start_date: "",
    actual_end_date: "",
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
      const selectedDate = dateSelected(text);
      switch (state.datePickerKeyId) {
        case "ACTUAL_START_DATE":
          state.actual_start_date = selectedDate;
          break;
        case "ACTUAL_END_DATE":
          state.actual_end_date = selectedDate;
          break;
      }
      state.showDatepicker = !state.showDatepicker;
    },
  },
});

const dateSelected = (isoDate) => {
  if (!isoDate) {
    return "";
  }
  const date = new Date(isoDate);
  const finalDate =
    date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
  console.log("date: ", finalDate);
  return finalDate;
};

export const {
  setDatePicker,
  updateSelectedDate,
  setPreBookingFollowUpDetails,
} = preBookingFollowUpSlice.actions;
export default preBookingFollowUpSlice.reducer;
