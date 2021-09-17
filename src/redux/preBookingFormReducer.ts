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

  const response = await client.get(URL.ENQUIRY_DETAILS(universalId));
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const updatePrebookingDetailsApi = createAsyncThunk("PREBOONING_FORMS_SLICE/updatePrebookingDetailsApi", async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.UPDATE_ENQUIRY_DETAILS(), payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getOnRoadPriceAndInsurenceDetailsApi = createAsyncThunk("PREBOONING_FORMS_SLICE/getOnRoadPriceAndInsurenceDetailsApi", async (payload, { rejectWithValue }) => {

  const response = await client.get(URL.GET_ON_ROAD_PRICE_AND_INSURENCE_DETAILS(payload["varientId"], payload["vehicleId"]));
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getPaidAccessoriesListApi = createAsyncThunk("PREBOONING_FORMS_SLICE/getPaidAccessoriesListApi", async (orgId, { rejectWithValue }) => {

  const customConfig = { orgId: orgId };
  const response = await client.get(URL.GET_PAID_ACCESSORIES_LIST(orgId), customConfig);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const dropPreBooingApi = createAsyncThunk("PREBOONING_FORMS_SLICE/dropPreBooingApi", async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.DROP_ENQUIRY(), payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const sendOnRoadPriceDetails = createAsyncThunk("PREBOONING_FORMS_SLICE/sendOnRoadPriceDetails", async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.SEND_ON_ROAD_PRICE_DETAILS(), payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getCustomerTypesApi = createAsyncThunk("PREBOONING_FORMS_SLICE/getCustomerTypesApi", async (universalId, { rejectWithValue }) => {

  const response = await client.get(URL.GET_CUSTOMER_TYPES());
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getOnRoadPriceDtoListApi = createAsyncThunk("PREBOONING_FORMS_SLICE/getOnRoadPriceDtoListApi", async (leadId, { rejectWithValue }) => {

  const response = await client.get(URL.GET_ON_ROAD_PRICE_DTO_LIST(leadId));
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

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
    paid_accessories_list: [],
    pre_booking_drop_response_status: null,
    update_pre_booking_details_response: "",
    on_road_price_dto_list_response: [],

    dropDownTitle: "",
    dropDownKeyId: "",
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
    customer_type: "",
    marital_status: "",
    // Communication Address
    pincode: "",
    urban_or_rural: 0, // 1: urban, 2:
    house_number: "",
    street_name: "",
    village: "",
    city: "",
    state: "",
    district: "",

    permanent_address: false,
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
    relationship_proof: "",
    // Booking Drop
    drop_reason: "",
    drop_remarks: ""
  },
  reducers: {
    clearState: (state, action) => {
      state.pre_booking_details_response = null;
      state.customer_types_response = null;
      state.vehicle_on_road_price_insurence_details_response = null;
      state.pre_booking_drop_response_status = null;
      state.update_pre_booking_details_response = null;
      state.on_road_price_dto_list_response = [];
    },
    setDropDownData: (state, action: PayloadAction<DropDownModelNew>) => {
      const { key, value, id } = action.payload;
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
          if (state.customer_types_response) {
            state.customer_types_data = state.customer_types_response[value.toLowerCase()];
          }
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
        case "DROP_REASON":
          state.drop_reason = value;
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
          if (state.permanent_address) {
            state.p_pincode = state.pincode;
            state.p_urban_or_rural = state.urban_or_rural;
            state.p_houseNum = state.house_number;
            state.p_streetName = state.street_name;
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
        case "RELATIONSHIP_PROOF":
          state.relationship_proof = text;
          break;
      }
    },
    setBookingDropDetails: (state, action) => {
      const { key, text } = action.payload;
      switch (key) {
        case "DROP_REMARKS":
          state.drop_remarks = text;
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
      state.age = dms_C_Or_A_Dto.age ? dms_C_Or_A_Dto.age.toString() : "0";
      state.customer_type = dms_C_Or_A_Dto.customerType ? dms_C_Or_A_Dto.customerType : "";
    },
    updateDmsLeadDtoData: (state, action) => {

      const dmsLeadDto = action.payload;
      state.enquiry_segment = dmsLeadDto.enquirySegment ? dmsLeadDto.enquirySegment : "";
      if (state.customer_types_response && state.enquiry_segment) {
        state.customer_types_data = state.customer_types_response[state.enquiry_segment.toLowerCase()];
      }
      state.marital_status = dmsLeadDto.maritalStatus ? dmsLeadDto.maritalStatus : "";

      // Commitment
      state.occasion = dmsLeadDto.occasion ? dmsLeadDto.occasion : "";
      const customerPreferredDate = dmsLeadDto.commitmentDeliveryPreferredDate ? dmsLeadDto.commitmentDeliveryPreferredDate : "";
      state.customer_preferred_date = convertTimeStampToDateString(customerPreferredDate, "DD/MM/YYYY");
      const tentativeDeliveryDate = dmsLeadDto.commitmentDeliveryTentativeDate ? dmsLeadDto.commitmentDeliveryTentativeDate : ""
      state.tentative_delivery_date = convertTimeStampToDateString(tentativeDeliveryDate, "DD/MM/YYYY");
    },
    updateDmsAddressData: (state, action) => {

      const dmsAddresses = action.payload;
      if (dmsAddresses.length == 2) {
        dmsAddresses.forEach((address) => {
          if (address.addressType === 'Communication') {

            state.pincode = address.pincode ? address.pincode : "";
            state.house_number = address.houseNo ? address.houseNo : "";
            state.street_name = address.street ? address.street : "";
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
        state.model_drop_down_data_update_status = "update";
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
    updateBookingPaymentData: (state, action) => {
      const dmsBooking = action.payload;
      if (dmsBooking) {
        const dataObj = dmsBooking;
        state.booking_amount = dataObj.bookingAmount ? dataObj.bookingAmount.toString() : "";
        state.payment_at = dataObj.paymentAt ? dataObj.paymentAt : "";
        state.booking_payment_mode = dataObj.modeOfPayment ? dataObj.modeOfPayment : "";
        state.delivery_location = dataObj.deliveryLocation ? dataObj.deliveryLocation : "";

      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getPrebookingDetailsApi.fulfilled, (state, action) => {
      //console.log("S getPrebookingDetailsApi: ", JSON.stringify(action.payload));
      if (action.payload.dmsEntity) {
        state.pre_booking_details_response = action.payload.dmsEntity;
      }
    })
    builder.addCase(getPrebookingDetailsApi.rejected, (state, action) => {
      //console.log("F getPrebookingDetailsApi: ", JSON.stringify(action.payload));
    })
    builder.addCase(updatePrebookingDetailsApi.fulfilled, (state, action) => {
      //console.log("S updatePrebookingDetailsApi: ", JSON.stringify(action.payload));
      if (action.payload.success == true) {
        state.update_pre_booking_details_response = "success";
      }
    })
    builder.addCase(updatePrebookingDetailsApi.rejected, (state, action) => {
      //console.log("F updatePrebookingDetailsApi: ", JSON.stringify(action.payload));
      state.update_pre_booking_details_response = "failed";
    })
    builder.addCase(getOnRoadPriceAndInsurenceDetailsApi.fulfilled, (state, action) => {
      //console.log("S getOnRoadPriceAndInsurenceDetailsApi: ", JSON.stringify(action.payload));
      if (action.payload) {
        state.vehicle_on_road_price_insurence_details_response = action.payload;
      }
    })
    builder.addCase(getOnRoadPriceAndInsurenceDetailsApi.rejected, (state, action) => {
      //console.log("F getOnRoadPriceAndInsurenceDetailsApi: ", JSON.stringify(action.payload));
    })

    builder.addCase(getPaidAccessoriesListApi.fulfilled, (state, action) => {
      //console.log("S getPaidAccessoriesListApi: ", JSON.stringify(action.payload));
      if (action.payload.accessorylist) {
        state.paid_accessories_list = action.payload.accessorylist;
      }
    })
    builder.addCase(dropPreBooingApi.fulfilled, (state, action) => {
      //console.log("S dropPreBooingApi: ", JSON.stringify(action.payload));
      if (action.payload.status === "SUCCESS") {
        state.pre_booking_drop_response_status = "success";
      }
    })
    builder.addCase(sendOnRoadPriceDetails.fulfilled, (state, action) => {

      if (action.payload.success === false) {
        showToastRedAlert(action.payload.errorMessage || "Something went wrong");
        return;
      }
    })
    builder.addCase(sendOnRoadPriceDetails.rejected, (state, action) => {
      //console.log("F getOnRoadPriceAndInsurenceDetailsApi: ", JSON.stringify(action.payload));
      showToastRedAlert("Something went wrong");
    })
    builder.addCase(getOnRoadPriceDtoListApi.fulfilled, (state, action) => {
      console.log("S getOnRoadPriceDtoListApi: ", JSON.stringify(action.payload));
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
            state.add_on_insurance + addOnNames;
          }

          state.consumer_offer = dataObj.specialScheme ? dataObj.specialScheme.toString() : "";
          state.exchange_offer = dataObj.exchangeOffers ? dataObj.exchangeOffers.toString() : "";
          state.corporate_offer = dataObj.corporateOffer ? dataObj.corporateOffer.toString() : "";
          state.promotional_offer = dataObj.promotionalOffers ? dataObj.promotionalOffers.toString() : "";
          state.cash_discount = dataObj.cashDiscount ? dataObj.cashDiscount.toString() : "";
          state.for_accessories = dataObj.focAccessories ? dataObj.focAccessories.toString() : "";
          state.additional_offer_1 = dataObj.additionalOffer1 ? dataObj.additionalOffer1.toString() : "";
          state.additional_offer_2 = dataObj.additionalOffer2 ? dataObj.additionalOffer2.toString() : "";
        }
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
          "company": companyTypes,
          "handicapped": companyTypes
        }
        state.customer_types_response = obj;
      }
    })
  }
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
  updateFuelAndTransmissionType,
  updateDmsContactOrAccountDtoData,
  updateDmsLeadDtoData,
  updateDmsAddressData,
  updateModelSelectionData,
  updateFinancialData,
  updateBookingPaymentData
} = prebookingFormSlice.actions;
export default prebookingFormSlice.reducer;
