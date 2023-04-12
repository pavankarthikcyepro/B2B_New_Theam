import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { convertTimeStampToDateString } from "../utils/helperFunctions";
import moment from "moment";
import { client } from "../networking/client";
import URL from "../networking/endpoints";

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

export const getCustomerTypesApi = createAsyncThunk(
  "EDIT_CUSTOMER_INFO_SLICE/getCustomerTypesApi",
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
  "EDIT_CUSTOMER_INFO_SLICE/getSourceTypesApi",
  async (tenantId, { rejectWithValue }) => {
    const response = await client.get(URL.GET_SOURCE_TYPE(tenantId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

const initialState = {
  showDatepicker: false,
  // Customer Info
  firstName: "",
  lastName: "",
  mobile: "",
  alterMobile: "",
  email: "",
  dateOfBirth: "",
  age: "",
  anniversaryDate: "",
  customerTypes: "",
  customerTypesResponse: [],
  occupation: "",
  sourceType: "",
  sourceTypesResponse: [],
  subSourceType: "",
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
};

const editCustomerInfoReducer = createSlice({
  name: "EDIT_CUSTOMER_INFO_SLICE",
  initialState: JSON.parse(JSON.stringify(initialState)),
  reducers: {
    clearStateData: () => JSON.parse(JSON.stringify(initialState)),
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
        case "NONE":
          break;
      }
      state.showDatepicker = !state.showDatepicker;
    },
    setDropDownData: (state, action: PayloadAction<DropDownModelNew>) => {
      const { key, value, id } = action.payload;
      switch (key) {
        case "CUSTOMER_TYPE":
          state.customerTypes = value;
          break;
        case "SOURCE_TYPE":
          state.sourceType = value;
          state.subSourceType = "";
          state.subSourceTypesResponse = [];
          break;
        case "SUB_SOURCE_TYPE":
          state.subSourceType = value;
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
        case "AGE":
          state.age = text;
          break;
        case "ANNIVE_DATE":
          state.anniversaryDate = text;
          break;
        case "OCCUPATION":
          state.occupation = text;
          break;
        case "SUB_SOURCE_RES":
          state.subSourceTypesResponse = text;
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
  },
  extraReducers: (builder) => {
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
  }
});

export const {
  clearStateData,
  setDatePicker,
  updateSelectedDate,
  setDropDownData,
  setPersonalIntro,
  setCommunicationAddress,
  updateAddressByPincode,
} = editCustomerInfoReducer.actions;
export default editCustomerInfoReducer.reducer;