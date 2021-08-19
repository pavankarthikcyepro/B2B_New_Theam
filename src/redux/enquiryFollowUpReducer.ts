import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from 'moment';

const dropDownData = [
  {
    value: "1",
    label: "Tiger Nixon",
  },
  {
    value: "2",
    label: "Garrett Winters",
  },
  {
    value: "3",
    label: "Jhon Wick 1",
  },
  {
    value: "4",
    label: "Jhon Wick 2",
  },
];

interface EnquiryFollowUpTextModel {
  key: string;
  text: string;
}
interface DropDownModelNew {
  key: string;

  value: string;
}

interface PersonalIntroModel {
  key: string;
  text: string;
}
interface CustomerDetailModel {
  key: string;
  text: string;
}
const slice = createSlice({
  name: "ENQUIRY_FOLLOW_UP_SLICE",
  initialState: {
    showDatepicker: false,
    showDropDownpicker: false,
    dropDownData: dropDownData,
    dropDownTitle: "",
    dropDownKeyId: "",
    datePickerKeyId: "",
    showImagePicker: false,
    imagePickerKeyId: "",
    //*enquiry follow up *//
    reason: "",
    customer_remarks: "",
    employee_remarks: "",
    model: "",
    varient: "",
    actual_start_time: "",
    actual_end_time: "",
  },
  reducers: {
    setEnquiryFollowUpDetails: (state, action: PayloadAction<EnquiryFollowUpTextModel>) => {
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
    setDropDownData: (state, action: PayloadAction<DropDownModelNew>) => {
      const { key, value } = action.payload;
      switch (key) {
        case "MODEL":
          state.model = value;
          break;
        case "VARIENT":
          state.varient = value;
          break;
      }
    },
    setDatePicker: (state, action) => {
      state.datePickerKeyId = action.payload;
      state.showDatepicker = !state.showDatepicker;
    },
    updateSelectedDate: (state, action: PayloadAction<CustomerDetailModel>) => {
      const { key, text } = action.payload;
      const selectedDate = convertToTime(text);
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

const convertToTime = (isoDate) => {
  const date = moment(isoDate).format("h:mm a");
  return date;
}

export const {
  setEnquiryFollowUpDetails,
  setDatePicker,
  setDropDownData,
  updateSelectedDate,
} = slice.actions;
export default slice.reducer;
