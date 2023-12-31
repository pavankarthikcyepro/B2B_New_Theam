import React from "react";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";
import * as AsyncStore from "../asyncStore";
import realm from "../database/realm";
import { showAlertMessage, showToastRedAlert } from "../utils/toast";

interface LoginState {
  employeeId: string;
  password: string;
  securePassword: boolean;
  showLoginErr: boolean;
  showPasswordErr: boolean;
  loginErrMessage: string;
  passwordErrMessage: string;
  isLoading: boolean;
  status: string;
  authToken: string;
  userName: string;
  showLoader: boolean;
  offlineStatus: string;
  menuListStatus: string;
  empIdStatus: String;
  userData: object;
  empId: string;
  menuList: any;
  login_employee_details: any;
  branchesList: any;
  token: string;
}

interface ErrorMessage {
  key: string;
  message: string;
}

const initialState: LoginState = {
  employeeId: "",
  password: "",
  // employeeId: "systemadmin",
  // password: "Master@123",
  securePassword: true,
  showLoginErr: false,
  showPasswordErr: false,
  loginErrMessage: "",
  passwordErrMessage: "",
  isLoading: false,
  status: "",
  authToken: "",
  userName: "",
  showLoader: false,
  offlineStatus: "",
  userData: {},
  empId: "",
  menuListStatus: "",
  empIdStatus: "",
  menuList: [],
  login_employee_details: {},
  branchesList: [],
  token: "",
};

export const postUserData = createAsyncThunk(
  "LOGIN_SLICE/postUserData",
  async (inputData, { rejectWithValue }) => {
    const response = await client.post(URL.LOGIN(), inputData, {}, false);
    console.log("response", response);

    const json = await response.json();
    console.log("JSON", json);

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getMenuList = createAsyncThunk(
  "LOGIN_SLICE/getMenuList",
  async (name, { rejectWithValue }) => {
    const response = await client.get(URL.MENULIST_API(name));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getEmpId = createAsyncThunk(
  "LOGIN_SLICE/getEmpId",
  async (name, { rejectWithValue }) => {
    const response = await client.get(URL.GET_EMPID(name));
    const json = await response.json();
    if (!response.ok) {
      alert("not ok");
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getPreEnquiryData = createAsyncThunk(
  "LOGIN_SLICE/getPreEnquiryData",
  async (endUrl, { rejectWithValue }) => {
    let url = URL.LEADS_LIST_API() + endUrl;
    const response = await client.get(url);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getCustomerTypeList = createAsyncThunk(
  "LOGIN_SLICE/getCustomerTypeList",
  async (data, { rejectWithValue }) => {
    const response = await client.get(URL.CUSTOMER_TYPE());
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getCarModalList = createAsyncThunk(
  "LOGIN_SLICE/getCarModalList",
  async (orgId, { rejectWithValue }) => {
    const response = await client.get(URL.VEHICLE_MODELS(orgId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const loginSlice = createSlice({
  name: "LOGIN_SLICE",
  initialState,
  reducers: {
    clearState: (state, action) => {
      state.authToken = "";
      state.userName = "";
      state.status = "";
      state.isLoading = false;
      state.authToken = "";
      state.userName = "";
      state.showLoader = false;
      state.offlineStatus = "";
      state.userData = {};
      state.empId = "";
      state.menuListStatus = "";
      state.empIdStatus = "";
      state.branchesList = [];
    },
    clearUserNameAndPass: (state, action) => {
      state.employeeId = "";
      state.password = "";
    },
    updateEmployeeId: (state, action: PayloadAction<string>) => {
      let employeeId = action.payload;
      if (employeeId.length < 4) {
        state.showLoginErr = false;
        state.loginErrMessage = "";
      }
      state.employeeId = employeeId;
    },
    updatePassword: (state, action: PayloadAction<string>) => {
      let password = action.payload;
      if (password.length < 6) {
        state.showPasswordErr = true;
        state.passwordErrMessage = "Password must be minimum of 6 characters";
      } else {
        state.showPasswordErr = false;
        state.passwordErrMessage = "";
      }
      state.password = password;
    },
    updateSecurePassword: (state) => {
      state.securePassword = !state.securePassword;
    },
    showErrorMessage: (state, action: PayloadAction<ErrorMessage>) => {
      if (action.payload.key === "EMPLOYEEID") {
        state.showLoginErr = true;
        state.loginErrMessage = action.payload.message;
      } else {
        state.showPasswordErr = true;
        state.passwordErrMessage = action.payload.message;
      }
    },
    updateToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postUserData.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(postUserData.fulfilled, (state, action) => {
        const dataObj = action.payload;
        if (dataObj.status == "200") {
          state.status = "sucess";
          state.isLoading = false;
          state.authToken = dataObj.accessToken;
          state.userName = dataObj.userName;
          state.userData = dataObj;
          // state.employeeId = "";
          // state.password = "";
          AsyncStore.storeData(AsyncStore.Keys.USER_TOKEN, dataObj.accessToken);
          AsyncStore.storeData(AsyncStore.Keys.IS_LOGIN, "true");
          AsyncStore.storeData(
            AsyncStore.Keys.ACCESS_TOKEN,
            dataObj.accessToken
          );
          AsyncStore.storeData(
            AsyncStore.Keys.REFRESH_TOKEN,
            dataObj.refreshToken
          );
        } else if (dataObj.reason) {
          showAlertMessage("Failed", "Incorrect Password");
          state.isLoading = false;
        }
      })
      .addCase(postUserData.rejected, (state, action) => {
        state.status = "failed";
        state.isLoading = false;
        if (action.payload != undefined && action.payload["errorMessage"]) {
          showToastRedAlert(action.payload["errorMessage"]);
        }
      })
      .addCase(getPreEnquiryData.pending, (state) => {
        state.isLoading = true;
        state.offlineStatus = "pending";
      })
      .addCase(getPreEnquiryData.fulfilled, (state, action) => {
        const dmsEntityObj = action.payload?.dmsEntity;
        if (dmsEntityObj) {
          const data = dmsEntityObj.leadDtoPage.content;
          if (data.length > 0) {
            data.forEach((object) => {
              realm.write(() => {
                realm.create("PRE_ENQUIRY_TABLE", { ...object });
              });
            });
          }
        }
        state.isLoading = false;
        state.offlineStatus = "completed";
      })
      .addCase(getPreEnquiryData.rejected, (state) => {
        state.isLoading = false;
        state.offlineStatus = "completed";
      })
      .addCase(getEmpId.pending, (state) => {
        state.isLoading = true;
        state.empIdStatus = "pending";
      })
      .addCase(getEmpId.fulfilled, (state, action) => {
        const empEntityObj = action.payload?.dmsEntity;
        if (empEntityObj) {
          const data = empEntityObj.empId;

          // if (data.length > 0) {
          //   data.forEach((object) => {
          //     realm.write(() => {
          //       realm.create("PRE_ENQUIRY_TABLE", { ...object });
          //     });
          //   });
          // }
        }
        state.isLoading = false;
        state.empIdStatus = "completed";
      })
      .addCase(getEmpId.rejected, (state) => {
        state.isLoading = false;
        state.empIdStatus = "completed";
      })
      .addCase(getMenuList.pending, (state, action) => {
        state.menuListStatus = "pending";
        state.isLoading = true;
      })
      .addCase(getMenuList.fulfilled, (state, action) => {
        const dmsEntityObj = action.payload.dmsEntity;
        const empId = dmsEntityObj.loginEmployee.empId;

        const menuList = dmsEntityObj.menuList;

        if (menuList.length > 0) {
          let newMenuList = [];
          menuList.forEach((item) => {
            newMenuList.push({
              screen: item.menuId,
              title: item.displayName,
            });
          });
          state.menuList = newMenuList;
        }

        AsyncStore.storeData(AsyncStore.Keys.EMP_ID, empId.toString());
        AsyncStore.storeData(
          AsyncStore.Keys.LOGIN_EMPLOYEE,
          JSON.stringify(dmsEntityObj.loginEmployee)
        );

        state.login_employee_details = dmsEntityObj.loginEmployee;
        state.branchesList = dmsEntityObj.loginEmployee.branchs;
        state.empId = empId;
        state.menuListStatus = "completed";
        state.isLoading = false;
      })
      .addCase(getMenuList.rejected, (state, action) => {
        state.menuListStatus = "failed";
        state.isLoading = false;
      })
      .addCase(getCustomerTypeList.fulfilled, (state, action) => {
        const data = action.payload;
        data.forEach((item) => {
          realm.write(() => {
            realm.create("CUSTOMER_TYPE_TABLE", {
              id: item.id,
              name: item.customerType,
            });
          });
        });
      })
      .addCase(getCarModalList.fulfilled, (state, action) => {
        const data = action.payload;
        data.forEach((item) => {
          realm.write(() => {
            realm.create("CAR_MODAL_LIST_TABLE", {
              id: item.vehicleId,
              name: item.model,
            });
          });
        });
      });
  },
});

export const {
  clearState,
  updateEmployeeId,
  updatePassword,
  updateSecurePassword,
  showErrorMessage,
  clearUserNameAndPass,
  updateToken,
} = loginSlice.actions;

export default loginSlice.reducer;

// export const postUserData = createAsyncThunk('LOGIN_SLICE/postUserData', async () => {
//     const response = await client.get(ENDPOINT(KEYS.login))
//     return response.hostelList
// })

// realm.create('PRE_ENQUIRY_TABLE', {
//     universalId: object['universalId'],
//     leadId: object['leadId'],
//     firstName: object['firstName'],
//     lastName: object['lastName'],
//     createdDate: object['createdDate'],
//     dateOfBirth: object['dateOfBirth'],
//     enquirySource: object['enquirySource'],
//     enquiryDate: object['enquiryDate'],
//     model: object['model'],
//     enquirySegment: object['enquirySegment'],
//     phone: object['phone'],
//     leadStage: object['leadStage'],
//     customerType: object['customerType'],
//     alternativeNumber: object['alternativeNumber'],
//     enquiryCategory: object['enquiryCategory'],
//     createdBy: object['createdBy'],
//     salesConsultant: object['salesConsultant'],
//     email: object['email'],
//     leadStatus: object['leadStatus'],
// });
