import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import URL from "../networking/endpoints";
import { client } from '../networking/client';

export const getPreEnquiryDetails = createAsyncThunk("CONFIRMED_PRE_ENQUIRY/getPreEnquiryDetails", async (universalId, { rejectWithValue }) => {
    const response = await client.get(URL.CONTACT_DETAILS(universalId))
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const noThanksApi = createAsyncThunk("CONFIRMED_PRE_ENQUIRY/noThanksApi", async (leadId, { rejectWithValue }) => {
    const response = await client.get(URL.NO_THANKS(leadId))
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getEmployeesListApi = createAsyncThunk("CONFIRMED_PRE_ENQUIRY/getEmployeesListApi", async (sourceOfEnquiryId, { rejectWithValue }) => {
    const response = await client.get(URL.SOURCE_OF_ENQUIRY_ENQUIRY(sourceOfEnquiryId))
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getaAllTasks = createAsyncThunk("CONFIRMED_PRE_ENQUIRY/getaAllTasks", async (endUrl, { rejectWithValue }) => {
    const url = URL.TASKS_PRE_ENQUIRY() + endUrl;
    const response = await client.get(url)
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const assignTaskApi = createAsyncThunk("CONFIRMED_PRE_ENQUIRY/assignTaskApi", async (body, { rejectWithValue }) => {
    const response = await client.put(URL.ASSIGN_TASK(), body)
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const changeEnquiryStatusApi = createAsyncThunk("CONFIRMED_PRE_ENQUIRY/changeEnquiryStatusApi", async (endUrl, { rejectWithValue }) => {
    const url = URL.CHANGE_ENQUIRY_STATUS() + endUrl;
    const response = await client.post(url, {})
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const updateEmployeeApi = createAsyncThunk("CONFIRMED_PRE_ENQUIRY/updateEmployeeApi", async (body, { rejectWithValue }) => {
    const response = await client.post(URL.SALES_CONSULTANT(), body)
    if (response.status !== 200) {
        return rejectWithValue(response);
    }
    return response;
})

export const slice = createSlice({
    name: "CONFIRMED_PRE_ENQUIRY",
    initialState: {
        pre_enquiry_details: {},
        all_pre_enquiry_tasks: [],
        employees_list: [],
        employees_list_status: "",
        assign_task_status: "",
        update_employee_status: "",
        change_enquiry_response: null,
        change_enquiry_status: "",
        isLoading: true,
        create_enquiry_loading: false,
        status: ""
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getPreEnquiryDetails.fulfilled, (state, action) => {
            // console.log("res: ", JSON.stringify(action.payload));
            state.pre_enquiry_details = action.payload.dmsEntity;
            state.isLoading = false;
        })
        builder.addCase(getPreEnquiryDetails.rejected, (state, action) => {
            state.isLoading = false;
        })
        builder.addCase(noThanksApi.fulfilled, (state, action) => {
            console.log("noThanksApi: ", JSON.stringify(action.payload));
        })
        builder.addCase(getEmployeesListApi.fulfilled, (state, action) => {
            // console.log("getEmployeesListApi: ", JSON.stringify(action.payload));
            state.employees_list = action.payload.dmsEntity.employeeDTOs || [];
            state.employees_list_status = "success";
        })
        builder.addCase(getaAllTasks.pending, (state, action) => {
            state.create_enquiry_loading = true;
        })
        builder.addCase(getaAllTasks.fulfilled, (state, action) => {
            console.log("getaAllTasks: ", JSON.stringify(action.payload));
            const dmsEntity = action.payload.dmsEntity;
            state.all_pre_enquiry_tasks = dmsEntity.tasks || [];
        })
        builder.addCase(assignTaskApi.fulfilled, (state, action) => {
            console.log("assignTaskApi: ", JSON.stringify(action.payload));
            state.assign_task_status = "success";
        })
        builder.addCase(changeEnquiryStatusApi.fulfilled, (state, action) => {
            console.log("changeEnquiryStatusApi: ", JSON.stringify(action.payload));
            state.change_enquiry_response = action.payload;
            state.change_enquiry_status = "success";
        })
        builder.addCase(updateEmployeeApi.fulfilled, (state, action) => {
            console.log("updateEmployeeApi: ", JSON.stringify(action.payload));
            state.update_employee_status = "success";
        })
    }
});

export const { } = slice.actions;
export default slice.reducer;
