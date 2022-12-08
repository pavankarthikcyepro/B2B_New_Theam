import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";
import {
  Relation_Data_Obj,
  Gender_Data_Obj,
} from "../jsonData/enquiryFormScreenJsonData";
import {
  convertDateStringToMillisecondsUsingMoment,
  convertTimeStampToDateString,
  convertTimeStringToDate,
  convertToDate,
} from "../utils/helperFunctions";
import moment from "moment";
import { showToastRedAlert, showToast } from "../utils/toast";
import {
  CustomerTypesObj,
  CustomerTypesObj21,
  CustomerTypesObj22,
} from "../jsonData/preEnquiryScreenJsonData";
import { Alert } from "react-native";

export const getEnquiryDetailsApi = createAsyncThunk(
  "ENQUIRY_FORM_SLICE/getEnquiryDetailsApi",
  async ({ universalId, leadStage, leadStatus }, { rejectWithValue }) => {
    // // try {
    //   const autoSaveResponse = await client.get(URL.ENQUIRY_DETAILS_BY_AUTOSAVE(universalId));
    //   const autoSavejson = await autoSaveResponse.json();
    // // } catch (error) {

    // // }

    const response = await client.get(URL.ENQUIRY_DETAILS(universalId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }

    return json.dmsEntity;
    // if (leadStatus === 'ENQUIRYCOMPLETED' && leadStage === 'ENQUIRY')
    // {
    //   // if (json.dmsEntity.hasOwnProperty("dmsLeadDto")) {
    //   // }
    //   if (!response.ok) {
    //     return rejectWithValue(json);
    //   }

    //   // if (json.dmsEntity.hasOwnProperty("dmsLeadDto")) {
    //   //   return json;
    //   // } else {
    //   //   return json.dmsEntity
    //   // }
    //   return json.dmsEntity
    // }
    // else{
    //   // if (autoSavejson.hasOwnProperty("dmsLeadDto")) {
    //   // }
    //   if (autoSaveResponse){
    //     if (!autoSaveResponse.ok) {
    //       return rejectWithValue(autoSavejson);
    //     }

    //     if (autoSavejson.hasOwnProperty("dmsLeadDto")) {
    //       return autoSavejson;
    //     } else {
    //       return json.dmsEntity
    //     }
    //   }
    //   else{
    //     json.dmsEntity
    //   }
    // }

    // if (autoSavejson.hasOwnProperty("dmsLeadDto")) {
    // }

    // if (json.success) {
    //    autoSaveResponse = await client.get(URL.ENQUIRY_DETAILS_BY_AUTOSAVE(universalId));
    //     autoSavejson = await autoSaveResponse.json();
    // }

    // if (!response.ok) {
    //   return rejectWithValue(json);
    // }

    // if (autoSavejson.hasOwnProperty("dmsLeadDto")) {
    //   return autoSavejson;
    // } else {
    //   return json.dmsEntity
    // }
    // return autoSavejson
  }
);

export const getEnquiryDetailsApiAuto = createAsyncThunk(
  "ENQUIRY_FORM_SLICE/getEnquiryDetailsApiAuto",
  async ({ universalId, leadStage, leadStatus }, { rejectWithValue }) => {
    // try {
    const autoSaveResponse = await client.get(
      URL.ENQUIRY_DETAILS_BY_AUTOSAVE(universalId)
    );
    const autoSavejson = await autoSaveResponse.json();
    // } catch (error) {

    // }

    const response = await client.get(URL.ENQUIRY_DETAILS(universalId));
    const json = await response.json();

    if (leadStatus === "ENQUIRYCOMPLETED" && leadStage === "ENQUIRY") {
      // if (json.dmsEntity.hasOwnProperty("dmsLeadDto")) {
      // }
      if (!response.ok) {
        return rejectWithValue(json);
      }

      // if (json.dmsEntity.hasOwnProperty("dmsLeadDto")) {
      //   return json;
      // } else {
      //   return json.dmsEntity
      // }
      return json.dmsEntity;
    } else {
      // if (autoSavejson.hasOwnProperty("dmsLeadDto")) {
      // }
      if (autoSaveResponse) {
        if (!autoSaveResponse.ok) {
          return rejectWithValue(autoSavejson);
        }

        if (autoSavejson.hasOwnProperty("dmsLeadDto")) {
          return autoSavejson;
        } else {
          return json.dmsEntity;
        }
      } else {
        json.dmsEntity;
      }
    }

    // if (autoSavejson.hasOwnProperty("dmsLeadDto")) {
    // }

    // if (json.success) {
    //    autoSaveResponse = await client.get(URL.ENQUIRY_DETAILS_BY_AUTOSAVE(universalId));
    //     autoSavejson = await autoSaveResponse.json();
    // }

    // if (!response.ok) {
    //   return rejectWithValue(json);
    // }

    // if (autoSavejson.hasOwnProperty("dmsLeadDto")) {
    //   return autoSavejson;
    // } else {
    //   return json.dmsEntity
    // }
    // return autoSavejson
  }
);

export const getAutoSaveEnquiryDetailsApi = createAsyncThunk(
  "ENQUIRY_FORM_SLICE/getAutoSaveEnquiryDetailsApi",
  async (universalId, { rejectWithValue }) => {
    const response = await client.get(
      URL.ENQUIRY_DETAILS_BY_AUTOSAVE(universalId)
    );
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);
export const getLogoNameApi = createAsyncThunk(
  "ENQUIRY_FORM_SLICE/getLogoNameApi",
  async (data, { rejectWithValue }) => {
    const response = await client.get(
      URL.PROFORMA_LOGO_NAME(data.orgId, data.branchId)
    );
    const json = await response.json();
  
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);
export const getProformaListingDetailsApi = createAsyncThunk(
  "ENQUIRY_FORM_SLICE/getProformaListingDetailsApi",
  async (crmUniversalId, { rejectWithValue }) => {
    const response = await client.get(
      URL.PROFORMA_LISTING_DETAILS(crmUniversalId)
    );
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);
export const getProformaModelApi = createAsyncThunk(
  "ENQUIRY_FORM_SLICE/getProformaModelApi",
  async (universalId, { rejectWithValue }) => {
    const response = await client.get(
      URL.ENQUIRY_DETAILS_BY_AUTOSAVE(universalId)
    );
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);
export const postProformaInvoiceDetails = createAsyncThunk(
  "ENQUIRY_FORM_SLICE/postProformaInvoiceDetails",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(URL.SAVE_PROFORMA_DETAILS(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);
export const getOnRoadPriceAndInsurenceDetailsApi = createAsyncThunk(
  "ENQUIRY_FORM_SLICE/getOnRoadPriceAndInsurenceDetailsApi",
  async (payload, { rejectWithValue }) => {

    const response = await client.get(
      URL.GET_ON_ROAD_PRICE_AND_INSURENCE_DETAILS(
        payload["varientId"],
        payload["orgId"]
      )
    );
    try {
      const json = await response.json();

      if (response.status != 200) {
        return rejectWithValue(json);
      }
      return json;
    } catch (error) {
      showToastRedAlert(
        `Value not found for varient id: ${payload["varientId"]} and org id: ${payload["orgId"]}`
      );
      console.error(
        "PRE-BOOKING getOnRoadPriceAndInsurenceDetailsApi JSON parse error: ",
        error + " : " + JSON.stringify(response)
      );
      return rejectWithValue({
        message: "Json parse error: " + JSON.stringify(response),
      });
    }
  }
);
export const updateEnquiryDetailsApi = createAsyncThunk(
  "ENQUIRY_FORM_SLICE/updateEnquiryDetailsApi",
  async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.UPDATE_ENQUIRY_DETAILS(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const autoSaveEnquiryDetailsApi = createAsyncThunk(
  "ENQUIRY_FORM_SLICE/autoSaveEnquiryDetailsApi",
  async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.UPDATE_ENQUIRY_DETAILS(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const customerLeadRef = createAsyncThunk(
  "CONFIRMED_PRE_ENQUIRY/customerLeadRef",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(URL.CUSTOMER_LEAD_REFERENCE(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const updateEnquiryDetailsApiAutoSave = createAsyncThunk(
  "ENQUIRY_FORM_SLICE/updateEnquiryDetailsApiAutoSave",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(URL.AUTO_SAVE(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const updateRef = createAsyncThunk(
  "ENQUIRY_FORM_SLICE/updateRef",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(URL.UPDATE_REF(), payload);
    try {

      // const json = await response.json();

      if (!response.ok) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error) {
      console.error(
        "getPrebookingDetailsApi JSON parse error: ",
        error + " : " + JSON.stringify(response)
      );
      return rejectWithValue({
        message: "Json parse error: " + JSON.stringify(response),
      });
    }
  }
);

export const dropEnquiryApi = createAsyncThunk(
  "ENQUIRY_FORM_SLICE/dropEnquiryApi",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(URL.DROP_ENQUIRY(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getCustomerTypesApi = createAsyncThunk(
  "ENQUIRY_FORM_SLICE/getCustomerTypesApi",
  async (orgId, { rejectWithValue }) => {
    const response = await client.get(URL.GET_CUSTOMER_TYPES(orgId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getPendingTasksApi = createAsyncThunk(
  "ENQUIRY_FORM_SLICE/getPendingTasksApi",
  async (endUrl, { rejectWithValue }) => {
    const url = URL.TASKS_PRE_ENQUIRY() + endUrl;

    const response = await client.get(url);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getTermsAndConditionsOrgwise = createAsyncThunk(
  "ENQUIRY_FORM_SLICE/getTermsAndConditionsOrgwise",
  async (endUrl, { rejectWithValue }) => {
    const response = await client.get(URL.PROFORMA_TERMS_N_CONDITIONS(endUrl));
    // const url = URL.PROFORMA_TERMS_N_CONDITIONS() + endUrl;

    // const response = await client.get(url);
    const json = await response.json();
    
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

interface PersonalIntroModel {
  key: string;
  text: string;
}

interface DropDownModelNew {
  key: string;
  value: string;
  id?: string;
  orgId?: string;
}

interface DropDownModel {
  id: string;
  name: string;
  keyId: string;
}

const initialState = {
  status: "",
  isLoading: false,
  openAccordian: 0,
  showDatepicker: false,
  customer_types_data: [],
  enquiry_drop_response_status: "",
  get_pending_tasks_response_status: "",
  get_pending_tasks_response_list: [],
  minDate: null,
  maxDate: null,

  //Proforma Invoice
  getTermsNConditions_res:"",
  getTermsNConditions_res_status:"",
  proforma_API_respData: "",
  proforma_API_response: "",
  proforma_listingdata : [],
  proforma_houseNo : "",
  proforma_address:"",
  profprma_street:"",
  proforma_gstnNumber:"",
  proforma_orgName: "",
  proforma_logo: "",
  proforma_city: "",
  proforma_branch: "",
  proforma_pincode: 0,
  proforma_state: "",
  proforma_model: "",
  vehicle_on_road_price_insurence_details_response: null,
  insurance_type: "",
  add_on_insurance: "",
  addOnPrice: 0,
  warranty: "",
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
  event_code: "",
  rf_by_first_name: "",
  rf_by_last_name: "",
  rf_by_mobile: "",
  rf_by_source: "",
  rf_by_source_location: "",
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
  salutation: "",
  // Communication Address
  pincode: "",
  urban_or_rural: 0, // 1: urban, 2:
  houseNum: "",
  streetName: "",
  village: "",
  mandal: "",
  city: "",
  state: "",
  district: "",

  is_permanent_address_same: "",
  p_pincode: "",
  p_urban_or_rural: 0, // 1: urban, 2:
  p_houseNum: "",
  p_streetName: "",
  p_village: "",
  p_mandal: "",
  p_city: "",
  p_state: "",
  p_district: "",
  // Model Selection
  lead_product_id: "",
  model: "",
  varient: "",
  color: "",
  fuel_type: "",
  dmsLeadProducts: [],
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
  employee_id: "",
  gstin_number: "",
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
  regDocumentKey: "",
  regDocumentPath: "",
  insuranceDocumentKey: "",
  insuranceDocumentPath: "",
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
  // data variables
  enquiry_details_response: null,
  update_enquiry_details_response: null,
  customer_types_response: null,
  isAddressSet: false,
  isOpened: false,
  refNo: "",
  rmfgYear: null,
  //offerprice
  consumer_offer: "",
  exchange_offer: "",
  corporate_offer: "",
  promotional_offer: "",
  cash_discount: "",
  for_accessories: "",
  additional_offer_1: "",
  additional_offer_2: "",
  accessories_discount:"",
  insurance_discount:"",
  foc_accessoriesFromServer :"",
};

const enquiryDetailsOverViewSlice = createSlice({
  name: "ENQUIRY_FORM_SLICE",
  initialState: JSON.parse(JSON.stringify(initialState)),
  reducers: {
    clearStateData: () => JSON.parse(JSON.stringify(initialState)),
    clearState: (state, action) => {
      state.enableEdit = false;
      state.enquiry_details_response = null;
      state.update_enquiry_details_response = null;
      state.get_pending_tasks_response_status = "";
      state.get_pending_tasks_response_list = [];

      state.customer_types_data = [];
      state.enquiry_drop_response_status = "";
      state.get_pending_tasks_response_status = "";
      state.get_pending_tasks_response_list = [];
      state.enquiry_details_response = null;
      state.update_enquiry_details_response = null;
      state.customer_types_response = null;
      state.employee_id = "";
      state.gstin_number = "";
      state.expected_delivery_date = "";
      state.a_make = "";
      state.a_model = "";
      state.a_make_other_name = "";
      state.a_model_other_name = "";
      state.a_varient = "";
      state.a_color = "";
      state.a_reg_no = "";
      // Replacement Buyer
      state.r_reg_no = "";
      state.regDocumentKey= "",
      state.regDocumentPath= "",
      state.insuranceDocumentKey= "",
      state.insuranceDocumentPath= "",
      state.r_varient = "";
      state.r_color = "";
      state.r_make = "";
      state.r_model = "";
      state.r_make_other_name = "";
      state.r_model_other_name = "";
      state.r_fuel_type = "";
      state.r_transmission_type = "";
      state.r_mfg_year = "";
      state.r_kms_driven_or_odometer_reading = "";
      state.r_expected_price = "";
      state.r_registration_date = "";
      state.r_registration_validity_date = "";
      state.r_hypothication_checked = false;
      state.r_hypothication_name = "";
      state.r_hypothication_branch = "";
      state.r_insurence_checked = false;
      state.r_insurence_company_name = "";
      state.r_insurence_expiry_date = "";
      state.r_insurence_type = "";
      state.r_insurence_from_date = "";
      state.r_insurence_to_date = "";
      state.r_insurence_document_checked = false;
      state.dmsLeadProducts = [];
      state.refNo = "";
      //offerprice
      state.consumer_offer = "";
      state.exchange_offer = "";
      state.corporate_offer = "";
      state.promotional_offer = "";
      state.cash_discount = "";
      state.for_accessories = "";
      state.additional_offer_1 = "";
      state.additional_offer_2 = "";
      state.accessories_discount = "",
      state.insurance_discount = "",
        state.foc_accessoriesFromServer = ""
    },
    clearState2: (state, action) => {
      state.enableEdit = false;
      state.enquiry_details_response = null;
      state.update_enquiry_details_response = null;
      state.get_pending_tasks_response_status = "";
      state.get_pending_tasks_response_list = [];

      state.customer_types_data = [];
      state.enquiry_drop_response_status = "";
      state.get_pending_tasks_response_status = "";
      state.get_pending_tasks_response_list = [];
      state.enquiry_details_response = null;
      state.update_enquiry_details_response = null;
      state.customer_types_response = null;
      state.employee_id = "";
      state.gstin_number = "";
      state.expected_delivery_date = "";
      state.a_make = "";
      state.a_model = "";
      state.a_make_other_name = "";
      state.a_model_other_name = "";
      state.a_varient = "";
      state.a_color = "";
      state.a_reg_no = "";
      // Replacement Buyer
      state.r_reg_no = "";
      state.regDocumentKey= "",
      state.regDocumentPath= "",
      state.insuranceDocumentKey= "",
      state.insuranceDocumentPath= "",
      state.r_varient = "";
      state.r_color = "";
      state.r_make = "";
      state.r_model = "";
      state.r_make_other_name = "";
      state.r_model_other_name = "";
      state.r_fuel_type = "";
      state.r_transmission_type = "";
      state.r_mfg_year = "";
      state.r_kms_driven_or_odometer_reading = "";
      state.r_expected_price = "";
      state.r_registration_date = "";
      state.r_registration_validity_date = "";
      state.r_hypothication_checked = false;
      state.r_hypothication_name = "";
      state.r_hypothication_branch = "";
      state.r_insurence_checked = false;
      state.r_insurence_company_name = "";
      state.r_insurence_expiry_date = "";
      state.r_insurence_type = "";
      state.r_insurence_from_date = "";
      state.r_insurence_to_date = "";
      state.r_insurence_document_checked = false;
      state.dmsLeadProducts = [];
      state.refNo = "";
      //offerprice
      state.consumer_offer = "";
      state.exchange_offer = "";
      state.corporate_offer = "";
      state.promotional_offer = "";
      state.cash_discount = "";
      state.for_accessories = "";
      state.additional_offer_1 = "";
      state.additional_offer_2 = "";
      state.foc_accessoriesFromServer = "";
    },
    setEditable: (state, action) => {
      state.enableEdit = !state.enableEdit;
    },
    setDropDownData: (state, action: PayloadAction<DropDownModelNew>) => {
      const { key, value, id, orgId } = action.payload;

      switch (key) {
        case "ENQUIRY_SEGMENT":
          state.enquiry_segment = value;
          state.customer_type = "";

          // if (state.customer_types_response) {
          //   state.customer_types_data =
          //       state.customer_types_response[value.toLowerCase()];
          // }
          // state.customer_type_list = CustomerTypesObj21[value.toLowerCase()]
          if (+orgId == 21) {
            state.customer_types_data = CustomerTypesObj21[value.toLowerCase()];
          } else if (+orgId == 22) {
            state.customer_types_data = CustomerTypesObj22[value.toLowerCase()];
          } else {
            state.customer_types_data = CustomerTypesObj[value.toLowerCase()];
          }
          break;
        case "CUSTOMER_TYPE":
          state.customer_type = value;
          break;
        case "RF_SOURCE":
          state.rf_by_source = value;
          break;
        case "SALUTATION":
          if (state.salutation !== value) {
            const genderData = Gender_Data_Obj[value.toLowerCase()];
            state.gender = genderData.length > 0 ? genderData[0].name : "";
            state.relation = "";
            state.gender_types_data = genderData;
            state.relation_types_data = Relation_Data_Obj[value.toLowerCase()];
          }
          state.salutation = value;
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
        case "INSURANCE_TYPE":
          state.insurance_type = value;
          break;
        case "WARRANTY":
          state.warranty = value;
          break;
        case "INSURENCE_ADD_ONS":
          state.add_on_insurance = value;
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
        case "R_INSURENCE_COMPANY_NAME":
          state.r_insurence_company_name = value;
          break;
      }
    },
    setDatePicker: (state, action) => {
      switch (action.payload) {
        case "EXPECTED_DELIVERY_DATE":
          state.minDate = new Date();
          state.maxDate = null;
          break;
        case "DATE_OF_BIRTH":
          state.minDate = null;
          state.maxDate = new Date();
          break;
        case "ANNIVERSARY_DATE":
          if (state.dateOfBirth) {
            let dobArr = state.dateOfBirth.split("/");
            state.minDate = new Date(
              Number(dobArr[2]) + 1,
              Number(dobArr[1]),
              Number(dobArr[0])
            );
          } else {
            state.minDate = null;
          }
          state.maxDate = new Date();
          break;
        case "R_MFG_YEAR":
          state.minDate = null;
          state.maxDate = new Date();
          break;
        case "R_REG_DATE":
          state.minDate = null;
          state.maxDate = new Date();
          break;
        case "R_REG_VALIDITY_DATE":
          state.minDate = null;
          state.maxDate = null;
          break;
        case "R_INSURENCE_POLICIY_EXPIRY_DATE":
          state.minDate = null;
          state.maxDate = null;
          break;
        case "R_INSURENCE_FROM_DATE":
          state.minDate = null;
          state.maxDate = null;
          break;
        case "R_INSURENCE_TO_DATE":
          state.minDate = null;
          state.maxDate = null;
          break;
        default:
          state.minDate = null;
          state.maxDate = null;
          break;
      }
      state.datePickerKeyId = action.payload;
      state.showDatepicker = !state.showDatepicker;
    },
    updatedmsLeadProduct: (state, action) => {
      // alert(JSON.stringify(action.payload))
      const data = action.payload;
      state.dmsLeadProducts = data;
    },
    updateSelectedDate: (state, action: PayloadAction<PersonalIntroModel>) => {
      const { key, text } = action.payload;
      const selectedDate = convertTimeStampToDateString(text, "DD/MM/YYYY");
      const keyId = key ? key : state.datePickerKeyId;
      switch (keyId) {
        case "DATE_OF_BIRTH":
          state.dateOfBirth = selectedDate;
          const given = moment(selectedDate, "DD/MM/YYYY");
          const current = moment().startOf("day");
          const total = Number(
            moment.duration(current.diff(given)).asYears()
          ).toFixed(0);
          if (Number(total) > 0) {
            state.age = total;
          }
          break;
        case "ANNIVERSARY_DATE":
          state.anniversaryDate = selectedDate;
          break;
        case "EXPECTED_DELIVERY_DATE":
          let categoryType = "";
          if (selectedDate) {
            const currentDate = moment().format("DD/MM/YYYY");
            const startDate = moment(currentDate, "DD/MM/YYYY");
            var endDate = moment(selectedDate, "DD/MM/YYYY");
            var daysCount = endDate.diff(startDate, "days");
            if (daysCount) {
              if (daysCount <= 7) {
                categoryType = "Hot";
              } else if (daysCount >= 8 && daysCount <= 15) {
                categoryType = "Warm";
              } else if (daysCount > 15) {
                categoryType = "Cold";
              }
            }
          }

          state.enquiry_category = categoryType;
          state.expected_delivery_date =
            convertDateStringToMillisecondsUsingMoment(text).toString();
          // state.expected_delivery_date = selectedDate;
          break;
        case "R_MFG_YEAR":
          state.r_mfg_year = convertTimeStampToDateString(text, "MM-YYYY");
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
        case "AGE":
          state.age = text;
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
          if (state.is_permanent_address_same == "YES") {
            state.p_pincode = text;
          }
          break;
        case "RURAL_URBAN":
          state.urban_or_rural = Number(text);
          if (state.is_permanent_address_same == "YES") {
            state.p_urban_or_rural = Number(text);
          }
          break;
        case "HOUSE_NO":
          state.houseNum = text;
          if (state.is_permanent_address_same == "YES") {
            state.p_houseNum = text;
          }
          break;
        case "STREET_NAME":
          state.streetName = text;
          if (state.is_permanent_address_same == "YES") {
            state.p_streetName = text;
          }
          break;
        case "VILLAGE":
          state.village = text;
          if (state.is_permanent_address_same == "YES") {
            state.p_village = text;
          }
          break;
        case "MANDAL":
          state.mandal = text;
          if (state.is_permanent_address_same == "YES") {
            state.p_mandal = text;
          }
          break;
        case "CITY":
          state.city = text;
          if (state.is_permanent_address_same == "YES") {
            state.p_city = text;
          }
          break;
        case "DISTRICT":
          state.district = text;
          if (state.is_permanent_address_same == "YES") {
            state.p_district = text;
          }
          break;
        case "STATE":
          state.state = text;
          if (state.is_permanent_address_same == "YES") {
            state.p_state = text;
          }
          break;
        case "PERMANENT_ADDRESS":
          if (text === "true") {
            state.is_permanent_address_same = "YES";
          } else if (text === "false") {
            state.is_permanent_address_same = "NO";
          }
          if (state.is_permanent_address_same === "YES") {
            state.p_pincode = state.pincode;
            state.p_urban_or_rural = state.urban_or_rural;
            state.p_houseNum = state.houseNum;
            state.p_streetName = state.streetName;
            state.p_village = state.village;
            state.p_mandal = state.mandal;
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
        case "P_MANDAL":
          state.p_mandal = text;
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
        case "RF_FIRST_NAME":
          state.rf_by_first_name = text;
          break;
        case "RF_LAST_NAME":
          state.rf_by_last_name = text;
          break;
        case "RF_MOBILE":
          state.rf_by_mobile = text;
          break;
        case "RF_SOURCE_LOCATION":
          state.rf_by_source_location = text;
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
        default:
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
          state.c_looking_for_any_other_brand_checked =
            !state.c_looking_for_any_other_brand_checked;
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
        case "EMPLOYEE_ID":
          state.employee_id = text;
          break;
        case "GSTIN_NUMBER":
          state.gstin_number = text;
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
        case "R_REG_DOC_KEY":
          state.regDocumentKey = text;
          break;
        case "R_REG_DOC_PATH":
          state.regDocumentPath = text;
          break;
        case "R_INS_DOC_KEY":
          state.insuranceDocumentKey = text;
          break;
        case "R_INS_DOC_PATH":
          state.insuranceDocumentPath = text;
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
      }
    },
    updateDmsContactOrAccountDtoData: (state, action) => {
      // dmsContactOrAccountDto

      const dms_C_Or_A_Dto = action.payload;

      if (dms_C_Or_A_Dto.email && dms_C_Or_A_Dto.email != "") {
        state.email = dms_C_Or_A_Dto.email;
      }

      if (dms_C_Or_A_Dto.firstName && dms_C_Or_A_Dto.firstName != "") {
        state.firstName = dms_C_Or_A_Dto.firstName;
      }

      if (dms_C_Or_A_Dto.lastName && dms_C_Or_A_Dto.lastName != "") {
        state.lastName = dms_C_Or_A_Dto.lastName;
      }

      if (dms_C_Or_A_Dto.phone && dms_C_Or_A_Dto.phone != "") {
        state.mobile = dms_C_Or_A_Dto.phone;
      }

      if (
        dms_C_Or_A_Dto.secondaryPhone &&
        dms_C_Or_A_Dto.secondaryPhone != ""
      ) {
        state.alterMobile = dms_C_Or_A_Dto.secondaryPhone;
      }

      if (dms_C_Or_A_Dto.gender && dms_C_Or_A_Dto.gender != "") {
        state.gender = dms_C_Or_A_Dto.gender;
      }

      if (dms_C_Or_A_Dto.relation && dms_C_Or_A_Dto.relation != "") {
        state.relation = dms_C_Or_A_Dto.relation;
      }

      if (dms_C_Or_A_Dto.salutation && dms_C_Or_A_Dto.salutation != "") {
        state.salutation = dms_C_Or_A_Dto.salutation;
      }

      if (dms_C_Or_A_Dto.relationName && dms_C_Or_A_Dto.relationName != "") {
        state.relationName = dms_C_Or_A_Dto.relationName;
      }

      if (dms_C_Or_A_Dto.age && dms_C_Or_A_Dto.age != "") {
        state.age = dms_C_Or_A_Dto.age;
      }

      if (state.salutation) {
        state.gender_types_data =
          Gender_Data_Obj[state.salutation.toLowerCase()];
        state.relation_types_data =
          Relation_Data_Obj[state.salutation.toLowerCase()];
      }

      if (dms_C_Or_A_Dto.dateOfBirth && dms_C_Or_A_Dto.dateOfBirth != "") {
        const dateOfBirth = dms_C_Or_A_Dto.dateOfBirth;
        state.dateOfBirth = convertTimeStampToDateString(
          dateOfBirth,
          "DD/MM/YYYY"
        );
      }

      if (
        dms_C_Or_A_Dto.anniversaryDate &&
        dms_C_Or_A_Dto.anniversaryDate != ""
      ) {
        const anniversaryDate = dms_C_Or_A_Dto.anniversaryDate;
        state.anniversaryDate = convertTimeStampToDateString(
          anniversaryDate,
          "DD/MM/YYYY"
        );
      }

      if (dms_C_Or_A_Dto.annualRevenue && dms_C_Or_A_Dto.annualRevenue != "") {
        state.approx_annual_income = dms_C_Or_A_Dto.annualRevenue;
      }

      if (dms_C_Or_A_Dto.company && dms_C_Or_A_Dto.company != "") {
        state.company_name = dms_C_Or_A_Dto.company;
      }

      if (dms_C_Or_A_Dto.customerType && dms_C_Or_A_Dto.customerType != "") {
        state.customer_type = dms_C_Or_A_Dto.customerType;
      }

      if (dms_C_Or_A_Dto.designation && dms_C_Or_A_Dto.designation != "") {
        state.designation = dms_C_Or_A_Dto.designation;
      }

      if (
        dms_C_Or_A_Dto.kmsTravelledInMonth &&
        dms_C_Or_A_Dto.kmsTravelledInMonth != ""
      ) {
        state.kms_travelled_month = dms_C_Or_A_Dto.kmsTravelledInMonth;
      }

      if (
        dms_C_Or_A_Dto.membersInFamily &&
        dms_C_Or_A_Dto.membersInFamily != ""
      ) {
        state.members = dms_C_Or_A_Dto.membersInFamily;
      }

      if (dms_C_Or_A_Dto.occupation && dms_C_Or_A_Dto.occupation != "") {
        state.occupation = dms_C_Or_A_Dto.occupation;
      }

      if (
        dms_C_Or_A_Dto.primeExpectationFromCar &&
        dms_C_Or_A_Dto.primeExpectationFromCar != ""
      ) {
        state.prime_expectation_from_car =
          dms_C_Or_A_Dto.primeExpectationFromCar;
      }

      if (dms_C_Or_A_Dto.whoDrives && dms_C_Or_A_Dto.whoDrives != "") {
        state.who_drives = dms_C_Or_A_Dto.whoDrives;
      }

      if (
        dms_C_Or_A_Dto.referedByFirstname &&
        dms_C_Or_A_Dto.referedByFirstname != ""
      ) {
        state.rf_by_first_name = dms_C_Or_A_Dto.referedByFirstname;
      }

      if (
        dms_C_Or_A_Dto.referedByLastname &&
        dms_C_Or_A_Dto.referedByLastname != ""
      ) {
        state.rf_by_last_name = dms_C_Or_A_Dto.referedByLastname;
      }

      if (
        dms_C_Or_A_Dto.refferedMobileNo &&
        dms_C_Or_A_Dto.refferedMobileNo != ""
      ) {
        state.rf_by_mobile = dms_C_Or_A_Dto.refferedMobileNo;
      }

      if (
        dms_C_Or_A_Dto.refferedSource &&
        dms_C_Or_A_Dto.refferedSource != ""
      ) {
        state.rf_by_source = dms_C_Or_A_Dto.refferedSource;
      }

      if (
        dms_C_Or_A_Dto.reffered_Sourcelocation &&
        dms_C_Or_A_Dto.reffered_Sourcelocation != ""
      ) {
        state.rf_by_source_location = dms_C_Or_A_Dto.reffered_Sourcelocation;
      }
    },
    updateDmsLeadDtoData: (state, action) => {
      const dmsLeadDto = action.payload;

      if (dmsLeadDto.buyerType && dmsLeadDto.buyerType != "") {
        state.buyer_type = dmsLeadDto.buyerType;
      }

      if (dmsLeadDto.enquiryCategory && dmsLeadDto.enquiryCategory != "") {
        state.enquiry_category = dmsLeadDto.enquiryCategory;
      }

      if (dmsLeadDto.enquirySegment && dmsLeadDto.enquirySegment != "") {
        state.enquiry_segment = dmsLeadDto.enquirySegment;
      }

      if (state.customer_types_response && state.enquiry_segment) {
        state.customer_types_data =
          state.customer_types_response[state.enquiry_segment.toLowerCase()];
      }

      if (dmsLeadDto.enquirySource && dmsLeadDto.enquirySource != "") {
        state.source_of_enquiry = dmsLeadDto.enquirySource;
      }

      if (dmsLeadDto.subSource && dmsLeadDto.subSource != "") {
        state.sub_source_of_enquiry = dmsLeadDto.subSource;
      }

      if (dmsLeadDto.gstNumber && dmsLeadDto.gstNumber != "") {
        state.gstin_number = dmsLeadDto.gstNumber;
      }

      if (dmsLeadDto.eventCode && dmsLeadDto.eventCode != "") {
        state.event_code = dmsLeadDto.eventCode;
      }

      if (
        dmsLeadDto.dmsExpectedDeliveryDate &&
        dmsLeadDto.dmsExpectedDeliveryDate != ""
      ) {
        const deliveryDate = dmsLeadDto.dmsExpectedDeliveryDate;
        state.expected_delivery_date = deliveryDate;
      }
      if (dmsLeadDto.model && dmsLeadDto.model != "") {
        state.model = dmsLeadDto.model;
      }

      if (dmsLeadDto.dmsLeadProducts && dmsLeadDto.dmsLeadProducts.length != 0)
        state.dmsLeadProducts = dmsLeadDto.dmsLeadProducts;

      // documentType: dmsLeadDto.documentType === null ? '' : dmsLeadDto.documentType,
      // modeOfPayment: dmsLeadDto.modeOfPayment === null ? '' : dmsLeadDto.modeOfPayment,
    },
    updateDmsAddressData: (state, action) => {
      const dmsAddresses = action.payload;
      if (dmsAddresses.length == 2) {
        dmsAddresses.forEach((address) => {
          if (address.addressType === "Communication") {
            if (address.pincode && address.pincode != "") {
              state.pincode = address.pincode;
            }

            if (address.houseNo && address.houseNo != "") {
              state.houseNum = address.houseNo;
            }

            if (address.street && address.street != "") {
              state.streetName = address.street;
            }

            if (address.village && address.village != "") {
              state.village = address.village;
            }

            if (address.mandal && address.mandal != "") {
              state.mandal = address.mandal;
            }

            if (address.city && address.city != "") {
              state.city = address.city;
            }

            if (address.district && address.district != "") {
              state.district = address.district;
            }

            if (address.state && address.state != "") {
              state.state = address.state;
            }

            let urbanOrRural = 0;
            if (address.urban) {
              urbanOrRural = 1;
            } else if (address.rural) {
              urbanOrRural = 2;
            }
            state.urban_or_rural = urbanOrRural;
          } else if (address.addressType === "Permanent") {
            if (address.pincode && address.pincode != "") {
              state.p_pincode = address.pincode;
            }

            if (address.houseNo && address.houseNo != "") {
              state.p_houseNum = address.houseNo;
            }

            if (address.street && address.street != "") {
              state.p_streetName = address.street;
            }

            if (address.village && address.village != "") {
              state.p_village = address.village;
            }

            if (address.mandal && address.mandal != "") {
              state.p_mandal = address.mandal;
            }

            if (address.city && address.city != "") {
              state.p_city = address.city;
            }

            if (address.district && address.district != "") {
              state.p_district = address.district;
            }

            if (address.state && address.state != "") {
              state.p_state = address.state;
            }

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
    clearPermanentAddr: (state, action) => {
      state.p_pincode = "";
      state.p_houseNum = "";
      state.p_streetName = "";
      state.p_village = "";
      state.p_mandal = "";
      state.p_city = "";
      state.p_district = "";
      state.p_state = "";
      state.p_urban_or_rural = 0;
    },
    updateModelSelectionData: (state, action) => {
      const dmsLeadProducts = action.payload;

      let dataObj: any = {};
      // if (dmsLeadProducts.length > 0) {
      //   dataObj = { ...dmsLeadProducts[0] };
      //  // dmsLeadProducts[0] = dmsLeadProducts[0]
      //  // dmsLeadProducts[1]= dmsLeadProducts[0]
      //   // const dms = [{ "color": "Outback Bronze", "fuel": "Petrol", "id": 2704, "model": "Kwid",
      //   //  "transimmisionType": "Manual", "variant": "KWID RXT 1.0L EASY- R BS6 ORVM MY22" },
      //   //   { "color": "Caspian Blue", "fuel": "Petrol", "id": 1833, "model": "Kiger", "transimmisionType": "Automatic",
      //   //   "variant": "Rxt 1.0L Ece Easy-R Ece My22" }]
      //   alert("hiii")
      //   state.dmsLeadProducts = dmsLeadProducts

      //  // state.dmsLeadProducts[1] = dmsLeadProducts[0]
      // }
      // state.lead_product_id = dataObj.id ? dataObj.id : 0;
      // if (dataObj.model) {
      //   state.model = dataObj.model;
      // }
      // state.varient = dataObj.variant ? dataObj.variant : "";
      // state.color = dataObj.color ? dataObj.color : "";
      // state.fuel_type = dataObj.fuel ? dataObj.fuel : "";
      // state.transmission_type = dataObj.transimmisionType
      //   ? dataObj.transimmisionType
      //   : "";
      try {
        if (dmsLeadProducts && dmsLeadProducts.length != 0) {
          state.dmsLeadProducts = dmsLeadProducts;
        } else {
          state.dmsLeadProducts = [];
        }
        state.model_drop_down_data_update_statu = "update";
      } catch (error) {
        // alert(error)
      }
    },
    updateFinancialData: (state, action) => {
      const dmsfinancedetails = action.payload;
      let dataObj: any = {};
      if (dmsfinancedetails.length > 0) {
        dataObj = { ...dmsfinancedetails[0] };
      }

      if (dataObj.financeType && dataObj.financeType != "") {
        state.retail_finance = dataObj.financeType;
      }

      if (dataObj.financeCategory && dataObj.financeCategory != "") {
        state.finance_category = dataObj.financeCategory;
      }

      if (dataObj.downPayment && dataObj.downPayment != "") {
        state.down_payment = dataObj.downPayment.toString();
      }

      if (dataObj.loanAmount && dataObj.loanAmount != "") {
        state.loan_amount = dataObj.loanAmount.toString();
      }

      if (dataObj.financeCompany && dataObj.financeCompany != "") {
        state.bank_or_finance = dataObj.financeCompany;
      }

      if (dataObj.financeCompany && dataObj.financeCompany != "") {
        state.bank_or_finance_name = dataObj.financeCompany;
      }

      if (dataObj.rateOfInterest && dataObj.rateOfInterest != "") {
        state.rate_of_interest = dataObj.rateOfInterest;
      }

      if (dataObj.expectedTenureYears && dataObj.expectedTenureYears != "") {
        state.loan_of_tenure = dataObj.expectedTenureYears;
      }

      if (dataObj.emi && dataObj.emi != "") {
        state.emi = dataObj.emi.toString();
      }

      if (dataObj.annualIncome && dataObj.annualIncome != "") {
        state.approx_annual_income = dataObj.annualIncome;
      }

      if (dataObj.location && dataObj.location != "") {
        state.location = dataObj.location;
      }

      if (dataObj.financeCompany && dataObj.financeCompany != "") {
        state.leashing_name = dataObj.financeCompany;
      }
    },
    updateCustomerNeedAnalysisData: (state, action) => {
      const dmsLeadScoreCards = action.payload;
      let dataObj: any = {};
      if (dmsLeadScoreCards.length > 0) {
        dataObj = { ...dmsLeadScoreCards[0] };
      }
      if (
        dataObj.lookingForAnyOtherBrand &&
        dataObj.lookingForAnyOtherBrand != ""
      ) {
        state.c_looking_for_any_other_brand_checked =
          dataObj.lookingForAnyOtherBrand;
      }

      if (dataObj.brand && dataObj.brand != "") {
        state.c_make = dataObj.brand;
      }

      if (dataObj.model && dataObj.model != "") {
        state.c_model = dataObj.model;
      }

      if (dataObj.otherMake && dataObj.otherMake != "") {
        state.c_make_other_name = dataObj.otherMake;
      }

      if (dataObj.otherModel && dataObj.otherModel != "") {
        state.c_model_other_name = dataObj.otherModel;
      }

      if (dataObj.variant && dataObj.variant != "") {
        state.c_variant = dataObj.variant;
      }

      if (dataObj.color && dataObj.color != "") {
        state.c_color = dataObj.color;
      }

      if (dataObj.fuel && dataObj.fuel != "") {
        state.c_fuel_type = dataObj.fuel;
      }
      // TODO:- Need to check transmission type in response
      if (dataObj.transmissionType && dataObj.transmissionType != "") {
        state.c_transmission_type = dataObj.transmissionType;
      }

      if (dataObj.priceRange && dataObj.priceRange != "") {
        state.c_price_range = dataObj.priceRange;
      }

      if (
        dataObj.onRoadPriceanyDifference &&
        dataObj.onRoadPriceanyDifference != ""
      ) {
        state.c_on_road_price = dataObj.onRoadPriceanyDifference;
      }

      if (dataObj.dealershipName && dataObj.dealershipName != "") {
        state.c_dealership_name = dataObj.dealershipName;
      }

      if (dataObj.dealershipLocation && dataObj.dealershipLocation != "") {
        state.c_dealership_location = dataObj.dealershipLocation;
      }

      if (
        dataObj.decisionPendingReason &&
        dataObj.decisionPendingReason != ""
      ) {
        state.c_dealership_pending_reason = dataObj.decisionPendingReason;
      }

      if (
        dataObj.voiceofCustomerRemarks &&
        dataObj.voiceofCustomerRemarks != ""
      ) {
        state.c_voice_of_customer_remarks = dataObj.voiceofCustomerRemarks;
      }
    },
    updateAdditionalOrReplacementBuyerData: (state, action) => {
      const dmsExchagedetails = action.payload;
      let dataObj: any = {};
      if (dmsExchagedetails.length > 0) {
        dataObj = dmsExchagedetails[0];
      }
      if (dataObj.buyerType === "Additional Buyer") {
        state.a_make = dataObj.brand ? dataObj.brand : "";
        state.a_model = dataObj.model ? dataObj.model : "";
        state.a_varient = dataObj.varient ? dataObj.varient : "";
        state.a_color = dataObj.color ? dataObj.color : "";
        state.a_reg_no = dataObj.regNo ? dataObj.regNo : "";
      } else if (
        dataObj.buyerType === "Replacement Buyer" ||
        dataObj.buyerType === "Exchange Buyer"
      ) {
        state.r_reg_no = dataObj.regNo ? dataObj.regNo : "";
        state.regDocumentKey = dataObj.regDocumentKey ? dataObj.regDocumentKey : "";
        state.regDocumentPath = dataObj.regDocumentPath ? dataObj.regDocumentPath : "";
        state.insuranceDocumentKey = dataObj.insuranceDocumentKey ? dataObj.insuranceDocumentKey : "";
        state.insuranceDocumentPath = dataObj.insuranceDocumentPath ? dataObj.insuranceDocumentPath : "";
        state.r_make = dataObj.brand ? dataObj.brand : "";
        state.r_model = dataObj.model ? dataObj.model : "";
        state.r_varient = dataObj.varient ? dataObj.varient : "";
        state.r_color = dataObj.color ? dataObj.color : "";
        state.r_fuel_type = dataObj.fuelType ? dataObj.fuelType : "";
        state.r_transmission_type = dataObj.transmission
          ? dataObj.transmission
          : "";

        const yearOfManfac = dataObj.yearofManufacture
          ? dataObj.yearofManufacture
          : "";
        state.rmfgYear = yearOfManfac;
        if (isNaN(yearOfManfac)) {
          state.r_mfg_year = yearOfManfac;
        } else {
          state.r_mfg_year = convertTimeStampToDateString(
            yearOfManfac,
            "MM-YYYY"
          );
        }


        state.r_kms_driven_or_odometer_reading = dataObj.kiloMeters
          ? dataObj.kiloMeters
          : "";
        state.r_expected_price = dataObj.expectedPrice
          ? dataObj.expectedPrice.toString()
          : "";

        state.r_hypothication_checked = dataObj.hypothicationRequirement
          ? dataObj.hypothicationRequirement
          : false;
        state.r_hypothication_name = dataObj.hypothication
          ? dataObj.hypothication
          : "";
        state.r_hypothication_branch = dataObj.hypothicationBranch
          ? dataObj.hypothicationBranch
          : "";

        const registrationDate = dataObj.registrationDate
          ? dataObj.registrationDate
          : "";

        state.r_registration_date =
          convertTimeStringToDate(registrationDate, "DD/MM/YYYY") ||
          registrationDate;

        const registrationValidityDate = dataObj.registrationValidityDate
          ? dataObj.registrationValidityDate
          : "";

        state.r_registration_validity_date =
          convertTimeStringToDate(registrationValidityDate, "DD/MM/YYYY") ||
          registrationValidityDate;

        state.r_insurence_checked = dataObj.insuranceAvailable
          ? dataObj.insuranceAvailable === "true"
            ? true
            : false
          : false;
        state.r_insurence_document_checked = dataObj.insuranceDocumentAvailable
          ? dataObj.insuranceDocumentAvailable
          : false;
        state.r_insurence_company_name = dataObj.insuranceCompanyName
          ? dataObj.insuranceCompanyName
          : "";
        state.r_insurence_type = dataObj.insuranceType
          ? dataObj.insuranceType
          : "";
        state.warranty = dataObj.warrantyName ? dataObj.warrantyName : "";
        const insurenceFromDate = dataObj.insuranceFromDate
          ? dataObj.insuranceFromDate
          : "";
        state.r_insurence_from_date =
          convertTimeStringToDate(insurenceFromDate, "DD/MM/YYYY") ||
          insurenceFromDate;
        const insurenceToDate = dataObj.insuranceToDate
          ? dataObj.insuranceToDate
          : "";
        state.r_insurence_expiry_date =
          convertTimeStringToDate(insurenceToDate, "DD/MM/YYYY") ||
          insurenceToDate;
        state.r_insurence_to_date =
          convertTimeStringToDate(insurenceToDate, "DD/MM/YYYY") ||
          insurenceToDate;
      }
    },
    updateDmsAttachmentDetails: (state, action) => {
      const dmsAttachments = action.payload;
      // state.pan_number = "";
      // state.adhaar_number = "";
      if (dmsAttachments.length > 0) {
        let newArr = [];
        dmsAttachments.forEach((item, index) => {
          let isAvailableIndex = newArr.findIndex(element => element === item.documentType);
          if (isAvailableIndex < 0) {
            newArr.push(item.documentType);
            switch (item.documentType) {
              case "pan":
                if (item.documentNumber && item.documentNumber != "") {
                  state.pan_number = item.documentNumber;
                }
                break;
              case "aadhar":
                if (item.documentNumber && item.documentNumber != "") {
                  state.adhaar_number = item.documentNumber;
                }
                break;
              case "employeeId":
                if (item.documentNumber && item.documentNumber != "") {
                  state.employee_id = item.documentNumber;
                }
              case "gstNumber":
                if (item.documentNumber && item.documentNumber != "") {
                  state.gstin_number = item.documentNumber;
                }
                break;
            }
          }
        });
      }
    },
    updateFuelAndTransmissionType: (state, action) => {
      state.fuel_type = action.payload.fuelType;
      state.transmission_type = action.payload.transmissionType;
    },
    updateStatus: (state, action) => {
      state.get_pending_tasks_response_status = "";
      state.get_pending_tasks_response_list = [];
    },
    updateAddressByPincode: (state, action) => {

      state.village = action.payload.Block || "";

      state.mandal = state.mandal ? state.mandal : action.payload.Mandal || "";
      // state.mandal = action.payload.Block || ""
      state.city = action.payload.District || "";
      state.district = action.payload.District || "";
      state.state = action.payload.State || "";
      state.isAddressSet = true;
      if (state.is_permanent_address_same === "YES") {
        state.p_village = action.payload.Block || "";
        state.p_mandal = state.mandal
          ? state.mandal
          : action.payload.Mandal || "";
        // state.mandal = action.payload.Block || ""
        state.p_city = action.payload.District || "";
        state.p_district = action.payload.District || "";
        state.p_state = action.payload.State || "";
      }
    },
    updateAddressByPincode2: (state, action) => {
      state.p_village = action.payload.Block || "";
      state.p_mandal = state.p_mandal
        ? state.p_mandal
        : action.payload.Mandal || "";
      // state.mandal = action.payload.Block || ""
      state.p_city = action.payload.District || "";
      state.p_district = action.payload.District || "";
      state.p_state = action.payload.State || "";
      // state.isAddressSet = true
    },
    updateRefNo: (state, action) => {
      state.refNo = action.payload;
    },
    setOfferPriceDataForSelectedProforma: (state ,action) =>{
     
      let oth_performa_column = action.payload;
      
      if(action.payload){
        state.consumer_offer = oth_performa_column.special_scheme 
        ? oth_performa_column.special_scheme.toString(): "";

        state.exchange_offer = oth_performa_column.exchange_offers 
        ? oth_performa_column.exchange_offers.toString(): "";
      
        state.corporate_offer = oth_performa_column.corporate_offer
          ? oth_performa_column.corporate_offer.toString() : "";
        
        state.promotional_offer = oth_performa_column.promotional_offers
          ? oth_performa_column.promotional_offers.toString() : "";

        state.cash_discount = oth_performa_column.cash_discount
          ? oth_performa_column.cash_discount.toString() : "";

        state.for_accessories = oth_performa_column.foc_accessories
          ? oth_performa_column.foc_accessories.toString() : "";

        state.foc_accessoriesFromServer = oth_performa_column.foc_accessories
          ? oth_performa_column.foc_accessories.toString() : "";

        state.additional_offer_1 = oth_performa_column.additional_offer1
          ? oth_performa_column.additional_offer1.toString() : "";

        state.additional_offer_2 = oth_performa_column.additional_offer2
          ? oth_performa_column.additional_offer2.toString() : "";

        state.accessories_discount = oth_performa_column.accessories_discount
          ? oth_performa_column.accessories_discount.toString() : "";

        state.insurance_discount = oth_performa_column.insurance_discount
          ? oth_performa_column.insurance_discount.toString() : "";
      }
    },

    clearOfferPriceData: (state,action)=>{
      
      state.consumer_offer = "";
      state.exchange_offer = "";
      state.corporate_offer = "";
      state.promotional_offer = "";
      state.cash_discount = "";
      state.for_accessories = "";
      state.additional_offer_1 = "";
      state.additional_offer_2 = "";
      state.accessories_discount = "",
        state.insurance_discount = ""
    },
    setOfferPriceDetails: (
      state,
      action: PayloadAction<PersonalIntroModel>
    ) => {
      const { key, text } = action.payload;
      switch (key) {
        case "CONSUMER_OFFER":
          state.consumer_offer = text;
          break;
        case "EXCHANGE_OFFER":
          state.exchange_offer = text;
          break;
        case "CORPORATE_OFFER":
          state.corporate_offer = text;
          break;
        case "PROMOTIONAL_OFFER":
          state.promotional_offer = text;
          break;
        case "CASH_DISCOUNT":
          state.cash_discount = text;
          break;
        case "FOR_ACCESSORIES":
          state.for_accessories = text;
          break;
        case "ADDITIONAL_OFFER_1":
          state.additional_offer_1 = text;
          break;
        case "ADDITIONAL_OFFER_2":
          state.additional_offer_2 = text;
          break;
        case "ACCESSORIES_DISCOUNT":
          state.accessories_discount = text;
          break;
        case "INSURANCE_DISCOUNT":
          state.insurance_discount = text;
          break;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getEnquiryDetailsApi.pending, (state) => {
      state.isLoading = true;
      state.enquiry_details_response = null;
    });
    builder.addCase(getEnquiryDetailsApi.fulfilled, (state, action) => {
      // if (action.payload.dmsEntity) {
      //  state.enquiry_details_response = action.payload.dmsEntity;
      state.enquiry_details_response = action.payload;
      state.isOpened = true;
      
      // }
      state.isLoading = false;
    });
    builder.addCase(getEnquiryDetailsApi.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getLogoNameApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getLogoNameApi.fulfilled, (state, action) => {
      // if (action.payload.dmsEntity) {
      //  state.enquiry_details_response = action.payload.dmsEntity;
      const data = action.payload;
      if (data && data.orgName) {
       
        state.proforma_orgName = data.orgName;
        state.proforma_logo = data.url;
        state.proforma_branch = data.branchName;
        state.proforma_city = data.city;
        state.proforma_state = data.state;
        state.proforma_pincode = data.pincode;
        state.proforma_gstnNumber = data.gstnNumber;
        state.proforma_houseNo = data.houseNo;
        state.proforma_address = `${data.houseNo}  ${data.street}`;
        state.profprma_street = data.street;
      }
      state.isLoading = false;
    });
    builder.addCase(getLogoNameApi.rejected, (state, action) => {
      state.isLoading = false;
    });


    builder.addCase(getProformaListingDetailsApi.pending, (state) => {
      state.isLoading = true;
      state.proforma_listingdata = [];
    });
    builder.addCase(getProformaListingDetailsApi.fulfilled, (state, action) => {
      
      const data = action.payload;
      if(data){
        state.proforma_listingdata = data;
      }
      state.isLoading = false;
    });
    builder.addCase(getProformaListingDetailsApi.rejected, (state, action) => {
      state.isLoading = false;
      state.proforma_listingdata = [];
    });


    
    builder.addCase(
      getOnRoadPriceAndInsurenceDetailsApi.pending,
      (state, action) => {
        state.vehicle_on_road_price_insurence_details_response = null;
        state.isLoading = true;
      }
    );
    builder.addCase(
      getOnRoadPriceAndInsurenceDetailsApi.fulfilled,
      (state, action) => {
        

        if (action.payload) {
          state.vehicle_on_road_price_insurence_details_response =
            action.payload;
          if (action.payload.insuranceAddOn.length > 0) {
            let addOnNames = "",
              price = 0;

            action.payload.insuranceAddOn.forEach((element, index) => {
              addOnNames +=
                element.add_on_price[0].document_name +
                (index + 1 < action.payload.insuranceAddOn.length ? ", " : "");
              price += Number(element.add_on_price[0].cost);
            });
            // state.add_on_insurance = addOnNames;
            if (state.insurance_type !== "" && state.add_on_insurance) {
              state.addOnPrice = price;
            }
          }
        }
        state.isLoading = false;
      }
    );
    builder.addCase(
      getOnRoadPriceAndInsurenceDetailsApi.rejected,
      (state, action) => {
        state.vehicle_on_road_price_insurence_details_response = null;
        state.isLoading = false;
      }
    );
    builder.addCase(postProformaInvoiceDetails.pending, (state) => {
      state.isLoading = true ;
      state.proforma_API_response = "pending";
      state.proforma_API_respData = "";
    });
    builder.addCase(postProformaInvoiceDetails.fulfilled, (state, action) => {
      // if (action.payload.dmsEntity) {
      //  state.enquiry_details_response = action.payload.dmsEntity;
      if(action.payload){
     
        

      if (action.payload && action.payload.crmUniversalId &&
         action.payload.performa_status ==="ENQUIRYCOMPLETED"){

        showToast("Proforma invoice saved successfully"); 
        state.proforma_API_response = "ENQUIRYCOMPLETED";
        state.proforma_API_respData = action.payload;

      } else if (action.payload.performa_status === "SENTFORAPPROVAL"){

        showToast("Proforma invoice sent for approval"); 
        state.proforma_API_response = "SENTFORAPPROVAL";
        state.proforma_API_respData = action.payload;

      } else if (action.payload.performa_status === "APPROVED"){

        state.proforma_API_response = "APPROVED";
        showToast("Proforma invoice approved successfully"); 
        state.proforma_API_respData = action.payload;

      } else if (action.payload.performa_status === "REJECTED") {

        showToast("Proforma invoice rejected successfully");
        state.proforma_API_response = "REJECTED";
        state.proforma_API_respData = action.payload;

      }

        state.isLoading = false;
        // state.proforma_API_response = "fullfilled";
    }
        // showToast("Successfully updated");
     
      // state.enquiry_details_response = action.payload;
      // state.isOpened = true
      // }
    });
    builder.addCase(postProformaInvoiceDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.proforma_API_response = "rejected";
      state.proforma_API_respData ="";
    });
    builder.addCase(getEnquiryDetailsApiAuto.pending, (state) => {
      state.isLoading = true;
      state.enquiry_details_response = null;
    });
    builder.addCase(getEnquiryDetailsApiAuto.fulfilled, (state, action) => {
      // if (action.payload.dmsEntity) {
      //  state.enquiry_details_response = action.payload.dmsEntity;
      state.enquiry_details_response = action.payload;
      state.isOpened = true;
      // }
      state.isLoading = false;
    });
    builder.addCase(getEnquiryDetailsApiAuto.rejected, (state, action) => {
      state.isLoading = false;
    });
    // Update Enquiry Details
    builder.addCase(getAutoSaveEnquiryDetailsApi.pending, (state, action) => {
      state.isLoading = true;
      // state.enquiry_details_response = null;
    });
    builder.addCase(getAutoSaveEnquiryDetailsApi.fulfilled, (state, action) => {
      if (action.payload) {
        // state.enquiry_details_response = action.payload;
      }

      state.isLoading = false;
    });
    builder.addCase(getAutoSaveEnquiryDetailsApi.rejected, (state, action) => {
      state.isLoading = false;
    });
    // Update Enquiry Details
    builder.addCase(updateEnquiryDetailsApi.pending, (state, action) => {
      state.update_enquiry_details_response = "pending";
      state.isLoading = true;
    });
    builder.addCase(updateEnquiryDetailsApi.fulfilled, (state, action) => {
      if (action.payload.success == true) {
        state.refNo = action.payload.dmsEntity.dmsLeadDto.referencenumber;
        state.update_enquiry_details_response = "success";
      }
      state.isLoading = false;
    });
    builder.addCase(updateEnquiryDetailsApi.rejected, (state, action) => {
      if (action.payload["message"] != undefined) {
        showToastRedAlert(action.payload["message"]);
      }
      state.update_enquiry_details_response = "failed";
      state.isLoading = false;
    });
    // Drop Enquiry
    builder.addCase(dropEnquiryApi.pending, (state, action) => {
      state.enquiry_drop_response_status = "pending";
      state.isLoading = true;
    });
    builder.addCase(dropEnquiryApi.fulfilled, (state, action) => {
      if (action.payload.status === "SUCCESS") {
        state.enquiry_drop_response_status = "success";
      }
      state.isLoading = false;
    });
    builder.addCase(dropEnquiryApi.rejected, (state, action) => {
      state.enquiry_drop_response_status = "failed";
      state.isLoading = false;
    });
    // Get Pending Tasks
    builder.addCase(getPendingTasksApi.pending, (state, action) => {
      state.get_pending_tasks_response_status = "pending";
      state.get_pending_tasks_response_list = [];
      state.isLoading = true;
    });
    builder.addCase(getPendingTasksApi.fulfilled, (state, action) => {
      if (action.payload.success === true) {
        state.get_pending_tasks_response_status = "success";
        state.get_pending_tasks_response_list = action.payload.dmsEntity.tasks;
      }
      state.isLoading = false;
    });
    builder.addCase(getPendingTasksApi.rejected, (state, action) => {
      state.get_pending_tasks_response_status = "failed";
      state.get_pending_tasks_response_list = [];
      state.isLoading = false;
    });
    // Get Customer Types
    builder.addCase(getCustomerTypesApi.pending, (state, action) => {
      state.customer_types_response = null;
      state.isLoading = true;
    });
    builder.addCase(getCustomerTypesApi.fulfilled, (state, action) => {
      if (action.payload) {
        const customerTypes = action.payload;
        let personalTypes = [];
        let commercialTypes = [];
        let companyTypes = [];
        customerTypes.forEach((customer) => {
          const obj = { id: customer.id, name: customer.customerType };
          if (customer.customerType === "Fleet") {
            commercialTypes.push(obj);
          } else if (customer.customerType === "Institution") {
            companyTypes.push(obj);
          } else {
            personalTypes.push(obj);
          }
        });
        const obj = {
          personal: personalTypes,
          commercial: commercialTypes,
          company: companyTypes,
          handicapped: companyTypes,
        };
        state.customer_types_response = obj;
      }
      state.isLoading = false;
    });
    builder.addCase(getCustomerTypesApi.rejected, (state, action) => {
      state.customer_types_response = null;
      state.isLoading = false;
    });
    //update ref number
    builder.addCase(updateRef.pending, (state, action) => {});
    builder.addCase(updateRef.fulfilled, (state, action) => {});
    builder.addCase(updateRef.rejected, (state, action) => {});
    builder.addCase(
      updateEnquiryDetailsApiAutoSave.pending,
      (state, action) => {}
    );
    builder.addCase(
      updateEnquiryDetailsApiAutoSave.fulfilled,
      (state, action) => {
        state.isLoading = false;
      }
    );
    builder.addCase(
      updateEnquiryDetailsApiAutoSave.rejected,
      (state, action) => {}
    );

    // Get terms and conditions org wise
    builder.addCase(getTermsAndConditionsOrgwise.pending, (state, action) => {
      state.getTermsNConditions_res_status = "pending";
      state.getTermsNConditions_res = [];
      state.isLoading = true;
    });
    builder.addCase(getTermsAndConditionsOrgwise.fulfilled, (state, action) => {
      if (action.payload) {
        state.getTermsNConditions_res_status = "success";
        state.getTermsNConditions_res = action.payload;
      }
      state.isLoading = false;
    });
    builder.addCase(getTermsAndConditionsOrgwise.rejected, (state, action) => {
      state.getTermsNConditions_res_status = "failed";
      state.getTermsNConditions_res = [];
      state.isLoading = false;
    });
  },
});

export const {
  clearStateData,
  clearState,
  clearState2,
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
  updateDmsAttachmentDetails,
  updateAddressByPincode,
  updateRefNo,
  updateStatus,
  clearPermanentAddr,
  updateAddressByPincode2,
  updatedmsLeadProduct,
  setOfferPriceDetails,
  setOfferPriceDataForSelectedProforma,
  clearOfferPriceData, 
} = enquiryDetailsOverViewSlice.actions;
export default enquiryDetailsOverViewSlice.reducer;
