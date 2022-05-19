import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";
import * as AsyncStore from '../asyncStore';
import { showToast, showToastRedAlert } from '../utils/toast';

export const getEmployeesActiveBranch = createAsyncThunk("TARGET_SETTINGS/getEmployeesActiveBranch", async (payload: any, { rejectWithValue }) => {

    const response = await client.get(URL.GET_EMPLOYEES_ACTIVE_BRANCHES(payload.orgId, payload.empId))
    const json = await response.json()
    // console.log("$$$$%%%$$ BRANCH: ", JSON.stringify(json));
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getEmployeesRolls = createAsyncThunk("TARGET_SETTINGS/getEmployeesRolls", async (payload: any, { rejectWithValue }) => {

    const response = await client.get(URL.GET_EMPLOYEES_ROLES(payload.empId))
    const json = await response.json()
    // console.log("$$$$%%%$$ ROLLS:", JSON.stringify(json));

    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const addTargetMapping = createAsyncThunk("TARGET_SETTINGS/addTargetMapping", async (payload: any, { rejectWithValue }) => {

    const response = await client.post(URL.ADD_TARGET_MAPPING(), payload)
    const json = await response.json()
    console.log("$$$$%%%$$:", JSON.stringify(json));
    showToast(json.message)
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const editTargetMapping = createAsyncThunk("TARGET_SETTINGS/editTargetMapping", async (payload: any, { rejectWithValue }) => {

    const response = await client.post(URL.EDIT_TARGET_MAPPING(), payload)
    const json = await response.json()
    console.log("$$$$%%%$$:", JSON.stringify(json));
    showToast(json.message)
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getEmployeesDropDownData = createAsyncThunk("TARGET_SETTINGS/getEmployeesDropDownData", async (payload: any, { rejectWithValue }) => {

    const response = await client.post(URL.GET_EMPLOYEES_DROP_DOWN_DATA(payload.orgId, payload.empId), payload.selectedIds)
    const json = await response.json()
    // console.log("$$$$$$$$$ DROP DOWN2:", JSON.stringify(json));

    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getAllTargetMapping = createAsyncThunk("TARGET_SETTINGS/getAllTargetMapping", async (payload: any, { rejectWithValue }) => {

    const response = await client.post(URL.GET_ALL_TARGET_MAPPING(), payload)
    const json = await response.json()
    console.log("$$$$$$$$$ TARGET:", JSON.stringify(json));
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const targetSettingsSlice = createSlice({
    name: "TARGET_SETTINGS",
    initialState: {
        startDate: "",
        endDate: "",
        isTeam: false,
        activeBranches: [],
        roles: [],
        targetMapping: [],
        employees_drop_down_data: {},
    },
    reducers: {
        updateStartDate: (state, action) => {
            state.startDate = action.payload;
        },
        updateEndDate: (state, action) => {
            state.endDate = action.payload;
        },
        updateIsTeam: (state, action) => {
            state.isTeam = action.payload;
        }
    },
    extraReducers: (builder) => {

        builder
            .addCase(getEmployeesActiveBranch.pending, (state, action) => {
                state.activeBranches = [];
            })
            .addCase(getEmployeesActiveBranch.fulfilled, (state, action) => {
                // console.log('menu_list: ', JSON.stringify(action.payload));
                state.activeBranches = action.payload;
            })
            .addCase(getEmployeesActiveBranch.rejected, (state, action) => {
                state.activeBranches = [];
            })
            .addCase(getEmployeesRolls.pending, (state, action) => {
                state.roles = [];
            })
            .addCase(getEmployeesRolls.fulfilled, (state, action) => {
                // console.log('menu_list: ', JSON.stringify(action.payload));
                state.roles = action.payload;
            })
            .addCase(getEmployeesRolls.rejected, (state, action) => {
                state.roles = [];
            })
            .addCase(getAllTargetMapping.pending, (state, action) => {
                state.targetMapping = [];
            })
            .addCase(getAllTargetMapping.fulfilled, (state, action) => {
                // console.log('menu_list: ', JSON.stringify(action.payload));
                state.targetMapping = action.payload.data ? action.payload.data : [];
            })
            .addCase(getAllTargetMapping.rejected, (state, action) => {
                state.targetMapping = [];
            })
            .addCase(addTargetMapping.pending, (state, action) => {
                
            })
            .addCase(addTargetMapping.fulfilled, (state, action) => {
                if (action.payload?.message !== null){
                    showToast(action.payload.message)
                }
            })
            .addCase(addTargetMapping.rejected, (state, action) => {
                
            })
            .addCase(editTargetMapping.pending, (state, action) => {

            })
            .addCase(editTargetMapping.fulfilled, (state, action) => {
                if (action.payload?.message !== null) {
                    showToast(action.payload.message)
                }
            })
            .addCase(editTargetMapping.rejected, (state, action) => {

            })
            .addCase(getEmployeesDropDownData.pending, (state, action) => {
                state.employees_drop_down_data = {};
            })
            .addCase(getEmployeesDropDownData.fulfilled, (state, action) => {
                console.log("S getEmployeesDropDownData: ", JSON.stringify(action.payload));
                if (action.payload) {
                    state.employees_drop_down_data = action.payload;
                }
            })
            .addCase(getEmployeesDropDownData.rejected, (state, action) => {
                state.employees_drop_down_data = {};
            })
    }
});

export const { updateStartDate, updateEndDate, updateIsTeam } = targetSettingsSlice.actions;
export default targetSettingsSlice.reducer;