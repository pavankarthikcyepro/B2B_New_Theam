import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  convertTimeStampToDateString,
  convertToTime,
} from "../utils/helperFunctions";
import URL from "../networking/endpoints";
import { client } from "../networking/client";

interface EnquiryFollowUpTextModel {
  key: string;
  text: string;
}

interface CustomerDetailModel {
  key: string;
  text: string;
}


export const getTaskDetailsApi = createAsyncThunk(
  "ENQUIRY_FOLLOW_UP_SLICE/getTaskDetailsApi",
  async (taskId, { rejectWithValue }) => {
    const response = await client.get(URL.GET_TASK_DETAILS(taskId));
    const json = await response.json();
    console.log("TASK DTLS:", JSON.stringify(json));

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const updateTaskApi = createAsyncThunk(
  "ENQUIRY_FOLLOW_UP_SLICE/updateTaskApi",
  async (body, { rejectWithValue }) => {
    const response = await client.put(URL.ASSIGN_TASK(), body);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getEnquiryDetailsApi = createAsyncThunk("ENQUIRY_FOLLOW_UP_SLICE/getEnquiryDetailsApi", async (universalId, { rejectWithValue }) => {

  const response = await client.get(URL.ENQUIRY_DETAILS(universalId));
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getReasonList = createAsyncThunk("ENQUIRY_FOLLOW_UP_SLICE/getReasonList", async (payload: any, { rejectWithValue }) => {
  console.log("REASON URL:", URL.REASON_LIST(payload.orgId, payload.taskName));

  const response = await client.get(URL.REASON_LIST(payload.orgId, payload.taskName));
  const json = await response.json()
  console.log("REASON: ", JSON.stringify(json));

  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

const slice = createSlice({
  name: "ENQUIRY_FOLLOW_UP_SLICE",
  initialState: {
    showDatepicker: false,
    datePickerKeyId: "",
    showImagePicker: false,
    imagePickerKeyId: "",
    task_details_response: null,
    is_loading_for_task_update: false,
    update_task_response_status: null,
    task_status: "",
    minDate: null,
    maxDate: null,
    //*enquiry follow up *//
    reason: "",
    customer_remarks: "",
    employee_remarks: "",
    model: "",
    varient: "",
    actual_start_time: "",
    actual_end_time: "",
    enquiry_details_response: null,
    isReasonUpdate: false,
  },
  reducers: {
    clearState: (state, action) => {
      state.task_details_response = null;
      state.is_loading_for_task_update = false;
      state.update_task_response_status = null;
      state.task_status = "";
    },
    setEnquiryFollowUpDetails: (
      state,
      action: PayloadAction<EnquiryFollowUpTextModel>
    ) => {
      const { key, text } = action.payload;
      switch (key) {
        case "REASON":
          state.reason = text;
          break;
        case "CUSTOMER_REMARKS":
          state.customer_remarks = text;
          break;
        case "EMPLOYEE_REMARKS":
          state.employee_remarks = text;
          break;
        case "MODEL":
          if (state.model !== text) {
            state.varient = "";
          }
          state.model = text;
          break;
        case "VARIENT":
          state.varient = text;
          break;
      }
    },
    setDatePicker: (state, action) => {
      let date = new Date();
      date.setDate(date.getDate() + 9);
      switch (action.payload) {
        case "ACTUAL_START_TIME":
          state.minDate = new Date();
          state.maxDate = date;
          break;
        case "ACTUAL_END_TIME":
          state.minDate = new Date();
          state.maxDate = date;
          break;
      }
      state.datePickerKeyId = action.payload;
      state.showDatepicker = !state.showDatepicker;
    },
    updateSelectedDate: (state, action: PayloadAction<CustomerDetailModel>) => {
      const { key, text } = action.payload;
      const selectedDate = convertTimeStampToDateString(text, "DD/MM/YYYY");
      const keyId = key ? key : state.datePickerKeyId;
      switch (state.datePickerKeyId) {
        case "ACTUAL_START_TIME":
          state.actual_start_time = selectedDate;

          break;
        case "ACTUAL_END_TIME":
          state.actual_end_time = selectedDate;
          break;
      }
      state.showDatepicker = !state.showDatepicker;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTaskDetailsApi.fulfilled, (state, action) => {
      if (action.payload.success === true && action.payload.dmsEntity) {
        const taskObj = action.payload.dmsEntity.task;
        state.reason = taskObj.reason ? taskObj.reason : "";
        if(taskObj.reason){
          state.isReasonUpdate = true;
        }
        state.customer_remarks = taskObj.customerRemarks
          ? taskObj.customerRemarks
          : "";
        state.employee_remarks = taskObj.employeeRemarks
          ? taskObj.employeeRemarks
          : "";
        const stratDate = taskObj.taskActualStartTime
          ? taskObj.taskActualStartTime
          : "";
        state.actual_start_time = convertTimeStampToDateString(
          stratDate,
          "DD/MM/YYYY"
        );
        const endDate = taskObj.taskActualEndTime
          ? taskObj.taskActualEndTime
          : "";
        state.actual_end_time = convertTimeStampToDateString(
          endDate,
          "DD/MM/YYYY"
        );
        state.task_status = taskObj.taskStatus;
        state.task_details_response = action.payload.dmsEntity.task;
      } else {
        state.task_details_response = null;
      }
    });
    builder.addCase(getTaskDetailsApi.rejected, (state, action) => {
      state.task_details_response = null;
    });
    builder.addCase(updateTaskApi.pending, (state, action) => {
      state.is_loading_for_task_update = true;
      state.update_task_response_status = null;
    });
    builder.addCase(updateTaskApi.fulfilled, (state, action) => {
      console.log("S updateTaskApi", JSON.stringify(action.payload));
      state.is_loading_for_task_update = false;
      state.update_task_response_status = "success";
    });
    builder.addCase(updateTaskApi.rejected, (state, action) => {
      console.log("F updateTaskApi", JSON.stringify(action.payload));
      state.is_loading_for_task_update = false;
      state.update_task_response_status = "failed";
    });
    // Get Prebooking Details
    builder.addCase(getEnquiryDetailsApi.pending, (state, action) => {
      state.enquiry_details_response = null;
      state.model = '';
      state.varient = '';
    })
    builder.addCase(getEnquiryDetailsApi.fulfilled, (state, action) => {
      if (action.payload.dmsEntity) {
        const dmsLeadDto = action.payload.dmsEntity.dmsLeadDto;
        console.log("selectedModelObj:", dmsLeadDto)

        if (dmsLeadDto.dmsLeadProducts && dmsLeadDto.dmsLeadProducts.length > 0) {
          const selectedModelObj = dmsLeadDto.dmsLeadProducts[0];
          console.log("selectedModelObj2:", selectedModelObj)
          state.model = selectedModelObj.model;
          state.varient = selectedModelObj.variant;
        }
        state.enquiry_details_response = action.payload.dmsEntity;
      }
    })
    builder.addCase(getEnquiryDetailsApi.rejected, (state, action) => {
      state.enquiry_details_response = null;
    })
  },
});

export const {
  clearState,
  setEnquiryFollowUpDetails,
  setDatePicker,
  updateSelectedDate,
} = slice.actions;
export default slice.reducer;
