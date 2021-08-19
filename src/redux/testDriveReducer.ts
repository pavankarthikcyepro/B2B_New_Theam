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

interface CustomerDetailModel {
  key: string;
  text: string;
}

interface DropDownModelNew {
  key: string;
  value: string;
}

interface DatePickerModel {
  key: string;
  mode: string;
}

const testDriveSlice = createSlice({
  name: "TEST_DRIVE_SLICE",
  initialState: {
    status: "",
    isLoading: false,
    showDatepicker: false,
    date_picker_mode: "date",
    drop_down_data: dropDownData,
    datePickerKeyId: "",
    showImagePicker: false,
    // Customer Details
    name: "",
    mobile: "",
    email: "",
    model: "",
    varient: "",
    fuel_type: "",
    transmission_type: "",
    address_type_is_showroom: "",
    customer_having_driving_licence: "",
    customer_preferred_date: "",
    selected_dse_employee: "",
    selected_driver: "",
    customer_preferred_time: "",
    actual_start_time: "",
    actual_end_time: ""
  },
  reducers: {
    setDropDownData: (state, action: PayloadAction<DropDownModelNew>) => {
      const { key, value } = action.payload;
      switch (key) {
        case "MODEL":
          state.model = value;
          break;
        case "VARIENT":
          state.varient = value;
          break;
        case "FUEL_TYPE":
          state.fuel_type = value;
          break;
        case "TRANSMISSION_TYPE":
          state.transmission_type = value;
          break;
        case "LIST_OF_DSE_EMPLOYEES":
          state.selected_dse_employee = value;
          break;
        case "LIST_OF_DRIVERS":
          state.selected_driver = value;
          break;
      }
    },
    setDatePicker: (state, action: PayloadAction<DatePickerModel>) => {
      const { key, mode } = action.payload;
      state.datePickerKeyId = key;
      state.date_picker_mode = mode;
      state.showDatepicker = !state.showDatepicker;
    },
    updateSelectedDate: (state, action: PayloadAction<CustomerDetailModel>) => {
      const { key, text } = action.payload;
      let selectedDate = "";
      if (state.date_picker_mode === "date") {
        selectedDate = convertToDate(text);
      } else {
        selectedDate = convertToTime(text);
      }
      switch (state.datePickerKeyId) {
        case "PREFERRED_DATE":
          state.customer_preferred_date = selectedDate;
          break;
        case "CUSTOMER_PREFERRED_TIME":
          state.customer_preferred_time = selectedDate;
          break;
        case "ACTUAL_START_TIME":
          state.actual_start_time = selectedDate;
          break;
        case "ACTUAL_END_TIME":
          state.actual_end_time = selectedDate;
          break;
        case "NONE":
          console.log('NONE')
          break;
      }
      state.showDatepicker = !state.showDatepicker;
    },
    setTestDriveDetails: (state, action: PayloadAction<CustomerDetailModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "MOBILE":
          state.mobile = text;
          break;
        case "NAME":
          state.name = text;
          break;
        case "EMAIL":
          state.email = text;
          break;
        case "CHOOSE_ADDRESS":
          state.address_type_is_showroom = text;
          break;
        case "CUSTOMER_HAVING_DRIVING_LICENCE":
          state.customer_having_driving_licence = text;
          break;
      }
    },
  },
});



const convertToTime = (isoDate) => {
  const date = moment(isoDate).format("h:mm a");
  return date;
}

const convertToDate = (isoDate) => {
  const date = moment(isoDate).format("DD/MM/YYYY");
  return date;
}

export const {
  setDatePicker,
  updateSelectedDate,
  setTestDriveDetails,
  setDropDownData,
} = testDriveSlice.actions;
export default testDriveSlice.reducer;
