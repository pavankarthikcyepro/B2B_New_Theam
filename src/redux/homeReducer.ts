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

export const getSourceOfEnquiryList = createAsyncThunk("HOME/getSourceOfEnquiryList", async (data, { rejectWithValue }) => {

  const response = await client.get(URL.GET_SOURCE_OF_ENQUIRY())
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
    customer_type_list: [],
    source_of_enquiry_list: [],
    dateSelectedIndex: 0,
    login_employee_details: {},
    dateModalVisible: false,
  },
  reducers: {
    dateSelected: (state, action) => {
      state.dateSelectedIndex = action.payload;
    },
    showDateModal: (state, action) => {
      state.dateModalVisible = !state.dateModalVisible;
    },
  },
  extraReducers: (builder) => {
    builder
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
      })
      .addCase(getMenuList.rejected, (state, action) => {

      })
      .addCase(getCarModalList.fulfilled, (state, action) => {
        // console.log('vehicle_modal_list: ', action.payload);
        if (action.payload) {
          state.vehicle_modal_list = action.payload;
        }
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
        if (action.payload) {
          state.source_of_enquiry_list = action.payload;
        }
      })
      .addCase(getSourceOfEnquiryList.rejected, (state, action) => {
        state.source_of_enquiry_list = [];
      })
  }
});

export const { dateSelected, showDateModal } = homeSlice.actions;
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