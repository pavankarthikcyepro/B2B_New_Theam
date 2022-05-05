import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";
import * as AsyncStore from '../asyncStore';

export const getEmployeesActiveBranch = createAsyncThunk("TARGET_SETTINGS/getEmployeesActiveBranch", async (payload: any, { rejectWithValue }) => {

    const response = await client.get(URL.GET_EMPLOYEES_ACTIVE_BRANCHES(payload.orgId, payload.empId))
    const json = await response.json()
    
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getEmployeesRolls = createAsyncThunk("TARGET_SETTINGS/getEmployeesRolls", async (payload: any, { rejectWithValue }) => {

    const response = await client.get(URL.GET_EMPLOYEES_ROLES(payload.empId))
    const json = await response.json()

    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const addTargetMapping = createAsyncThunk("TARGET_SETTINGS/addTargetMapping", async (payload: any, { rejectWithValue }) => {

    const response = await client.post(URL.ADD_TARGET_MAPPING(), payload)
    const json = await response.json()

    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getAllTargetMapping = createAsyncThunk("TARGET_SETTINGS/getAllTargetMapping", async (payload: any, { rejectWithValue }) => {

    const response = await client.post(URL.GET_ALL_TARGET_MAPPING(), payload)
    const json = await response.json()
    console.log("RES:", JSON.stringify(json));

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
        targetMapping: []
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
    }
});

export const { updateStartDate, updateEndDate, updateIsTeam } = targetSettingsSlice.actions;
export default targetSettingsSlice.reducer;