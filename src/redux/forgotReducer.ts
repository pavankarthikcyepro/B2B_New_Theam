import React from "react";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";
import * as AsyncStore from "../asyncStore";
import realm from "../database/realm";
import { showToastRedAlert } from "../utils/toast";

interface LoginState {
  employeeId: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
  securePassword: boolean;
  secureNewPassword: boolean;
  secureConfirmPassword: boolean;
  showLoginErr: boolean;
  showPasswordErr: boolean;
  showConfirmPasswordErr:boolean;
  showNewPasswordErr:boolean;
  loginErrMessage: string;
  passwordErrMessage: string;
  newPasswordErrMessage: string;
  confirmPasswordErrMessage: string;
  isLoading: boolean;
  status: string;
  authToken: string;
  userName: string;
  showLoader: boolean;
  offlineStatus: string;
  menuListStatus: string;
  userData: object;
  empId: string;
  menuList: any;
  login_employee_details: any;
  branchesList: any;
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
  newPassword:"",
  confirmPassword:"",
  securePassword: true,
  secureNewPassword:true,
  secureConfirmPassword:true,
  showLoginErr: false,
  showPasswordErr: false,
  showConfirmPasswordErr:false,
  showNewPasswordErr:false,
  loginErrMessage: "",
  passwordErrMessage: "",
    newPasswordErrMessage: "",
  confirmPasswordErrMessage:"",
  isLoading: false,
  status: "",
  authToken: "",
  userName: "",
  showLoader: false,
  offlineStatus: "",
  userData: {},
  empId: "",
  menuListStatus: "",
  menuList: [],
  login_employee_details: {},
  branchesList: [],
};


export const forgotslice = createSlice({
  name: "FORGOT_SLICE",
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
      state.branchesList = [];
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
      if (password.length < 4) {
        state.showPasswordErr = true;
        state.passwordErrMessage = "Password max length is 6 chars";
      } else {
        state.showPasswordErr = false;
        state.passwordErrMessage = "";
      }
      state.password = password;
    },
    updateNewPassword: (state, action: PayloadAction<string>) => {
      let newPassword = action.payload;
      if (newPassword.length < 4) {
        state.showNewPasswordErr = true;
        state.newPasswordErrMessage = "Password max length is 6 chars";
      } else {
        state.showNewPasswordErr = false;
        state.newPasswordErrMessage = "";
      }
      state.newPassword = newPassword;
    },
    updateConfirmPassword: (state, action: PayloadAction<string>) => {
      let confirmPassword = action.payload;
      if (confirmPassword.length < 4) {
        state.showConfirmPasswordErr = true;
        state.confirmPasswordErrMessage = "Password max length is 6 chars";
      } else {
        state.showConfirmPasswordErr = false;
        state.confirmPasswordErrMessage = "";
      }
      state.confirmPassword = confirmPassword;
    },
    updateSecurePassword: (state) => {
      state.securePassword = !state.securePassword;
     
    },
    updateSecureNewPassword: (state) => {
      state.secureNewPassword = !state.secureNewPassword;
    },
    updateSecureConfirmPassword: (state) => {
     
      state.secureConfirmPassword = !state.secureConfirmPassword;
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
  },
});

export const {
  clearState,
  updateEmployeeId,
  updatePassword,
  updateNewPassword,
  updateConfirmPassword,
  updateSecurePassword,
  updateSecureNewPassword,
  updateSecureConfirmPassword,

  showErrorMessage,
} = forgotslice.actions;

export default forgotslice.reducer;

