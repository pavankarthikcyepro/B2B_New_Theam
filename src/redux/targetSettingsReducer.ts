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
    console.log("PAYLOAD:", URL.ADD_TARGET_MAPPING(), JSON.stringify(payload))
    const response = await client.post(URL.ADD_TARGET_MAPPING(), payload)

    const json = await response.json()
    console.log("$$$$%%%$$ ADD:", JSON.stringify(json));
    if (json?.message) {
        showToast(json.message)
    }
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const editTargetMapping = createAsyncThunk("TARGET_SETTINGS/editTargetMapping", async (payload: any, { rejectWithValue }) => {

    const response = await client.post(URL.EDIT_TARGET_MAPPING(), payload)
    const json = await response.json()
    console.log("$$$$%%%$$ EDIT:", JSON.stringify(json));
    if (json?.message){
        showToast(json.message)
    }
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

export const getSpecialDropValue = createAsyncThunk("TARGET_SETTINGS/getSpecialDropValue", async (payload: any, { rejectWithValue }) => {

    const response = await client.post(URL.GET_SPECIAL_DROP_VALUE(), payload)
    const json = await response.json()

    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const saveSelfTargetParams = createAsyncThunk("TARGET_SETTINGS/saveSelfTargetParams", async (payload: any, { rejectWithValue }) => {
    console.log('$$$$%%%$$ EDIT save params: payload:: ', payload)
    const response = await client.post(URL.UPDATE_SELF_TARGET_PARAMS(), payload)
    const json = await response.json()
    console.log("$$$$%%%$$ EDIT save params:", JSON.stringify(json));
    if (json?.message){
        showToast(json.message)
    }
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})
export const saveTeamTargetParams = createAsyncThunk("TARGET_SETTINGS/saveTeamTargetParams", async (payload: any, { rejectWithValue }) => {
    console.log('$$$$%%%$$ EDIT save TEAM params: payload:: ', payload)
    const response = await client.post(URL.UPDATE_TEAM_TARGET_PARAMS(), payload)
    const json = await response.json()
    console.log("$$$$%%%$$ EDIT save TEAM params:", JSON.stringify(json));
    if (json?.message){
        showToast(json.message)
    }
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
        isLoading: false,
        isTeam: false,
        activeBranches: [],
        roles: [],
        targetMapping: [],
        employees_drop_down_data: {},
        monthList: [
            {
                id: 1,
                name: "January",
                isChecked: false,
            },
            {
                id: 2,
                name: "February",
                isChecked: false,
            },
            {
                id: 3,
                name: "March",
                isChecked: false,
            },
            {
                id: 4,
                name: "April",
                isChecked: false,
            },
            {
                id: 5,
                name: "May",
                isChecked: false,
            },
            {
                id: 6,
                name: "June",
                isChecked: false,
            },
            {
                id: 7,
                name: "July",
                isChecked: false,
            },
            {
                id: 8,
                name: "August",
                isChecked: false,
            },
            {
                id: 9,
                name: "September",
                isChecked: false,
            },
            {
                id: 10,
                name: "October",
                isChecked: false,
            },
            {
                id: 11,
                name: "November	",
                isChecked: false,
            },
            {
                id: 12,
                name: "December",
                isChecked: false,
            }
        ],
        selectedMonth: null,
        targetType: 'MONTHLY',
        isDataLoaded: false,
        specialOcation: [],
        selectedSpecial: null,
        team_target_data_saved: false
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
        },
        updateMonth: (state, action) => {
            state.selectedMonth = action.payload;
        },
        updateTargetType: (state, action) => {
            state.targetType = action.payload;
        },
        updateSpecial: (state, action) => {
            state.selectedSpecial = action.payload;
        },
    },
    extraReducers: (builder) => {

        builder
            .addCase(getEmployeesActiveBranch.pending, (state, action) => {
                state.activeBranches = [];
                state.isLoading = true;
            })
            .addCase(getEmployeesActiveBranch.fulfilled, (state, action) => {
                // console.log('menu_list: ', JSON.stringify(action.payload));
                state.isLoading = false;

                state.activeBranches = action.payload;
            })
            .addCase(getEmployeesActiveBranch.rejected, (state, action) => {
                state.isLoading = false;

                state.activeBranches = [];
            })
            .addCase(getEmployeesRolls.pending, (state, action) => {
                state.isLoading = true;

                state.roles = [];
            })
            .addCase(getEmployeesRolls.fulfilled, (state, action) => {
                state.isLoading = false;

                // console.log('menu_list: ', JSON.stringify(action.payload));
                state.roles = action.payload;
            })
            .addCase(getEmployeesRolls.rejected, (state, action) => {
                state.isLoading = false;

                state.roles = [];
            })
            .addCase(getAllTargetMapping.pending, (state, action) => {
                state.isLoading = true;

                state.isDataLoaded = false
                state.targetMapping = [];
            })
            .addCase(getAllTargetMapping.fulfilled, (state, action) => {
                state.isLoading = false;

                console.log('menu_list: ', JSON.stringify(action.payload));
                state.targetMapping = []
                state.targetMapping = action.payload.data ? action.payload.data : [];
                state.isDataLoaded = true
            })
            .addCase(getAllTargetMapping.rejected, (state, action) => {
                state.isLoading = false;

                state.targetMapping = [];
                state.isDataLoaded = true
            })
            .addCase(addTargetMapping.pending, (state, action) => {
                state.isLoading = true;


            })
            .addCase(addTargetMapping.fulfilled, (state, action) => {
                state.isLoading = false;

                if (action.payload?.message){
                    showToast(action.payload.message)
                }
            })
            .addCase(addTargetMapping.rejected, (state, action) => {
                state.isLoading = false;

            })
            .addCase(editTargetMapping.pending, (state, action) => {
                state.isLoading = true;

            })
            .addCase(editTargetMapping.fulfilled, (state, action) => {
                state.isLoading = false;

                if (action.payload?.message) {
                    showToast(action.payload.message)
                }
            })
            .addCase(editTargetMapping.rejected, (state, action) => {
                state.isLoading = false;

            })
            .addCase(getEmployeesDropDownData.pending, (state, action) => {
                state.isLoading = true;

                state.employees_drop_down_data = {};
            })
            .addCase(getEmployeesDropDownData.fulfilled, (state, action) => {
                state.isLoading = false;

                console.log("S getEmployeesDropDownData: ", JSON.stringify(action.payload));
                if (action.payload) {
                    state.employees_drop_down_data = action.payload;
                }
            })
            .addCase(getEmployeesDropDownData.rejected, (state, action) => {
                state.isLoading = false;

                state.employees_drop_down_data = {};
            })
            .addCase(getSpecialDropValue.pending, (state, action) => {
                state.isLoading = true;

                // state.employees_drop_down_data = {};
            })
            .addCase(getSpecialDropValue.fulfilled, (state, action) => {
                state.isLoading = false;

                console.log("$$$$$$$$$ SPECIAL1:", JSON.stringify(action.payload));
                if (action.payload.length > 0) {
                    let temp = [];
                    for (let i = 0; i < action.payload.length; i++){
                        temp.push({
                            ...action.payload[i],
                            id: action.payload[i].id,
                            name: action.payload[i].value,
                            isChecked: false,
                        })
                        if (i === action.payload.length - 1){
                            state.specialOcation = temp;
                        }
                    }
                }
            })
            .addCase(getSpecialDropValue.rejected, (state, action) => {
                state.isLoading = false;

                // state.employees_drop_down_data = {};
            })
            .addCase(saveSelfTargetParams.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(saveSelfTargetParams.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(saveSelfTargetParams.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(saveTeamTargetParams.pending, (state, action) => {
                state.isLoading = true;
                state.team_target_data_saved = false;
            })
            .addCase(saveTeamTargetParams.fulfilled, (state, action) => {
                state.isLoading = false;
                state.team_target_data_saved = true;
            })
            .addCase(saveTeamTargetParams.rejected, (state, action) => {
                state.isLoading = false;
                state.team_target_data_saved = false;
            })
    }
});

export const { updateStartDate, updateEndDate, updateIsTeam, updateMonth, updateTargetType, updateSpecial } = targetSettingsSlice.actions;
export default targetSettingsSlice.reducer;
