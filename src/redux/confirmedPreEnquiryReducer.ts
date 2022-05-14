import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import URL from "../networking/endpoints";
import { client } from '../networking/client';
import { showToastRedAlert } from "../utils/toast";

export const getPreEnquiryDetails = createAsyncThunk("CONFIRMED_PRE_ENQUIRY/getPreEnquiryDetails", async (universalId, { rejectWithValue }) => {
    const response = await client.get(URL.CONTACT_DETAILS(universalId))
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const customerLeadRef = createAsyncThunk("CONFIRMED_PRE_ENQUIRY/customerLeadRef", async (payload, { rejectWithValue }) => {
    const response = await client.post(URL.CUSTOMER_LEAD_REFERENCE(), payload)
    const json = await response.json()
    console.log("LEAD REF", JSON.stringify(json));
    
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

export const getEmployeesListApi = createAsyncThunk("CONFIRMED_PRE_ENQUIRY/getEmployeesListApi", async (data: any, { rejectWithValue }) => {
    const response = await client.get(URL.SOURCE_OF_ENQUIRY_ENQUIRY(data.sourceId, data.orgId, data.branchId))
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


interface DropDownModelNew {
    key: string;
    value: string;
    id?: string;
}
interface DropDownModel {
    id: string;
    name: string;
    keyId: string;
}
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
        status: "",
        drop_reasons_list: [],
        // Booking Drop
        drop_reason: "",
        drop_remarks: "",
        reject_remarks: "",
        d_brand_name: "",
        d_dealer_name: "",
        d_location: "",
        d_model: "",

    },
    reducers: {
        clearState: (state, action) => {
            state.pre_enquiry_details = {};
            state.all_pre_enquiry_tasks = [];
            state.employees_list = [];
            state.employees_list_status = "";
            state.assign_task_status = "";
            state.update_employee_status = "";
            state.change_enquiry_response = null;
            state.change_enquiry_status = "";
            state.isLoading = false;
            state.create_enquiry_loading = false;
            state.status = "";
            state.drop_reasons_list = [];
            // Booking Drop
            state.drop_reason = "";
            state.drop_remarks = "";
            state.reject_remarks = "";
            state.d_brand_name = "";
            state.d_dealer_name = "";
            state.d_location = "";
            state.d_model = "";
        },
        setDropDownData: (state, action: PayloadAction<DropDownModelNew>) => {
            const { key, value, id } = action.payload;
            switch (key) {
                case "DROP_REASON":
                    state.drop_reason = value;
                    break;
            }
        },
        setPreEnquiryDropDetails: (state, action) => {
            const { key, text } = action.payload;
            switch (key) {
                case "DROP_REMARKS":
                    state.drop_remarks = text;
                    break;
                case "DROP_BRAND_NAME":
                    state.d_brand_name = text;
                    break;
                case "DROP_DEALER_NAME":
                    state.d_dealer_name = text;
                    break;
                case "DROP_LOCATION":
                    state.d_location = text;
                    break;
                case "DROP_MODEL":
                    state.d_model = text;
                    break;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getPreEnquiryDetails.pending, (state, action) => {
            state.isLoading = true;
            state.pre_enquiry_details = {};
        })
        builder.addCase(getPreEnquiryDetails.fulfilled, (state, action) => {
            state.pre_enquiry_details = action.payload.dmsEntity;
            state.isLoading = false;
        })
        builder.addCase(getPreEnquiryDetails.rejected, (state, action) => {
            state.isLoading = false;
            state.pre_enquiry_details = {};
        })
        builder.addCase(noThanksApi.fulfilled, (state, action) => {
            console.log("noThanksApi: ", JSON.stringify(action.payload));
        })
        builder.addCase(getEmployeesListApi.pending, (state, action) => {
            state.employees_list = [];
            state.employees_list_status = "";
        })
        builder.addCase(getEmployeesListApi.fulfilled, (state, action) => {
            state.employees_list = action.payload.dmsEntity.employeeDTOs || [];
            state.employees_list_status = "success";
        })
        builder.addCase(getEmployeesListApi.rejected, (state, action) => {
            state.employees_list = [];
            state.employees_list_status = "failed";
            if (action.payload["message"]) {
                showToastRedAlert(action.payload["message"]);
            }
        })
        builder.addCase(getaAllTasks.pending, (state, action) => {
            state.create_enquiry_loading = true;
            state.all_pre_enquiry_tasks = [];
        })
        builder.addCase(getaAllTasks.fulfilled, (state, action) => {
            const dmsEntity = action.payload.dmsEntity;
            state.all_pre_enquiry_tasks = dmsEntity.tasks || [];
            state.create_enquiry_loading = false;
        })
        builder.addCase(getaAllTasks.rejected, (state, action) => {
            state.create_enquiry_loading = false;
            state.all_pre_enquiry_tasks = [];
        })
        builder.addCase(assignTaskApi.pending, (state, action) => {
            state.assign_task_status = "pending";
        })
        builder.addCase(assignTaskApi.fulfilled, (state, action) => {
            state.assign_task_status = "success";
        })
        builder.addCase(assignTaskApi.rejected, (state, action) => {
            state.assign_task_status = "failed";
        })
        builder.addCase(changeEnquiryStatusApi.pending, (state, action) => {
            state.change_enquiry_response = {};
            state.change_enquiry_status = "Pending";
        })
        builder.addCase(changeEnquiryStatusApi.fulfilled, (state, action) => {
            console.log("S changeEnquiryStatusApi: ", JSON.stringify(action.payload))
            state.change_enquiry_response = action.payload;
            state.change_enquiry_status = "success";
        })
        builder.addCase(changeEnquiryStatusApi.rejected, (state, action) => {
            state.change_enquiry_response = {};
            state.change_enquiry_status = "failed";
        })
        builder.addCase(updateEmployeeApi.pending, (state, action) => {
            state.update_employee_status = "pending";
        })
        builder.addCase(updateEmployeeApi.fulfilled, (state, action) => {
            state.update_employee_status = "success";
        })
        builder.addCase(updateEmployeeApi.rejected, (state, action) => {
            state.update_employee_status = "failed";
        })
    }

});

export const { clearState, setDropDownData, setPreEnquiryDropDetails } = slice.actions;
export default slice.reducer;
