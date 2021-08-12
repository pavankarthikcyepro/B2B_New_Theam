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

const relationTypeData = [
  {
    id: 1,
    name: "S/O",
  },
  {
    id: 2,
    name: "D/0",
  },
];

interface PersonalIntroModel {
  key: string;
  text: string;
}

interface DropDownModel {
  id: string;
  name: string;
  keyId: string;
}

const enquiryDetailsOverViewSlice = createSlice({
  name: "ENQUIRY_DETAILS_OVERVIEW_SLICE",
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
    // Personal Intro
    firstName: "",
    lastName: "",
    relationName: "",
    mobile: "",
    alterMobile: "",
    email: "",
    dateOfBirth: "",
    anniversaryDate: "",
    relation: "",
    gender: "",
    salutaion: "",
    // Communication Address
    pincode: "",
    urban_or_rural: 0, // 1: urban, 2:
    houseNum: "",
    streetName: "",
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
    // Customer Profile
    occupation: "",
    designation: "",
    enquiry_segment: "",
    customer_type: "",
    source_of_enquiry: "",
    expected_date: "",
    enquiry_category: "",
    buyer_type: "",
    kms_travelled_month: "",
    who_drives: "",
    members: "",
    prime_expectation_from_car: "",
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
    // Customer Need Analysis
    c_looking_for_any_other_brand: false,
    c_make: "",
    c_model: "",
    c_variant: "",
    c_color: "",
    c_fuel_type: '',
    c_transmission_type: '',
    c_price_range: "",
    c_on_road_price: "",
    c_dealership_name: "",
    c_dealership_location: "",
    c_dealership_pending_reason: "",
    c_voice_of_customer_remarks: "",
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
        case "RELATION":
          state.dropDownData = relationTypeData;
          state.dropDownTitle = "Select Relation";
          state.dropDownKeyId = "RELATION";
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
        case "SOURCE_OF_ENQUIRY":
          state.dropDownData = dummyData;
          state.dropDownTitle = "Select Source Of Enquiry";
          state.dropDownKeyId = "SOURCE_OF_ENQUIRY";
          break;
        case "ENQUIRY_CATEGORY":
          state.dropDownData = dummyData;
          state.dropDownTitle = "Select Enquiry Category";
          state.dropDownKeyId = "ENQUIRY_CATEGORY";
          break;
        case "BUYER_TYPE":
          state.dropDownData = dummyData;
          state.dropDownTitle = "Select Buyer Type";
          state.dropDownKeyId = "BUYER_TYPE";
          break;
        case "KMS_TRAVELLED":
          state.dropDownData = dummyData;
          state.dropDownTitle = "Select Kms Travelled In Month";
          state.dropDownKeyId = "KMS_TRAVELLED";
          break;
        case "WHO_DRIVES":
          state.dropDownData = dummyData;
          state.dropDownTitle = "Who Drives?";
          state.dropDownKeyId = "WHO_DRIVES";
          break;
        case "MEMBERS":
          state.dropDownData = dummyData;
          state.dropDownTitle = "Select Members";
          state.dropDownKeyId = "MEMBERS";
          break;
        case "PRIME_EXPECTATION_CAR":
          state.dropDownData = dummyData;
          state.dropDownTitle = "What is Prime Expectation from the car";
          state.dropDownKeyId = "PRIME_EXPECTATION_CAR";
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
          state.salutaion = name;
          break;
        case "GENDER":
          state.gender = name;
          break;
        case "RELATION":
          state.relation = name;
          break;
        case "ENQUIRY_SEGMENT":
          state.enquiry_segment = name;
          break;
        case "CUSTOMER_TYPE":
          state.customer_type = name;
          break;
        case "SOURCE_OF_ENQUIRY":
          state.source_of_enquiry = name;
          break;
        case "ENQUIRY_CATEGORY":
          state.enquiry_category = name;
          break;
        case "BUYER_TYPE":
          state.buyer_type = name;
          break;
        case "KMS_TRAVELLED":
          state.kms_travelled_month = name;
          break;
        case "WHO_DRIVES":
          state.who_drives = name;
          break;
        case "MEMBERS":
          state.members = name;
          break;
        case "PRIME_EXPECTATION_CAR":
          state.prime_expectation_from_car = name;
          break;
        case "MODEL":
          state.model = name;
          break;
        case "VARIENT":
          state.varient = name;
          break;
        case "COLOR":
          state.color = name;
          break;
        case "FUEL_TYPE":
          state.fuel_type = name;
          break;
        case "TRANSMISSION_TYPE":
          state.transmission_type = name;
          break;
        case "RETAIL_FINANCE":
          state.retail_finance = name;
          break;
        case "FINANCE_CATEGORY":
          state.finance_category = name;
          break;
        case "BANK_FINANCE":
          state.bank_or_finance = name;
          break;
        case "LOAN_OF_TENURE":
          state.loan_of_tenure = name;
          break;
        case "APPROX_ANNUAL_INCOME":
          state.approx_annual_income = name;
          break;
        case "C_MAKE":
          state.c_make = name;
          break;
        case "C_MODEL":
          state.c_model = name;
          break;
        case "C_FUEL_TYPE":
          state.c_fuel_type = name;
          break;
        case "C_TRANSMISSION_TYPE":
          state.c_transmission_type = name;
          break;
      }
      state.showDropDownpicker = !state.showDropDownpicker;
    },
    setDatePicker: (state, action) => {
      state.datePickerKeyId = action.payload;
      state.showDatepicker = !state.showDatepicker;
    },
    updateSelectedDate: (state, action: PayloadAction<PersonalIntroModel>) => {
      const { key, text } = action.payload;
      const selectedDate = dateSelected(text);
      switch (state.datePickerKeyId) {
        case "DATE_OF_BIRTH":
          state.dateOfBirth = selectedDate;
          break;
        case "ANNIVERSARY_DATE":
          state.anniversaryDate = selectedDate;
          break;
        case "EXPECTED_DATE":
          state.expected_date = selectedDate;
          break;
      }
      state.showDatepicker = !state.showDatepicker;
    },
    setPersonalIntro: (state, action: PayloadAction<PersonalIntroModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "FIRST_NAME":
          state.firstName = text;
          break;
        case "LAST_NAME":
          state.lastName = text;
          break;
        case "RELATION_NAME":
          state.relationName = text;
          break;
        case "MOBILE":
          state.mobile = text;
          break;
        case "ALTER_MOBILE":
          state.alterMobile = text;
          break;
        case "EMAIL":
          state.email = text;
          break;
        case "DOB":
          state.dateOfBirth = text;
          break;
        case "ANNIVE_DATE":
          state.anniversaryDate = text;
          break;
      }
    },
    setModelDropDown: (state, action) => {
      switch (action.payload) {
        case "MODEL":
          state.dropDownData = salutationData;
          state.dropDownTitle = "Select Model";
          state.dropDownKeyId = "MODEL";
          break;
        case "VARIENT":
          state.dropDownData = salutationData;
          state.dropDownTitle = "Select Varient";
          state.dropDownKeyId = "VARIENT";
          break;
        case "COLOR":
          state.dropDownData = salutationData;
          state.dropDownTitle = "Select Color";
          state.dropDownKeyId = "COLOR";
          break;
        case "FUEL_TYPE":
          state.dropDownData = salutationData;
          state.dropDownTitle = "Select Fuel Type";
          state.dropDownKeyId = "FUEL_TYPE";
          break;
        case "TRANSMISSION_TYPE":
          state.dropDownData = salutationData;
          state.dropDownTitle = "Select Transmission Type";
          state.dropDownKeyId = "TRANSMISSION_TYPE";
          break;
      }
      state.showDropDownpicker = !state.showDropDownpicker;
    },
    setFinancialDropDown: (state, action) => {
      switch (action.payload) {
        case "RETAIL_FINANCE":
          state.dropDownData = dummyData;
          state.dropDownTitle = "Finance Detail";
          state.dropDownKeyId = "RETAIL_FINANCE";
          break;
        case "FINANCE_CATEGORY":
          state.dropDownData = dummyData;
          state.dropDownTitle = "Finance Detail";
          state.dropDownKeyId = "FINANCE_CATEGORY";
          break;
        case "BANK_FINANCE":
          state.dropDownData = dummyData;
          state.dropDownTitle = "Finance Detail";
          state.dropDownKeyId = "BANK_FINANCE";
          break;
        case "LOAN_OF_TENURE":
          state.dropDownData = dummyData;
          state.dropDownTitle = "Finance Detail";
          state.dropDownKeyId = "LOAN_OF_TENURE";
          break;
        case "APPROX_ANNUAL_INCOME":
          state.dropDownData = dummyData;
          state.dropDownTitle = "Finance Detail";
          state.dropDownKeyId = "APPROX_ANNUAL_INCOME";
          break;
      }
      state.showDropDownpicker = !state.showDropDownpicker;
    },
    updateModelDropDownData: (state, action: PayloadAction<DropDownModel>) => {
      const { id, name, keyId } = action.payload;
      switch (keyId) {
      }
      state.showDropDownpicker = !state.showDropDownpicker;
    },

    setCustomerNeedDropDown: (state, action) => {
      switch (action.payload) {
        case "C_MAKE":
          state.dropDownData = dummyData;
          state.dropDownTitle = "Select Make";
          state.dropDownKeyId = "C_MAKE";
          break;
        case "C_MODEL":
          state.dropDownData = dummyData;
          state.dropDownTitle = "Select Model";
          state.dropDownKeyId = "C_MODEL";
          break;
        case "C_FUEL_TYPE":
          state.dropDownData = dummyData;
          state.dropDownTitle = "Select Fuel Type";
          state.dropDownKeyId = "C_FUEL_TYPE";
          break;
        case "C_TRANSMISSION_TYPE":
          state.dropDownData = dummyData;
          state.dropDownTitle = "Select Transmission Type";
          state.dropDownKeyId = "C_TRANSMISSION_TYPE";
          break;
      }
      state.showDropDownpicker = !state.showDropDownpicker;
    },
    updateCustomerNeedDropDownData: (
      state,
      action: PayloadAction<DropDownModel>
    ) => {
      const { id, name, keyId } = action.payload;
      switch (keyId) {
      }
      state.showDropDownpicker = !state.showDropDownpicker;
    },
    setCommunicationAddress: (
      state,
      action: PayloadAction<PersonalIntroModel>
    ) => {
      const { key, text } = action.payload;
      switch (key) {
        case "PINCODE":
          state.pincode = text;
          break;
        case "RURAL_URBAN":
          state.urban_or_rural = Number(text);
          break;
        case "HOUSE_NO":
          state.houseNum = text;
          break;
        case "STREET_NAME":
          state.streetName = text;
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
    setCustomerProfile: (state, action: PayloadAction<PersonalIntroModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "OCCUPATION":
          state.occupation = text;
          break;
        case "DESIGNATION":
          state.designation = text;
          break;
      }
    },
    setFinancialDetails: (state, action: PayloadAction<PersonalIntroModel>) => {
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

    setCustomerNeedAnalysis: (
      state,
      action: PayloadAction<PersonalIntroModel>
    ) => {
      const { key, text } = action.payload;
      switch (key) {
        case "CHECK_BOX":
          state.c_looking_for_any_other_brand = !state.c_looking_for_any_other_brand;
          break;
        case "VARIANT":
          state.c_variant = text;
          break;
        case "COLOR":
          state.c_color = text;
          break;
        case "PRICE_RANGE":
          state.c_price_range = text;
          break;
        case "ON_ROAD_PRICE":
          state.c_on_road_price = text;
          break;

        case "DEALERSHIP_NAME":
          state.c_dealership_name = text;
          break;

        case "DEALERSHIP_LOCATION":
          state.c_dealership_location = text;
          break;

        case "DEALERSHIP_PENDING_REASON":
          state.c_dealership_pending_reason = text;
          break;

        case "VOICE_OF_CUSTOMER_REMARKS":
          state.c_voice_of_customer_remarks = text;
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
  setPersonalIntro,
  setCommunicationAddress,
  setCustomerProfile,
  updateSelectedDropDownData,
  updateSelectedDate,
  setModelDropDown,
  setFinancialDropDown,
  setFinancialDetails,
  setCustomerNeedAnalysis,
  setCustomerNeedDropDown,
} = enquiryDetailsOverViewSlice.actions;
export default enquiryDetailsOverViewSlice.reducer;
