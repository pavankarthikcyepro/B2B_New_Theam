import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const dropDownData = [
  {
    value: '1',
    label: 'Tiger Nixon',
  },
  {
    value: '2',
    label: 'Garrett Winters',
  },
  {
    value: '3',
    label: 'Jhon Wick 1',
  },
  {
    value: '4',
    label: 'Jhon Wick 2',
  }
]

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

interface DropDownModelNew {
  key: string;
  value: string;
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
    showDatepicker: false,
    showDropDownpicker: false,
    dropDownData: dropDownData,
    dropDownTitle: "",
    dropDownKeyId: "",
    datePickerKeyId: "",
    showImagePicker: false,
    imagePickerKeyId: "",
    // Customer Details
    first_name: "",
    last_name: "",
    age: "",
    mobile: "",
    email: "",
    date_of_birth: "",
    gender: "",
    salutation: "",
    enquiry_segment: "",
    customer_type: "",
    // Communication Address
    pincode: "",
    urban_or_rural: 0, // 1: urban, 2:
    house_number: "",
    street_name: "",
    village: "",
    city: "",
    state: "",
    district: "",

    permanent_address: true,
    p_pincode: "",
    p_urban_or_rural: 0, // 1: urban, 2:
    p_houseNum: "",
    p_streetName: "",
    p_village: "",
    p_city: "",
    p_state: "",
    p_district: "",
    // Model Selection
    model: "",
    varient: "",
    color: "",
    fuel_type: "",
    transmission_type: "",
    // financial details
    retail_finance: "",
    finance_category: "",
    down_payment: "",
    loan_amount: "",
    bank_or_finance: "",
    rate_of_interest: "",
    loan_of_tenure: "",
    emi: "",
    approx_annual_income: "",
    // Booking payment mod
    booking_amount: "",
    payment_at: "",
    booking_payment_mode: "",
    // commitment
    customer_preferred_date: "",
    occasion: "",
    tentative_delivery_date: "",
    delivery_location: "",
    // Documents Upload
    form_or_pan: "",
    customer_type_category: "",
    adhaar_number: "",
    relationship_proof: ""
  },
  reducers: {
    setDropDownData: (state, action: PayloadAction<DropDownModelNew>) => {
      const { key, value } = action.payload;
      switch (key) {
        case "SALUTATION":
          state.salutation = value;
          break;
        case "ENQUIRY_SEGMENT":
          state.enquiry_segment = value;
          break;
        case "CUSTOMER_TYPE":
          state.customer_type = value;
          break;
        case "GENDER":
          state.gender = value;
          break;
        case "MODEL":
          state.model = value;
          break;
        case "VARIENT":
          state.varient = value;
          break;
        case "COLOR":
          state.color = value;
          break;
        case "FUEL_TYPE":
          state.fuel_type = value;
          break;
        case "TRANSMISSION_TYPE":
          state.transmission_type = value;
          break;
        case "RETAIL_FINANCE":
          state.retail_finance = value;
          break;
        case "FINANCE_CATEGORY":
          state.finance_category = value;
          break;
        case "BANK_FINANCE":
          state.bank_or_finance = value;
          break;
        case "LOAN_OF_TENURE":
          state.loan_of_tenure = value;
          break;
        case "APPROX_ANNUAL_INCOME":
          state.approx_annual_income = value;
          break;
        case "PAYMENT_AT":
          state.payment_at = value;
          break;
        case "BOOKING_PAYMENT_MODE":
          state.booking_payment_mode = value;
          break;
        case "FORM_60_PAN":
          state.form_or_pan = value;
          break;
        case "CUSTOMER_TYPE_CATEGORY":
          state.customer_type_category = value;
          break;
      }
    },
    setImagePicker: (state, action) => {
      state.imagePickerKeyId = action.payload;
      state.showImagePicker = !state.showImagePicker;
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
        case "CUSTOMER_PREFERRED_DATE":
          state.customer_preferred_date = selectedDate;
          break;
        case "TENTATIVE_DELIVERY_DATE":
          state.tentative_delivery_date = selectedDate;
          break;
      }
      state.showDatepicker = !state.showDatepicker;
    },
    setCustomerDetails: (state, action: PayloadAction<CustomerDetailModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "FIRST_NAME":
          state.first_name = text;
          break;
        case "LAST_NAME":
          state.last_name = text;
          break;
        case "MOBILE":
          state.mobile = text;
          break;
        case "EMAIL":
          state.email = text;
          break;
        case "DOB":
          state.date_of_birth = text;
          break;
      }
    },
    setCommunicationAddress: (state, action: PayloadAction<CustomerDetailModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "PINCODE":
          state.pincode = text;
          break;
        case "RURAL_URBAN":
          state.urban_or_rural = Number(text);
          break;
        case "HOUSE_NO":
          state.house_number = text;
          break;
        case "STREET_NAME":
          state.street_name = text;
          break;
        case "VILLAGE":
          state.village = text;
          break;
        case "CITY":
          state.city = text;
          break;
        case "DISTRICT":
          state.district = text;
          break;
        case "STATE":
          state.state = text;
          break;
        case "PERMANENT_ADDRESS":
          state.permanent_address = !state.permanent_address;
          break;
        case "P_PINCODE":
          state.p_pincode = text;
          break;
        case "P_RURAL_URBAN":
          state.p_urban_or_rural = Number(text);
          break;
        case "P_HOUSE_NO":
          state.p_houseNum = text;
          break;
        case "P_STREET_NAME":
          state.p_streetName = text;
          break;
        case "P_VILLAGE":
          state.p_village = text;
          break;
        case "P_CITY":
          state.p_city = text;
          break;
        case "P_DISTRICT":
          state.p_district = text;
          break;
        case "P_STATE":
          state.p_state = text;
          break;
      }
    },
    setFinancialDetails: (state, action: PayloadAction<CustomerDetailModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "DOWN_PAYMENT":
          state.down_payment = text;
          break;
        case "LOAN_AMOUNT":
          state.loan_amount = text;
          break;
        case "RATE_OF_INTEREST":
          state.rate_of_interest = text;
          break;
        case "EMI":
          state.emi = text;
          break;
      }
    },
    setBookingPaymentDetails: (state, action: PayloadAction<CustomerDetailModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "BOOKING_AMOUNT":
          state.booking_amount = text;
          break;
      }
    },
    setCommitmentDetails: (state, action: PayloadAction<CustomerDetailModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "OCCASION":
          state.down_payment = text;
          break;
        case "DELIVERY_LOCATON":
          state.delivery_location = text;
          break;
      }
    },
    setDocumentUploadDetails: (state, action: PayloadAction<CustomerDetailModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "ADHAR":
          state.adhaar_number = text;
          break;
        case "RELATIONSHIP_PROOF":
          state.relationship_proof = text;
          break;
      }
    }
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
  setCustomerDetails,
  setCommunicationAddress,
  setFinancialDetails,
  setCommitmentDetails,
  setBookingPaymentDetails,
  setDropDownData,
  setDocumentUploadDetails,
  setImagePicker
} = prebookingFormSlice.actions;
export default prebookingFormSlice.reducer;
