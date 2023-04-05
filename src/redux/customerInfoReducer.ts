import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";
import { Gender_Data_Obj, Relation_Data_Obj } from "../jsonData/enquiryFormScreenJsonData";
import { client } from "../networking/client";
import URL from "../networking/endpoints";
import { convertTimeStampToDateString } from "../utils/helperFunctions";

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
            const genderData = Gender_Data_Obj[value.toLowerCase()];
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
        // Service Info
        case "SERVICE_TYPE":
          state.serviceType = value;
          state.subServiceType = "";
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
        case "FASTAG":
          state.fastag = value;
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
                moment(state.insuranceExpiryDate, "DD/MM/YYYY").format(
                  "MM/DD/YYYY"
                )
              )
            : new Date();
          break;
        case "INSURANCE_EXPIRY_DATE":
          state.minDate = state.insuranceStartDate
            ? new Date(
                moment(state.insuranceStartDate, "DD/MM/YYYY").format(
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
                moment(state.oemEndDate, "DD/MM/YYYY").format("MM/DD/YYYY")
              )
            : new Date();
          break;
        case "OEM_END_DATE":
          state.minDate = state.oemStartDate
            ? new Date(
                moment(state.oemStartDate, "DD/MM/YYYY").format("MM/DD/YYYY")
              )
            : new Date();
          state.maxDate = null;
          break;
        case "EW_START_DATE":
          state.minDate = null;
          state.maxDate = state.ewExpiryDate
            ? new Date(
                moment(state.ewExpiryDate, "DD/MM/YYYY").format("MM/DD/YYYY")
              )
            : new Date();
          break;
        case "EW_EXPIRY_DATE":
          state.minDate = state.ewStartDate
            ? new Date(
                moment(state.ewStartDate, "DD/MM/YYYY").format("MM/DD/YYYY")
              )
            : new Date();
          state.maxDate = null;
          break;
        case "AMC_START_DATE":
          state.minDate = null;
          state.maxDate = state.amcExpiryDate
            ? new Date(
                moment(state.amcExpiryDate, "DD/MM/YYYY").format("MM/DD/YYYY")
              )
            : new Date();
          break;
        case "AMC_EXPIRY_DATE":
          state.minDate = state.amcStartDate
            ? new Date(
                moment(state.amcStartDate, "DD/MM/YYYY").format("MM/DD/YYYY")
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
    },
  },
  extraReducers: (builder) => {
    // ADD Customer
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
      .addCase(getVehicleInfo.pending, (state, action) => {

      })
      .addCase(getVehicleInfo.fulfilled, (state, action) => {
        if (action.payload) {
          let sData = action.payload;
          let newArr = [];

          for (let i = 0; i < sData.length; i++) {
            let data = { ...sData[i], name: sData[i].model };
            newArr.push(Object.assign({}, data));
          }
          state.vehicleModelList = [...newArr];
        }
      })
      .addCase(getVehicleInfo.rejected, (state, action) => {

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
  setAmcInfo,
} = customerInfoReducer.actions;
export default customerInfoReducer.reducer;
