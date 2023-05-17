import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";
import { Relation_Data_Obj } from "../jsonData/enquiryFormScreenJsonData";
import { client } from "../networking/client";
import URL from "../networking/endpoints";
import { convertTimeStampToDateString } from "../utils/helperFunctions";
import _ from "lodash";
import { SALUTATIONS } from "../jsonData/addCustomerScreenJsonData";
import { showToast } from "../utils/toast";

const dateFormate = "YYYY/MM/DD"
interface DropDownModelNew {
  key: string;
  value: string;
  id?: string;
  orgId?: string;
}

interface PersonalIntroModel {
  key: string;
  text: string;
}

export const addCustomer = createAsyncThunk(
  "CUSTOMER_INFO_SLICE/addCustomer",
  async (payload, { rejectWithValue }) => {
    const { tenantId, customerData } = payload;
    const response = await client.post(URL.ADD_CUSTOMER(tenantId), customerData);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const editCustomer = createAsyncThunk(
  "CUSTOMER_INFO_SLICE/editCustomer",
  async (payload, { rejectWithValue }) => {
    const { tenantId, customerData } = payload;
    const response = await client.put(URL.ADD_CUSTOMER(tenantId), customerData);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getCustomerDetails = createAsyncThunk(
  "CUSTOMER_INFO_SLICE/getCustomerDetails",
  async (payload, { rejectWithValue }) => {
    const { tenantId, vehicleRegNumber } = payload;
    const response = await client.get(
      URL.GET_CUSTOMER_DETAILS(tenantId, vehicleRegNumber)
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getCustomerTypesApi = createAsyncThunk(
  "CUSTOMER_INFO_SLICE/getCustomerTypesApi",
  async (orgId, { rejectWithValue }) => {
    const response = await client.get(URL.GET_CUSTOMER_TYPES(orgId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getSourceTypesApi = createAsyncThunk(
  "CUSTOMER_INFO_SLICE/getSourceTypesApi",
  async (tenantId, { rejectWithValue }) => {
    const response = await client.get(URL.GET_SOURCE_TYPE(tenantId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getServiceTypesApi = createAsyncThunk(
  "CUSTOMER_INFO_SLICE/getServiceTypesApi",
  async (tenantId, { rejectWithValue }) => {
    const response = await client.get(URL.GET_SERVICE_TYPE(tenantId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getSubServiceTypesApi = createAsyncThunk(
  "CUSTOMER_INFO_SLICE/getSubServiceTypesApi",
  async (payload, { rejectWithValue }) => {
    const { tenantId, catId } = payload;
    const response = await client.get(
      URL.GET_SUB_SERVICE_TYPE(tenantId, catId)
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getVehicleInfo = createAsyncThunk(
  "CUSTOMER_INFO_SLICE/getVehicleInfo",
  async (orgId, { rejectWithValue }) => {
    const response = await client.get(URL.GET_VEHICLE_INFO(orgId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getComplaintReasonsApi = createAsyncThunk(
  "CUSTOMER_INFO_SLICE/getComplaintReasonsApi",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(URL.GET_COMPLAINT_REASON(), payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getInsuranceCompanyApi = createAsyncThunk(
  "CUSTOMER_INFO_SLICE/getInsuranceCompanyApi",
  async (orgId, { rejectWithValue }) => {
    const response = await client.get(URL.GET_INSURANCE_COMPANY(orgId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

const initialState = {
  isLoading: false,
  addCustomerResponseStatus: "pending",
  editCustomerResponseStatus: "pending",
  customerDetailsResponse: "",
  getCustomerDetailsResponseStatus: "pending",
  // Customer Info
  salutation: "",
  firstName: "",
  lastName: "",
  gender: "",
  gender_types_data: [],
  relation_types_data: [],
  relation: "",
  mobile: "",
  alterMobile: "",
  email: "",
  occupation: "",
  datePickerKeyId: "",
  showDatepicker: false,
  dateOfBirth: "",
  age: "",
  anniversaryDate: "",
  sourceType: "",
  subSourceType: "",
  customerTypesResponse: [],
  customerTypes: "",
  sourceTypesResponse: [],
  subSourceTypesResponse: [],
  // Customer Address
  pincode: "",
  addressName: "",
  urban_or_rural: 0,
  houseNum: "",
  streetName: "",
  village: "",
  mandal: "",
  city: "",
  district: "",
  state: "",
  isAddressSet: false,
  // Vehicle Information
  vehicleRegNo: "",
  vehicleMaker: "",
  vehicleMakerList: [],
  vehicleModel: "",
  vehicleModelList: [],
  vehicleVariant: "",
  vehicleVariantList: [],
  vehicleTransmissionType: "",
  vehicleFuelType: "",
  vehicleColor: "",
  vehicleColorList: "",
  vin: "",
  engineNumber: "",
  chassisNumber: "",
  kmReading: "",
  saleDate: "",
  makingMonth: "",
  makingYear: "",
  sellingDealer: "",
  sellingLocation: "",
  fastag: "",
  // Service Information
  serviceDate: "",
  serviceType: "",
  serviceTypeResponse: [],
  subServiceType: "",
  subServiceTypeResponse: [],
  serviceAmount: "",
  serviceCenter: "",
  readingAtService: "",
  serviceAdvisor: "",
  serviceDealerName: "",
  serviceDealerLocation: "",
  serviceFeedback: "",
  complaintReason: "",
  complaintReasonResponse: [],
  complaintStatus: "",
  // Insurance Information
  insuranceCompany: "",
  insuranceCompanyResponse: [],
  insuranceStartDate: "",
  insuranceExpiryDate: "",
  insuranceAmount: "",
  insurancePolicyNo: "",
  // OEM Warranty Information
  oemPeriod: "",
  oemWarrantyNo: "",
  oemStartDate: "",
  oemEndDate: "",
  oemWarrantyAmount: "",
  // EX-Warranty Information
  ewType: "",
  ewPolicyNo: "",
  ewStartDate: "",
  ewExpiryDate: "",
  ewAmountPaid: "",
  // AMC Information
  amcName: "",
  amcPolicyNo: "",
  amcStartDate: "",
  amcExpiryDate: "",
  amcAmountPaid: "",
};

const customerInfoReducer = createSlice({
  name: "CUSTOMER_INFO_SLICE",
  initialState: JSON.parse(JSON.stringify(initialState)),
  reducers: {
    clearStateData: () => JSON.parse(JSON.stringify(initialState)),
    setDropDownData: (state, action: PayloadAction<DropDownModelNew>) => {
      const { key, value, id } = action.payload;
      switch (key) {
        // Customer Info
        case "SALUTATION":
          if (state.salutation !== value) {
            const genderData = SALUTATIONS[value.toLowerCase()];
            state.gender = genderData?.length > 0 ? genderData[0].name : "";
            state.relation = "";
            state.gender_types_data = genderData;
            if (value) {
              state.relation_types_data =
                Relation_Data_Obj[value.toLowerCase()];
            } else {
              state.relation_types_data = [];
            }
          }
          state.salutation = value;
          break;
        case "GENDER":
          state.gender = value;
          break;
        case "RELATION":
          state.relation = value;
          break;
        case "SOURCE_TYPE":
          state.sourceType = value;
          state.subSourceType = "";
          state.subSourceTypesResponse = [];
          break;
        case "SUB_SOURCE_TYPE":
          state.subSourceType = value;
          break;
        case "CUSTOMER_TYPE":
          state.customerTypes = value;
          break;
        // Vehicle Info
        case "VEHICLE_MAKER":
          state.vehicleMaker = value;
          break;
        case "VEHICLE_MODEL":
          state.vehicleModel = value;
          state.vehicleVariant = "";
          state.vehicleTransmissionType = "";
          state.vehicleFuelType = "";
          state.vehicleColor = "";
          break;
        case "VEHICLE_VARIANT":
          state.vehicleVariant = value;
          state.vehicleColor = "";
          break;
        case "VEHICLE_COLOR":
          state.vehicleColor = value;
          break;
        case "VEHICLE_TRANSMISSION_TYPE":
          state.vehicleTransmissionType = value;
          break;
        case "VEHICLE_FUEL_TYPE":
          state.vehicleFuelType = value;
          break;
        case "MAKING_MONTH":
          state.makingMonth = value;
          break;
        case "FASTAG":
          state.fastag = value;
          break;
        // Service Info
        case "SERVICE_TYPE":
          state.serviceType = value;
          state.subServiceType = "";
          break;
        case "SUB_SERVICE_TYPE_LIST":
          state.subServiceTypeResponse = value;
          break;
        case "SUB_SERVICE_TYPE":
          state.subServiceType = value;
          break;
        case "SERVICE_FEEDBACK":
          state.serviceFeedback = value;
          break;
        case "COMPLAINT_REASON":
          state.complaintReason = value;
          break;
        case "COMPLAINT_STATUS":
          state.complaintStatus = value;
          break;
        // Insurance Info
        case "INSURANCE_COMPANY":
          state.insuranceCompany = value;
          break;
        case "OEM_PERIOD":
          state.oemPeriod = value;
          break;
        case "EW_TYPE":
          state.ewType = value;
          break;
        case "AMC_NAME":
          state.amcName = value;
          break;
      }
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
        case "RELATION":
          state.relation = text;
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
        case "OCCUPATION":
          state.occupation = text;
          break;
        case "DOB":
          state.dateOfBirth = text;
          break;
        case "AGE":
          state.age = text;
          break;
        case "ANNIVE_DATE":
          state.anniversaryDate = text;
          break;
        case "SUB_SOURCE_RES":
          state.subSourceTypesResponse = text;
          break;
      }
    },
    setDatePicker: (state, action) => {
      switch (action.payload) {
        case "DATE_OF_BIRTH":
          state.minDate = null;
          state.maxDate = new Date();
          break;
        case "ANNIVERSARY_DATE":
          state.minDate = null;
          state.maxDate = null;
          break;
        case "SALE_DATE":
          state.minDate = null;
          state.maxDate = new Date();
          break;
        case "SERVICE_DATE":
          state.minDate = null;
          state.maxDate = new Date();
          break;
        case "INSURANCE_START_DATE":
          state.minDate = null;
          state.maxDate = state.insuranceExpiryDate
            ? new Date(
                moment(state.insuranceExpiryDate, dateFormate).format(
                  "MM/DD/YYYY"
                )
              )
            : new Date();
          break;
        case "INSURANCE_EXPIRY_DATE":
          state.minDate = state.insuranceStartDate
            ? new Date(
                moment(state.insuranceStartDate, dateFormate).format(
                  "MM/DD/YYYY"
                )
              )
            : new Date();
          state.maxDate = null;
          break;
        case "OEM_START_DATE":
          state.minDate = null;
          state.maxDate = state.oemEndDate
            ? new Date(
                moment(state.oemEndDate, dateFormate).format("MM/DD/YYYY")
              )
            : new Date();
          break;
        case "OEM_END_DATE":
          state.minDate = state.oemStartDate
            ? new Date(
                moment(state.oemStartDate, dateFormate).format("MM/DD/YYYY")
              )
            : new Date();
          state.maxDate = null;
          break;
        case "EW_START_DATE":
          state.minDate = null;
          state.maxDate = state.ewExpiryDate
            ? new Date(
                moment(state.ewExpiryDate, dateFormate).format("MM/DD/YYYY")
              )
            : new Date();
          break;
        case "EW_EXPIRY_DATE":
          state.minDate = state.ewStartDate
            ? new Date(
                moment(state.ewStartDate, dateFormate).format("MM/DD/YYYY")
              )
            : new Date();
          state.maxDate = null;
          break;
        case "AMC_START_DATE":
          state.minDate = null;
          state.maxDate = state.amcExpiryDate
            ? new Date(
                moment(state.amcExpiryDate, dateFormate).format("MM/DD/YYYY")
              )
            : new Date();
          break;
        case "AMC_EXPIRY_DATE":
          state.minDate = state.amcStartDate
            ? new Date(
                moment(state.amcStartDate, dateFormate).format("MM/DD/YYYY")
              )
            : new Date();
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
    updateSelectedDate: (state, action: PayloadAction<PersonalIntroModel>) => {
      const { key, text } = action.payload;
      const selectedDate = convertTimeStampToDateString(text, "YYYY/MM/DD");
      const keyId = key ? key : state.datePickerKeyId;
      switch (keyId) {
        case "DATE_OF_BIRTH":
          state.dateOfBirth = selectedDate;
          const given = moment(selectedDate, "YYYY/MM/DD");
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
        case "SALE_DATE":
          state.saleDate = selectedDate;
          break;
        case "MAKING_MONTH":
          state.saleDate = selectedDate;
          break;
        case "SERVICE_DATE":
          state.serviceDate = selectedDate;
          break;
        case "INSURANCE_START_DATE":
          state.insuranceStartDate = selectedDate;
          break;
        case "INSURANCE_EXPIRY_DATE":
          state.insuranceExpiryDate = selectedDate;
          break;
        case "OEM_START_DATE":
          state.oemStartDate = selectedDate;
          break;
        case "OEM_END_DATE":
          state.oemEndDate = selectedDate;
          break;
        case "EW_START_DATE":
          state.ewStartDate = selectedDate;
          break;
        case "EW_EXPIRY_DATE":
          state.ewExpiryDate = selectedDate;
          break;
        case "AMC_START_DATE":
          state.amcStartDate = selectedDate;
          break;
        case "AMC_EXPIRY_DATE":
          state.amcExpiryDate = selectedDate;
          break;
        case "NONE":
          break;
      }
      state.showDatepicker = !state.showDatepicker;
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
        case "ADDRESS":
          state.addressName = text;
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
        case "MANDAL":
          state.mandal = text;
          break;
        case "CITY":
          state.city = text;
          break;
        case "STATE":
          state.state = text;
          break;
        case "DISTRICT":
          state.district = text;
          break;
      }
    },
    updateAddressByPincode: (state, action) => {
      state.addressName = action.payload.Name || "";
      state.village = action.payload.Block || "";
      state.mandal = state.mandal ? state.mandal : action.payload.Mandal || "";
      state.city = action.payload.District || "";
      state.district = action.payload.District || "";
      state.state = action.payload.State || "";
      if (Object.keys(action.payload).length > 0) {
        state.isAddressSet = true;
      } else {
        state.isAddressSet = false;
      }
    },
    setVehicleInformation: (
      state,
      action: PayloadAction<PersonalIntroModel>
    ) => {
      const { key, text } = action.payload;
      switch (key) {
        case "VEHICLE_REG_NO":
          state.vehicleRegNo = text;
          break;
        case "VEHICLE_VARIANT_LIST":
          state.vehicleVariantList = text;
          break;
        case "VEHICLE_COLOR_LIST":
          state.vehicleColorList = text;
          break;
        case "VEHICLE_FUEL_TYPE":
          state.vehicleFuelType = text;
          break;
        case "VEHICLE_TRANSMISSION_TYPE":
          state.vehicleTransmissionType = text;
          break;
        case "VIN":
          state.vin = text;
          break;
        case "ENGINE_NUMBER":
          state.engineNumber = text;
          break;
        case "CHASSIS_NUMBER":
          state.chassisNumber = text;
          break;
        case "KM_READING":
          state.kmReading = text;
          break;
        case "SELLING_DEALER":
          state.sellingDealer = text;
          break;
        case "SELLING_LOCATION":
          state.sellingLocation = text;
          break;
        case "MAKING_YEAR":
          state.makingYear = text;
          break;
      }
    },
    setServiceInfo: (state, action: PayloadAction<PersonalIntroModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "SERVICE_AMOUNT":
          state.serviceAmount = text;
          break;
        case "SERVICE_CENTER":
          state.serviceCenter = text;
          break;
        case "READING_AT_SERVICE":
          state.readingAtService = text;
          break;
        case "SERVICE_ADVISOR":
          state.serviceAdvisor = text;
          break;
        case "SERVICE_DEALER_NAME":
          state.serviceDealerName = text;
          break;
        case "SERVICE_DEALER_LOCATION":
          state.serviceDealerLocation = text;
          break;
      }
    },
    setInsuranceInfo: (state, action: PayloadAction<PersonalIntroModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "INSURANCE_AMOUNT":
          state.insuranceAmount = text;
          break;
        case "INSURANCE_POLICY_NO":
          state.insurancePolicyNo = text;
          break;
      }
    },
    setOemWarrantyInfo: (state, action: PayloadAction<PersonalIntroModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "OEM_WARRANTY_NO":
          state.oemWarrantyNo = text;
          break;
        case "OEM_WARRANTY_AMOUNT":
          state.oemWarrantyAmount = text;
          break;
      }
    },
    setExWarrantyInfo: (state, action: PayloadAction<PersonalIntroModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "EW_POLICY_NO":
          state.ewPolicyNo = text;
          break;
        case "EW_AMOUNT_PAID":
          state.ewAmountPaid = text;
          break;
      }
    },
    setAmcInfo: (state, action: PayloadAction<PersonalIntroModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "AMC_POLICY_NO":
          state.amcPolicyNo = text;
          break;
        case "AMC_AMOUNT_PAID":
          state.amcAmountPaid = text;
          break;
      }
    }
  },
  extraReducers: (builder) => {
    // Add Customer
    builder
      .addCase(addCustomer.pending, (state, action) => {
        state.isLoading = true;
        state.addCustomerResponseStatus = "pending";
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.addCustomerResponseStatus = "success";
        }
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.addCustomerResponseStatus = "failed";
        state.isLoading = false;
        if (action.payload.message) {
          showToast(`${action.payload.message}`);
        } else {
          showToast(`Something went wrong`);
        }
      });
   
    // Edit Customer
    builder
      .addCase(editCustomer.pending, (state, action) => {
        state.isLoading = true;
        state.editCustomerResponseStatus = "pending";
      })
      .addCase(editCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.editCustomerResponseStatus = "success";
        }
      })
      .addCase(editCustomer.rejected, (state, action) => {
        state.editCustomerResponseStatus = "failed";
        if (action.payload.message){
          showToast(`${action.payload.message}`);
        } else {
          showToast(`Something went wrong`);
        }
        state.isLoading = false;
      });

    // Get Customer Details
    builder
      .addCase(getCustomerDetails.pending, (state, action) => {
        state.isLoading = true;
        state.getCustomerDetailsResponseStatus = "pending";
        state.customerDetailsResponse = "";
      })
      .addCase(getCustomerDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customerDetailsResponse = action.payload.body;
        if (action.payload.body) {
          const { customerDetail } = action.payload.body;
          
          if (customerDetail.addresses.length > 0) {
            let details = customerDetail.addresses[0];
            state.pincode = details.pin;
            state.urban_or_rural = details.isUrban ? 1 : 2;
            state.houseNum = details.houseNo;
            state.streetName = details.street;
            state.village = details.villageOrTown;
            state.mandal = details.mandalOrTahasil;
            state.city = details.city;
            state.district = details.district;
            state.state = details.state;
          }
          // state.leadSource = customerDetail.leadSource;
          // state.parentLeadSource = customerDetail.parentLeadSource;
          state.age = customerDetail.age;
          state.alterMobile = customerDetail.alternateContactNumber;
          state.mobile = customerDetail.contactNumber;
          state.customerTypes = customerDetail.customerType;
          state.anniversaryDate = customerDetail.dateOfArrival;
          state.dateOfBirth = customerDetail.dateOfBirth;
          state.email = customerDetail.email;
          state.firstName = customerDetail.firstName;
          state.gender = customerDetail.gender;
          state.lastName = customerDetail.lastName;
          state.occupation = customerDetail.occupation;
          state.relation = customerDetail.relationName;
          state.salutation = customerDetail.salutation;

          const { historyDetail } = action.payload.body;
          state.complaintStatus = historyDetail.complaintStatus;
          state.serviceDealerLocation = historyDetail.dealerLocation;
          state.serviceDealerName = historyDetail.dealerName;
          state.readingAtService = `${historyDetail.kmReadingAtService}`;
          state.serviceFeedback = historyDetail.lastServiceFeedback;
          state.complaintReason = historyDetail.reasonForComplaint;
          state.serviceAmount = historyDetail.serviceAmount
            ? `${historyDetail.serviceAmount}`
            : "";
          state.serviceCenter = historyDetail.serviceCenter;
          state.serviceDate = historyDetail.serviceDate;
          state.serviceAdvisor = historyDetail.serviceManager;
          // state.serviceType = historyDetail.serviceType;
          // state.subServiceType = historyDetail.subServiceType;

          const { insuranceDetail } = action.payload.body;
          state.insuranceStartDate = insuranceDetail.startDate;
          state.insuranceExpiryDate = insuranceDetail.endDate;
          state.insuranceAmount = insuranceDetail.insuranceAmount
            ? `${insuranceDetail.insuranceAmount}`
            : "";
          state.insurancePolicyNo = insuranceDetail.insuranceIdentifier;
          state.insuranceCompany = insuranceDetail.vendor;

          const { vehicleDetail } = action.payload.body;
          state.chassisNumber = vehicleDetail.chassisNumber;
          state.vehicleColor = vehicleDetail.color;
          state.kmReading = `${vehicleDetail.currentKmReading}`;
          state.engineNumber = vehicleDetail.engineNumber;
          state.vehicleFuelType = vehicleDetail.fuelType;
          state.fastag = vehicleDetail.isFastag ? "Yes" : "No";
          state.makingMonth = vehicleDetail.makingMonth;
          state.makingYear = `${vehicleDetail.makingYear}`;
          state.saleDate = vehicleDetail.purchaseDate;
          state.sellingDealer = vehicleDetail.sellingDealer;
          state.sellingLocation = vehicleDetail.sellingLocation;
          state.vehicleTransmissionType = vehicleDetail.transmisionType;
          state.vehicleVariant = vehicleDetail.variant;
          state.vehicleMaker = vehicleDetail.vehicleMake;
          state.vehicleModel = vehicleDetail.vehicleModel;
          state.vehicleRegNo = vehicleDetail.vehicleRegNumber;
          state.vin = vehicleDetail.vin;

          const { warrantyDetail } = action.payload.body;
          for (let i = 0; i < warrantyDetail.length; i++) {
            let item = warrantyDetail[i];
            if (item.warrantyType == "MCP") {
              state.amcName = item.amc_name;
              state.amcAmountPaid = `${item.amountPaid}`;
              state.amcPolicyNo = item.number;
              state.amcExpiryDate = item.expiryDate;
              state.amcStartDate = item.startDate;
            } else if (item.warrantyType == "EW") {
              state.ewType = item.ewName;
              state.ewAmountPaid = `${item.amountPaid}`;
              state.ewPolicyNo = item.number;
              state.ewStartDate = item.expiryDate;
              state.ewExpiryDate = item.startDate;
            } else if (item.warrantyType == "OEM") {
              state.oemPeriod = item.oemPeriod;
              state.oemWarrantyAmount = `${item.amountPaid}`;
              state.oemWarrantyNo = item.number;
              state.oemStartDate = item.expiryDate;
              state.oemEndDate = item.startDate;
            }
          }

          state.getCustomerDetailsResponseStatus = "success";
        }
      })
      .addCase(getCustomerDetails.rejected, (state, action) => {
        state.getCustomerDetailsResponseStatus = "failed";
        state.customerDetailsResponse = "";
        if (action.payload.message) {
          showToast(`${action.payload.message}`);
        } else {
          showToast(`Something went wrong`);
        }
        state.isLoading = false;
      });

    // Get Customer Types
    builder
      .addCase(getCustomerTypesApi.pending, (state, action) => {
        state.customerTypesResponse = [];
        state.customerTypes = null;
      })
      .addCase(getCustomerTypesApi.fulfilled, (state, action) => {
        if (action.payload) {
          state.customerTypesResponse = action.payload;
        }
      })
      .addCase(getCustomerTypesApi.rejected, (state, action) => {
        state.customerTypesResponse = [];
        state.customerTypes = null;
      });

    // Get Source Types
    builder
      .addCase(getSourceTypesApi.pending, (state, action) => {
        state.sourceTypesResponse = [];
        state.subSourceTypesResponse = [];
      })
      .addCase(getSourceTypesApi.fulfilled, (state, action) => {
        if (action.payload) {
          let sData = action.payload.body;
          let newArr = [];

          for (let i = 0; i < sData.length; i++) {
            let data = { ...sData[i], name: sData[i].type };
            if (
              sData[i]?.subtypeMap &&
              Object.keys(sData[i].subtypeMap).length > 0
            ) {
              let subSource = [];
              let newSubSource = Object.values(sData[i].subtypeMap);
              for (let j = 0; j < newSubSource.length; j++) {
                const element = {
                  ...newSubSource[j],
                  name: newSubSource[j].type,
                };
                subSource.push(element);
              }
              data.subtypeMap = subSource;
            }

            newArr.push(Object.assign({}, data));
          }
          state.sourceTypesResponse = [...newArr];
        }
      })
      .addCase(getSourceTypesApi.rejected, (state, action) => {
        state.sourceTypesResponse = [];
        state.subSourceTypesResponse = [];
      });

    // Get Service Types
    builder
      .addCase(getServiceTypesApi.pending, (state, action) => {
        state.serviceTypeResponse = [];
        state.subServiceTypeResponse = [];
      })
      .addCase(getServiceTypesApi.fulfilled, (state, action) => {
        if (action.payload) {
          let sData = action.payload.body;
          let newArr = [];

          for (let i = 0; i < sData.length; i++) {
            let data = { ...sData[i], name: sData[i].categoryName };
            newArr.push(Object.assign({}, data));
          }
          state.serviceTypeResponse = [...newArr];
        }
      })
      .addCase(getServiceTypesApi.rejected, (state, action) => {
        state.serviceTypeResponse = [];
        state.subServiceTypeResponse = [];
      });

    // Get Sub Service Types
    builder
      .addCase(getSubServiceTypesApi.pending, (state, action) => {
        state.subServiceTypeResponse = [];
      })
      .addCase(getSubServiceTypesApi.fulfilled, (state, action) => {
        if (action.payload) {
          let sData = action.payload.body;
          let newArr = [];

          for (let i = 0; i < sData.length; i++) {
            let data = { ...sData[i], name: sData[i].serviceName };
            newArr.push(Object.assign({}, data));
          }
          state.subServiceTypeResponse = [...newArr];
        }
      })
      .addCase(getSubServiceTypesApi.rejected, (state, action) => {
        state.subServiceTypeResponse = [];
      });

    // Get Complaint Reason
    builder
      .addCase(getComplaintReasonsApi.pending, (state, action) => {
        state.complaintReasonResponse = [];
      })
      .addCase(getComplaintReasonsApi.fulfilled, (state, action) => {
        if (action.payload) {
          let sData = action.payload;
          let newArr = [];

          for (let i = 0; i < sData.length; i++) {
            let data = { ...sData[i], name: sData[i].menu };
            newArr.push(Object.assign({}, data));
          }
          state.complaintReasonResponse = [...newArr];
        }
      })
      .addCase(getComplaintReasonsApi.rejected, (state, action) => {
        state.complaintReasonResponse = [];
      });

    // Get Insurance Company
    builder
      .addCase(getInsuranceCompanyApi.pending, (state, action) => {
        state.insuranceCompanyResponse = [];
      })
      .addCase(getInsuranceCompanyApi.fulfilled, (state, action) => {
        if (action.payload) {
          let sData = action.payload;
          let newArr = [];

          for (let i = 0; i < sData.length; i++) {
            let data = { ...sData[i], name: sData[i].companyName };
            newArr.push(Object.assign({}, data));
          }
          state.insuranceCompanyResponse = [...newArr];
        }
      })
      .addCase(getInsuranceCompanyApi.rejected, (state, action) => {
        state.insuranceCompanyResponse = [];
      });

    // Get Vehicle Info
    builder
      .addCase(getVehicleInfo.pending, (state, action) => {})
      .addCase(getVehicleInfo.fulfilled, (state, action) => {
        if (action.payload) {
          let sData = action.payload;
          let newArr = [];
          let newMakerArr = [];
          for (let i = 0; i < sData.length; i++) {
            let data = { ...sData[i], name: sData[i].model };
            newArr.push(Object.assign({}, data));

            if (sData[i].maker) {
              let payload = { id: i, name: sData[i].maker };
              newMakerArr.push(Object.assign({}, payload));
            }
          }
          state.vehicleModelList = [...newArr];
          state.vehicleMakerList = _.uniqBy(newMakerArr, "name");
        }
      })
      .addCase(getVehicleInfo.rejected, (state, action) => {
        if (action.payload.message) {
          showToast(`${action.payload.message}`);
        } else {
          showToast(`Vehicle info not available`);
        }
      });
  },
});

export const {
  clearStateData,
  setDropDownData,
  setPersonalIntro,
  setDatePicker,
  updateSelectedDate,
  setCommunicationAddress,
  updateAddressByPincode,
  setVehicleInformation,
  setServiceInfo,
  setInsuranceInfo,
  setOemWarrantyInfo,
  setExWarrantyInfo,
  setAmcInfo
} = customerInfoReducer.actions;
export default customerInfoReducer.reducer;