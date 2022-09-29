import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";

import {
  Form_Types,
} from "../jsonData/prebookingFormScreenJsonData";
import {
  Salutation_Types,
  Enquiry_Segment_Data,
  Gender_Data_Obj,
} from "../jsonData/enquiryFormScreenJsonData";
import { convertTimeStampToDateString } from "../utils/helperFunctions";
import { showToastRedAlert } from "../utils/toast";
import moment from "moment";
import {
  CustomerTypesObj,
  CustomerTypesObj21,
  CustomerTypesObj22
} from "../jsonData/preEnquiryScreenJsonData";

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

export const getPrebookingDetailsApi = createAsyncThunk("PREBOONING_FORMS_SLICE/getPrebookingDetailsApi", async (universalId, { rejectWithValue }) => {
  console.log("%$%$%$%$:", URL.ENQUIRY_DETAILS(universalId));

  const response = await client.get(URL.ENQUIRY_DETAILS(universalId));
  try {
    const json = await response.json();

    if (response.status != 200) {
      return rejectWithValue(json);
    }
    return json;
  } catch (error) {
    console.error("getPrebookingDetailsApi JSON parse error: ", error + " : " + JSON.stringify(response));
    return rejectWithValue({ message: "Json parse error: " + JSON.stringify(response) });
  }
})

export const updatePrebookingDetailsApi = createAsyncThunk("PREBOONING_FORMS_SLICE/updatePrebookingDetailsApi", async (payload, { rejectWithValue }) => {
console.log({payload})
  const response = await client.post(URL.UPDATE_ENQUIRY_DETAILS(), payload);
  try {
    const json = await response.json();
    // console.log("DATA:", JSON.stringify(json));

    if (response.status != 200) {
      return rejectWithValue(json);
    }
    return json;
  } catch (error) {
    console.error("updatePrebookingDetailsApi JSON parse error: ", error + " : " + JSON.stringify(response));
    return rejectWithValue({ message: "Json parse error: " + JSON.stringify(response) });
  }
})

export const getOnRoadPriceAndInsurenceDetailsApi = createAsyncThunk("PREBOONING_FORMS_SLICE/getOnRoadPriceAndInsurenceDetailsApi", async (payload, { rejectWithValue }) => {
  console.log("PAYLOAD:", URL.GET_ON_ROAD_PRICE_AND_INSURENCE_DETAILS(payload["varientId"], payload["orgId"]), JSON.stringify(payload));

  const response = await client.get(URL.GET_ON_ROAD_PRICE_AND_INSURENCE_DETAILS(payload["varientId"], payload["orgId"]));
  try {
    const json = await response.json();
    // console.log("INSURANCE:", JSON.stringify(json));

    if (response.status != 200) {
      return rejectWithValue(json);
    }
    return json;
  } catch (error) {
    showToastRedAlert(`Value not found for varient id: ${payload["varientId"]} and org id: ${payload["orgId"]}`)
    console.error("PRE-BOOKING getOnRoadPriceAndInsurenceDetailsApi JSON parse error: ", error + " : " + JSON.stringify(response));
    return rejectWithValue({ message: "Json parse error: " + JSON.stringify(response) });
  }
})

export const dropPreBooingApi = createAsyncThunk("PREBOONING_FORMS_SLICE/dropPreBooingApi", async (payload, { rejectWithValue }) => {

  console.log("DROP PAYLOAD: ", URL.DROP_ENQUIRY(), payload);

  const response = await client.post(URL.DROP_ENQUIRY(), payload);
  try {
    const json = await response.json();
    console.log("DROP RES: ", JSON.stringify(json));

    if (response.status != 200) {
      return rejectWithValue(json);
    }
    return json;
  } catch (error) {
    console.error("dropPreBooingApi JSON parse error: ", error + " : " + JSON.stringify(response));
    return rejectWithValue({ message: "Json parse error: " + JSON.stringify(response) });
  }
})
export const sendEditedOnRoadPriceDetails = createAsyncThunk("PREBOONING_FORMS_SLICE/sendEditedOnRoadPriceDetails", async (payload, { rejectWithValue }) => {

  console.log("PPPTTT:", URL.SEND_ON_ROAD_PRICE_DETAILS(), JSON.stringify(payload));

  const response = await client.put(URL.SEND_ON_ROAD_PRICE_DETAILS(), payload);
  try {
    const json = await response.json();
    console.log("DATA:", JSON.stringify(json));

    if (response.status != 200) {
      return rejectWithValue(json);
    }
    return json;
  } catch (error) {
    console.error("sendOnRoadPriceDetails JSON parse error: ", error + " : " + JSON.stringify(response));
    return rejectWithValue({ message: "Json parse error: " + JSON.stringify(response) });
  }
})

export const sendOnRoadPriceDetails = createAsyncThunk("PREBOONING_FORMS_SLICE/sendOnRoadPriceDetails", async (payload, { rejectWithValue }) => {

  console.log("PPPTTT:", URL.SEND_ON_ROAD_PRICE_DETAILS(), JSON.stringify(payload));

  const response = await client.post(URL.SEND_ON_ROAD_PRICE_DETAILS(), payload);
  try {
    const json = await response.json();
    console.log("DATA:", JSON.stringify(json));

    if (response.status != 200) {
      return rejectWithValue(json);
    }
    return json;
  } catch (error) {
    console.error("sendOnRoadPriceDetails JSON parse error: ", error + " : " + JSON.stringify(response));
    return rejectWithValue({ message: "Json parse error: " + JSON.stringify(response) });
  }
})

export const getCustomerTypesApi = createAsyncThunk("PREBOONING_FORMS_SLICE/getCustomerTypesApi", async (orgId, { rejectWithValue }) => {

  const response = await client.get(URL.GET_CUSTOMER_TYPES(orgId));
  try {
    const json = await response.json();
    if (response.status != 200) {
      return rejectWithValue(json);
    }
    return json;
  } catch (error) {
    console.error("getCustomerTypesApi JSON parse error: ", error + " : " + JSON.stringify(response));
    return rejectWithValue({ message: "Json parse error: " + JSON.stringify(response) });
  }
})

export const getDropDataApi = createAsyncThunk("PREBOONING_FORMS_SLICE/getDropDataApi", async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.GET_DROP_DATA(), payload);
  try {
    const json = await response.json();
    // console.log("DROP:", JSON.stringify(json));

    if (response.status != 200) {
      return rejectWithValue(json);
    }
    return json;
  } catch (error) {
    console.error("getDropDataApi JSON parse error: ", error + " : " + JSON.stringify(response));
    return rejectWithValue({ message: "Json parse error: " + JSON.stringify(response) });
  }
})

export const getDropSubReasonDataApi = createAsyncThunk("PREBOONING_FORMS_SLICE/getDropSubReasonDataApi", async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.GET_DROP_DATA(), payload);
  try {
    const json = await response.json();
    if (response.status != 200) {
      return rejectWithValue(json);
    }
    return json;
  } catch (error) {
    console.error("getDropSubReasonDataApi JSON parse error: ", error + " : " + JSON.stringify(response));
    return rejectWithValue({ message: "Json parse error: " + JSON.stringify(response) });
  }
})

export const getOnRoadPriceDtoListApi = createAsyncThunk("PREBOONING_FORMS_SLICE/getOnRoadPriceDtoListApi", async (leadId, { rejectWithValue }) => {

  const response = await client.get(URL.GET_ON_ROAD_PRICE_DTO_LIST(leadId));
  try {
    const json = await response.json();
    console.log("DATA:", JSON.stringify(json));
    if (response.status != 200) {
      return rejectWithValue(json);
    }
    return json;
  } catch (error) {
    console.error("getOnRoadPriceDtoListApi JSON parse error: ", error + " : " + JSON.stringify(response));
    return rejectWithValue({ message: "Json parse error: " + JSON.stringify(response) });
  }
})

export const preBookingPaymentApi = createAsyncThunk("PREBOONING_FORMS_SLICE/preBookingPaymentApi", async (payload, { rejectWithValue }) => {

  console.log("URL PPP", URL.PRE_BOOKING_PAYMENT(), JSON.stringify(payload));

  const response = await client.post(URL.PRE_BOOKING_PAYMENT(), payload);
  try {
    const json = await response.json();
    console.log("RES:", JSON.stringify(json));

    if (response.status != 200) {
      return rejectWithValue(json);
    }
    return json;
  } catch (error) {
    console.error("preBookingPaymentApi JSON parse error: ", error + " : " + JSON.stringify(response));
    return rejectWithValue({ message: "Json parse error: " + JSON.stringify(response) });
  }
})

export const postBookingAmountApi = createAsyncThunk("PREBOONING_FORMS_SLICE/postBookingAmountApi", async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.BOOKING_AMOUNT(), payload);
  try {
    const json = await response.json();
    console.log("postBookingAmountApi", JSON.stringify(json));

    if (response.status != 200) {
      return rejectWithValue(json);
    }
    return json;
  } catch (error) {
    console.error("postBookingAmountApi JSON parse error: ", error + " : " + JSON.stringify(response));
    return rejectWithValue({ message: "Json parse error: " + JSON.stringify(response) });
  }
})

export const getPaymentDetailsApi = createAsyncThunk("PREBOONING_FORMS_SLICE/getPaymentDetailsApi", async (leadId, { rejectWithValue }) => {
  console.log("LEAD ID:", leadId, URL.GET_PRE_BOOKING_PAYMENT_DETAILS(leadId));
  const response = await client.get(URL.GET_PRE_BOOKING_PAYMENT_DETAILS(leadId));
  try {
    const json = await response.json();
    if (response.status != 200) {
      return rejectWithValue(json);
    }
    return json;
  } catch (error) {
    console.error("getPaymentDetailsApi JSON parse error: ", error + " : " + JSON.stringify(response));
    return rejectWithValue({ message: "Json parse error: " + JSON.stringify(response) });
  }
})

export const getBookingAmountDetailsApi = createAsyncThunk("PREBOONING_FORMS_SLICE/getBookingAmountDetailsApi", async (leadId, { rejectWithValue }) => {

  const response = await client.get(URL.GET_BOOKING_AMOUNT_DETAILS(leadId));
  try {
    const json = await response.json();
    if (response.status != 200) {
      return rejectWithValue(json);
    }
    return json;
  } catch (error) {
    console.error("getBookingAmountDetailsApi JSON parse error: ", error + " : " + JSON.stringify(response));
    return rejectWithValue({ message: "Json parse error: " + JSON.stringify(response) });
  }
})

export const getAssignedTasksApi = createAsyncThunk("PREBOONING_FORMS_SLICE/getAssignedTasksApi", async (universalId, { rejectWithValue }) => {

  const url = URL.TASKS_PRE_ENQUIRY() + universalId;
  const response = await client.get(url);
  try {
    const json = await response.json();
    if (response.status != 200) {
      return rejectWithValue(json);
    }
    return json;
  } catch (error) {
    console.error("getAssignedTasksApi JSON parse error: ", error + " : " + JSON.stringify(response));
    return rejectWithValue({ message: "Json parse error: " + JSON.stringify(response) });
  }
})

export const updateRef = createAsyncThunk("ENQUIRY_FORM_SLICE/updateRef",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(URL.UPDATE_REF(), payload);
    try {
      // const json = await response.json();
      console.log("UPDATE REF", response);

      if (!response.ok) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error) {
      console.error(JSON.stringify(response));
      return rejectWithValue({ message: "Json parse error: " + JSON.stringify(response) });
    }
  }
);

interface CustomerDetailModel {
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

const prebookingFormSlice = createSlice({
  name: "PREBOONING_FORMS_SLICE",
  initialState: {
    status: "",
    isLoading: false,
    showDatepicker: false,
    showDropDownpicker: false,
    dropDownData: dropDownData,
    pre_booking_details_response: null,
    customer_types_response: null,
    vehicle_on_road_price_insurence_details_response: null,
    pre_booking_drop_response_status: null,
    update_pre_booking_details_response: "",
    on_road_price_dto_list_response: [],
    send_onRoad_price_details_response: null,
    drop_reasons_list: [],
    drop_sub_reasons_list: [],
    pre_booking_payment_response: null,
    pre_booking_payment_response_status: "",
    booking_amount_response: null,
    booking_amount_response_status: "",
    existing_payment_details_response: null,
    existing_payment_details_status: "",
    existing_booking_amount_response: null,
    existing_booking_amount_response_status: "",
    assigned_tasks_list: [],
    assigned_tasks_list_status: "",
    minDate: null,
    maxDate: null,

    datePickerKeyId: "",
    showImagePicker: false,
    imagePickerKeyId: "",

    //Customer Details
    salutation_types_data: Salutation_Types,
    gender_types_data: [],
    form_types_data: Form_Types,
    enquiry_segment_types_data: Enquiry_Segment_Data,
    customer_types_data: [],
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
    buyer_type:"",
    customer_type: "",
    marital_status: "",
    // Communication Address
    pincode: "",
    defaultAddress: "",
    urban_or_rural: 0, // 1: urban, 2:
    house_number: "",
    street_name: "",
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
    model: "",
    varient: "",
    color: "",
    fuel_type: "",
    transmission_type: "",
    dmsLeadProducts: [],

    lead_product_id: "",
    model_drop_down_data_update_status: null,
    // financial details
    retail_finance: "",
    finance_category: "",
    bank_or_finance_name: "",
    location: "",
    down_payment: "",
    loan_amount: "",
    bank_or_finance: "",
    rate_of_interest: "",
    loan_of_tenure: "",
    emi: "",
    approx_annual_income: "",
    leashing_name: "",
    // Booking payment mod
    booking_amount: "",
    payment_at: "",
    booking_payment_mode: "",
    // commitment
    customer_preferred_date: "",
    occasion: "",
    tentative_delivery_date: "",
    delivery_location: "",
    //Price Conformation
    vechicle_registration: false,
    vehicle_type: "",
    registration_number: "",
    insurance_type: "",
    add_on_insurance: "",
    warranty: "",
    //offerprice
    consumer_offer: "",
    exchange_offer: "",
    corporate_offer: "",
    promotional_offer: "",
    cash_discount: "",
    for_accessories: "",
    additional_offer_1: "",
    additional_offer_2: "",
    // Documents Upload
    form_or_pan: "",
    customer_type_category: "",
    adhaar_number: "",
    pan_number: "",
    relationship_proof: "",
    gstin_number: "",
    employee_id: "",
    // Booking Drop
    reject_remarks: "",
    // PreBooking Payment Details
    type_of_upi: "",
    transfer_from_mobile: "",
    transfer_to_mobile: "",
    utr_no: "",
    transaction_date: "",
    comapany_bank_name: "",
    cheque_number: "",
    cheque_date: "",
    dd_number: "",
    dd_date: "",
    isDataLoaded: false,
    addOnPrice: 0,
    refNo: '',
    accessories_discount: '',
    insurance_discount: '',
    isAddressSet: false
  },
  reducers: {
    clearState: (state, action) => {
      state.isLoading = false;
      state.pre_booking_details_response = null;
      state.customer_types_response = null;
      state.vehicle_on_road_price_insurence_details_response = null;
      state.pre_booking_drop_response_status = null;
      state.update_pre_booking_details_response = null;
      state.on_road_price_dto_list_response = [];
      state.send_onRoad_price_details_response = null;
      state.drop_reasons_list = [];
      state.drop_sub_reasons_list = [];
      state.pre_booking_payment_response = null;
      state.pre_booking_payment_response_status = "";
      state.existing_payment_details_response = null;
      state.existing_payment_details_status = "";
      state.existing_booking_amount_response = null;
      state.existing_booking_amount_response_status = "";
      state.assigned_tasks_list = [];
      state.assigned_tasks_list_status = "";

      // Customer Details
      state.first_name = "";
      state.last_name = "";
      state.age = "";
      state.mobile = "";
      state.email = "";
      state.date_of_birth = "";
      state.gender = "";
      state.salutation = "";
      state.enquiry_segment = "";
      state.buyer_type= "";
      state.customer_type = "";
      state.marital_status = "";
      // Communication Address
      state.pincode = "";
      state.defaultAddress = "";
      state.urban_or_rural = 0; // 1: urban, 2:
      state.house_number = "";
      state.street_name = "";
      state.village = "";
      state.mandal = "";
      state.city = "";
      state.state = "";
      state.district = "";

      state.is_permanent_address_same = "";
      state.p_pincode = "";
      state.p_urban_or_rural = 0; // 1: urban, 2:
      state.p_houseNum = "";
      state.p_streetName = "";
      state.p_village = "";
      state.p_mandal = "";
      state.p_city = "";
      state.p_state = "";
      state.p_district = "";
      // Model Selection
      state.model = "";
      state.varient = "";
      state.color = "";
      state.fuel_type = "";
      state.transmission_type = "";
      state.lead_product_id = "";
      state.dmsLeadProducts = [];
      state.model_drop_down_data_update_status = null;
      // financial details
      state.retail_finance = "";
      state.finance_category = "";
      state.bank_or_finance_name = "";
      state.location = "";
      state.down_payment = "";
      state.loan_amount = "";
      state.bank_or_finance = "";
      state.rate_of_interest = "";
      state.loan_of_tenure = "";
      state.emi = "";
      state.approx_annual_income = "";
      state.leashing_name = "";
      // Booking payment mod
      state.booking_amount = "";
      state.payment_at = "";
      state.booking_payment_mode = "";
      // commitment
      state.customer_preferred_date = "";
      state.occasion = "";
      state.tentative_delivery_date = "";
      state.delivery_location = "";
      //Price Conformation
      state.vechicle_registration = false;
      state.vehicle_type = "";
      state.registration_number = "";
      state.insurance_type = "";
      state.add_on_insurance = "";
      state.warranty = "";
      //offerprice
      state.consumer_offer = "";
      state.exchange_offer = "";
      state.corporate_offer = "";
      state.promotional_offer = "";
      state.cash_discount = "";
      state.for_accessories = "";
      state.additional_offer_1 = "";
      state.additional_offer_2 = "";
      // Documents Upload
      state.form_or_pan = "";
      state.customer_type_category = "";
      state.adhaar_number = "";
      state.pan_number = "";
      state.relationship_proof = "";
      state.gstin_number = "";
      state.employee_id = "";
      // Booking Drop
      state.reject_remarks = "";
      // PreBooking Payment Details
      state.type_of_upi = "";
      state.transfer_from_mobile = "";
      state.transfer_to_mobile = "";
      state.utr_no = "";
      state.transaction_date = "";
      state.comapany_bank_name = "";
      state.cheque_number = "";
      state.cheque_date = "";
      state.dd_number = "";
      state.dd_date = "";
      state.isDataLoaded = false
      state.addOnPrice = 0
      state.refNo = ''
      state.accessories_discount = ''
      state.insurance_discount = ''
      state.isAddressSet = false
    },
    updateStatus: (state, action) => {
      state.pre_booking_payment_response_status = "";
      state.booking_amount_response_status = ''
    },
    updatedmsLeadProduct: (state, action) => {
      // alert(JSON.stringify(action.payload))
      const data = action.payload;
      console.log("updatedmsLeadProduct: ", JSON.stringify(action.payload));
      state.dmsLeadProducts = data
    },
    setDropDownData: (state, action: PayloadAction<DropDownModelNew>) => {
      const { key, value, id, orgId } = action.payload;
      switch (key) {
        case "SALUTATION":
          if (state.salutation !== value) {
            state.gender = "";
            state.gender_types_data = Gender_Data_Obj[value.toLowerCase()];
          }
          state.salutation = value;
          break;
        case "ENQUIRY_SEGMENT":
          state.enquiry_segment = value;
          state.customer_type = "";
          // if (state.customer_types_response) {
          //   state.customer_types_data = state.customer_types_response[value.toLowerCase()];
          // }
          if(+orgId == 21){
            state.customer_types_data = CustomerTypesObj21[value.toLowerCase()];
          }
          else if( +orgId == 22){
            state.customer_types_data = CustomerTypesObj22[value.toLowerCase()];
          }
          else{
            state.customer_types_data = CustomerTypesObj[value.toLowerCase()];
          }

          break;
        case "BUYER_TYPE":
          state.buyer_type = value;
          //state.customer_type ="";
          //             if(state.customer_types_response){
          // state.customer_types_data = state.customer_types_response[value.toLowerCase()]
          //             }
          break;
        case "CUSTOMER_TYPE":
          state.customer_type = value;
          break;
        case "GENDER":
          state.gender = value;
          break;
        case "MARITAL_STATUS":
          state.marital_status = value;
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
        case "INSURANCE_TYPE":
          state.insurance_type = value;
          break;
        case "WARRANTY":
          state.warranty = value;
          break;
        case "INSURENCE_ADD_ONS":
          state.add_on_insurance = value;
          break;
        case "VEHICLE_TYPE":
          state.vehicle_type = value;
          break;
      }
    },
    setImagePicker: (state, action) => {
      state.imagePickerKeyId = action.payload;
      state.showImagePicker = !state.showImagePicker;
    },
    setDatePicker: (state, action) => {
      console.log("ACTIONDATE===>",state)
      switch (action.payload) {
        case "DATE_OF_BIRTH":
          state.minDate = null;
          state.maxDate = new Date();
          break;
        case "CUSTOMER_PREFERRED_DATE":
          state.minDate = new Date();
          state.maxDate = null;
          break;
        case "TENTATIVE_DELIVERY_DATE":
          state.minDate = new Date();
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
    updateSelectedDate: (state, action: PayloadAction<CustomerDetailModel>) => {
      const { key, text } = action.payload;
      const selectedDate = convertTimeStampToDateString(text, "DD/MM/YYYY");
      console.log("REDUXDATESELECT------>>>",selectedDate)
      switch (state.datePickerKeyId) {
        case "DATE_OF_BIRTH":
          state.date_of_birth = selectedDate;
          const given = moment(selectedDate, "DD/MM/YYYY");
          const current = moment().startOf('day');
          const total = Number(moment.duration(current.diff(given)).asYears()).toFixed(0);
          if (Number(total) > 0) {
            state.age = total;
          }
          break;
        case "CUSTOMER_PREFERRED_DATE":
          state.customer_preferred_date = selectedDate;
          console.log("selector===-=-==-=>", state.customer_preferred_date);
          break;
        case "TENTATIVE_DELIVERY_DATE":
          state.tentative_delivery_date = selectedDate;

          break;
        case "TRANSACTION_DATE":

          state.transaction_date = selectedDate;
          break;
        case "CHEQUE_DATE":
          state.cheque_date = selectedDate;
          break;
        case "DD_DATE":
          state.dd_date = selectedDate;
          break;
        case "NONE":
          console.log("NONE");
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
        case "AGE":
          state.age = text;
          break;
      }
    },
    setCommunicationAddress: (
      state,
      action: PayloadAction<CustomerDetailModel>
    ) => {
      const { key, text } = action.payload;
      switch (key) {
        case "PINCODE":
          state.pincode = text;
          break;
        case "DEFAULT_ADDRESS":
          state.defaultAddress = text;
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
        case "MANDAL":
          state.mandal = text;
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
          if (text === "true") {
            state.is_permanent_address_same = "YES";
          } else if (text === "false") {
            state.is_permanent_address_same = "NO";
          }
          if (state.is_permanent_address_same === "YES") {
            state.p_pincode = state.pincode;
            state.p_urban_or_rural = state.urban_or_rural;
            state.p_houseNum = state.house_number;
            state.p_streetName = state.street_name;
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
    setFinancialDetails: (
      state,
      action: PayloadAction<CustomerDetailModel>
    ) => {
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
        case "LOAN_OF_TENURE":
          state.loan_of_tenure = text;
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
      }
    },
    setPriceConformationDetails: (
      state,
      action: PayloadAction<CustomerDetailModel>
    ) => {
      const { key, text } = action.payload;
      switch (key) {
        case "VECHILE_REGISTRATION":
          state.vechicle_registration = !state.vechicle_registration;
          break;
        case "REGISTRATION_NUMBER":
          state.registration_number = text;
          break;
      }
    },
    setOfferPriceDetails: (
      state,
      action: PayloadAction<CustomerDetailModel>
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
    setBookingPaymentDetails: (
      state,
      action: PayloadAction<CustomerDetailModel>
    ) => {
      const { key, text } = action.payload;
      switch (key) {
        case "BOOKING_AMOUNT":
          state.booking_amount = text;
          break;
      }
    },
    setCommitmentDetails: (
      state,
      action: PayloadAction<CustomerDetailModel>
    ) => {
      const { key, text } = action.payload;
      switch (key) {
        case "OCCASION":
          state.occasion = text;
          break;
        case "DELIVERY_LOCATON":
          state.delivery_location = text;
          break;
      }
    },
    setDocumentUploadDetails: (
      state,
      action: PayloadAction<CustomerDetailModel>
    ) => {
      const { key, text } = action.payload;
      switch (key) {
        case "ADHAR":
          state.adhaar_number = text;
          break;
        case "PAN_NUMBER":
          state.pan_number = text;
          break;
        case "RELATIONSHIP_PROOF":
          state.relationship_proof = text;
          break;
        case "GSTIN_NUMBER":
          state.gstin_number = text;
          break;
        case "EMPLOYEE_ID":
          state.employee_id = text;
          break;
      }
    },
    setBookingDropDetails: (state, action) => {
      const { key, text } = action.payload;
      switch (key) {
        case "REJECT_REMARKS":
          state.reject_remarks = text;
          break;
      }
    },
    updateResponseStatus: (state, action) => {
      state.update_pre_booking_details_response = action.payload
    },
    setPreBookingPaymentDetials: (state, action) => {
      const { key, text } = action.payload;
      switch (key) {
        case "TYPE_OF_UPI":
          state.type_of_upi = text;
          break;
        case "TRANSFER_FROM_MOBILE":
          state.transfer_from_mobile = text;
          break;
        case "TRANSFER_TO_MOBILE":
          state.transfer_to_mobile = text;
          break;
        case "UTR_NO":
          state.utr_no = text;
          break;
        case "COMPANY_BANK_NAME":
          state.comapany_bank_name = text;
          break;
        case "CHEQUE_NUMBER":
          state.cheque_number = text;
          break;
        case "DD_NUMBER":
          state.dd_number = text;
          break;
      }
    },
    updateFuelAndTransmissionType: (state, action) => {
      state.fuel_type = action.payload.fuelType;
      state.transmission_type = action.payload.transmissionType;
    },
    updateDmsContactOrAccountDtoData: (state, action) => {

      // dmsContactOrAccountDto
      const dms_C_Or_A_Dto = action.payload;
      state.salutation = dms_C_Or_A_Dto.salutation ? dms_C_Or_A_Dto.salutation : "";
      if (state.salutation) {
        state.gender_types_data = Gender_Data_Obj[state.salutation.toLowerCase()];
      }
      state.first_name = dms_C_Or_A_Dto.firstName ? dms_C_Or_A_Dto.firstName : "";
      state.last_name = dms_C_Or_A_Dto.lastName ? dms_C_Or_A_Dto.lastName : "";
      state.mobile = dms_C_Or_A_Dto.phone ? dms_C_Or_A_Dto.phone : "";
      state.email = dms_C_Or_A_Dto.email ? dms_C_Or_A_Dto.email : "";
      const dateOfBirth = dms_C_Or_A_Dto.dateOfBirth ? dms_C_Or_A_Dto.dateOfBirth : "";
      state.date_of_birth = convertTimeStampToDateString(dateOfBirth, "DD/MM/YYYY");
      state.gender = dms_C_Or_A_Dto.gender ? dms_C_Or_A_Dto.gender : "";
      // state.age = dms_C_Or_A_Dto.age ? dms_C_Or_A_Dto.age.toString() : "0";
      const dob = convertTimeStampToDateString(dateOfBirth, "DD/MM/YYYY");
      const given = moment(dob, "DD/MM/YYYY");
      const current = moment().startOf('day');
      const total = Number(moment.duration(current.diff(given)).asYears()).toFixed(0);
      console.log("DOB:", given, total);

      if (Number(total) > 0) {
        state.age = total.toString();
      }
      state.customer_type = dms_C_Or_A_Dto.customerType ? dms_C_Or_A_Dto.customerType : "";
      ///state.buyer_type = dms_C_Or_A_Dto.buyerType? dms_C_Or_A_Dto.buyerType:"";
    },
    updateDmsLeadDtoData: (state, action) => {
      console.log("updateDmsLeadDtoData=-=-=-=-==-=>: ", JSON.stringify(action.payload));

      const dmsLeadDto = action.payload;
      state.enquiry_segment = dmsLeadDto.enquirySegment ? dmsLeadDto.enquirySegment : "";
      if (state.customer_types_response && state.enquiry_segment) {
        state.customer_types_data = state.customer_types_response[state.enquiry_segment.toLowerCase()];
      }
      // state.buyer_type = dmsLeadDto.enquiry_segment ? dmsLeadDto.buyerType :"";
      // if(state.customer_types_response && state){
      //   state.customer_types_data = state.customer_types_response[state.buyer_type.toLowerCase()]
      // }
      state.buyer_type = dmsLeadDto.buyerType
        ? dmsLeadDto.buyerType
        : "";
      state.marital_status = dmsLeadDto.maritalStatus ? dmsLeadDto.maritalStatus : "";
      state.vehicle_type = dmsLeadDto.otherVehicleType ? dmsLeadDto.otherVehicleType : "";
      state.registration_number = dmsLeadDto.otherVehicleRcNo ? dmsLeadDto.otherVehicleRcNo : "";

      // Documents
      if (dmsLeadDto.documentType) {
        state.form_or_pan = dmsLeadDto.documentType;
      }
      if (dmsLeadDto.gstNumber && dmsLeadDto.gstNumber != "") {
        state.gstin_number = dmsLeadDto.gstNumber
      }
      state.customer_type_category = dmsLeadDto.customerCategoryType ? dmsLeadDto.customerCategoryType : "";

      // Commitment
      state.occasion = dmsLeadDto.occasion ? dmsLeadDto.occasion : "";
      const customerPreferredDate = dmsLeadDto.commitmentDeliveryPreferredDate ? dmsLeadDto.commitmentDeliveryPreferredDate : "";

      state.customer_preferred_date = convertTimeStampToDateString(customerPreferredDate, "DD/MM/YYYY");
      console.log("Select---------->>>>>>>>", customerPreferredDate);
      const tentativeDeliveryDate = dmsLeadDto.commitmentDeliveryTentativeDate ? dmsLeadDto.commitmentDeliveryTentativeDate : ""
      state.tentative_delivery_date = convertTimeStampToDateString(tentativeDeliveryDate, "DD/MM/YYYY");

      // Reject Remarks
      state.reject_remarks = dmsLeadDto.remarks ? dmsLeadDto.remarks : "";
    },
    updateDmsAddressData: (state, action) => {

      const dmsAddresses = action.payload;
      if (dmsAddresses.length == 2) {
        if (dmsAddresses[0].pincode !== dmsAddresses[1].pincode ||
          dmsAddresses[0].houseNo !== dmsAddresses[1].houseNo ||
          dmsAddresses[0].street !== dmsAddresses[1].street ||
          dmsAddresses[0].village !== dmsAddresses[1].village ||
          dmsAddresses[0].mandal !== dmsAddresses[1].mandal ||
          dmsAddresses[0].city !== dmsAddresses[1].city ||
          dmsAddresses[0].district !== dmsAddresses[1].district ||
          dmsAddresses[0].state !== dmsAddresses[1].state) {
          state.is_permanent_address_same = "NO"
        }
        else {
          state.is_permanent_address_same = "YES"
        }
        dmsAddresses.forEach((address) => {
          if (address.addressType === 'Communication') {
            state.defaultAddress = address;
            state.pincode = address.pincode ? address.pincode : "";
            state.house_number = address.houseNo ? address.houseNo : "";
            state.street_name = address.street ? address.street : "";
            state.village = address.village ? address.village : "";
            state.mandal = address.mandal ? address.mandal : "";
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
            state.p_mandal = address.mandal ? address.mandal : "";
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
    clearPermanentAddr: (state, action) => {
      state.p_pincode = "";
      state.p_houseNum = "";
      state.p_streetName = "";
      state.p_village = "";
      state.p_mandal = "";
      state.p_city = "";
      state.p_district = "";
      state.p_state = "";
      state.p_urban_or_rural = 0
    },
    updateModelSelectionData: (state, action) => {
      const dmsLeadProducts = action.payload;
      let dataObj: any = {};
      if (dmsLeadProducts.length > 0) {
        // dataObj = { ...dmsLeadProducts[0] };
        let modelData = dmsLeadProducts.filter((item) => item.model === state.pre_booking_details_response?.dmsLeadDto?.model)
        dataObj = { ...modelData[0] };
        console.log("$$$$$$$$$ MODEL $$$$$$$$$$", modelData[0])
      }
      state.lead_product_id = dataObj.id ? dataObj.id : "";
      state.model = dataObj.model ? dataObj.model : "";
      state.varient = dataObj.variant ? dataObj.variant : "";
      state.color = dataObj.color ? dataObj.color : "";
      state.fuel_type = dataObj.fuel ? dataObj.fuel : "";
      state.transmission_type = dataObj.transimmisionType ? dataObj.transimmisionType : "";
      try {
        if (dmsLeadProducts && dmsLeadProducts.length != 0)
          state.dmsLeadProducts = dmsLeadProducts;
        state.model_drop_down_data_update_status = "update";
      } catch (error) {
        // alert(error)
      }
      //state.model_drop_down_data_update_status = "update";
    },
    updateFinancialData: (state, action) => {
      const dmsfinancedetails = action.payload;
      let dataObj: any = {};
      if (dmsfinancedetails.length > 0) {
        dataObj = { ...dmsfinancedetails[0] };
      }
      state.retail_finance = dataObj.financeType ? dataObj.financeType : "";
      state.finance_category = dataObj.financeCategory ? dataObj.financeCategory : "";
      state.down_payment = dataObj.downPayment ? dataObj.downPayment.toString() : "";
      state.loan_amount = dataObj.loanAmount ? dataObj.loanAmount.toString() : "";
      state.bank_or_finance =  state.retail_finance === 'In House' ? dataObj.financeCompany
        ? dataObj.financeCompany
        : "" : '';
      state.bank_or_finance_name = dataObj.financeCompany ? dataObj.financeCompany : "";
      state.rate_of_interest = dataObj.rateOfInterest ? dataObj.rateOfInterest : "";
      state.loan_of_tenure = dataObj.expectedTenureYears ? dataObj.expectedTenureYears : "";
      state.emi = dataObj.emi ? dataObj.emi.toString() : "";
      state.approx_annual_income = dataObj.annualIncome ? dataObj.annualIncome : "";
      state.location = dataObj.location ? dataObj.location : "";
      state.leashing_name = dataObj.financeCompany ? dataObj.financeCompany : "";
    },
    updateBookingPaymentData: (state, action) => {
      const dmsBooking = action.payload;
      let dataObj: any = {};
      if (dmsBooking) {
        dataObj = { ...dmsBooking };
      }
      state.booking_amount = dataObj.bookingAmount ? dataObj.bookingAmount.toString() : "";
      state.payment_at = dataObj.paymentAt ? dataObj.paymentAt : "";
      console.log("BOOKING MODE: ", dataObj.modeOfPayment);

      state.booking_payment_mode = dataObj.modeOfPayment ? dataObj.modeOfPayment : "";
      state.delivery_location = dataObj.deliveryLocation ? dataObj.deliveryLocation : "";
      state.vechicle_registration = dataObj.otherVehicle ? dataObj.otherVehicle : false;
    },
    updateDmsAttachments: (state, action) => {

      state.pan_number = "";
      state.adhaar_number = "";
      console.log("DOCS:", JSON.stringify(action.payload));

      const dmsAttachments = action.payload;
      const attachments = [...dmsAttachments];
      if (attachments.length > 0) {
        attachments.forEach((item, index) => {
          if (item.documentType === "pan") {
            if (item.documentNumber) {
              state.pan_number = item.documentNumber;
            }
          }
          else if (item.documentType === "aadhar") {
            if (item.documentNumber) {
              state.adhaar_number = item.documentNumber;
            }
          }
          else if (item.documentType === "employeeId" || item.documentType === "employeeId") {
            if (item.documentNumber) {
              state.employee_id = item.documentNumber;
            }
          }
          else if (item.documentType === "gstNumber") {
            if (item.documentNumber && item.documentNumber != "") {
              state.gstin_number = item.documentNumber;
            }
          }
        })
      }
    },
    updateAddressByPincode: (state, action) => {
      state.defaultAddress = action.payload;
      state.village = action.payload.Block || ""
      state.mandal = state.mandal ? state.mandal : action.payload.Mandal || ""
      // state.mandal = action.payload.Block || ""
      state.city = action.payload.District || ""
      state.district = action.payload.District || ""
      state.state = action.payload.State || ""
      state.isAddressSet = true
    },
    updateAddressByPincode2: (state, action) => {

      state.p_village = action.payload.Block || ""
      state.p_mandal = state.p_mandal ? state.p_mandal : action.payload.Mandal || ""
      // state.mandal = action.payload.Block || ""
      state.p_city = action.payload.District || ""
      state.p_district = action.payload.District || ""
      state.p_state = action.payload.State || ""
      // state.isAddressSet = true
    },
  },
  extraReducers: (builder) => {
    // Get PreBooking Details
    builder.addCase(getPrebookingDetailsApi.pending, (state, action) => {
      state.pre_booking_details_response = null;
      state.isLoading = true;
    })
    builder.addCase(getPrebookingDetailsApi.fulfilled, (state, action) => {
      if (action.payload.dmsEntity) {
        state.refNo = action.payload.dmsEntity.dmsLeadDto.referencenumber;
        state.pre_booking_details_response = action.payload.dmsEntity;
        let attachments = action.payload.dmsEntity.dmsLeadDto.dmsAttachments;
        if (attachments.length > 0) {
          let panDtls = [];
          panDtls = attachments.filter((item) => {
            return item.documentType === "pan"
          })
          if (panDtls.length > 0) {
            state.form_or_pan = 'PAN'
            state.isDataLoaded = true
            setDocumentUploadDetails({
              key: "PAN_NUMBER",
              text: state.pan_number,
            })
          }
          else {
            state.isDataLoaded = true
          }
        }
      }
      state.isLoading = false;
    })
    builder.addCase(getPrebookingDetailsApi.rejected, (state, action) => {
      state.pre_booking_details_response = null;
      state.isLoading = false;
    })
    // Update PreBooking Details
    builder.addCase(updatePrebookingDetailsApi.pending, (state, action) => {
      state.update_pre_booking_details_response = "";
      state.isLoading = true;
    })
    builder.addCase(updatePrebookingDetailsApi.fulfilled, (state, action) => {
      if (action.payload.success == true) {
        state.update_pre_booking_details_response = "success";
      }
      state.isLoading = false;
    })
    builder.addCase(updatePrebookingDetailsApi.rejected, (state, action) => {
      console.log("F updatePrebookingDetailsApi: ", JSON.stringify(action.payload));
      // if (action.payload["message"]) {
      //   showToastRedAlert(action.payload["message"]);
      // }
      state.update_pre_booking_details_response = "failed";
      state.isLoading = false;
    })
    // Get On Road Price & Insurence Details
    builder.addCase(getOnRoadPriceAndInsurenceDetailsApi.pending, (state, action) => {
      state.vehicle_on_road_price_insurence_details_response = null;
      state.isLoading = true;
    })
    builder.addCase(getOnRoadPriceAndInsurenceDetailsApi.fulfilled, (state, action) => {
      if (action.payload) {
        state.vehicle_on_road_price_insurence_details_response = action.payload;
        if (action.payload.insuranceAddOn.length > 0) {
          let addOnNames = "", price = 0;
          console.log('ADD-ONS: ', JSON.stringify(action.payload.insuranceAddOn));

          action.payload.insuranceAddOn.forEach((element, index) => {
            addOnNames += element.add_on_price[0].document_name + ((index + 1) < action.payload.insuranceAddOn.length ? ", " : "");
            price += Number(element.add_on_price[0].cost)
          });
          // state.add_on_insurance = addOnNames;
          if (state.insurance_type !== '' && state.add_on_insurance) {
            state.addOnPrice = price;
          }

        }
      }
      state.isLoading = false;
    })
    builder.addCase(getOnRoadPriceAndInsurenceDetailsApi.rejected, (state, action) => {
      state.vehicle_on_road_price_insurence_details_response = null;
      state.isLoading = false;
    })
    // Drop Pre-Booking
    builder.addCase(dropPreBooingApi.pending, (state, action) => {
      state.pre_booking_drop_response_status = "pending"
      state.isLoading = true;
    })
    builder.addCase(dropPreBooingApi.fulfilled, (state, action) => {
      if (action.payload.status === "SUCCESS") {
        state.pre_booking_drop_response_status = "success";
      }
      state.isLoading = false;
    })
    builder.addCase(dropPreBooingApi.rejected, (state, action) => {
      state.pre_booking_drop_response_status = "failed"
      state.isLoading = false;
    })
    // Send On Road Price Details
    builder.addCase(sendOnRoadPriceDetails.pending, (state, action) => {
      state.send_onRoad_price_details_response = null
      state.isLoading = true;
    })
    builder.addCase(sendOnRoadPriceDetails.fulfilled, (state, action) => {
      if (action.payload.dmsEntity) {
        state.send_onRoad_price_details_response = action.payload.dmsEntity.dmsOnRoadPriceDto;
      }
      state.isLoading = false;
    })
    builder.addCase(sendOnRoadPriceDetails.rejected, (state, action) => {
      state.send_onRoad_price_details_response = null
      state.isLoading = false;
      // if (action.payload["errorMessage"]) {
      //   showToastRedAlert(action.payload["errorMessage"] || "Something went wrong");
      // }
    })
    // Send edited On Road Price Details
    builder.addCase(sendEditedOnRoadPriceDetails.pending, (state, action) => {
      state.send_onRoad_price_details_response = null
      state.isLoading = true;
    })
    builder.addCase(sendEditedOnRoadPriceDetails.fulfilled, (state, action) => {
      if (action.payload.dmsEntity) {
        state.send_onRoad_price_details_response = action.payload.dmsEntity.dmsOnRoadPriceDto;
      }
      state.isLoading = false;
    })
    builder.addCase(sendEditedOnRoadPriceDetails.rejected, (state, action) => {
      state.send_onRoad_price_details_response = null
      state.isLoading = false;
      // if (action.payload["errorMessage"]) {
      //   showToastRedAlert(action.payload["errorMessage"] || "Something went wrong");
      // }
    })
    // Get On Road Price Dto List
    builder.addCase(getOnRoadPriceDtoListApi.pending, (state, action) => {
      state.on_road_price_dto_list_response = [];
      state.isLoading = true;
    })
    builder.addCase(getOnRoadPriceDtoListApi.fulfilled, (state, action) => {
      // console.log("S getOnRoadPriceDtoListApi: ", JSON.stringify(action.payload));
      if (action.payload.dmsEntity) {
        const dmsOnRoadPriceDtoList = action.payload.dmsEntity.dmsOnRoadPriceDtoList;
        state.on_road_price_dto_list_response = dmsOnRoadPriceDtoList;
        if (dmsOnRoadPriceDtoList.length > 0) {
          const dataObj = dmsOnRoadPriceDtoList[0];

          state.insurance_type = dataObj.insuranceType ? dataObj.insuranceType : "";
          state.warranty = dataObj.warrantyName ? dataObj.warrantyName : "";

          if (dataObj.insuranceAddonData && dataObj.insuranceAddonData.length > 0) {
            let addOnNames = "";
            dataObj.insuranceAddonData.forEach((element, index) => {
              addOnNames += element.insuranceAddonName + ((index + 1) < dataObj.length ? ", " : "");
            });
            state.add_on_insurance = addOnNames;
          }

          state.consumer_offer = dataObj.specialScheme ? dataObj.specialScheme.toString() : "";
          state.exchange_offer = dataObj.exchangeOffers ? dataObj.exchangeOffers.toString() : "";
          state.corporate_offer = dataObj.corporateOffer ? dataObj.corporateOffer.toString() : "";
          state.promotional_offer = dataObj.promotionalOffers ? dataObj.promotionalOffers.toString() : "";
          state.cash_discount = dataObj.cashDiscount ? dataObj.cashDiscount.toString() : "";
          state.for_accessories = dataObj.focAccessories ? dataObj.focAccessories.toString() : "";
          state.additional_offer_1 = dataObj.additionalOffer1 ? dataObj.additionalOffer1.toString() : "";
          state.additional_offer_2 = dataObj.additionalOffer2 ? dataObj.additionalOffer2.toString() : "";
          state.insurance_discount = dataObj.insuranceDiscount ? dataObj.insuranceDiscount.toString() : "";
          state.accessories_discount = dataObj.accessoriesDiscount ? dataObj.accessoriesDiscount.toString() : "";
        }
      }
      state.isLoading = false;
    })
    builder.addCase(getOnRoadPriceDtoListApi.rejected, (state, action) => {
      state.on_road_price_dto_list_response = [];
      state.isLoading = false;
    })
    // Get Customer Types
    builder.addCase(getCustomerTypesApi.pending, (state, action) => {
      state.customer_types_response = [];
      state.isLoading = true;
    })
    builder.addCase(getCustomerTypesApi.fulfilled, (state, action) => {
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
          "company": companyTypes,
          "handicapped": companyTypes
        }
        state.customer_types_response = obj;
      }
      state.isLoading = false;
    })
    builder.addCase(getCustomerTypesApi.rejected, (state, action) => {
      state.customer_types_response = [];
      state.isLoading = false;
    })
    // Get Drop Down Data
    builder.addCase(getDropDataApi.pending, (state, action) => {
      state.drop_reasons_list = [];
      state.isLoading = true;
    })
    builder.addCase(getDropDataApi.fulfilled, (state, action) => {

      if (action.payload) {
        const newTypeData = action.payload.map(element => {
          return {
            ...element,
            name: element.value
          }
        });
        state.drop_reasons_list = newTypeData;
      }
      state.isLoading = false;
    })
    builder.addCase(getDropDataApi.rejected, (state, action) => {
      state.drop_reasons_list = [];
      state.isLoading = false;
    })
    // Get drop sub reasons api
    builder.addCase(getDropSubReasonDataApi.pending, (state, action) => {
      state.drop_sub_reasons_list = [];
      state.isLoading = true;
    })
    builder.addCase(getDropSubReasonDataApi.fulfilled, (state, action) => {
      if (action.payload) {
        const newTypeData = action.payload.map(element => {
          return {
            ...element,
            name: element.value
          }
        });
        state.drop_sub_reasons_list = newTypeData;
      }
      state.isLoading = false;
    })
    builder.addCase(getDropSubReasonDataApi.rejected, (state, action) => {
      state.drop_sub_reasons_list = [];
      state.isLoading = false;
    })
    // Pre Booking Payment Api
    builder.addCase(preBookingPaymentApi.pending, (state, action) => {
      state.pre_booking_payment_response = null;
      state.pre_booking_payment_response_status = "pending";
      state.isLoading = true;
    })
    builder.addCase(preBookingPaymentApi.fulfilled, (state, action) => {
      if (action.payload.success == true) {
        state.pre_booking_payment_response = action.payload.dmsEntity;
        state.pre_booking_payment_response_status = "success";
      }
      state.isLoading = false;
    })
    builder.addCase(preBookingPaymentApi.rejected, (state, action) => {
      // if (action.payload["message"]) {
      //   showToastRedAlert(action.payload["message"]);
      // }
      state.pre_booking_payment_response = null;
      state.pre_booking_payment_response_status = "failed";
      state.isLoading = false;
    })
    //Post Booking Amount
    builder.addCase(postBookingAmountApi.pending, (state, action) => {
      state.booking_amount_response = null;
      state.booking_amount_response_status = "pending";
      state.isLoading = true;
    })
    builder.addCase(postBookingAmountApi.fulfilled, (state, action) => {
      if (action.payload.success == true) {
        state.booking_amount_response = action.payload.dmsEntity.dmsBookingAmountReceivedDtoList;
        state.booking_amount_response_status = "success";
      }
      state.isLoading = false;
    })
    builder.addCase(postBookingAmountApi.rejected, (state, action) => {
      // if (action.payload["errorMessage"]) {
      //   showToastRedAlert(action.payload["errorMessage"]);
      // }
      state.booking_amount_response = null;
      state.booking_amount_response_status = "failed";
      state.isLoading = false;
    })
    // Get Payment Details Api
    builder.addCase(getPaymentDetailsApi.pending, (state, action) => {
      state.existing_payment_details_response = null;
      state.existing_payment_details_status = "pending";
      state.isLoading = true;
    })
    builder.addCase(getPaymentDetailsApi.fulfilled, (state, action) => {
      if (action.payload) {
        console.log("PAYMENT DATA: ", JSON.stringify(action.payload));

        state.existing_payment_details_response = action.payload;
        state.type_of_upi = action.payload.typeUpi ? action.payload.typeUpi : "";
        state.transfer_from_mobile = action.payload.transferFromMobile ? action.payload.transferFromMobile : "";
        state.transfer_to_mobile = action.payload.transferToMobile ? action.payload.transferToMobile : "";
        state.utr_no = action.payload.utrNo ? action.payload.utrNo : "";
        state.comapany_bank_name = action.payload.bankName ? action.payload.bankName : "";
        state.cheque_number = action.payload.chequeNo ? action.payload.chequeNo.toString() : "";
        state.dd_number = action.payload.ddNo ? action.payload.ddNo : "";

        const date = convertTimeStampToDateString(action.payload.date, "DD/MM/YYYY");
        state.transaction_date = date;
        state.cheque_date = date;
        state.dd_date = date;
      }
      state.existing_payment_details_status = "success";
      state.isLoading = false;
    })
    builder.addCase(getPaymentDetailsApi.rejected, (state, action) => {
      // if (action.payload["errorMessage"]) {
      //   showToastRedAlert(action.payload["errorMessage"]);
      // }
      state.existing_payment_details_response = null;
      state.existing_payment_details_status = "failed";
      state.isLoading = false;
    })
    //Get Booking Amount Details
    builder.addCase(getBookingAmountDetailsApi.pending, (state, action) => {
      state.existing_booking_amount_response = null;
      state.existing_booking_amount_response_status = "pending";
      state.isLoading = true;
    })
    builder.addCase(getBookingAmountDetailsApi.fulfilled, (state, action) => {
      if (action.payload.success == true) {
        state.existing_booking_amount_response = action.payload.dmsEntity.dmsBookingAmountReceivedDtoList;
        state.existing_booking_amount_response_status = "success";
      }
      state.isLoading = false;
    })
    builder.addCase(getBookingAmountDetailsApi.rejected, (state, action) => {
      // if (action.payload["errorMessage"]) {
      //   showToastRedAlert(action.payload["errorMessage"]);
      // }
      state.existing_booking_amount_response = null;
      state.existing_booking_amount_response_status = "failed";
      state.isLoading = false;
    })
    //Get Assingned Tasks api
    builder.addCase(getAssignedTasksApi.pending, (state, action) => {
      state.assigned_tasks_list = [];
      state.assigned_tasks_list_status = "pending";
      state.isLoading = true;
    })
    builder.addCase(getAssignedTasksApi.fulfilled, (state, action) => {
      if (action.payload.success == true && action.payload.dmsEntity) {
        state.assigned_tasks_list = action.payload.dmsEntity.tasks || [];
      }
      state.isLoading = false;
      state.assigned_tasks_list_status = "success";
    })
    builder.addCase(getAssignedTasksApi.rejected, (state, action) => {
      // if (action.payload["errorMessage"]) {
      //   showToastRedAlert(action.payload["errorMessage"]);
      // }
      state.assigned_tasks_list = [];
      state.assigned_tasks_list_status = "failed";
      state.isLoading = false;
    })
    //update ref number
    builder.addCase(updateRef.pending, (state, action) => {

    });
    builder.addCase(updateRef.fulfilled, (state, action) => {

    });
    builder.addCase(updateRef.rejected, (state, action) => {

    });
  }
});

export const {
  clearState,
  setDatePicker,
  updateSelectedDate,
  setCustomerDetails,
  setCommunicationAddress,
  setFinancialDetails,
  setCommitmentDetails,
  setBookingPaymentDetails,
  setPriceConformationDetails,
  setOfferPriceDetails,
  setDropDownData,
  setDocumentUploadDetails,
  setBookingDropDetails,
  setImagePicker,
  setPreBookingPaymentDetials,
  updateFuelAndTransmissionType,
  updateDmsContactOrAccountDtoData,
  updateDmsLeadDtoData,
  updateDmsAddressData,
  updateModelSelectionData,
  updateFinancialData,
  updateBookingPaymentData,
  updateDmsAttachments,
  updateAddressByPincode,
  updateResponseStatus,
  updateStatus,
  clearPermanentAddr,
  updateAddressByPincode2,
  updatedmsLeadProduct
} = prebookingFormSlice.actions;
export default prebookingFormSlice.reducer;
