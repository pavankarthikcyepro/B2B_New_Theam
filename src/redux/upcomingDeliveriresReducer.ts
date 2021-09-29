import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

interface DatePickerModel {
  key: string;
  mode: string;
  text: string;
}

export const upcomingdeliveriesSlice = createSlice({
  name: "UPCOMINGDELIVIERIES",
  initialState: {
    status: "",
    isLoading: false,
    showDatepicker: false,
    date_picker_mode: "date",
    datePickerKeyId: "",
    from_date: "",
    to_date: "",
  },
  reducers: {
    setDatePicker: (state, action: PayloadAction<DatePickerModel>) => {
      const { key, mode } = action.payload;
      state.datePickerKeyId = key;
      state.date_picker_mode = mode;
      state.showDatepicker = !state.showDatepicker;
    },
    updateSelectedDate: (state, action: PayloadAction<DatePickerModel>) => {
      const { key, text } = action.payload;
      let selectedDate = "";
      if (state.date_picker_mode === "date") {
        selectedDate = convertToDate(text);
      } else {
        selectedDate = convertToTime(text);
      }
      switch (state.datePickerKeyId) {
        case "FROM_DATE":
          state.from_date = selectedDate;
          break;
        case "TO_DATE":
          state.to_date = selectedDate;
          break;
        case "NONE":
          console.log("NONE");
          break;
      }
      state.showDatepicker = !state.showDatepicker;
    },
  },
});

const convertToTime = (isoDate) => {
  const date = moment(isoDate).format("h:mm a");
  return date;
};

const convertToDate = (isoDate) => {
  const date = moment(isoDate).format("DD/MM/YYYY");
  return date;
};

export const { setDatePicker, updateSelectedDate } =
  upcomingdeliveriesSlice.actions;
export default upcomingdeliveriesSlice.reducer;
