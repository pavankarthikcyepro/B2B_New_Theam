import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";


interface CustomerDetailModel {
  key: string;
  text: string;
}

interface DropDownModelNew {
  key: string;
  value: string;
}

interface DatePickerModel {
  key: string;
  mode: string;
}

export const getTestDriveDseEmployeeListApi = createAsyncThunk("TEST_DRIVE_SLICE/getTestDriveDseEmployeeListApi", async (payload, { rejectWithValue }) => {

  const response = await client.get(URL.GET_TEST_DRIVE_DSE_LIST());
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getDriversListApi = createAsyncThunk("TEST_DRIVE_SLICE/getDriversListApi", async (payload, { rejectWithValue }) => {

  const response = await client.get(URL.GET_DRIVERS_LIST());
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getTestDriveVehicleListApi = createAsyncThunk("TEST_DRIVE_SLICE/getTestDriveVehicleListApi", async (payload, { rejectWithValue }) => {

  const response = await client.get(URL.GET_TEST_DRIVE_VEHICLES(payload["barnchId"], payload["orgId"]));
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

const testDriveSlice = createSlice({
  name: "TEST_DRIVE_SLICE",
  initialState: {
    status: "",
    isLoading: false,
    employees_list: [],
    drivers_list: [],
    // Customer Details
    name: "",
    mobile: "",
    email: "",
    model: "",
    varient: "",
    fuel_type: "",
    transmission_type: "",
    address_type_is_showroom: "",
    customer_address: "",
    customer_having_driving_licence: "",
    customer_preferred_date: "",
    selected_dse_employee: "",
    selected_driver: "",
    customer_preferred_time: "",
    actual_start_time: "",
    actual_end_time: ""
  },
  reducers: {
    setDropDownData: (state, action: PayloadAction<DropDownModelNew>) => {
      const { key, value } = action.payload;
      switch (key) {
        case "MODEL":
          if (state.model != value) {
            state.varient = "";
            state.fuel_type = "";
            state.transmission_type = "";
          }
          state.model = value;
          break;
        case "VARIENT":
          state.varient = value;
          break;
        case "LIST_OF_DSE_EMPLOYEES":
          state.selected_dse_employee = value;
          break;
        case "LIST_OF_DRIVERS":
          state.selected_driver = value;
          break;
      }
    },
    updateSelectedDate: (state, action: PayloadAction<CustomerDetailModel>) => {
      const { key, text } = action.payload;
      console.log(text);
      switch (key) {
        case "PREFERRED_DATE":
          state.customer_preferred_date = text;
          break;
        case "CUSTOMER_PREFERRED_TIME":
          state.customer_preferred_time = text;
          break;
        case "ACTUAL_START_TIME":
          state.actual_start_time = text;
          break;
        case "ACTUAL_END_TIME":
          state.actual_end_time = text;
          break;
      }
    },
    setTestDriveDetails: (state, action: PayloadAction<CustomerDetailModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "MOBILE":
          state.mobile = text;
          break;
        case "NAME":
          state.name = text;
          break;
        case "EMAIL":
          state.email = text;
          break;
        case "CUSTOMER_ADDRESS":
          state.customer_address = text;
          break;
        case "CHOOSE_ADDRESS":
          state.address_type_is_showroom = text;
          break;
        case "CUSTOMER_HAVING_DRIVING_LICENCE":
          state.customer_having_driving_licence = text;
          break;
      }
    },
    updateFuelAndTransmissionType: (state, action) => {
      state.fuel_type = action.payload.fuelType;
      state.transmission_type = action.payload.transmissionType;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getTestDriveVehicleListApi.fulfilled, (state, action) => {
      console.log("S getTestDriveVehicleListApi: ", JSON.stringify(action.payload));
    })
    builder.addCase(getTestDriveDseEmployeeListApi.fulfilled, (state, action) => {
      //console.log("S getTestDriveDseEmployeeListApi: ", JSON.stringify(action.payload));
      if (action.payload.dmsEntity) {
        state.employees_list = action.payload.dmsEntity.employees;
      }
    })
    builder.addCase(getDriversListApi.fulfilled, (state, action) => {
      console.log("S getDriversListApi: ", JSON.stringify(action.payload));
      if (action.payload.dmsEntity) {
        const driversList = action.payload.dmsEntity.employees;
        let newFormatDriversList = [];
        driversList.forEach((item) => {
          newFormatDriversList.push({
            id: item.empId,
            name: item.empName
          })
        })
        state.drivers_list = newFormatDriversList;
      }
    })
  }
});

export const {
  updateSelectedDate,
  setTestDriveDetails,
  setDropDownData,
  updateFuelAndTransmissionType
} = testDriveSlice.actions;
export default testDriveSlice.reducer;
