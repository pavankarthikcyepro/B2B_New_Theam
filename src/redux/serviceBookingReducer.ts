import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";
import { showToast } from "../utils/toast";
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

export const getBookingList = createAsyncThunk(
  "SERVICE_BOOKING_SLICE/getBookingList",
  async (payload, { rejectWithValue }) => {
    const { tenantId, vehicleRegNumber } = payload;
    const response = await client.get(
      URL.GET_SERVICE_BOOKING_LIST(tenantId, vehicleRegNumber)
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getCities = createAsyncThunk(
  "SERVICE_BOOKING_SLICE/getCities",
  async (tenantId, { rejectWithValue }) => {
    const response = await client.get(URL.GET_CITIES(tenantId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getServiceTypesApi = createAsyncThunk(
  "SERVICE_BOOKING_SLICE/getServiceTypesApi",
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
  "SERVICE_BOOKING_SLICE/getSubServiceTypesApi",
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

export const getTimeSlots = createAsyncThunk(
  "SERVICE_BOOKING_SLICE/getTimeSlots",
  async (payload, { rejectWithValue }) => {
    const { tenantId, date } = payload;
    const response = await client.get(
      URL.GET_BOOKING_TIME_SLOTS(tenantId, date)
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const createCustomerBooking = createAsyncThunk(
  "SERVICE_BOOKING_SLICE/createCustomerBooking",
  async (payload, { rejectWithValue }) => {
    const { tenantId, bookingData } = payload;
    const response = await client.post(
      URL.CREATE_CUSTOMER_BOOKING(tenantId),
      bookingData
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

const initialState = {
  isLoading: false,
  showDatepicker: false,
  createCustomerBookingResponseStatus: "pending",
  datePickerKeyId: "",
  bookingList: [],
  cities: [],
  serviceType: "",
  subServiceType: "",
  serviceTypeResponse: [],
  subServiceTypeResponse: [],
  serviceReqDate: "",
  bookingTimeSlotsList: [],
  selectedTimeSlot: "",
  bookingFacility: "",
  location: "",
  serviceCenterCode: "",
  serviceCenterCodeList: [],
  serviceAdvisorName: "",
  driverName: "",
  // address
  pickAddress: "",
  pickCity: "",
  pickState: "",
  pickPinCode: "",
  pickUpTime: "",
  dropAddress: "",
  dropCity: "",
  dropState: "",
  dropPinCode: "",
  dropUpTime: "",
  doorKm: "",
  doorAddress: "",
};

const serviceBookingReducer = createSlice({
  name: "SERVICE_BOOKING_SLICE",
  initialState: JSON.parse(JSON.stringify(initialState)),
  reducers: {
    clearStateData: (state, action) => {
      state.isLoading = false;
      state.showDatepicker = false;
      state.createCustomerBookingResponseStatus = "pending";
      state.datePickerKeyId = "";
      state.cities = [];
      state.serviceType = "";
      state.subServiceType = "";
      state.serviceTypeResponse = [];
      state.subServiceTypeResponse = [];
      state.serviceReqDate = "";
      state.bookingTimeSlotsList = [];
      state.selectedTimeSlot = "";
      state.bookingFacility = "";
      state.location = "";
      state.serviceCenterCode = "";
      state.serviceCenterCodeList = [];
      state.serviceAdvisorName = "";
      state.driverName = "";
      state.pickAddress = "";
      state.pickCity = "";
      state.pickState = "";
      state.pickPinCode = "";
      state.pickUpTime = "";
      state.dropAddress = "";
      state.dropCity = "";
      state.dropState = "";
      state.dropPinCode = "";
      state.dropUpTime = "";
      state.doorKm = "";
      state.doorAddress = "";
    },
    clearBookingStateData: (state, action) => {
      state.bookingList = [];
    },
    setDropDownData: (state, action: PayloadAction<DropDownModelNew>) => {
      const { key, value, id } = action.payload;
      switch (key) {
        // Service Info
        case "SERVICE_TYPE":
          state.serviceType = value;
          state.subServiceType = "";
          if (!value) {
            state.subServiceTypeResponse = [];
          }
          break;
        case "SUB_SERVICE_TYPE":
          state.subServiceType = value;
          break;
        case "TIME_SLOT_ID":
          state.selectedTimeSlot = value;
          break;
        case "BOOKING_FACILITIES":
          state.bookingFacility = value;
          break;
        case "LOCATION":
          state.location = value;
          break;
        case "SERVICE_CENTER_CODE":
          state.serviceCenterCode = value;
          break;
        case "SERVICE_CENTER_CODE_LIST":
          state.serviceCenterCodeList = value;
          break;
        case "SERVICE_ADVISOR_NAME":
          state.serviceAdvisorName = value;
          break;
        case "DRIVER_NAME":
          state.driverName = value;
          break;
      }
    },
    setDatePicker: (state, action) => {
      switch (action.payload) {
        case "SERVICE_REQ_DATE":
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
    updateSelectedDate: (state, action: PayloadAction<PersonalIntroModel>) => {
      const { key, text } = action.payload;
      const keyId = key ? key : state.datePickerKeyId;
      switch (keyId) {
        case "SERVICE_REQ_DATE":
          state.serviceReqDate = text;
          state.selectedTimeSlot = "";
          break;
        case "PICKUP_TIME":
          state.pickUpTime = text;
          break;
        case "DROPUP_TIME":
          state.dropUpTime = text;
          break;
      }
      state.showDatepicker = !state.showDatepicker;
    },
    setInputInfo: (state, action: PayloadAction<PersonalIntroModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "PICK_ADDRESS":
          state.pickAddress = text;
          break;
        case "PICK_CITY":
          state.pickCity = text;
          break;
        case "PICK_STATE":
          state.pickState = text;
          break;
        case "PICK_PINCODE":
          state.pickPinCode = text;
          break;
        case "DROP_ADDRESS":
          state.dropAddress = text;
          break;
        case "DROP_CITY":
          state.dropCity = text;
          break;
        case "DROP_STATE":
          state.dropState = text;
          break;
        case "DROP_PINCODE":
          state.dropPinCode = text;
          break;
        case "SAME_ADDRESS":
          state.dropAddress = state.pickAddress;
          state.dropCity = state.pickCity;
          state.dropState = state.pickState;
          state.dropPinCode = state.pickPinCode;
          break;
        case "DOOR_ADDRESS":
          state.doorAddress = text;
          break;
        case "DOOR_KM":
          state.doorKm = text;
          break;
      }
    },
  },
  extraReducers: (builder) => {
    // Get Booking List
    builder
      .addCase(getBookingList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getBookingList.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.bookingList = action.payload.body.content;
        }
      })
      .addCase(getBookingList.rejected, (state, action) => {
        state.addCustomerResponseStatus = "failed";
        state.isLoading = false;
        if (action.payload.message) {
          showToast(`${action.payload.message}`);
        } else {
          showToast(`Something went wrong`);
        }
      });

    // Get Service Types
    builder
      .addCase(getCities.pending, (state, action) => {
        state.cities = [];
      })
      .addCase(getCities.fulfilled, (state, action) => {
        if (action.payload) {
          let sData = action.payload.body;
          let newArr = [];

          for (let i = 0; i < sData.length; i++) {
            let data = { id: i, name: sData[i] };
            newArr.push(Object.assign({}, data));
          }
          state.cities = [...newArr];
        }
      })
      .addCase(getCities.rejected, (state, action) => {
        state.cities = [];
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

    // Get Booking Time Slots
    builder
      .addCase(getTimeSlots.pending, (state, action) => {
        state.bookingTimeSlotsList = [];
      })
      .addCase(getTimeSlots.fulfilled, (state, action) => {
        if (action.payload) {
          state.bookingTimeSlotsList = [...action.payload.body];
        }
      })
      .addCase(getTimeSlots.rejected, (state, action) => {
        state.bookingTimeSlotsList = [];
      });

    // Create Customer Booking
    builder
      .addCase(createCustomerBooking.pending, (state, action) => {
        state.createCustomerBookingResponseStatus = "pending";
      })
      .addCase(createCustomerBooking.fulfilled, (state, action) => {
        if (action.payload) {
          state.createCustomerBookingResponseStatus = "success";
        }
      })
      .addCase(createCustomerBooking.rejected, (state, action) => {
        state.createCustomerBookingResponseStatus = "failed";
        if (action.payload.message) {
          showToast(`${action.payload.message}`);
        } else {
          showToast(`Something went wrong`);
        }
      });
  },
});

export const {
  clearStateData,
  clearBookingStateData,
  setDropDownData,
  setDatePicker,
  updateSelectedDate,
  setInputInfo,
} = serviceBookingReducer.actions;
export default serviceBookingReducer.reducer;
