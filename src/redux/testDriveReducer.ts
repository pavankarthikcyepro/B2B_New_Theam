import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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



const testDriveSlice = createSlice({
  name: "TEST_DRIVE_SLICE",
  initialState: {
    status: "",
    isLoading: false,
    showDatepicker: false,
    showDropDownpicker: false,
    // dropDownData: dropDownData,
    dropDownTitle: "",
    dropDownKeyId: "",
    datePickerKeyId: "",
    showImagePicker: false,
    imagePickerKeyId: "",
    // Customer Details
    name: "",
    mobile: "",
    email: "",
    date_of_birth: "",
    model: "",
    varient: "",
    fuel_type: "",
    transmission_type: "",
    listofdse_employees: "",
    listof_drivers: "",
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
        case "LISTOFDSE_EMPLOYEES":
          state.listofdse_employees = value;
          break;
        case "LISTOF_DRIVERS":
          state.listof_drivers = value;
          break;
      }
    },
   
    setDatePicker: (state, action) => {
      state.datePickerKeyId = action.payload;
      state.showDatepicker = !state.showDatepicker;
    },
    updateSelectedDate: (state, action: PayloadAction<CustomerDetailModel>) => {
      const { key, text } = action.payload;
      const selectedDate = dateSelected(text);
      switch (state.datePickerKeyId) {
        case "DATE_OF_BIRTH":
          state.date_of_birth = selectedDate;
          break;
      }
      state.showDatepicker = !state.showDatepicker;
    },
    setTestDriveDetails: (
      state,
      action: PayloadAction<CustomerDetailModel>
    ) => {
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
      }
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
  setTestDriveDetails,
  setDropDownData,
} = testDriveSlice.actions;
export default testDriveSlice.reducer;
