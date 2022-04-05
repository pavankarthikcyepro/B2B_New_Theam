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
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getCarModalList = createAsyncThunk("HOME/getCarModalList", async (orgId, { rejectWithValue }) => {

  const response = await client.get(URL.VEHICLE_MODELS(orgId))
  const json = await response.json()
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

  const response = await client.post(URL.GET_TARGET_PARAMS(), payload)
  const json = await response.json()
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
    vehicle_modal_list: [],
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
    org_is_loading: false,
    emp_is_loading: false,
    sales_data: {},
    sales_comparison_data: [],
    branchesList: []
  },
  reducers: {
    dateSelected: (state, action) => {
      state.dateSelectedIndex = action.payload;
    },
    updateFilterDropDownData: (state, action) => {
      state.filter_drop_down_data = action.payload;
    },
  },
  extraReducers: (builder) => {

    builder
      .addCase(getMenuList.pending, (state, action) => {
        state.branchesList = [];
      })
      .addCase(getMenuList.fulfilled, (state, action) => {
        //console.log('menu_list: ', action.payload);
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
      // Get Car modal list
      .addCase(getCarModalList.pending, (state, action) => {
        state.vehicle_modal_list = [];
        state.vehicle_model_list_for_filters = [];
      })
      .addCase(getCarModalList.fulfilled, (state, action) => {
        if (action.payload) {
          state.vehicle_modal_list = action.payload;

          // For pre-enquiry, enquiry & pre-booking filter's
          let modalList = [];
          if (state.vehicle_modal_list.length > 0) {
            state.vehicle_modal_list.forEach((item) => {
              modalList.push({ id: item.vehicleId, name: item.model, isChecked: false });
            });
          }
          state.vehicle_model_list_for_filters = modalList;
        }
      })
      .addCase(getCarModalList.rejected, (state, action) => {
        state.vehicle_modal_list = [];
        state.vehicle_model_list_for_filters = [];
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
        //console.log("S getTargetParametersData: ", JSON.stringify(action.payload));
        if (action.payload) {
          state.target_parameters_data = action.payload;
        }
      })
      .addCase(getTargetParametersData.rejected, (state, action) => {
        state.target_parameters_data = [];
      })
      // Get Employees Drop Down Data
      .addCase(getEmployeesDropDownData.pending, (state, action) => {
        state.employees_drop_down_data = {};
      })
      .addCase(getEmployeesDropDownData.fulfilled, (state, action) => {
        //console.log("S getEmployeesDropDownData: ", JSON.stringify(action.payload));
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
        console.log("S getSalesData: ", JSON.stringify(action.payload));
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

export const { dateSelected, updateFilterDropDownData } = homeSlice.actions;
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