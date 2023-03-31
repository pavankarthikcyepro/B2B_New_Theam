import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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

export const searchCustomer = createAsyncThunk(
  "CUSTOMER_INFO_SLICE/searchCustomer",
  async (payload, { rejectWithValue }) => {
    const { tenantId, vehicleRegNo } = payload;
    const response = await client.get(
      URL.GET_SEARCH_CUSTOMER(tenantId, vehicleRegNo)
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
  vehicleRegNo: "",
  contactNo: "",
  vinNo: "",
  customerName: "",
  serviceType: "",
  engineNo: "",
  policyNo: "",
  searchResultResponseStatus: "",
  searchResult: [],
  serviceTypeResponse: [],
};

const searchCustomerReducer = createSlice({
  name: "SEARCH_CUSTOMER_SLICE",
  initialState: JSON.parse(JSON.stringify(initialState)),
  reducers: {
    clearStateData: () => JSON.parse(JSON.stringify(initialState)),
    clearSearchResult: (state, action) => {
      state.searchResult = [];
    },
    setDropDownData: (state, action: PayloadAction<DropDownModelNew>) => {
      const { key, value, id } = action.payload;
      switch (key) {
        case "SERVICE_TYPE":
          state.serviceType = value;
          break;
      }
    },
    setSearchInformation: (
      state,
      action: PayloadAction<PersonalIntroModel>
    ) => {
      const { key, text } = action.payload;
      switch (key) {
        case "VEHICLE_REG_NO":
          state.vehicleRegNo = text;
          break;
        case "CONTACT_NO":
          state.contactNo = text;
          break;
        case "VIN_NO":
          state.vinNo = text;
          break;
        case "CUSTOMER_NAME":
          state.customerName = text;
          break;
        case "ENGINE_NO":
          state.engineNo = text;
          break;
        case "POLICY_NO":
          state.policyNo = text;
          break;
      }
    },
  },
  extraReducers: (builder) => {
    // Get Service Types
    builder
      .addCase(getServiceTypesApi.pending, (state, action) => {
        state.serviceTypeResponse = [];
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
      });

    // Search Customer
    builder
      .addCase(searchCustomer.pending, (state, action) => {
        state.isLoading = true;
        state.searchResultResponseStatus = "pending";
      })
      .addCase(searchCustomer.fulfilled, (state, action) => {
        if (action.payload) {
          state.isLoading = false;
          state.searchResult = action.payload.body.content;
          state.searchResultResponseStatus = "success";
        }
      })
      .addCase(searchCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.searchResult = [];
        state.searchResultResponseStatus = "failed";
      });
  },
});

export const {
  clearStateData,
  clearSearchResult,
  setDropDownData,
  setSearchInformation,
} = searchCustomerReducer.actions;
export default searchCustomerReducer.reducer;