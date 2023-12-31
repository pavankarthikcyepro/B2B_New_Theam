import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import moment from "moment";
import { client } from "../networking/client";
import URL from "../networking/endpoints";
import { showToast, showToastRedAlert, showToastSucess } from "../utils/toast";

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
  
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const updateTestDriveTaskApi = createAsyncThunk("TEST_DRIVE_SLICE/updateTestDriveTaskApi", async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.UPDATE_TEST_DRIVE_TASK(), payload);

  try {
    const json = await response.json();
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

export const generateOtpApi = createAsyncThunk("HOME_VISIT_SLICE/generateOtpApi", async (payload, { rejectWithValue }) => {
  const url = `${URL.GENERATE_OTP()}?type=TEST DRIVE`;
  const response = await client.post(url, payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const validateOtpApi = createAsyncThunk("HOME_VISIT_SLICE/validateOtpApi", async (payload, { rejectWithValue }) => {
  
  const response = await client.post(URL.VALIDATE_OTP(), payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})



export const saveReScheduleRemark = createAsyncThunk("TEST_DRIVE_SLICE/saveReScheduleRemark", async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.SAVE_RECHEDULE_REMARKS(), payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getReScheduleRemark = createAsyncThunk("TEST_DRIVE_SLICE/getReScheduleRemark", async (payload, { rejectWithValue }) => {

  const response = await client.get(URL.GET_RECHEDULE_REMARKS(), payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})


// call on click of retestdrive added to get entry of same task in today and closed 
export const getDetailsWrokflowTask = createAsyncThunk("TEST_DRIVE_SLICE/getDetailsWrokflowTask", async (payload, { rejectWithValue }) => {

  const response = await client.get(URL.GET_WORKFLOW_TASKS(payload["entityId"], payload["taskName"]), );
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})


// call on click of retestdrive added to get entry of same task in today and closed 
export const getDetailsWrokflowTaskReTestDrive = createAsyncThunk("TEST_DRIVE_SLICE/getDetailsWrokflowTaskReTestDrive", async (payload, { rejectWithValue }) => {

  const response = await client.get(URL.GET_WORKFLOW_TASKS(payload["entityId"], payload["taskName"]),);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

// call on click of retestdrive added to get entry of same task in today and closed 
export const getDetailsWrokflowTaskForFormData = createAsyncThunk("TEST_DRIVE_SLICE/getDetailsWrokflowTaskForFormData", async (payload, { rejectWithValue }) => {

  const response = await client.get(URL.GET_WORKFLOW_TASKS(payload["entityId"], payload["taskName"]),);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const postDetailsWorkFlowTask = createAsyncThunk("TEST_DRIVE_SLICE/postDetailsWorkFlowTask", async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.POST_WORKFLOW_TASKS(), payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})


export const postReOpenTestDrive = createAsyncThunk("TEST_DRIVE_SLICE/postReOpenTestDrive", async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.SAVETESTDRIVE(), payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})


// for calling on all btns 
export const postReOpenTestDriveV2 = createAsyncThunk("TEST_DRIVE_SLICE/postReOpenTestDriveV2", async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.SAVETESTDRIVE(), payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})


export const PutUpdateListTestDriveHistory = createAsyncThunk("TEST_DRIVE_SLICE/PutUpdateListTestDriveHistory", async (payload,{ rejectWithValue }) => {

  const response = await client.put(URL.UPDATELIST_TESTDRIVE_HISTORY(payload["recordid"]), payload["body"]);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

// get test drive audit history counts 
export const getTestDriveHistoryCount = createAsyncThunk("TEST_DRIVE_SLICE/getTestDriveHistoryCount", async (universalId, { rejectWithValue }) => {

  const response = await client.get(URL.GET_TEST_HISTORY_COUNT(universalId));
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})


// listing API for history details 
export const getTestDriveHistoryDetails = createAsyncThunk("TEST_DRIVE_SLICE/getTestDriveHistoryDetails", async (universalId, { rejectWithValue }) => {

  const response = await client.get(URL.GET_TEST_HISTORY_DETAILS(universalId));
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

// call for close and reschdules in retestdrvie cases
export const putWorkFlowHistory = createAsyncThunk("TEST_DRIVE_SLICE/putWorkFlowHistory", async (payload, { rejectWithValue }) => {
 
  
  const response = await client.put(URL.GET_PUT_WORKFLOW_HISTORY(payload["recordid"]), payload["body"]);
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
    generate_otp_response_status: "",
    otp_session_key: "",
    validate_otp_response_status: "",
    reopen_test_drive_res_status:"",
    test_drive_history_count_statu:"",
    test_drive_history_count:0,
     test_drive_history_details_statu:"",
    test_drive_history_details:"",
    test_drrive_history_updatelist:"",
    isReasonUpdate: true,
    reason: "",
    save_test_drive_rescheduleRemarks_status: "",
    get_workFlow_task_details:[],
    post_workFlow_task_details: "",
    put_workflow_task_history :"",
    get_workFlow_task_details_Form_data: [],
    get_workFlow_task_details_reTestDrive:[]
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
      state.test_drive_varients_obj_for_drop_down = {}
      state.test_drive_vehicle_list_for_drop_down = []
      state.test_drive_vehicle_list = []
      state.drivers_list = []
      state.employees_list = []
      state.driverId = ''
      state.generate_otp_response_status = "";
      state.otp_session_key = "";
      state.validate_otp_response_status = "";
      state.reopen_test_drive_res_status ="";
      state.test_drive_history_count_statu="";
      state.test_drive_history_count=0;
     state.test_drive_history_details_statu= "";
        state.test_drive_history_details= "";
      state.test_drrive_history_updatelist="";
      state.reason = "";
      state.get_workFlow_task_details = [];
      state.post_workFlow_task_details = "";
      state.put_workflow_task_history = "";
      state.get_workFlow_task_details_Form_data = [];
      state.get_workFlow_task_details_reTestDrive = []
    },
    updateSelectedDate: (state, action: PayloadAction<CustomerDetailModel>) => {
      const { key, text } = action.payload;
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
    clearOTP: (state, action) => {
      state.generate_otp_response_status = "";
      state.otp_session_key = "";
      state.validate_otp_response_status = "";
    },
    updateSelectedScheduledata: (state, action: PayloadAction<CustomerDetailModel>)=>{
      const { key, text } = action.payload;
      switch (key) {
        case "REASON":
          state.reason = text;
          break;
        
      }
    }
  },
  extraReducers: (builder) => {
    // Get Task Details Api
    builder.addCase(getTaskDetailsApi.pending, (state, action) => {
      state.task_details_response = null;
    })
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
    builder.addCase(getTestDriveAppointmentDetailsApi.pending, (state, action) => {
      state.test_drive_appointment_details_response = null;
    })
    builder.addCase(getTestDriveAppointmentDetailsApi.fulfilled, (state, action) => {
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
      state.test_drive_appointment_details_response = null;
    })
    // Get Test Drive Vehicle list
    builder.addCase(getTestDriveVehicleListApi.pending, (state, action) => {
      state.test_drive_vehicle_list = [];
      state.test_drive_vehicle_list_for_drop_down = [];
    })
    builder.addCase(getTestDriveVehicleListApi.fulfilled, (state, action) => {
      if (action.payload.status === "SUCCESS" && action.payload.vehicles) {
        const vehicles = action.payload.vehicles;
        state.test_drive_vehicle_list = vehicles;

        // For dropdown
        let new_vehicles = [];
        let vehicleNames = [];
        let varientObj = {};
        vehicles.forEach(element => {
          const vehicleInfo = element.vehicleInfo;
          const vehicleInfoForModel = {
            ...vehicleInfo,
            name: vehicleInfo.model,
            id: element.id,
          };
          const vehicleInfoForVarient = {
            ...vehicleInfo,
            name: vehicleInfo.varientName,
            id: element.id,
          };

          if (vehicleNames.includes(vehicleInfo.vehicleId)) {
            const oldData = varientObj[vehicleInfo.model];
            varientObj[vehicleInfo.model] = [...oldData, vehicleInfoForVarient];
          } else {
            vehicleNames.push(vehicleInfo.vehicleId);
            varientObj[vehicleInfo.model] = [vehicleInfoForVarient];
            new_vehicles.push(vehicleInfoForModel)
          }
        });
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

    builder.addCase(generateOtpApi.pending, (state, action) => {
      state.isLoading = true;
      state.generate_otp_response_status = "";
      state.otp_session_key = "";
    })
    builder.addCase(generateOtpApi.fulfilled, (state, action) => {
      const status = action.payload.reason ? action.payload.reason : "";
      if (status === "Success") {
        showToastSucess("Otp sent successfully");
      }
      state.isLoading = false;
      state.generate_otp_response_status = "successs";
      state.otp_session_key = action.payload.sessionKey ? action.payload.sessionKey : "";
    })
    builder.addCase(generateOtpApi.rejected, (state, action) => {
      if (action.payload["reason"]) {
        showToastRedAlert(action.payload["reason"]);
      }
      state.isLoading = false;
      state.generate_otp_response_status = "failed";
      state.otp_session_key = "";
    })
    // Validate OTP
    builder.addCase(validateOtpApi.pending, (state, action) => {
      state.isLoading = true;
      state.validate_otp_response_status = "pending";
    })
    builder.addCase(validateOtpApi.fulfilled, (state, action) => {
      if (action.payload.reason === "Success") {
        state.validate_otp_response_status = "successs";
      }
      else if (action.payload["reason"]) {
        showToastRedAlert(action.payload["reason"]);
        state.validate_otp_response_status = "failed";
      }
      state.isLoading = false;
    })
    builder.addCase(validateOtpApi.rejected, (state, action) => {
      if (action.payload["reason"]) {
        showToastRedAlert(action.payload["reason"]);
      }
      state.isLoading = false;
      state.validate_otp_response_status = "failed";
    })

    // reopen test drive
    builder.addCase(postReOpenTestDrive.pending, (state, action) => {
      state.isLoading = true;
      state.reopen_test_drive_res_status = "pending";
    })
    builder.addCase(postReOpenTestDrive.fulfilled, (state, action) => {
      if (action.payload) {
        state.reopen_test_drive_res_status = "successs";
      }
      // else if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      //   state.reopen_test_drive_res_status = "failed";
      // }
      state.isLoading = false;
    })
    builder.addCase(postReOpenTestDrive.rejected, (state, action) => {
      // if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      // }
      state.isLoading = false;
      state.reopen_test_drive_res_status = "failed";
    })

    // for calling on all btn test drive
    builder.addCase(postReOpenTestDriveV2.pending, (state, action) => {
      state.isLoading = true;
      // state.reopen_test_drive_res_status = "pending";
    })
    builder.addCase(postReOpenTestDriveV2.fulfilled, (state, action) => {
      if (action.payload) {
        // state.reopen_test_drive_res_status = "successs";
      }
      // else if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      //   state.reopen_test_drive_res_status = "failed";
      // }
      state.isLoading = false;
    })
    builder.addCase(postReOpenTestDriveV2.rejected, (state, action) => {
      // if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      // }
      state.isLoading = false;
      // state.reopen_test_drive_res_status = "failed";
    })

    // reopen test drive history count 
    builder.addCase(getTestDriveHistoryCount.pending, (state, action) => {
      state.isLoading = true;
      state.test_drive_history_count_statu = "pending";
      state.test_drive_history_count = 0;
    })
    builder.addCase(getTestDriveHistoryCount.fulfilled, (state, action) => {
      if (action.payload) {
       
        state.test_drive_history_count_statu = "successs";
        state.test_drive_history_count = action.payload.count;
      }
      // else if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      //   state.reopen_test_drive_res_status = "failed";
      // }
      state.isLoading = false;
    })
    builder.addCase(getTestDriveHistoryCount.rejected, (state, action) => {
      // if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      // }
      state.isLoading = false;
      state.test_drive_history_count_statu = "failed";
      state.test_drive_history_count = 0;
    })

    


    // reopen test drive history Details listing 
    builder.addCase(getTestDriveHistoryDetails.pending, (state, action) => {
      state.isLoading = true;
    
      state.test_drive_history_details_statu = "pending";
      state.test_drive_history_details = "";
    })
    builder.addCase(getTestDriveHistoryDetails.fulfilled, (state, action) => {
      if (action.payload) {
        
        state.test_drive_history_details_statu = "successs";
        state.test_drive_history_details = action.payload;
      }
      // else if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      //   state.reopen_test_drive_res_status = "failed";
      // }
      state.isLoading = false;
    })
    builder.addCase(getTestDriveHistoryDetails.rejected, (state, action) => {
      // if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      // }
      state.isLoading = false;
      state.test_drive_history_details_statu = "failed";
      state.test_drive_history_details = "";
    })


    
    builder.addCase(PutUpdateListTestDriveHistory.pending, (state, action) => {
      state.isLoading = true;

    
      state.test_drrive_history_updatelist = "";
    })
    builder.addCase(PutUpdateListTestDriveHistory.fulfilled, (state, action) => {
      if (action.payload) {

        state.test_drrive_history_updatelist = action.payload;
      }
     
      state.isLoading = false;
    })
    builder.addCase(PutUpdateListTestDriveHistory.rejected, (state, action) => {
    
      state.isLoading = false;
     
      state.test_drrive_history_updatelist = "";
    })


    // saveReScheduleRemark test drive
    builder.addCase(saveReScheduleRemark.pending, (state, action) => {
      state.isLoading = true;
      state.save_test_drive_rescheduleRemarks_status = "pending";
    })
    builder.addCase(saveReScheduleRemark.fulfilled, (state, action) => {
      if (action.payload) {
        state.save_test_drive_rescheduleRemarks_status = "successs";
      }
      // else if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      //   state.reopen_test_drive_res_status = "failed";
      // }
      state.isLoading = false;
    })
    builder.addCase(saveReScheduleRemark.rejected, (state, action) => {
      // if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      // }
      state.isLoading = false;
      state.save_test_drive_rescheduleRemarks_status = "failed";
    })


    
    builder.addCase(getDetailsWrokflowTask.pending, (state, action) => {
      state.isLoading = true;
      state.get_workFlow_task_details = [];
    })
    builder.addCase(getDetailsWrokflowTask.fulfilled, (state, action) => {
      if (action.payload) {
        state.get_workFlow_task_details =action.payload;
      }
      // else if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      //   state.reopen_test_drive_res_status = "failed";
      // }
      state.isLoading = false;
    })
    builder.addCase(getDetailsWrokflowTask.rejected, (state, action) => {
      // if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      // }
      state.isLoading = false;
      state.get_workFlow_task_details = [];
    })

    builder.addCase(getDetailsWrokflowTaskReTestDrive.pending, (state, action) => {
      state.isLoading = true;
      state.get_workFlow_task_details_reTestDrive = [];
    })
    builder.addCase(getDetailsWrokflowTaskReTestDrive.fulfilled, (state, action) => {
      if (action.payload) {
        state.get_workFlow_task_details_reTestDrive = action.payload;
      }
      // else if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      //   state.reopen_test_drive_res_status = "failed";
      // }
      state.isLoading = false;
    })
    builder.addCase(getDetailsWrokflowTaskReTestDrive.rejected, (state, action) => {
      // if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      // }
      state.isLoading = false;
      state.get_workFlow_task_details_reTestDrive = [];
    })


    builder.addCase(getDetailsWrokflowTaskForFormData.pending, (state, action) => {
      state.isLoading = true;
      state.get_workFlow_task_details_Form_data = [];
    })
    builder.addCase(getDetailsWrokflowTaskForFormData.fulfilled, (state, action) => {
      if (action.payload) {
        state.get_workFlow_task_details_Form_data = action.payload;
      }
      // else if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      //   state.reopen_test_drive_res_status = "failed";
      // }
      state.isLoading = false;
    })

    builder.addCase(getDetailsWrokflowTaskForFormData.rejected, (state, action) => {
      // if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      // }
      state.isLoading = false;
      state.get_workFlow_task_details_Form_data = [];
    })



    builder.addCase(postDetailsWorkFlowTask.pending, (state, action) => {
      state.isLoading = true;
      state.post_workFlow_task_details = "pending";
    })
    builder.addCase(postDetailsWorkFlowTask.fulfilled, (state, action) => {
      if (action.payload) {
        state.post_workFlow_task_details = "success";
      }
      // else if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      //   state.reopen_test_drive_res_status = "failed";
      // }
      state.isLoading = false;
    })
    builder.addCase(postDetailsWorkFlowTask.rejected, (state, action) => {
      // if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      // }
      state.isLoading = false;
      state.post_workFlow_task_details = "failed";
    })


    builder.addCase(putWorkFlowHistory.pending, (state, action) => {
      state.isLoading = true;
      state.put_workflow_task_history = "pending";
    })
    builder.addCase(putWorkFlowHistory.fulfilled, (state, action) => {
      if (action.payload) {
        state.put_workflow_task_history = "success";
      }
      // else if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      //   state.reopen_test_drive_res_status = "failed";
      // }
      state.isLoading = false;
    })
    builder.addCase(putWorkFlowHistory.rejected, (state, action) => {
      // if (action.payload["reason"]) {
      //   showToastRedAlert(action.payload["reason"]);
      // }
      state.isLoading = false;
      state.put_workflow_task_history = "failed";
    })
  }
});

export const {
  clearState,
  updateSelectedDate,
  clearOTP, updateSelectedScheduledata
} = testDriveSlice.actions;
export default testDriveSlice.reducer;
