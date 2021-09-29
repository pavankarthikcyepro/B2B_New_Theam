import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import URL from "../networking/endpoints";
import { client } from "../networking/client";
import { showToast } from "../utils/toast";


export const getTaskDetailsApi = createAsyncThunk("CREATE_ENQUIRY_SLICE/getTaskDetailsApi", async (taskId, { rejectWithValue }) => {

    const response = await client.get(URL.GET_TASK_DETAILS(taskId));
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getEnquiryDetailsApi = createAsyncThunk("CREATE_ENQUIRY_SLICE/getEnquiryDetailsApi", async (universalId, { rejectWithValue }) => {

    const response = await client.get(URL.ENQUIRY_DETAILS(universalId));
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getEmployeesListApi = createAsyncThunk("CREATE_ENQUIRY_SLICE/getEmployeesListApi", async (sourceOfEnquiryId, { rejectWithValue }) => {
    const response = await client.get(URL.SOURCE_OF_ENQUIRY_ENQUIRY(sourceOfEnquiryId))
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const updateTaskApi = createAsyncThunk("CREATE_ENQUIRY_SLICE/updateTaskApi", async (body, { rejectWithValue }) => {
    const response = await client.put(URL.ASSIGN_TASK(), body)
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const updateEmployeeApi = createAsyncThunk("CREATE_ENQUIRY_SLICE/updateEmployeeApi", async (body, { rejectWithValue }) => {
    const response = await client.post(URL.SALES_CONSULTANT(), body)
    if (response.status !== 200) {
        return rejectWithValue(response);
    }
    return response;
})

export const changeEnquiryStatusApi = createAsyncThunk("CREATE_ENQUIRY_SLICE/changeEnquiryStatusApi", async (endUrl, { rejectWithValue }) => {
    const url = URL.CHANGE_ENQUIRY_STATUS() + endUrl;
    const response = await client.post(url, {})
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})


const slice = createSlice({
    name: "CREATE_ENQUIRY_SLICE",
    initialState: {
        task_details_response: null,
        enquiry_details_response: null,
        employees_list: [],
        employees_list_status: "",
        update_employee_status: "",
        is_loading_for_task_update: false,
        update_task_response_status: null,
        change_enquiry_response: null,
        change_enquiry_status: "",
    },
    reducers: {
        clearState: (state, action) => {
            state.task_details_response = null;
            state.enquiry_details_response = null;
            state.update_task_response_status = null;
            state.employees_list = [];
            state.employees_list_status = "";
            state.update_employee_status = "";
        },
    },
    extraReducers: (builder) => {
        // Get Task Details
        builder.addCase(getTaskDetailsApi.fulfilled, (state, action) => {
            console.log("S getTaskDetailsApi: ", JSON.stringify(action.payload));
            if (action.payload.success === true && action.payload.dmsEntity) {
                const taskObj = action.payload.dmsEntity.task;
                state.task_details_response = action.payload.dmsEntity.task;
            } else {
                state.task_details_response = null;
            }
        })
        builder.addCase(getTaskDetailsApi.rejected, (state, action) => {
            console.log("F getTaskDetailsApi: ", JSON.stringify(action.payload));
            state.task_details_response = null;
        })
        // Get Enquiry Details
        builder.addCase(getEnquiryDetailsApi.fulfilled, (state, action) => {
            console.log("S getEnquiryDetailsApi: ", JSON.stringify(action.payload));
            if (action.payload.dmsEntity) {
                state.enquiry_details_response = action.payload.dmsEntity;
            }
        })
        builder.addCase(getEnquiryDetailsApi.rejected, (state, action) => {
            console.log("F getEnquiryDetailsApi: ", JSON.stringify(action.payload));
            state.enquiry_details_response = null;
        })
        // Get Employees lit
        builder.addCase(getEmployeesListApi.fulfilled, (state, action) => {
            // console.log("getEmployeesListApi: ", JSON.stringify(action.payload));
            if (action.payload.dmsEntity) {
                state.employees_list = action.payload.dmsEntity.employeeDTOs || [];
                state.employees_list_status = "success";
            }
        })
        builder.addCase(getEmployeesListApi.rejected, (state, action) => {
            // console.log("getEmployeesListApi: ", JSON.stringify(action.payload));
            state.employees_list = [];
            state.employees_list_status = "failed";
        })
        // Update Task
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
            // console.log("F updateTaskApi", JSON.stringify(action.payload))
            state.is_loading_for_task_update = false;
            state.update_task_response_status = null;
            showToast("Something went wrong");
        })
        // Update Employee
        builder.addCase(updateEmployeeApi.fulfilled, (state, action) => {
            console.log("updateEmployeeApi: ", JSON.stringify(action.payload));
            state.update_employee_status = "success";
        })
        builder.addCase(updateEmployeeApi.rejected, (state, action) => {
            // console.log("updateEmployeeApi: ", JSON.stringify(action.payload));
            state.update_employee_status = "failed";
        })
        // Update Enquiry Status
        builder.addCase(changeEnquiryStatusApi.fulfilled, (state, action) => {
            console.log("S changeEnquiryStatusApi: ", JSON.stringify(action.payload));
            state.change_enquiry_response = action.payload;
            state.change_enquiry_status = "success";
        })
        builder.addCase(changeEnquiryStatusApi.rejected, (state, action) => {
            console.log("F changeEnquiryStatusApi: ", JSON.stringify(action.payload));
            state.change_enquiry_response = null;
            state.change_enquiry_status = "failed";
        })
    }
});

export const {
    clearState,
} = slice.actions;
export default slice.reducer;