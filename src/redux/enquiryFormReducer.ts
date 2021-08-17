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

interface PersonalIntroModel {
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

const enquiryDetailsOverViewSlice = createSlice({
  name: "ENQUIRY_DETAILS_OVERVIEW_SLICE",
  initialState: {
    status: "",
    isLoading: false,
    openAccordian: 0,
    showDatepicker: false,
    dropDownData: dropDownData,
    datePickerKeyId: "",
    enableEdit: false,
    showImagePicker: false,
    imagePickerKeyId: "",
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
    // Upload Documents
    pan_number: "",
    pan_image: null,
    adhaar_number: "",
    adhaar_image: null
  },
  reducers: {
    setEditable: (state, action) => {
      console.log("pressed");
      state.enableEdit = !state.enableEdit;
    },
    setDropDownData: (state, action: PayloadAction<DropDownModelNew>) => {
      const { key, value } = action.payload;
      switch (key) {
        case "SALUTATION":
          state.salutaion = value;
          break;
        case "GENDER":
          state.gender = value;
          break;
        case "RELATION":
          state.relation = value;
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
        case "ENQUIRY_SEGMENT":
          state.enquiry_segment = value;
          break;
        case "CUSTOMER_TYPE":
          state.customer_type = value;
          break;
        case "SOURCE_OF_ENQUIRY":
          state.source_of_enquiry = value;
          break;
        case "ENQUIRY_CATEGORY":
          state.enquiry_category = value;
          break;
        case "BUYER_TYPE":
          state.buyer_type = value;
          break;
        case "KMS_TRAVELLED":
          state.kms_travelled_month = value;
          break;
        case "WHO_DRIVES":
          state.who_drives = value;
          break;
        case "MEMBERS":
          state.members = value;
          break;
        case "PRIME_EXPECTATION_CAR":
          state.prime_expectation_from_car = value;
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
        case "C_MAKE":
          state.c_make = value;
          break;
        case "C_MODEL":
          state.c_model = value;
          break;
        case "C_VARIANT":
          state.c_variant = value;
          break;
        case "C_COLOR":
          state.c_color = value;
          break;
        case "C_FUEL_TYPE":
          state.fuel_type = value;
          break;
        case "C_TRANSMISSION_TYPE":
          state.transmission_type = value;
          break;
      }
    },
    setDatePicker: (state, action) => {
      console.log('coming here')
      state.datePickerKeyId = action.payload;
      state.showDatepicker = !state.showDatepicker;
    },
    updateSelectedDate: (state, action: PayloadAction<PersonalIntroModel>) => {
      const { key, text } = action.payload;
      const selectedDate = dateSelected(text);
      const keyId = key ? key : state.datePickerKeyId;
      switch (keyId) {
        case "DATE_OF_BIRTH":
          state.dateOfBirth = selectedDate;
          break;
        case "ANNIVERSARY_DATE":
          state.anniversaryDate = selectedDate;
          break;
        case "EXPECTED_DATE":
          state.expected_date = selectedDate;
          break;
        case "NONE":
          console.log('NONE')
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
    setCommunicationAddress: (state, action: PayloadAction<PersonalIntroModel>) => {
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
    setCustomerNeedAnalysis: (state, action: PayloadAction<PersonalIntroModel>) => {
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
    setImagePicker: (state, action) => {
      state.imagePickerKeyId = action.payload;
      state.showImagePicker = !state.showImagePicker;
    },
    setUploadDocuments: (state, action: PayloadAction<PersonalIntroModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "PAN":
          state.pan_number = text;
          break;
        case "ADHAR":
          state.adhaar_number = text;
          break;
        case "UPLOAD_PAN":
          break;
        case "UPLOAD_ADHAR":
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
  //console.log("date: ", finalDate);
  return finalDate;
};

export const {
  setDatePicker,
  setEditable,
  setPersonalIntro,
  setCommunicationAddress,
  setCustomerProfile,
  updateSelectedDate,
  setFinancialDetails,
  setCustomerNeedAnalysis,
  setImagePicker,
  setUploadDocuments,
  setDropDownData
} = enquiryDetailsOverViewSlice.actions;
export default enquiryDetailsOverViewSlice.reducer;
