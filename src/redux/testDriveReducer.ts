import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import moment from "moment";
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

export const getTaskDetailsApi = createAsyncThunk("TEST_DRIVE_SLICE/getTaskDetailsApi", async (taskId, { rejectWithValue }) => {

  const response = await client.get(URL.GET_TASK_DETAILS(taskId));
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getTestDriveDseEmployeeListApi = createAsyncThunk("TEST_DRIVE_SLICE/getTestDriveDseEmployeeListApi", async (orgId, { rejectWithValue }) => {

  const response = await client.get(URL.GET_TEST_DRIVE_DSE_LIST(orgId));
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getDriversListApi = createAsyncThunk("TEST_DRIVE_SLICE/getDriversListApi", async (orgId, { rejectWithValue }) => {

  const response = await client.get(URL.GET_DRIVERS_LIST(orgId));
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
  console.log("TD URL: ", URL.BOOK_TEST_DRIVE_APPOINTMENT());
  
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const updateTestDriveTaskApi = createAsyncThunk("TEST_DRIVE_SLICE/updateTestDriveTaskApi", async (payload, { rejectWithValue }) => {
  console.log("PAY:", JSON.stringify(payload));

  const response = await client.post(URL.UPDATE_TEST_DRIVE_TASK(), payload);

  try {
    const json = await response.json();
    console.log("DATA:", JSON.stringify(json));
    if (response.status != 200) {
      return rejectWithValue(json);
    }
    return json;
  } catch (error) {
    console.error("JSON parse error: ", error + " : " + JSON.stringify(response));
    return rejectWithValue({ message: "Json parse error: " + JSON.stringify(response) });
  }

  // const json = await response.json()
  // if (!response.ok) {
  //   return rejectWithValue(json);
  // }
  // return json;
})

export const getTestDriveAppointmentDetailsApi = createAsyncThunk("TEST_DRIVE_SLICE/getAppointmentDetailsApi", async (payload, { rejectWithValue }) => {
  console.log("URL ", URL.GET_TEST_DRIVE_APPOINTMENT_DETAILS(payload["entityModuleId"], payload["barnchId"], payload["orgId"]));

  const response = await client.get(URL.GET_TEST_DRIVE_APPOINTMENT_DETAILS(payload["entityModuleId"], payload["barnchId"], payload["orgId"]));
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const validateTestDriveApi = createAsyncThunk("TEST_DRIVE_SLICE/validateTestDriveApi", async (payload, { rejectWithValue }) => {

  const response = await client.get(URL.VALIDATE_TEST_DRIVE_DATE(payload["date"], payload["vehicleId"]));
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
    test_drive_varients_obj_for_drop_down: {},
    task_details_response: null,
    book_test_drive_appointment_response: null,
    test_drive_update_task_response: null,
    test_drive_appointment_details_response: null,
    test_drive_date_validate_response: null,
    // Customer Details
    customer_preferred_date: "",
    customer_preferred_time: "",
    actual_start_time: "",
    actual_end_time: "",
    driverId: "",
  },
  reducers: {
    clearState: (state, action) => {
      state.customer_preferred_date = "";
      state.customer_preferred_time = "";
      state.actual_start_time = "";
      state.actual_end_time = "";
      state.book_test_drive_appointment_response = null;
      state.test_drive_update_task_response = null;
      state.task_details_response = null;
      state.test_drive_appointment_details_response = null;
      state.test_drive_date_validate_response = null;
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
  },
  extraReducers: (builder) => {
    // Get Task Details Api
    builder.addCase(getTaskDetailsApi.pending, (state, action) => {
      state.task_details_response = null;
    })
    builder.addCase(getTaskDetailsApi.fulfilled, (state, action) => {
      console.log("S getTaskDetailsApi: ", JSON.stringify(action.payload));
      if (action.payload.success === true && action.payload.dmsEntity) {
        state.task_details_response = action.payload.dmsEntity.task;
      } else {
        state.task_details_response = null;
      }
    })
    builder.addCase(getTaskDetailsApi.rejected, (state, action) => {
      console.log("F getTaskDetailsApi: ", JSON.stringify(action.payload));
      state.task_details_response = null;
    })
    // Get Test Drive Appointment Details
    builder.addCase(getTestDriveAppointmentDetailsApi.pending, (state, action) => {
      state.test_drive_appointment_details_response = null;
    })
    builder.addCase(getTestDriveAppointmentDetailsApi.fulfilled, (state, action) => {
      console.log("S getTestDriveAppointmentDetailsApi: ", JSON.stringify(action.payload));
      if (action.payload != null && action.payload.statusCode === "200") {
        if (action.payload.testDrives && action.payload.testDrives.length > 0) {

          const testDrivesInfo = action.payload.testDrives[0];

          const testDriveDatetime = testDrivesInfo.testDriveDatetime ? testDrivesInfo.testDriveDatetime : "";
          const testDriveDatetimeAry = testDriveDatetime.split(" ");
          if (testDriveDatetimeAry.length > 0) {
            state.customer_preferred_date = moment(testDriveDatetimeAry[0], "DD-MM-YYYY").format("DD/MM/YYYY")
          }
          if (testDriveDatetimeAry.length > 1) {
            state.customer_preferred_time = testDriveDatetimeAry[1];
          }

          const startTime = testDrivesInfo.startTime ? testDrivesInfo.startTime : "";
          const startTimeAry = startTime.split(" ");
          if (startTimeAry.length > 1) {
            state.actual_start_time = startTimeAry[1];
          }
          state.driverId = testDrivesInfo.driverId;
          const endTime = testDrivesInfo.endTime ? testDrivesInfo.endTime : "";
          const endTimeAry = endTime.split(" ");
          if (endTimeAry.length > 1) {
            state.actual_end_time = endTimeAry[1];
          }
          state.test_drive_appointment_details_response = testDrivesInfo;
        }
      }
    })
    builder.addCase(getTestDriveAppointmentDetailsApi.rejected, (state, action) => {
      // console.log("F getTestDriveAppointmentDetailsApi: ", JSON.stringify(action.payload));
      state.test_drive_appointment_details_response = null;
    })
    // Get Test Drive Vehicle list
    builder.addCase(getTestDriveVehicleListApi.pending, (state, action) => {
      state.test_drive_vehicle_list = [];
      state.test_drive_vehicle_list_for_drop_down = [];
    })
    builder.addCase(getTestDriveVehicleListApi.fulfilled, (state, action) => {
      console.log("S getTestDriveVehicleListApi: ", JSON.stringify(action.payload));
      if (action.payload.status === "SUCCESS" && action.payload.vehicles) {
        const vehicles = action.payload.vehicles;
        state.test_drive_vehicle_list = vehicles;

        // For dropdown
        let new_vehicles = [];
        let vehicleNames = [];
        let varientObj = {};
        vehicles.forEach(element => {
          const vehicleInfo = element.vehicleInfo;
          const vehicleInfoForModel = { ...vehicleInfo, name: vehicleInfo.model, id: vehicleInfo.vehicleId };
          const vehicleInfoForVarient = { ...vehicleInfo, name: vehicleInfo.varientName, id: vehicleInfo.vehicleId };

          if (vehicleNames.includes(vehicleInfo.vehicleId)) {
            const oldData = varientObj[vehicleInfo.model];
            varientObj[vehicleInfo.model] = [...oldData, vehicleInfoForVarient];
          } else {
            vehicleNames.push(vehicleInfo.vehicleId);
            varientObj[vehicleInfo.model] = [vehicleInfoForVarient];
            new_vehicles.push(vehicleInfoForModel)
          }
        });
        console.log("length: ", new_vehicles.length)
        state.test_drive_vehicle_list_for_drop_down = new_vehicles;
        state.test_drive_varients_obj_for_drop_down = varientObj;
      }
    })
    builder.addCase(getTestDriveVehicleListApi.rejected, (state, action) => {
      state.test_drive_vehicle_list = [];
      state.test_drive_vehicle_list_for_drop_down = [];
    })
    builder.addCase(getTestDriveDseEmployeeListApi.pending, (state, action) => {
      state.employees_list = [];
    })
    builder.addCase(getTestDriveDseEmployeeListApi.fulfilled, (state, action) => {
      // console.log("getTestDriveDseEmployeeListApi S: ", action.payload);
      if (action.payload.dmsEntity) {
        state.employees_list = action.payload.dmsEntity.employees;
      }
    })
    builder.addCase(getTestDriveDseEmployeeListApi.rejected, (state, action) => {
      state.employees_list = [];
    })
    // Get Driviers List
    builder.addCase(getDriversListApi.pending, (state, action) => {
      state.drivers_list = [];
    })
    builder.addCase(getDriversListApi.fulfilled, (state, action) => {
      //console.log("getDriversListApi S: ", action.payload);
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
    builder.addCase(getDriversListApi.rejected, (state, action) => {
      console.log("getDriversListApi F: ", action.payload);
      state.drivers_list = [];
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
      if (action.payload.success === true) {
        state.test_drive_update_task_response = "success";
      }
      else {
        state.test_drive_update_task_response = action.payload.errorMessage;
      }
      state.isLoading = false;
    })
    builder.addCase(updateTestDriveTaskApi.rejected, (state, action) => {
      state.test_drive_update_task_response = "failed";
      state.isLoading = false;
    })
    // Validate Test Drive Api
    builder.addCase(validateTestDriveApi.pending, (state, action) => {
      state.test_drive_date_validate_response = null;
    })
    builder.addCase(validateTestDriveApi.fulfilled, (state, action) => {
      state.test_drive_date_validate_response = action.payload;
    })
    builder.addCase(validateTestDriveApi.rejected, (state, action) => {
      state.test_drive_date_validate_response = null;
    })
  }
});

export const {
  clearState,
  updateSelectedDate,
} = testDriveSlice.actions;
export default testDriveSlice.reducer;
