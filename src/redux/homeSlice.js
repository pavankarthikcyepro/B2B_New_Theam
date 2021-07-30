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

export const getMenuList = createAsyncThunk("HOME/getMenuList", async (name) => {

  const response = client.get(URL.MENULIST_API(name))
  return response;
})

export const getCarModalList = createAsyncThunk("HOME/getCarModalList", async (orgId) => {

  const response = client.get(URL.VEHICLE_MODELS(orgId))
  return response;
})

export const getCustomerTypeList = createAsyncThunk("HOME/getCustomerTypeList", async () => {

  const response = client.get(URL.CUSTOMER_TYPE())
  return response;
})

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
    dateSelectedIndex: 0,
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
        // console.log('menu_list: ', action.payload);
        const dmsEntityObj = action.payload.dmsEntity;
        const empId = dmsEntityObj.loginEmployee.empId;
        AsyncStore.storeData(AsyncStore.Keys.EMP_ID, empId.toString());
        state.employeeId = empId;
      })
      .addCase(getMenuList.rejected, (state, action) => {

      })
      .addCase(getCarModalList.fulfilled, (state, action) => {
        // console.log('vehicle_modal_list: ', action.payload);
        const data = action.payload;
        let modalList = [];
        data.forEach(item => {
          modalList.push({ id: item.vehicleId, name: item.model })
        });
        state.vehicle_modal_list = modalList;
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
  }
});

export const { dateSelected, showDateModal } = homeSlice.actions;
export default homeSlice.reducer;
