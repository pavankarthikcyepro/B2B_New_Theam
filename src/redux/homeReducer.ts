import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";
import * as AsyncStore from '../asyncStore';

const data = [
    {
        title: "Pre-Enquiry",
        count: 12,
    },
    {
        title: "My Task",
        count: 10,
    },
];

const dates = [
    {
        month: "MAY",
        date: 1,
        day: "Mon",
    },
    {
        month: "MAY",
        date: 2,
        day: "Tue",
    },
    {
        month: "MAY",
        date: 3,
        day: "Wed",
    },
    {
        month: "MAY",
        date: 4,
        day: "Thu",
    },
    {
        month: "MAY",
        date: 5,
        day: "Fri",
    },
];

export const getMenuList = createAsyncThunk("HOME/getMenuList", async (name, { rejectWithValue }) => {

    const response = await client.get(URL.MENULIST_API(name))
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getOrganaizationHirarchyList = createAsyncThunk("HOME/getOrganaizationHirarchyList", async (payload: any, { rejectWithValue }) => {

    const response = await client.get(URL.ORG_HIRARCHY(payload.orgId, payload.branchId))
    const json = await response.json()
    // console.log("$$$$ DATA $$$$$:", JSON.stringify(json));
    
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getCustomerTypeList = createAsyncThunk("HOME/getCustomerTypeList", async (data, { rejectWithValue }) => {

    const response = await client.get(URL.CUSTOMER_TYPE())
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getSourceOfEnquiryList = createAsyncThunk("HOME/getSourceOfEnquiryList", async (orgId, { rejectWithValue }) => {

    const response = await client.get(URL.GET_SOURCE_OF_ENQUIRY(orgId))
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getVehicalModalList = createAsyncThunk("HOME/getVehicalModalList", async (payload: any, { rejectWithValue }) => {

    const response = await client.post(URL.GET_VEHICAL_MODAL(), payload)
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getLeadSourceTableList = createAsyncThunk("HOME/getLeadSourceTableList", async (payload: any, { rejectWithValue }) => {

    const response = await client.post(URL.LEAD_SOURCE_DATA(), payload)
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getVehicleModelTableList = createAsyncThunk("HOME/getVehicleModelTableList", async (payload: any, { rejectWithValue }) => {

    const response = await client.post(URL.VEHICLE_MODEL_DATA(), payload)
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getEventTableList = createAsyncThunk("HOME/getEventTableList", async (payload: any, { rejectWithValue }) => {

    const response = await client.post(URL.EVENT_DATA(), payload)
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getTaskTableList = createAsyncThunk("HOME/getTaskTableList", async (payload: any, { rejectWithValue }) => {

    const response = await client.post(URL.TASKS_DATA(), payload)
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    } 
    return json;
})

export const getLostDropChartData = createAsyncThunk("HOME/getLostDropChartData", async (payload: any, { rejectWithValue }) => {

    const response = await client.post(URL.GET_LOST_DROP_CHART_DATA(), payload)
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getTargetParametersData = createAsyncThunk("HOME/getTargetParametersData", async (payload: any, { rejectWithValue }) => {
    // console.log("PAYLOAD:", payload);
    
    const response = await client.post(URL.GET_TARGET_PARAMS(), payload)
    const json = await response.json()
    console.log("homeReducer", payload);


    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
}) 

export const getTargetParametersAllData = createAsyncThunk("HOME/getTargetParametersAllData", async (payload: any, { rejectWithValue }) => {
    // console.log("PAYLOAD:", payload);

    const response = await client.post(URL.GET_TARGET_PARAMS_ALL(), payload)
    const json = await response.json()

    // console.log("&&&&&& DATA $$$$$$$:", JSON.stringify(json));

    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getTargetParametersEmpData = createAsyncThunk("HOME/getTargetParametersEmpData", async (payload: any, { rejectWithValue }) => {
    // console.log("PAYLOAD:", payload);

    const response = await client.post(URL.GET_TARGET_PARAMS_EMP(), payload)
    const json = await response.json()

    // console.log("&&&&&& DATA $$$$$$$:", JSON.stringify(json));

    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getGroupDealerRanking = createAsyncThunk("HOME/getGroupDealerRanking", async (payload: any, { rejectWithValue }) => {
    // console.log("&&&&", URL.GET_TARGET_RANKING(payload.orgId), payload.payload);
    console.log("CALLED");

    const response = await client.post(URL.GET_TARGET_GROUP_RANKING(payload.orgId), payload.payload)
    const json = await response.json()
    // console.log("&&&&&& DATA:", json);

    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getDealerRanking = createAsyncThunk("HOME/getDealerRanking", async (payload: any, { rejectWithValue }) => {

    const response = await client.post(URL.GET_TARGET_RANKING(payload.orgId, payload.branchId), payload.payload)
    const json = await response.json()
    // console.log("&&&&&& DATA:", json);

    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getEmployeesDropDownData = createAsyncThunk("HOME/getEmployeesDropDownData", async (payload: any, { rejectWithValue }) => {

    const response = await client.post(URL.GET_EMPLOYEES_DROP_DOWN_DATA(payload.orgId, payload.empId), payload.selectedIds)
    const json = await response.json()
    
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getSalesData = createAsyncThunk("HOME/getSalesData", async (payload: any, { rejectWithValue }) => {

    const response = await client.post(URL.GET_SALES_DATA(), payload)
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getSalesComparisonData = createAsyncThunk("HOME/getSalesComparisonData", async (payload: any, { rejectWithValue }) => {

    const response = await client.post(URL.GET_SALES_COMPARISON_DATA(), payload)
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getBranchIds = createAsyncThunk("HOME/getBranchIds", async (payload: any, { rejectWithValue }) => {
    console.log("CALLED");
    
    const response = await client.get(URL.GET_BRANCH())
    const json = await response.json()
    console.log("SUCCESS:", json);
    
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const downloadFile = createAsyncThunk("HOME/downloadFile", async (payload: any, { rejectWithValue }) => {

    const response = await client.post(URL.DOWNLOAD_FILE(), payload)
    const json = await response.json()
    console.log("DOWNLOAD: ", json);
    
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})


export const updateIsTeam = createAsyncThunk("HOME/updateIsTeam", async (payload: any) => {
    console.log("PPP", payload);
    
    return payload;
})

const AVAILABLE_SCREENS = [
    {
        "menuId": 81,
        "displayName": "EMS",
    },
    {
        "menuId": 100,
        "displayName": "Event Management",
    }
]

export const homeSlice = createSlice({
    name: "HOME",
    initialState: {
        serchtext: "",
        employeeId: "",
        tableData: data,
        datesData: dates,
        menuList: [],
        vehicle_model_list_for_filters: [],
        customer_type_list: [],
        source_of_enquiry_list: [],
        dateSelectedIndex: 0,
        login_employee_details: {},
        filter_drop_down_data: [],
        lead_source_table_data: [],
        vehicle_model_table_data: [],
        events_table_data: [],
        task_table_data: {},
        lost_drop_chart_data: {},
        employees_drop_down_data: {},
        target_parameters_data: [],
        all_target_parameters_data: [],
        all_emp_parameters_data: [],
        org_is_loading: false,
        emp_is_loading: false,
        sales_data: {},
        sales_comparison_data: [],
        branchesList: [],
        allGroupDealerData: [],
        allDealerData: [],
        isTeam: false,
        isTeamPresent: false
    },
    reducers: {
        dateSelected: (state, action) => {
            state.dateSelectedIndex = action.payload;
        },
        updateFilterDropDownData: (state, action) => {
            state.filter_drop_down_data = action.payload;
        },
        updateIsTeamPresent: (state, action) => {
            state.isTeamPresent = action.payload;
        },
    },
    extraReducers: (builder) => {

        builder
            .addCase(getMenuList.pending, (state, action) => {
                state.branchesList = [];
            })
            .addCase(getMenuList.fulfilled, (state, action) => {
                // console.log('menu_list: ', JSON.stringify(action.payload));
                const dmsEntityObj = action.payload.dmsEntity;
                const menuList = dmsEntityObj.menuList;

                if (menuList.length > 0) {
                    let newMenuList = [];
                    menuList.forEach((item) => {
                        newMenuList.push({
                            screen: item.menuId,
                            title: item.displayName
                        })
                    });
                    state.menuList = newMenuList;
                }

                const empId = dmsEntityObj.loginEmployee.empId;
                AsyncStore.storeData(AsyncStore.Keys.EMP_ID, empId.toString());
                state.login_employee_details = dmsEntityObj.loginEmployee;
                AsyncStore.storeData(AsyncStore.Keys.LOGIN_EMPLOYEE, JSON.stringify(dmsEntityObj.loginEmployee));
                state.employeeId = empId;
                state.branchesList = dmsEntityObj.loginEmployee.branchs;
                AsyncStore.storeData("BRANCHES_DATA", JSON.stringify(dmsEntityObj.loginEmployee.branchs))
            })
            .addCase(getMenuList.rejected, (state, action) => {
                state.branchesList = [];
            })
            .addCase(updateIsTeam.fulfilled, (state, action) => {
                console.log("TEAM: ", action.payload);
                
                state.isTeam = action.payload;
            })
            .addCase(getCustomerTypeList.fulfilled, (state, action) => {
                //console.log('customer_type_list: ', action.payload);
                const data = action.payload;
                let typeList = [];
                data.forEach(item => {
                    typeList.push({ id: item.id, name: item.customerType })
                });
                state.customer_type_list = typeList;
            })
            // Get Source of Enquiry List
            .addCase(getSourceOfEnquiryList.pending, (state, action) => {
                state.source_of_enquiry_list = [];
            })
            .addCase(getSourceOfEnquiryList.fulfilled, (state, action) => {
                //console.log("getSourceOfEnquiryList S: ", JSON.stringify(action.payload))
                if (action.payload) {
                    const sourceList = action.payload;
                    let modalList = [];
                    if (sourceList.length > 0) {
                        sourceList.forEach((item) => {
                            modalList.push({ ...item, isChecked: false });
                        });
                    }
                    state.source_of_enquiry_list = modalList;
                }
            })
            .addCase(getSourceOfEnquiryList.rejected, (state, action) => {
                state.source_of_enquiry_list = [];
            })
            // Get Vehical Modal List
            .addCase(getVehicalModalList.pending, (state, action) => {
                state.vehicle_model_list_for_filters = [];
            })
            .addCase(getVehicalModalList.fulfilled, (state, action) => {
                //console.log("getSourceOfEnquiryList S: ", JSON.stringify(action.payload))
                if (action.payload) {
                    const modalList = action.payload;
                    let sourceList = [];
                    if (modalList.length > 0) {
                        modalList.forEach((item) => {
                            sourceList.push({ ...item, isChecked: false });
                        });
                    }
                    state.vehicle_model_list_for_filters = modalList;
                }
            })
            .addCase(getVehicalModalList.rejected, (state, action) => {
                state.vehicle_model_list_for_filters = [];
            })
            // Get Filter Dropdown list
            .addCase(getOrganaizationHirarchyList.pending, (state, action) => {

            })
            .addCase(getOrganaizationHirarchyList.fulfilled, (state, action) => {
                // console.log("S getOrganaizationHirarchyList: ", JSON.stringify(action.payload));
                if (action.payload) {
                    state.filter_drop_down_data = action.payload;
                }
            })
            .addCase(getOrganaizationHirarchyList.rejected, (state, action) => {
                // console.log("F getOrganaizationHirarchyList: ", JSON.stringify(action.payload));
            })
            // Get Lead Source Table List
            .addCase(getLeadSourceTableList.pending, (state, action) => {
                state.lead_source_table_data = [];
            })
            .addCase(getLeadSourceTableList.fulfilled, (state, action) => {
                //console.log("S getLeadSourceTableList: ", JSON.stringify(action.payload));
                if (action.payload) {
                    state.lead_source_table_data = action.payload;
                }
            })
            .addCase(getLeadSourceTableList.rejected, (state, action) => {
                state.lead_source_table_data = [];
            })
            // Get Vehicle Model Table List
            .addCase(getVehicleModelTableList.pending, (state, action) => {
                state.vehicle_model_table_data = [];
            })
            .addCase(getVehicleModelTableList.fulfilled, (state, action) => {
                //console.log("S getVehicleModelTableList: ", JSON.stringify(action.payload));
                if (action.payload) {
                    state.vehicle_model_table_data = action.payload;
                }
            })
            .addCase(getVehicleModelTableList.rejected, (state, action) => {
                state.vehicle_model_table_data = [];
            })
            // Get Event Table List
            .addCase(getEventTableList.pending, (state, action) => {
                state.events_table_data = [];
            })
            .addCase(getEventTableList.fulfilled, (state, action) => {
                // console.log("S getEventTableList: ", JSON.stringify(action.payload));
                if (action.payload) {
                    state.events_table_data = action.payload;
                }
            })
            .addCase(getEventTableList.rejected, (state, action) => {
                state.events_table_data = [];
            })
            // Get Event Table List
            .addCase(getTaskTableList.pending, (state, action) => {
                state.task_table_data = {};
            })
            .addCase(getTaskTableList.fulfilled, (state, action) => {
                //console.log("S getTaskTableList: ", JSON.stringify(action.payload));
                if (action.payload) {
                    state.task_table_data = action.payload;
                }
            })
            .addCase(getTaskTableList.rejected, (state, action) => {
                state.task_table_data = {};
            })
            // Get Lost Drop Chart Data
            .addCase(getLostDropChartData.pending, (state, action) => {
                state.lost_drop_chart_data = {};
            })
            .addCase(getLostDropChartData.fulfilled, (state, action) => {
                //console.log("S getLostDropChartData: ", JSON.stringify(action.payload));
                if (action.payload) {
                    state.lost_drop_chart_data = action.payload;
                }
            })
            .addCase(getLostDropChartData.rejected, (state, action) => {
                state.lost_drop_chart_data = {};
            })
            // Get Target Parameters Data
            .addCase(getTargetParametersData.pending, (state, action) => {
                state.target_parameters_data = [];
            })
            .addCase(getTargetParametersData.fulfilled, (state, action) => {
                if (action.payload) {
                    state.target_parameters_data = [];
                    // console.log(action.payload, "action:")
                    state.target_parameters_data = action.payload;
                }
            })
            .addCase(getTargetParametersData.rejected, (state, action) => {
                state.target_parameters_data = [];
            })
            .addCase(getTargetParametersAllData.pending, (state, action) => {
                state.all_target_parameters_data = [];
                state.all_emp_parameters_data = [];
            })
            .addCase(getTargetParametersAllData.fulfilled, (state, action) => {
                if (action.payload) {
                    // console.log("^%$%&*^&*^&*&*& SET %&&&*%^$%&*&^%", JSON.stringify(action.payload.overallTargetAchivements));
                    
                    state.all_target_parameters_data = [];
                    state.all_emp_parameters_data = [];
                    console.log(action.payload.employeeTargetAchievements, "dashboard")
                    state.isTeamPresent = action.payload.employeeTargetAchievements.length > 1;
                    state.all_target_parameters_data = action.payload.overallTargetAchivements;
                    state.all_emp_parameters_data = action.payload.employeeTargetAchievements;
                }
            })
            .addCase(getTargetParametersAllData.rejected, (state, action) => {
                state.all_target_parameters_data = [];
                state.all_emp_parameters_data = [];
            })
            .addCase(getGroupDealerRanking.pending, (state, action) => {
                state.allGroupDealerData = [];
            })
            .addCase(getGroupDealerRanking.fulfilled, (state, action) => {
                if (action.payload) {
                    state.allGroupDealerData = action.payload;
                }
            })
            .addCase(getGroupDealerRanking.rejected, (state, action) => {
                state.allGroupDealerData = [];
            })

            .addCase(getDealerRanking.pending, (state, action) => {
                state.allDealerData = [];
            })
            .addCase(getDealerRanking.fulfilled, (state, action) => {
                if (action.payload) {
                    state.allDealerData = action.payload;
                }
            })
            .addCase(getDealerRanking.rejected, (state, action) => {
                state.allDealerData = [];
            })

            // Get Employees Drop Down Data
            .addCase(getEmployeesDropDownData.pending, (state, action) => {
                state.employees_drop_down_data = {};
            })
            .addCase(getEmployeesDropDownData.fulfilled, (state, action) => {
                if (action.payload) {
                    state.employees_drop_down_data = action.payload;
                }
            })
            .addCase(getEmployeesDropDownData.rejected, (state, action) => {
                state.employees_drop_down_data = {};
            })
            // Get Sales Data
            .addCase(getSalesData.pending, (state, action) => {
                state.sales_data = {};
            })
            .addCase(getSalesData.fulfilled, (state, action) => {
                // console.log("S getSalesData: ", JSON.stringify(action.payload));
                if (action.payload) {
                    state.sales_data = action.payload;
                }
            })
            .addCase(getSalesData.rejected, (state, action) => {
                state.sales_data = {};
            })
            // Get Sales Comparison Data
            .addCase(getSalesComparisonData.pending, (state, action) => {
                state.sales_comparison_data = [];
            })
            .addCase(getSalesComparisonData.fulfilled, (state, action) => {
                //console.log("S getSalesComparisonData: ", JSON.stringify(action.payload));
                if (action.payload) {
                    state.sales_comparison_data = action.payload;
                }
            })
            .addCase(getSalesComparisonData.rejected, (state, action) => {
                state.sales_comparison_data = [];
            })
    }
});

export const { dateSelected, updateFilterDropDownData, updateIsTeamPresent } = homeSlice.actions;
export default homeSlice.reducer;


// const sampleData = [
//   {
//     "menuId": 81,
//     "description": "EMS",
//     "displayName": "EMS",
//   },
//   {
//     "menuId": 100,
//     "description": "Event Management",
//     "displayName": "Event Management",
//   },
//   {
//     "menuId": 115,
//     "description": "Test Drive",
//     "displayName": "Test Drive",
//   },
//   {
//     "menuId": 117,
//     "description": "Evaluator",
//     "displayName": "Evaluator",
//   },
//   {
//     "menuId": 119,
//     "description": "My Tasks",
//     "displayName": "My Tasks",
//   },
//   {
//     "menuId": 123,
//     "description": "Pre Booking",
//     "displayName": "Pre Booking",
//   },
//   {
//     "menuId": 125,
//     "description": "Pre Delivery",
//     "displayName": "Pre Delivery",
//   }
// ]