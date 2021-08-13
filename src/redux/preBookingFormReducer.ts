import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const dummyData = [
  {
    id: 1,
    name: "First",
  },
  {
    id: 2,
    name: "Second",
  },
  {
    id: 3,
    name: "Third",
  },
  {
    id: 4,
    name: "Fourth",
  },
  {
    id: 5,
    name: "Fifth",
  },
];

const genderData = [
  {
    id: 1,
    name: "Male",
  },
  {
    id: 2,
    name: "Female",
  },
];

const salutationData = [
  {
    id: 1,
    name: "Mr",
  },
  {
    id: 2,
    name: "Mrs",
  },
];

interface CustomerDetailModel {
  key: string;
  text: string;
}

interface DropDownModel {
  id: string;
  name: string;
  keyId: string;
}

const prebookingFormSlice = createSlice({
  name: "PREBOONING_FORMS_SLICE",
  initialState: {
    status: "",
    isLoading: false,
    openAccordian: 0,
    showDatepicker: false,
    showDropDownpicker: false,
    dropDownData: genderData,
    dropDownTitle: "",
    dropDownKeyId: "",
    datePickerKeyId: "",
    enableEdit: false,
    // Customer Details
    firstName: "",
    lastName: "",
    age: "",
    mobile: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    salutation: "",
    enquiry_segment: "",
    customer_type: "",
  },
  reducers: {
    setEditable: (state, action) => {
      console.log("pressed");
      state.enableEdit = !state.enableEdit;
    },
    setAccordian: (state, action) => {
      console.log("payload: ", action.payload);
      if (action.payload != state.openAccordian) {
        state.openAccordian = action.payload;
      } else {
        state.openAccordian = 0;
      }
    },
    setDropDown: (state, action) => {
      switch (action.payload) {
        case "SALUTATION":
          state.dropDownData = salutationData;
          state.dropDownTitle = "Select Salutation";
          state.dropDownKeyId = "SALUTATION";
          break;
        case "GENDER":
          state.dropDownData = genderData;
          state.dropDownTitle = "Select Gender";
          state.dropDownKeyId = "GENDER";
          break;
        case "ENQUIRY_SEGMENT":
          state.dropDownData = dummyData;
          state.dropDownTitle = "Select Enquiry Segment";
          state.dropDownKeyId = "ENQUIRY_SEGMENT";
          break;
        case "CUSTOMER_TYPE":
          state.dropDownData = dummyData;
          state.dropDownTitle = "Select Customer Type";
          state.dropDownKeyId = "CUSTOMER_TYPE";
          break;
      }
      state.showDropDownpicker = !state.showDropDownpicker;
    },
    updateSelectedDropDownData: (
      state,
      action: PayloadAction<DropDownModel>
    ) => {
      const { id, name, keyId } = action.payload;
      switch (keyId) {
        case "SALUTATION":
          state.salutation = name;
          break;
        case "GENDER":
          state.gender = name;
          break;
        case "ENQUIRY_SEGMENT":
          state.enquiry_segment = name;
          break;
        case "CUSTOMER_TYPE":
          state.customer_type = name;
          break;
      }
      state.showDropDownpicker = !state.showDropDownpicker;
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
          state.dateOfBirth = selectedDate;
          break;
      }
      state.showDatepicker = !state.showDatepicker;
    },
    setCustomerDetails: (state, action: PayloadAction<CustomerDetailModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "FIRST_NAME":
          state.firstName = text;
          break;
        case "LAST_NAME":
          state.lastName = text;
          break;

        case "MOBILE":
          state.mobile = text;
          break;
        case "EMAIL":
          state.email = text;
          break;
        case "DOB":
          state.dateOfBirth = text;
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
  setAccordian,
  setDatePicker,
  setEditable,
  setDropDown,
  updateSelectedDropDownData,
  updateSelectedDate,
  setCustomerDetails,
} = prebookingFormSlice.actions;
export default prebookingFormSlice.reducer;
