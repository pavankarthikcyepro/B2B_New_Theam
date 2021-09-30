import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";


interface CustomerDetailModel {
  key: string;
  text: string;
}

interface DropDownModelNew {
  id: any;
  key: string;
  value: string;
}

interface DatePickerModel {
  key: string;
  mode: string;
}

export const getTaskDetailsApi = createAsyncThunk("TEST_DRIVE_SLICE/getTaskDetailsApi", async (taskId, { rejectWithValue }) => {

  const response = await client.get(URL.GET_TASK_DETAILS(taskId));
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

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

export const bookTestDriveAppointmentApi = createAsyncThunk("TEST_DRIVE_SLICE/bookTestDriveAppointmentApi", async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.BOOK_TEST_DRIVE_APPOINTMENT(), payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const updateTestDriveTaskApi = createAsyncThunk("TEST_DRIVE_SLICE/updateTestDriveTaskApi", async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.UPDATE_TEST_DRIVE_TASK(), payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getTestDriveAppointmentDetailsApi = createAsyncThunk("TEST_DRIVE_SLICE/getAppointmentDetailsApi", async (payload, { rejectWithValue }) => {

  const response = await client.get(URL.GET_TEST_DRIVE_APPOINTMENT_DETAILS(payload["entityModuleId"], payload["barnchId"], payload["orgId"]));
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
    test_drive_vehicle_list: [],
    test_drive_vehicle_list_for_drop_down: [],
    task_details_response: null,
    book_test_drive_appointment_response: null,
    test_drive_update_task_response: null,
    test_drive_appointment_details_response: null,
    // Customer Details
    name: "",
    mobile: "",
    email: "",
    model: "",
    varient: "",
    fuel_type: "",
    transmission_type: "",
    selected_vehicle_id: "",
    address_type_is_showroom: "true",
    customer_address: "",
    customer_having_driving_licence: "false",
    customer_preferred_date: "",
    selected_dse_employee: "",
    selected_dse_id: "",
    selected_driver: "",
    selected_driver_id: "",
    customer_preferred_time: "",
    actual_start_time: "",
    actual_end_time: ""
  },
  reducers: {
    clearState: (state, action) => {
      state.book_test_drive_appointment_response = null;
      state.test_drive_update_task_response = null;
      state.task_details_response = null;
      state.test_drive_appointment_details_response = null;
    },
    setDropDownData: (state, action: PayloadAction<DropDownModelNew>) => {
      const { key, value, id } = action.payload;
      switch (key) {
        case "MODEL":
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
          state.selected_driver_id = id;
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
    updateSelectedTestDriveVehicle: (state, action) => {

      const vehicleInfo = action.payload;
      console.log(vehicleInfo);
      state.model = vehicleInfo.model;
      state.varient = vehicleInfo.varient;
      state.fuel_type = vehicleInfo.fuelType;
      state.transmission_type = vehicleInfo.transmissionType;
      state.selected_vehicle_id = vehicleInfo.id;
    },
    updateBasicDetails: (state, action) => {
      const taskData = action.payload;
      if (taskData) {
        const leadDtoObj = taskData.leadDto;
        state.name = leadDtoObj.firstName + " " + leadDtoObj.lastName;
        state.email = leadDtoObj.email || "";
        state.mobile = leadDtoObj.phone || "";
        state.selected_dse_employee = taskData.assignee.empName;
        state.selected_dse_id = taskData.assignee.empId;
      }
    }
  },
  extraReducers: (builder) => {
    // Get Task Details Api
    builder.addCase(getTaskDetailsApi.fulfilled, (state, action) => {
      if (action.payload.success === true && action.payload.dmsEntity) {
        state.task_details_response = action.payload.dmsEntity.task;
      } else {
        state.task_details_response = null;
      }
    })
    builder.addCase(getTaskDetailsApi.rejected, (state, action) => {
      state.task_details_response = null;
    })
    // Get Test Drive Appointment Details
    builder.addCase(getTestDriveAppointmentDetailsApi.fulfilled, (state, action) => {
      if (action.payload != null && action.payload.statusCode === "200") {
        if (action.payload.testDrives && action.payload.testDrives.length > 0) {
          state.test_drive_appointment_details_response = action.payload.testDrives[0];
        }
      }
    })
    builder.addCase(getTestDriveAppointmentDetailsApi.rejected, (state, action) => {
      console.log("F getTestDriveAppointmentDetailsApi: ", JSON.stringify(action.payload));
      state.test_drive_appointment_details_response = null;
    })
    // Get Test Drive Vehicle list
    builder.addCase(getTestDriveVehicleListApi.fulfilled, (state, action) => {
      // console.log("S getTestDriveVehicleListApi: ", JSON.stringify(action.payload));
      if (action.payload.status === "SUCCESS" && action.payload.vehicles) {
        const vehicles = action.payload.vehicles;
        state.test_drive_vehicle_list = vehicles;

        // For dropdown
        let new_vehicles = [];
        vehicles.forEach(element => {
          const vehicleInfo = element.vehicleInfo;
          new_vehicles.push({
            id: vehicleInfo.vehicleId,
            name: vehicleInfo.model,
            model: vehicleInfo.model,
            varient: vehicleInfo.varientName,
            fuelType: vehicleInfo.fuelType,
            transmissionType: vehicleInfo.transmission_type
          })
        });
        state.test_drive_vehicle_list_for_drop_down = new_vehicles;
      }
    })
    builder.addCase(getTestDriveVehicleListApi.rejected, (state, action) => {
      state.test_drive_vehicle_list = [];
      state.test_drive_vehicle_list_for_drop_down = [];
    })
    builder.addCase(getTestDriveDseEmployeeListApi.fulfilled, (state, action) => {
      //console.log("S getTestDriveDseEmployeeListApi: ", JSON.stringify(action.payload));
      if (action.payload.dmsEntity) {
        state.employees_list = action.payload.dmsEntity.employees;
      }
    })
    builder.addCase(getDriversListApi.fulfilled, (state, action) => {
      //console.log("S getDriversListApi: ", JSON.stringify(action.payload));
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
    // Book Test Drive Appointment
    builder.addCase(bookTestDriveAppointmentApi.pending, (state, action) => {
      state.isLoading = true;
    })
    builder.addCase(bookTestDriveAppointmentApi.fulfilled, (state, action) => {
      if (action.payload.statusCode == "200") {
        state.book_test_drive_appointment_response = action.payload;
      }
      state.isLoading = false;
    })
    builder.addCase(bookTestDriveAppointmentApi.rejected, (state, action) => {
      state.book_test_drive_appointment_response = null;
      state.isLoading = false;
    })
    // Update Test Drive Task
    builder.addCase(updateTestDriveTaskApi.pending, (state, action) => {
      state.isLoading = true;
    })
    builder.addCase(updateTestDriveTaskApi.fulfilled, (state, action) => {
      console.log("S updateTestDriveTaskApi: ", JSON.stringify(action.payload));
      if (action.payload.success === true) {
        state.test_drive_update_task_response = "success";
      }
      state.isLoading = false;
    })
    builder.addCase(updateTestDriveTaskApi.rejected, (state, action) => {
      console.log("F updateTestDriveTaskApi: ", JSON.stringify(action.payload));
      state.test_drive_update_task_response = "failed";
      state.isLoading = false;
    })
  }
});

export const {
  clearState,
  updateSelectedDate,
  setTestDriveDetails,
  setDropDownData,
  updateBasicDetails,
  updateSelectedTestDriveVehicle
} = testDriveSlice.actions;
export default testDriveSlice.reducer;
