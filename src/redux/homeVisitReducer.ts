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


// save home visit
export const savehomevisit = createAsyncThunk("HOME_VISIT_SLICE/savehomevisit", async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.SAVEHOMEVISIT(), payload);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

// get home visit counts
export const getHomeVisitCounts = createAsyncThunk("HOME_VISIT_SLICE/getHomeVisitCounts", async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.GET_HOME_HISTORY_COUNT(payload));
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

// put home visit For update and reschedule
export const updateListHV = createAsyncThunk("HOME_VISIT_SLICE/updateListHV", async (payload, { rejectWithValue }) => {

    const response = await client.put(URL.UPDATELIST_HOME_VISIT(payload["recordid"]), payload["body"]);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

// get home visit audit list 
export const getHomeVisitAuditDetails = createAsyncThunk("HOME_VISIT_SLICE/getHomeVisitAuditDetails", async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.GET_HOME_VISIT_COUNT_DETAILS(payload) );
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const putworkFlowUpdateHomeVisit = createAsyncThunk("HOME_VISIT_SLICE/putworkFlowUpdateHomeVisit", async (payload, { rejectWithValue }) => {

    const response = await client.put(URL.UPDATE_HOMEVISIT_WORKFLOW(payload));
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})


// call on click of homevist added to get entry of same task in today and closed 
export const getDetailsWrokflowTask = createAsyncThunk("HOME_VISIT_SLICE/getDetailsWrokflowTask", async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.GET_WORKFLOW_TASKS(payload["entityId"], payload["taskName"]),);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})


// call on click of home visit added to get entry of same task in today and closed 
export const getDetailsWrokflowTaskReHomeVisitDrive = createAsyncThunk("HOME_VISIT_SLICE/getDetailsWrokflowTaskReHomeVisitDrive", async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.GET_WORKFLOW_TASKS(payload["entityId"], payload["taskName"]),);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})


// call on click of retestdrive added to get entry of same task in today and closed 
export const getDetailsWrokflowTaskFormData = createAsyncThunk("HOME_VISIT_SLICE/getDetailsWrokflowTaskFormData", async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.GET_WORKFLOW_TASKS(payload["entityId"], payload["taskName"]),);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const postDetailsWorkFlowTask = createAsyncThunk("HOME_VISIT_SLICE/postDetailsWorkFlowTask", async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.POST_WORKFLOW_TASKS(), payload);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

// call for close and reschdules in rehome visit cases
export const putWorkFlowHistory = createAsyncThunk("HOME_VISIT_SLICE/putWorkFlowHistory", async (payload, { rejectWithValue }) => {

    const response = await client.put(URL.GET_PUT_WORKFLOW_HISTORY(payload["recordid"]), payload["body"]);
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
        datePickerKey:"",
        next_follow_up_Time: "",
        homeVisit_history_counts :"",
        home_visit_History_listing:"",
        home_visit_History_listing_status: "",
        putworkFlowUpdateHomeVisitRes:"",
        post_workFlow_task_details: "",
        put_workflow_task_history: "",
        re_home_visitResubmit_response: "",
        get_workFlow_task_details: [],
        actual_start_time_local: "",
        get_workFlow_task_details_FormData: [],
        get_workFlow_task_details_Re_home_visit:[]
    },
    reducers: {
        clearState: (state, action) => {
            state.task_details_response = null;
            state.update_task_response_status = null;
            state.generate_otp_response_status = "";
            state.otp_session_key = "";
            state.validate_otp_response_status = "";
            state.datePickerKey = "",
            state.next_follow_up_Time="",
            state.homeVisit_history_counts = "",
            state.home_visit_History_listing = "",
                state.home_visit_History_listing_status = "",
            state.putworkFlowUpdateHomeVisitRes = "",
                state.post_workFlow_task_details= "",
                state.put_workflow_task_history = "",
                state.re_home_visitResubmit_response ="",
                state.get_workFlow_task_details= [],
                state.actual_start_time_local = "",
                state.get_workFlow_task_details_FormData = [],
                state.get_workFlow_task_details_Re_home_visit = []
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
                    state.datePickerKey = "date"
                    break;
                case "ACTUAL_END_TIME":
                    state.minDate = new Date();
                    state.maxDate = date;
                    break;
                case "NEEXT_FOLLOWUP_TIME":
                    state.minDate = new Date();
                    state.maxDate = date;
                    state.datePickerKey = "time"
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
                case "NEEXT_FOLLOWUP_TIME":
                    state.next_follow_up_Time = text;
                    break;
            }
            state.showDatepicker = !state.showDatepicker;
        },

        updateSelectedDateFormServerRes: (state, action: PayloadAction<CustomerDetailModel>) => {
            const { key, text } = action.payload;
           
            switch (key) {
                case "ACTUAL_START_TIME":
                    state.actual_start_time = text;

                    break;
                case "ACTUAL_END_TIME":
                    state.actual_end_time = text;
                    break;
                case "NEEXT_FOLLOWUP_TIME":
                    state.next_follow_up_Time = text;
                    break;
            }
            
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

                const startDate = taskObj.taskActualStartTime
                    ? taskObj.taskActualStartTime
                    : "";

                state.actual_start_time = convertTimeStampToDateString(
                    startDate,
                    "DD/MM/YYYY"
                );
                state.actual_start_time_local = convertTimeStampToDateString(
                    startDate,
                    "DD/MM/YYYY"
                );
                const endDate = taskObj.taskActualEndTime
                    ? taskObj.taskActualEndTime
                    : "";
                state.actual_end_time = convertTimeStampToDateString(
                    endDate,
                    "DD/MM/YYYY"
                );

                const nextFollowuptime = taskObj?.nextFlowupTime
                    ? taskObj?.nextFlowupTime
                    : "";


                state.next_follow_up_Time = nextFollowuptime !== "" ? convertToTime(nextFollowuptime) : ""


                // use of taskUpdatedTime changes backup
                // const startDate = taskObj.taskUpdatedTime
                //     ? taskObj.taskUpdatedTime
                //     : "";
                    
                // state.actual_start_time = convertTimeStampToDateString(
                //     startDate,
                //     "DD/MM/YYYY"
                // );
                // const endDate = taskObj.taskActualEndTime
                //     ? taskObj.taskActualEndTime
                //     : "";
                // state.actual_end_time = convertTimeStampToDateString(
                //     endDate,
                //     "DD/MM/YYYY"
                // );

                // const nextFollowuptime = taskObj.taskUpdatedTime
                //     ? taskObj.taskUpdatedTime
                //     : "";
               
                
                    
                // state.next_follow_up_Time = nextFollowuptime!== "" ? convertToTime(nextFollowuptime) :""
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
            state.is_loading_for_task_update = false;
            state.update_task_response_status = "success";
        })
        builder.addCase(updateTaskApi.rejected, (state, action) => {
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


        // home visit history count
        builder.addCase(getHomeVisitCounts.pending, (state, action) => {
            state.isLoading = true;
            state.homeVisit_history_counts = "pending";
        })
        builder.addCase(getHomeVisitCounts.fulfilled, (state, action) => {
            if (action.payload) {
                state.homeVisit_history_counts = action.payload;
            }
            state.isLoading = false;
        })
        builder.addCase(getHomeVisitCounts.rejected, (state, action) => {
          
            state.isLoading = false;
            state.homeVisit_history_counts = "failed";
        })


        // home visit history count
        builder.addCase(updateListHV.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(updateListHV.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        builder.addCase(updateListHV.rejected, (state, action) => {
            state.isLoading = false;
        })


        // home visit history count
        builder.addCase(getHomeVisitAuditDetails.pending, (state, action) => {
            state.isLoading = true;
            state.home_visit_History_listing = "",
                state.home_visit_History_listing_status = "pending"

        })
        builder.addCase(getHomeVisitAuditDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            if(action.payload){
                state.home_visit_History_listing = action.payload;
                state.home_visit_History_listing_status = "success";
            }
            
        })
        builder.addCase(getHomeVisitAuditDetails.rejected, (state, action) => {
            state.isLoading = false;
            state.home_visit_History_listing = "";
            state.home_visit_History_listing_status = "faild"
        })

        // home visit workflow update
        builder.addCase(putworkFlowUpdateHomeVisit.pending, (state, action) => {
            state.isLoading = true;
            state.putworkFlowUpdateHomeVisitRes = ""

        })
        builder.addCase(putworkFlowUpdateHomeVisit.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload) {
                state.putworkFlowUpdateHomeVisitRes = action.payload;
            }

        })
        builder.addCase(putworkFlowUpdateHomeVisit.rejected, (state, action) => {
            state.isLoading = false;
            state.putworkFlowUpdateHomeVisitRes = "";
        })


        // home visit workflowtaskhistory
        builder.addCase(postDetailsWorkFlowTask.pending, (state, action) => {
            state.isLoading = true;
            state.post_workFlow_task_details = "pending"

        })
        builder.addCase(postDetailsWorkFlowTask.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload) {
                state.post_workFlow_task_details = "success";
            }

        })
        builder.addCase(postDetailsWorkFlowTask.rejected, (state, action) => {
            state.isLoading = false;
            state.post_workFlow_task_details = "failed";
        })


        // home visit workflowtaskhistory
        builder.addCase(putWorkFlowHistory.pending, (state, action) => {
            state.isLoading = true;
            state.put_workflow_task_history = ""

        })
        builder.addCase(putWorkFlowHistory.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload) {
                state.put_workflow_task_history = action.payload;
            }

        })
        builder.addCase(putWorkFlowHistory.rejected, (state, action) => {
            state.isLoading = false;
            state.put_workflow_task_history = "";
        })


        // home visit savehomevisit
        builder.addCase(savehomevisit.pending, (state, action) => {
            state.isLoading = true;
            state.re_home_visitResubmit_response = "pendig"

        })
        builder.addCase(savehomevisit.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload) {
                state.re_home_visitResubmit_response = "success";
            }

        })
        builder.addCase(savehomevisit.rejected, (state, action) => {
            state.isLoading = false;
            state.re_home_visitResubmit_response = "rejected";
        })



        // home visit savehomevisit
        builder.addCase(getDetailsWrokflowTask.pending, (state, action) => {
            state.isLoading = true;
            state.get_workFlow_task_details = []

        })
        builder.addCase(getDetailsWrokflowTask.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload) {
                state.get_workFlow_task_details = action.payload;
            }

        })
        builder.addCase(getDetailsWrokflowTask.rejected, (state, action) => {
            state.isLoading = false;
            state.get_workFlow_task_details = [];
        })

        // home visit 
        builder.addCase(getDetailsWrokflowTaskFormData.pending, (state, action) => {
            state.isLoading = true;
            state.get_workFlow_task_details_FormData = []

        })
        builder.addCase(getDetailsWrokflowTaskFormData.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload) {
                state.get_workFlow_task_details_FormData = action.payload;
            }

        })
        builder.addCase(getDetailsWrokflowTaskFormData.rejected, (state, action) => {
            state.isLoading = false;
            state.get_workFlow_task_details_FormData = [];
        })


        // home visit 
        builder.addCase(getDetailsWrokflowTaskReHomeVisitDrive.pending, (state, action) => {
            state.isLoading = true;
            state.get_workFlow_task_details_Re_home_visit = []

        })
        builder.addCase(getDetailsWrokflowTaskReHomeVisitDrive.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload) {
                state.get_workFlow_task_details_Re_home_visit = action.payload;
            }

        })
        builder.addCase(getDetailsWrokflowTaskReHomeVisitDrive.rejected, (state, action) => {
            state.isLoading = false;
            state.get_workFlow_task_details_Re_home_visit = [];
        })
    }
});

export const {
    clearState,
    setHomeVisitDetails,
    setDatePicker,
    updateSelectedDate, updateSelectedDateFormServerRes
} = slice.actions;
export default slice.reducer;
