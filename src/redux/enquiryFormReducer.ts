import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";
import {
  Relation_Data_Obj,
  Gender_Data_Obj,
} from "../jsonData/enquiryFormScreenJsonData";
import { convertTimeStampToDateString } from "../utils/helperFunctions";

export const getEnquiryDetailsApi = createAsyncThunk("ENQUIRY_FORM_SLICE/getEnquiryDetailsApi", async (universalId, { rejectWithValue }) => {

  const response = await client.get(URL.ENQUIRY_DETAILS(universalId));
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const updateEnquiryDetailsApi = createAsyncThunk("ENQUIRY_FORM_SLICE/updateEnquiryDetailsApi", async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.UPDATE_ENQUIRY_DETAILS(), payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const dropEnquiryApi = createAsyncThunk("ENQUIRY_FORM_SLICE/dropEnquiryApi", async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.DROP_ENQUIRY(), payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getCustomerTypesApi = createAsyncThunk("ENQUIRY_FORM_SLICE/getCustomerTypesApi", async (universalId, { rejectWithValue }) => {

  const response = await client.get(URL.GET_CUSTOMER_TYPES());
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

interface PersonalIntroModel {
  key: string;
  text: string;
}

interface DropDownModelNew {
  key: string;
  value: string;
  id?: string;
}

interface DropDownModel {
  id: string;
  name: string;
  keyId: string;
}

const enquiryDetailsOverViewSlice = createSlice({
  name: "ENQUIRY_FORM_SLICE",
  initialState: {
    status: "",
    isLoading: false,
    openAccordian: 0,
    showDatepicker: false,
    customer_types_data: [],
    enquiry_drop_response_status: "",
    //personal Intro
    gender_types_data: [],
    relation_types_data: [],

    datePickerKeyId: "",
    enableEdit: false,
    showImagePicker: false,
    imagePickerKeyId: "",
    // Customer Profile
    occupation: "",
    designation: "",
    enquiry_segment: "",
    customer_type: "",
    company_name: "",
    source_of_enquiry: "",
    sub_source_of_enquiry: "",
    expected_delivery_date: "",
    enquiry_category: "",
    buyer_type: "",
    kms_travelled_month: "",
    who_drives: "",
    members: "",
    prime_expectation_from_car: "",
    // Personal Intro
    firstName: "",
    lastName: "",
    relationName: "",
    mobile: "",
    alterMobile: "",
    email: "",
    age: "",
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
    lead_product_id: "",
    model: "",
    varient: "",
    color: "",
    fuel_type: "",
    transmission_type: "",
    model_drop_down_data_update_statu: "",
    // financial details
    retail_finance: "",
    finance_category: "",
    down_payment: "",
    loan_amount: "",
    bank_or_finance_name: "",
    location: "",
    bank_or_finance: "",
    rate_of_interest: "",
    loan_of_tenure: "",
    emi: "",
    leashing_name: "",
    approx_annual_income: "",
    // Customer Need Analysis
    c_looking_for_any_other_brand_checked: false,
    c_make: "",
    c_make_other_name: "",
    c_model: "",
    c_model_other_name: "",
    c_variant: "",
    c_color: "",
    c_fuel_type: "",
    c_transmission_type: "",
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
    adhaar_image: null,
    // Additional Buyer
    a_make: "",
    a_model: "",
    a_make_other_name: "",
    a_model_other_name: "",
    a_varient: "",
    a_color: "",
    a_reg_no: "",
    // Replacement Buyer
    r_reg_no: "",
    r_varient: "",
    r_color: "",
    r_make: "",
    r_model: "",
    r_make_other_name: "",
    r_model_other_name: "",
    r_fuel_type: "",
    r_transmission_type: "",
    r_mfg_year: "",
    r_kms_driven_or_odometer_reading: "",
    r_expected_price: "",
    r_registration_date: "",
    r_registration_validity_date: "",
    r_hypothication_checked: false,
    r_hypothication_name: "",
    r_hypothication_branch: "",
    r_insurence_checked: false,
    r_insurence_company_name: "",
    r_insurence_expiry_date: "",
    r_insurence_type: "",
    r_insurence_from_date: "",
    r_insurence_to_date: "",
    r_insurence_document_checked: false,
    // DROP SECTION
    drop_reason: "",
    drop_remarks: "",
    // data variables
    enquiry_details_response: null,
    customer_types_response: null
  },
  reducers: {
    setEditable: (state, action) => {
      console.log("pressed");
      state.enableEdit = !state.enableEdit;
    },
    setDropDownData: (state, action: PayloadAction<DropDownModelNew>) => {
      const { key, value, id } = action.payload;
      switch (key) {
        case "ENQUIRY_SEGMENT":
          console.log("selected: ", value);
          state.enquiry_segment = value;
          state.customer_type = "";
          if (state.customer_types_response) {
            state.customer_types_data = state.customer_types_response[value.toLowerCase()];
          }
          break;
        case "CUSTOMER_TYPE":
          state.customer_type = value;
          break;
        case "SALUTATION":
          if (state.salutaion !== value) {
            state.gender = "";
            state.relation = "";
            state.gender_types_data = Gender_Data_Obj[value.toLowerCase()];
            state.relation_types_data = Relation_Data_Obj[value.toLowerCase()];
          }
          state.salutaion = value;
          break;
        case "GENDER":
          state.gender = value;
          break;
        case "RELATION":
          state.relation = value;
          break;
        case "MODEL":
          if (state.model !== value) {
            state.varient = "";
            state.color = "";
            state.fuel_type = "";
            state.transmission_type = "";
          }
          state.model = value;
          break;
        case "VARIENT":
          if (state.varient !== value) {
            state.color = "";
          }
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
        case "SOURCE_OF_ENQUIRY":
          state.source_of_enquiry = value;
          break;
        case "SUB_SOURCE_OF_ENQUIRY":
          state.sub_source_of_enquiry = value;
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
        case "APPROX_ANNUAL_INCOME":
          state.approx_annual_income = value;
          break;
        case "C_MAKE":
          if (state.c_make !== value) {
            state.c_model = "";
          }
          state.c_make = value;
          break;
        case "C_MODEL":
          state.c_model = value;
          break;
        case "C_FUEL_TYPE":
          state.c_fuel_type = value;
          break;
        case "C_TRANSMISSION_TYPE":
          state.c_transmission_type = value;
          break;
        case "A_MAKE":
          if (state.a_make !== value) {
            state.a_model = "";
          }
          state.a_make = value;
          break;
        case "A_MODEL":
          state.a_model = value;
          break;
        case "R_MAKE":
          if (state.r_make !== value) {
            state.r_model = "";
          }
          state.r_make = value;
          break;
        case "R_MODEL":
          state.r_model = value;
          break;
        case "R_FUEL_TYPE":
          state.r_fuel_type = value;
          break;
        case "R_TRANSMISSION_TYPE":
          state.r_transmission_type = value;
          break;
        case "R_INSURENCE_TYPE":
          state.r_insurence_type = value;
          break;
        case "DROP_REASON":
          state.drop_reason = value;
      }
    },
    setDatePicker: (state, action) => {
      console.log("coming here");
      state.datePickerKeyId = action.payload;
      state.showDatepicker = !state.showDatepicker;
    },
    updateSelectedDate: (state, action: PayloadAction<PersonalIntroModel>) => {
      const { key, text } = action.payload;
      const selectedDate = convertTimeStampToDateString(text, "DD/MM/YYYY");
      const keyId = key ? key : state.datePickerKeyId;
      switch (keyId) {
        case "DATE_OF_BIRTH":
          state.dateOfBirth = selectedDate;
          break;
        case "ANNIVERSARY_DATE":
          state.anniversaryDate = selectedDate;
          break;
        case "EXPECTED_DELIVERY_DATE":
          state.expected_delivery_date = selectedDate;
          break;
        case "R_MFG_YEAR":
          state.r_mfg_year = selectedDate;
          break;
        case "R_REG_DATE":
          state.r_registration_date = selectedDate;
          break;
        case "R_REG_VALIDITY_DATE":
          state.r_registration_validity_date = selectedDate;
          break;
        case "R_INSURENCE_POLICIY_EXPIRY_DATE":
          state.r_insurence_expiry_date = selectedDate;
          break;
        case "R_INSURENCE_FROM_DATE":
          state.r_insurence_from_date = selectedDate;
          break;
        case "R_INSURENCE_TO_DATE":
          state.r_insurence_to_date = selectedDate;
          break;
        case "NONE":
          console.log("NONE");
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
          if (state.permanent_address) {
            state.p_pincode = state.pincode;
            state.p_urban_or_rural = state.urban_or_rural;
            state.p_houseNum = state.houseNum;
            state.p_streetName = state.streetName;
            state.p_village = state.village;
            state.p_city = state.city;
            state.p_district = state.district;
            state.p_state = state.state;
          }
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
        case "COMPANY_NAME":
          state.company_name = text;
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
        case "BANK_R_FINANCE_NAME":
          state.bank_or_finance_name = text;
          break;
        case "LOCATION":
          state.location = text;
          break;
        case "LEASHING_NAME":
          state.leashing_name = text;
          break;
        case "LOAN_OF_TENURE":
          state.loan_of_tenure = text;
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
          state.c_looking_for_any_other_brand_checked = !state.c_looking_for_any_other_brand_checked;
          break;
        case "C_MAKE_OTHER_NAME":
          state.c_make_other_name = text;
          break;
        case "C_MODEL_OTHER_NAME":
          state.c_model_other_name = text;
          break;
        case "C_VARIANT":
          state.c_variant = text;
          break;
        case "C_COLOR":
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
    },
    setAdditionalBuyerDetails: (state, action) => {
      const { key, text } = action.payload;
      switch (key) {
        case "A_MAKE_OTHER_NAME":
          state.a_make_other_name = text;
          break;
        case "A_MODEL_OTHER_NAME":
          state.a_model_other_name = text;
          break;
        case "A_VARIENT":
          state.a_varient = text;
          break;
        case "A_COLOR":
          state.a_color = text;
          break;
        case "A_REG_NO":
          state.a_reg_no = text;
          break;
      }
    },
    setReplacementBuyerDetails: (state, action) => {
      const { key, text } = action.payload;
      switch (key) {
        case "R_REG_NO":
          state.r_reg_no = text;
          break;
        case "R_MAKE_OTHER_NAME":
          state.r_make_other_name = text;
          break;
        case "R_MODEL_OTHER_NAME":
          state.r_model_other_name = text;
          break;
        case "R_VARIENT":
          state.r_varient = text;
          break;
        case "R_COLOR":
          state.r_color = text;
          break;
        case "R_KMS_DRIVEN_OR_ODOMETER_READING":
          state.r_kms_driven_or_odometer_reading = text;
          break;
        case "R_HYPOTHICATION_NAME":
          state.r_hypothication_name = text;
          break;
        case "R_HYPOTHICATION_BRANCH":
          state.r_hypothication_branch = text;
          break;
        case "R_EXP_PRICE":
          state.r_expected_price = text;
          break;
        case "R_INSURENCE_CMPNY_NAME":
          state.r_insurence_company_name = text;
          break;
        case "R_HYPOTHICATION_CHECKED":
          state.r_hypothication_checked = !state.r_hypothication_checked;
          break;
        case "R_INSURENCE_CHECKED":
          state.r_insurence_checked = !state.r_insurence_checked;
          break;
        case "R_INSURENCE_DOC_CHECKED":
          state.r_insurence_document_checked =
            !state.r_insurence_document_checked;
          break;
      }
    },
    setEnquiryDropDetails: (state, action) => {
      const { key, text } = action.payload;
      switch (key) {
        case "DROP_REMARKS":
          state.drop_remarks = text;
          break;
      }
    },
    updateDmsContactOrAccountDtoData: (state, action) => {

      // dmsContactOrAccountDto
      const dms_C_Or_A_Dto = action.payload;
      state.dateOfBirth = dms_C_Or_A_Dto.dateOfBirth ? dms_C_Or_A_Dto.dateOfBirth : "";
      state.email = dms_C_Or_A_Dto.email ? dms_C_Or_A_Dto.email : "";
      state.firstName = dms_C_Or_A_Dto.firstName ? dms_C_Or_A_Dto.firstName : "";
      state.lastName = dms_C_Or_A_Dto.lastName ? dms_C_Or_A_Dto.lastName : "";
      state.mobile = dms_C_Or_A_Dto.phone ? dms_C_Or_A_Dto.phone : "";
      state.alterMobile = dms_C_Or_A_Dto.secondaryPhone ? dms_C_Or_A_Dto.secondaryPhone : "";
      state.gender = dms_C_Or_A_Dto.gender ? dms_C_Or_A_Dto.gender : "";
      state.relation = dms_C_Or_A_Dto.relation ? dms_C_Or_A_Dto.relation : "";
      state.salutaion = dms_C_Or_A_Dto.salutation ? dms_C_Or_A_Dto.salutation : "";
      state.relationName = dms_C_Or_A_Dto.relationName ? dms_C_Or_A_Dto.relationName : "";
      state.age = dms_C_Or_A_Dto.age ? dms_C_Or_A_Dto.age.toString() : "0";

      if (state.salutaion) {
        state.gender_types_data = Gender_Data_Obj[state.salutaion.toLowerCase()];
        state.relation_types_data = Relation_Data_Obj[state.salutaion.toLowerCase()];
      }

      state.anniversaryDate = dms_C_Or_A_Dto.anniversaryDate ? dms_C_Or_A_Dto.anniversaryDate : "";
      state.approx_annual_income = dms_C_Or_A_Dto.annualRevenue ? dms_C_Or_A_Dto.annualRevenue : "";
      state.company_name = dms_C_Or_A_Dto.company ? dms_C_Or_A_Dto.company : "";
      state.customer_type = dms_C_Or_A_Dto.customerType ? dms_C_Or_A_Dto.customerType : "";
      state.designation = dms_C_Or_A_Dto.designation ? dms_C_Or_A_Dto.designation : "";
      state.kms_travelled_month = dms_C_Or_A_Dto.kmsTravelledInMonth ? dms_C_Or_A_Dto.kmsTravelledInMonth : "";
      state.members = dms_C_Or_A_Dto.membersInFamily ? dms_C_Or_A_Dto.membersInFamily : "";
      state.occupation = dms_C_Or_A_Dto.occupation ? dms_C_Or_A_Dto.occupation : "";
      state.prime_expectation_from_car = dms_C_Or_A_Dto.primeExpectationFromCar ? dms_C_Or_A_Dto.primeExpectationFromCar : "";
      state.who_drives = dms_C_Or_A_Dto.whoDrives ? dms_C_Or_A_Dto.whoDrives : "";
    },
    updateDmsLeadDtoData: (state, action) => {

      const dmsLeadDto = action.payload;
      state.buyer_type = dmsLeadDto.buyerType ? dmsLeadDto.buyerType : "";
      state.enquiry_category = dmsLeadDto.enquiryCategory ? dmsLeadDto.enquiryCategory : "";
      state.enquiry_segment = dmsLeadDto.enquirySegment ? dmsLeadDto.enquirySegment : "";
      if (state.customer_types_response && state.enquiry_segment) {
        state.customer_types_data = state.customer_types_response[state.enquiry_segment.toLowerCase()];
      }
      state.source_of_enquiry = dmsLeadDto.enquirySource ? dmsLeadDto.enquirySource : "";
      state.sub_source_of_enquiry = dmsLeadDto.subSource ? dmsLeadDto.subSource : "";
      const deliveryDate = dmsLeadDto.dmsExpectedDeliveryDate ? dmsLeadDto.dmsExpectedDeliveryDate : "";
      state.expected_delivery_date = convertTimeStampToDateString(deliveryDate, "DD/MM/YYYY");
      state.model = dmsLeadDto.model ? dmsLeadDto.model : "";

      // documentType: dmsLeadDto.documentType === null ? '' : dmsLeadDto.documentType,
      // modeOfPayment: dmsLeadDto.modeOfPayment === null ? '' : dmsLeadDto.modeOfPayment,
    },
    updateDmsAddressData: (state, action) => {

      const dmsAddresses = action.payload;
      if (dmsAddresses.length == 2) {
        dmsAddresses.forEach((address) => {
          if (address.addressType === 'Communication') {

            state.pincode = address.pincode ? address.pincode : "";
            state.houseNum = address.houseNo ? address.houseNo : "";
            state.streetName = address.street ? address.street : "";
            state.village = address.village ? address.village : "";
            state.city = address.city ? address.city : "";
            state.district = address.district ? address.district : "";
            state.state = address.state ? address.state : "";

            let urbanOrRural = 0;
            if (address.urban) {
              urbanOrRural = 1;
            } else if (address.rural) {
              urbanOrRural = 2;
            }
            state.urban_or_rural = urbanOrRural;

          } else if (address.addressType === 'Permanent') {

            state.p_pincode = address.pincode ? address.pincode : "";
            state.p_houseNum = address.houseNo ? address.houseNo : "";
            state.p_streetName = address.street ? address.street : "";
            state.p_village = address.village ? address.village : "";
            state.p_city = address.city ? address.city : "";
            state.p_district = address.district ? address.district : "";
            state.p_state = address.state ? address.state : "";
            let urbanOrRural = 0;
            if (address.urban) {
              urbanOrRural = 1;
            } else if (address.rural) {
              urbanOrRural = 2;
            }
            state.p_urban_or_rural = urbanOrRural;
          }
        });
      }
    },
    updateModelSelectionData: (state, action) => {

      const dmsLeadProducts = action.payload;
      if (dmsLeadProducts.length > 0) {
        const dataObj = dmsLeadProducts[0];
        state.lead_product_id = dataObj.id ? dataObj.id : "";
        state.model = dataObj.model ? dataObj.model : "";
        state.varient = dataObj.variant ? dataObj.variant : "";
        state.color = dataObj.color ? dataObj.color : "";
        state.fuel_type = dataObj.fuel ? dataObj.fuel : "";
        state.transmission_type = dataObj.transimmisionType ? dataObj.transimmisionType : "";
        state.model_drop_down_data_update_statu = "update";
      }
    },
    updateFinancialData: (state, action) => {
      const dmsfinancedetails = action.payload;
      if (dmsfinancedetails.length > 0) {
        const dataObj = dmsfinancedetails[0];
        state.retail_finance = dataObj.financeType ? dataObj.financeType : "";
        state.finance_category = dataObj.financeCategory ? dataObj.financeCategory : "";
        state.down_payment = dataObj.downPayment ? dataObj.downPayment.toString() : "";
        state.loan_amount = dataObj.loanAmount ? dataObj.loanAmount.toString() : "";
        state.bank_or_finance = dataObj.financeCompany ? dataObj.financeCompany : "";
        state.bank_or_finance_name = dataObj.financeCompany ? dataObj.financeCompany : "";
        state.rate_of_interest = dataObj.rateOfInterest ? dataObj.rateOfInterest : "";
        state.loan_of_tenure = dataObj.expectedTenureYears ? dataObj.expectedTenureYears : "";
        state.emi = dataObj.emi ? dataObj.emi.toString() : "";
        state.approx_annual_income = dataObj.annualIncome ? dataObj.annualIncome : "";
        state.location = dataObj.location ? dataObj.location : "";
        state.leashing_name = dataObj.financeCompany ? dataObj.financeCompany : "";
      }
    },
    updateCustomerNeedAnalysisData: (state, action) => {
      const dmsLeadScoreCards = action.payload;
      if (dmsLeadScoreCards.length > 0) {
        const dataObj = dmsLeadScoreCards[0];
        state.c_looking_for_any_other_brand_checked = dataObj.lookingForAnyOtherBrand ? dataObj.lookingForAnyOtherBrand : false;
        state.c_make = dataObj.brand ? dataObj.brand : "";
        state.c_model = dataObj.model ? dataObj.model : "";
        state.c_make_other_name = dataObj.otherMake ? dataObj.otherMake : "";
        state.c_model_other_name = dataObj.otherModel ? dataObj.otherModel : "";
        state.c_variant = dataObj.variant ? dataObj.variant : "";
        state.c_color = dataObj.color ? dataObj.color : "";
        state.c_fuel_type = dataObj.fuel ? dataObj.fuel : "";
        // TODO:- Need to check transmission type in response
        state.c_transmission_type = "";
        state.c_price_range = dataObj.priceRange ? dataObj.priceRange : "";
        state.c_on_road_price = dataObj.onRoadPriceanyDifference ? dataObj.onRoadPriceanyDifference : "";
        state.c_dealership_name = dataObj.dealershipName ? dataObj.dealershipName : "";
        state.c_dealership_location = dataObj.dealershipLocation ? dataObj.dealershipLocation : "";
        state.c_dealership_pending_reason = dataObj.decisionPendingReason ? dataObj.decisionPendingReason : "";
        state.c_voice_of_customer_remarks = dataObj.voiceofCustomerRemarks ? dataObj.voiceofCustomerRemarks : "";
      }
    },
    updateAdditionalOrReplacementBuyerData: (state, action) => {
      const dmsExchagedetails = action.payload;
      if (dmsExchagedetails.length > 0) {
        const dataObj = dmsExchagedetails[0];

        if (dataObj.buyerType === "Additional Buyer") {
          state.a_make = dataObj.brand ? dataObj.brand : "";
          state.a_model = dataObj.model ? dataObj.model : "";
          state.a_varient = dataObj.varient ? dataObj.varient : "";
          state.a_color = dataObj.color ? dataObj.color : "";
          state.a_reg_no = dataObj.regNo ? dataObj.regNo : "";
        }
        else if (dataObj.buyerType === "Replacement Buyer") {

          state.r_reg_no = dataObj.regNo ? dataObj.regNo : "";
          state.r_make = dataObj.brand ? dataObj.brand : "";
          state.r_model = dataObj.model ? dataObj.model : "";
          state.r_varient = dataObj.varient ? dataObj.varient : "";
          state.r_color = dataObj.color ? dataObj.color : "";
          state.r_fuel_type = dataObj.fuelType ? dataObj.fuelType : "";
          state.r_transmission_type = dataObj.transmission ? dataObj.transmission : "";
          const yearOfManfac = dataObj.yearofManufacture ? dataObj.yearofManufacture : "";
          state.r_mfg_year = convertTimeStampToDateString(yearOfManfac, "DD/MM/YYYY");

          state.r_kms_driven_or_odometer_reading = dataObj.kiloMeters ? dataObj.kiloMeters : "";
          state.r_expected_price = dataObj.expectedPrice ? dataObj.expectedPrice.toString() : "";

          state.r_hypothication_checked = dataObj.hypothicationRequirement ? dataObj.hypothicationRequirement : false;
          state.r_hypothication_name = dataObj.hypothication ? dataObj.hypothication : "";
          state.r_hypothication_branch = dataObj.hypothicationBranch ? dataObj.hypothicationBranch : "";

          const registrationDate = dataObj.registrationDate ? dataObj.registrationDate : "";
          state.r_registration_date = convertTimeStampToDateString(registrationDate, "DD/MM/YYYY");

          const registrationValidityDate = dataObj.registrationValidityDate ? dataObj.registrationValidityDate : "";
          state.r_registration_validity_date = convertTimeStampToDateString(registrationValidityDate, "DD/MM/YYYY");

          state.r_insurence_checked = dataObj.insuranceAvailable ? (dataObj.insuranceAvailable === "true" ? true : false) : false;
          state.r_insurence_document_checked = dataObj.insuranceDocumentAvailable ? dataObj.insuranceDocumentAvailable : false;
          state.r_insurence_company_name = dataObj.insuranceCompanyName ? dataObj.insuranceCompanyName : "";
          state.r_insurence_expiry_date = dataObj.insuranceExpiryDate ? dataObj.insuranceExpiryDate : "";
          state.r_insurence_type = dataObj.insuranceType ? dataObj.insuranceType : "";
          const insurenceFromDate = dataObj.insuranceFromDate ? dataObj.insuranceFromDate : "";
          state.r_insurence_from_date = convertTimeStampToDateString(insurenceFromDate, "DD/MM/YYYY");
          const insurenceToDate = dataObj.insuranceToDate ? dataObj.insuranceToDate : "";
          state.r_insurence_to_date = convertTimeStampToDateString(insurenceToDate, "DD/MM/YYYY");
        }
      }
    },
    updateFuelAndTransmissionType: (state, action) => {
      state.fuel_type = action.payload.fuelType;
      state.transmission_type = action.payload.transmissionType;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getEnquiryDetailsApi.pending, (state) => {

    })
    builder.addCase(getEnquiryDetailsApi.fulfilled, (state, action) => {
      console.log("S getEnquiryDetailsApi: ", JSON.stringify(action.payload));
      if (action.payload.dmsEntity) {
        state.enquiry_details_response = action.payload.dmsEntity;
      }
    })
    builder.addCase(getEnquiryDetailsApi.rejected, (state, action) => {
      console.log("F getEnquiryDetailsApi: ", JSON.stringify(action.payload));
    })
    builder.addCase(updateEnquiryDetailsApi.fulfilled, (state, action) => {
      console.log("S updateEnquiryDetailsApi: ", JSON.stringify(action.payload));
    })
    builder.addCase(updateEnquiryDetailsApi.rejected, (state, action) => {
      console.log(" updateEnquiryDetailsApi: ", JSON.stringify(action.payload));
    })
    builder.addCase(dropEnquiryApi.fulfilled, (state, action) => {
      console.log("S dropEnquiryApi: ", JSON.stringify(action.payload));
      if (action.payload.status === "SUCCESS") {
        state.enquiry_drop_response_status = "success";
      }
    })
    builder.addCase(getCustomerTypesApi.fulfilled, (state, action) => {
      console.log("S getCustomerTypesApi: ", JSON.stringify(action.payload));
      if (action.payload) {
        const customerTypes = action.payload;
        let personalTypes = [];
        let commercialTypes = [];
        let companyTypes = [];
        customerTypes.forEach(customer => {
          const obj = { id: customer.id, name: customer.customerType }
          if (customer.customerType === "Fleet") {
            commercialTypes.push(obj);
          } else if (customer.customerType === "Institution") {
            companyTypes.push(obj);
          } else {
            personalTypes.push(obj);
          }
        });
        const obj = {
          "personal": personalTypes,
          "commercial": commercialTypes,
          "company": companyTypes
        }
        state.customer_types_response = obj;
      }
    })
  }
});

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
  setDropDownData,
  setAdditionalBuyerDetails,
  setReplacementBuyerDetails,
  setEnquiryDropDetails,
  updateDmsContactOrAccountDtoData,
  updateDmsLeadDtoData,
  updateDmsAddressData,
  updateModelSelectionData,
  updateFinancialData,
  updateFuelAndTransmissionType,
  updateCustomerNeedAnalysisData,
  updateAdditionalOrReplacementBuyerData,
} = enquiryDetailsOverViewSlice.actions;
export default enquiryDetailsOverViewSlice.reducer;
