import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import URL from "../networking/endpoints";
import { client } from "../networking/client";
import { showToast } from "../utils/toast";

interface HomeVisitTextModel {
    key: string,
    text: string
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


const slice = createSlice({
    name: "HOME_VISIT_SLICE",
    initialState: {
        task_details_response: null,
        is_loading_for_task_update: false,
        update_task_response_status: null,
        reason: "",
        customer_remarks: "",
        employee_remarks: ""
    },
    reducers: {
        clearState: (state, action) => {
            state.task_details_response = null;
            state.update_task_response_status = null;
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
        }
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
    }
});

export const {
    clearState,
    setHomeVisitDetails
} = slice.actions;
export default slice.reducer;