import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { convertToTime } from "../utils/helperFunctions";
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

export const getTaskDetailsApi = createAsyncThunk("ENQUIRY_FOLLOW_UP_SLICE/getTaskDetailsApi", async (taskId, { rejectWithValue }) => {

  const response = await client.get(URL.GET_TASK_DETAILS(taskId));
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const updateTaskApi = createAsyncThunk("ENQUIRY_FOLLOW_UP_SLICE/updateTaskApi", async (body, { rejectWithValue }) => {
  const response = await client.put(URL.ASSIGN_TASK(), body)
  const json = await response.json()
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
    //*enquiry follow up *//
    reason: "",
    customer_remarks: "",
    employee_remarks: "",
    model: "",
    varient: "",
    actual_start_time: "",
    actual_end_time: "",
  },
  reducers: {
    setEnquiryFollowUpDetails: (state, action: PayloadAction<EnquiryFollowUpTextModel>) => {
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
      state.datePickerKeyId = action.payload;
      state.showDatepicker = !state.showDatepicker;
    },
    updateSelectedDate: (state, action: PayloadAction<CustomerDetailModel>) => {
      const { key, text } = action.payload;
      const selectedDate = convertToTime(text);
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
        state.customer_remarks = taskObj.customerRemarks ? taskObj.customerRemarks : "";
        state.employee_remarks = taskObj.employeeRemarks ? taskObj.employeeRemarks : "";
        state.task_details_response = action.payload.dmsEntity.task;
      } else {
        state.task_details_response = null;
      }
    })
    builder.addCase(getTaskDetailsApi.rejected, (state, action) => {
      state.task_details_response = null;
    })
    builder.addCase(updateTaskApi.pending, (state, action) => {
      state.is_loading_for_task_update = true;
    })
    builder.addCase(updateTaskApi.fulfilled, (state, action) => {
      console.log("S updateTaskApi", JSON.stringify(action.payload))
      state.is_loading_for_task_update = false;
    })
    builder.addCase(updateTaskApi.rejected, (state, action) => {
      console.log("F updateTaskApi", JSON.stringify(action.payload))
      state.is_loading_for_task_update = false;
    })
  }
});

export const {
  setEnquiryFollowUpDetails,
  setDatePicker,
  updateSelectedDate,
} = slice.actions;
export default slice.reducer;
