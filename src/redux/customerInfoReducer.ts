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
    const response = await client.get(URL.GET_CUSTOMER_TYPES(tenantId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

const initialState = {
  salutation: "",
  gender_types_data: [],
  relation_types_data: [],
  relation: "",
  mobile: "",
  alterMobile: "",
  email: "",
  occupation: "",
  datePickerKeyId: "",
  showDatepicker: false,
  age: "",
  anniversaryDate: "",
  sourceType: "",
  subSourceType: "",
  customerTypesResponse: [],
  customerTypes: "",
  sourceTypes: "",
};

const customerInfoReducer = createSlice({
  name: "CUSTOMER_INFO_SLICE",
  initialState: JSON.parse(JSON.stringify(initialState)),
  reducers: {
    clearStateData: () => JSON.parse(JSON.stringify(initialState)),
    setDropDownData: (state, action: PayloadAction<DropDownModelNew>) => {
      const { key, value, id } = action.payload;
      switch (key) {
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
        case "CUSTOMER_TYPE":
          state.customerTypes = value;
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
      }
    },
    setDatePicker: (state, action) => {
      switch (action.payload) {
        case "DATE_OF_BIRTH":
          state.minDate = null;
          state.maxDate = new Date();
          break;
        case "ANNIVERSARY_DATE":
          if (state.dateOfBirth) {
            state.minDate = null;
          } else {
            state.minDate = null;
          }
          state.maxDate = new Date();
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
        case "NONE":
          break;
      }
      state.showDatepicker = !state.showDatepicker;
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
  },
});

export const {
  clearStateData,
  setDropDownData,
  setPersonalIntro,
  setDatePicker,
  updateSelectedDate,
} = customerInfoReducer.actions;
export default customerInfoReducer.reducer;
