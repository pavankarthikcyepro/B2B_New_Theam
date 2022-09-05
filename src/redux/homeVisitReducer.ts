import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import URL from "../networking/endpoints";
import { client } from "../networking/client";
import { showToast, showToastRedAlert, showToastSucess } from "../utils/toast";
import {
    convertTimeStampToDateString,
    convertToTime,
} from "../utils/helperFunctions";

interface HomeVisitTextModel {
    key: string,
    text: string
}

interface CustomerDetailModel {
    key: string;
    text: string;
}

export const getTaskDetailsApi = createAsyncThunk("HOME_VISIT_SLICE/getTaskDetailsApi", async (taskId, { rejectWithValue }) => {

    const response = await client.get(URL.GET_TASK_DETAILS(taskId));
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const updateTaskApi = createAsyncThunk("HOME_VISIT_SLICE/updateTaskApi", async (body, { rejectWithValue }) => {
    const response = await client.put(URL.ASSIGN_TASK(), body)
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const generateOtpApi = createAsyncThunk("HOME_VISIT_SLICE/generateOtpApi", async (payload, { rejectWithValue }) => {

    const url = `${URL.GENERATE_OTP()}?type=HOME VISIT`;
    console.log("OTP PAYLOAD url: ", url, payload);
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

const slice = createSlice({
    name: "HOME_VISIT_SLICE",
    initialState: {
        task_details_response: null,
        is_loading_for_task_update: false,
        update_task_response_status: null,
        reason: "",
        customer_remarks: "",
        employee_remarks: "",
        isLoading: false,
        generate_otp_response_status: "",
        otp_session_key: "",
        validate_otp_response_status: "",
        isReasonUpdate: false,
        actual_end_time: "",
        minDate: null,
        maxDate: null,
        showDatepicker: false,
        datePickerKeyId: "",
        actual_start_time: "",
    },
    reducers: {
        clearState: (state, action) => {
            state.task_details_response = null;
            state.update_task_response_status = null;
            state.generate_otp_response_status = "";
            state.otp_session_key = "";
            state.validate_otp_response_status = "";
        },
        setHomeVisitDetails: (state, action: PayloadAction<HomeVisitTextModel>) => {
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
        builder.addCase(getTaskDetailsApi.pending, (state, action) => {
            state.task_details_response = null;
        })
        builder.addCase(getTaskDetailsApi.fulfilled, (state, action) => {
            if (action.payload.success === true && action.payload.dmsEntity) {
                const taskObj = action.payload.dmsEntity.task;
                if (taskObj.reason) {
                    state.isReasonUpdate = true;
                }
                state.reason = taskObj.reason ? taskObj.reason : "";
                state.customer_remarks = taskObj.customerRemarks ? taskObj.customerRemarks : "";
                state.employee_remarks = taskObj.employeeRemarks ? taskObj.employeeRemarks : "";
                state.task_details_response = taskObj;
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
            }
        })
        builder.addCase(getTaskDetailsApi.rejected, (state, action) => {
            state.task_details_response = null;
        })
        builder.addCase(updateTaskApi.pending, (state, action) => {
            state.is_loading_for_task_update = true;
            state.update_task_response_status = null;
        })
        builder.addCase(updateTaskApi.fulfilled, (state, action) => {
            console.log("S updateTaskApi", JSON.stringify(action.payload))
            state.is_loading_for_task_update = false;
            state.update_task_response_status = "success";
        })
        builder.addCase(updateTaskApi.rejected, (state, action) => {
            console.log("F updateTaskApi", JSON.stringify(action.payload))
            state.is_loading_for_task_update = false;
            state.update_task_response_status = null;
            showToast("Something went wrong");
        })
        // Generate OTP
        builder.addCase(generateOtpApi.pending, (state, action) => {
            state.isLoading = true;
            state.generate_otp_response_status = "";
            state.otp_session_key = "";
        })
        builder.addCase(generateOtpApi.fulfilled, (state, action) => {
            console.log("S generateOtpApi: ", JSON.stringify(action.payload));
            const status = action.payload.reason ? action.payload.reason : "";
            if (status === "Success") {
                showToastSucess("Otp sent successfully");
            }
            state.isLoading = false;
            state.generate_otp_response_status = "successs";
            state.otp_session_key = action.payload.sessionKey ? action.payload.sessionKey : "";
        })
        builder.addCase(generateOtpApi.rejected, (state, action) => {
            console.log("F generateOtpApi: ", JSON.stringify(action.payload));
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
            console.log("S validateOtpApi: ", JSON.stringify(action.payload));
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
            console.log("F validateOtpApi: ", JSON.stringify(action.payload));
            if (action.payload["reason"]) {
                showToastRedAlert(action.payload["reason"]);
            }
            state.isLoading = false;
            state.validate_otp_response_status = "failed";
        })
    }
});

export const {
    clearState,
    setHomeVisitDetails,
    setDatePicker,
    updateSelectedDate
} = slice.actions;
export default slice.reducer;
