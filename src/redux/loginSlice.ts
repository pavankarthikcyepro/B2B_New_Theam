import React from "react";
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../networking/client';
import URL from '../networking/endpoints';
import * as AsyncStore from '../asyncStore';
import realm from '../database/realm';

interface LoginState {
    employeeId: string,
    password: string,
    securePassword: boolean,
    showLoginErr: boolean,
    showPasswordErr: boolean,
    loginErrMessage: string,
    passwordErrMessage: string,
    isLoading: boolean,
    status: string,
    authToken: string,
    userName: string,
    showLoader: boolean,
    offlineStatus: string,
    menuListStatus: string,
    userData: object,
    empId: string
}

interface ErrorMessage {
    key: string,
    message: string
}

const initialState: LoginState = {
    employeeId: "EG_S5237",
    password: "Bharat@123",
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
    menuListStatus: ""
}

export const postUserData = createAsyncThunk('LOGIN_SLICE/postUserData', async (inputData) => {

    const response = await client.post(URL.LOGIN(), inputData)
    return response
})

export const getMenuList = createAsyncThunk("LOGIN_SLICE/getMenuList", async (name) => {

    const response = client.get(URL.MENULIST_API(name))
    return response;
})

export const getPreEnquiryData = createAsyncThunk('LOGIN_SLICE/getPreEnquiryData', async (endUrl) => {

    let url = URL.LEADS_LIST_API() + endUrl;
    const response = await client.get(url);
    return response
})

export const getCustomerTypeList = createAsyncThunk("LOGIN_SLICE/getCustomerTypeList", async () => {

    const response = client.get(URL.CUSTOMER_TYPE())
    return response;
})

export const getCarModalList = createAsyncThunk("LOGIN_SLICE/getCarModalList", async (orgId) => {

    const response = client.get(URL.VEHICLE_MODELS(orgId))
    return response;
})

export const loginSlice = createSlice({
    name: 'LOGIN_SLICE',
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
        showLoader: (state, action) => {
            state.showLoader = !state.showLoader;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(postUserData.pending, (state) => {
                state.status = 'loading';
                state.isLoading = true;
            })
            .addCase(postUserData.fulfilled, (state, action) => {
                // console.log('res2: ', action.payload);
                const dataObj = action.payload;
                state.status = 'sucess';
                state.isLoading = false;
                state.authToken = dataObj.idToken;
                state.userName = dataObj.userName;
                state.userData = dataObj;
            })
            .addCase(postUserData.rejected, (state, action) => {
                console.log('res3: ', action.payload);
                state.status = 'failed';
                state.isLoading = false;
            })
            .addCase(getPreEnquiryData.pending, (state) => {
                state.isLoading = true;
                state.offlineStatus = "pending"
            })
            .addCase(getPreEnquiryData.fulfilled, (state, action) => {
                console.log('res: ', action.payload);
                const dmsEntityObj = action.payload?.dmsEntity;
                if (dmsEntityObj) {
                    const data = dmsEntityObj.leadDtoPage.content;
                    if (data.length > 0) {
                        data.forEach(object => {
                            realm.write(() => {
                                realm.create('PRE_ENQUIRY_TABLE', { ...object })
                            });
                        })
                    }
                }
                state.isLoading = false;
                state.offlineStatus = "completed";
            })
            .addCase(getPreEnquiryData.rejected, (state) => {
                state.isLoading = false;
                state.offlineStatus = "completed"
            })
            .addCase(getMenuList.fulfilled, (state, action) => {
                console.log('menu_list: ', action.payload);
                const dmsEntityObj = action.payload.dmsEntity;
                const empId = dmsEntityObj.loginEmployee.empId;
                AsyncStore.storeData(AsyncStore.Keys.EMP_ID, empId.toString());
                state.empId = empId;
                state.menuListStatus = "completed";
            })
            .addCase(getCustomerTypeList.fulfilled, (state, action) => {
                console.log('customer_type_list: ', action.payload);
                const data = action.payload;
                data.forEach(item => {
                    realm.write(() => {
                        realm.create('CUSTOMER_TYPE_TABLE', { id: item.id, name: item.customerType })
                    });
                });
            })
            .addCase(getCarModalList.fulfilled, (state, action) => {
                console.log('vehicle_modal_list: ', action.payload);
                const data = action.payload;
                data.forEach(item => {
                    realm.write(() => {
                        realm.create('CAR_MODAL_LIST_TABLE', { id: item.vehicleId, name: item.model })
                    });
                });
            })
    }
})


export const { clearState, updateEmployeeId, updatePassword, updateSecurePassword, showErrorMessage, showLoader } = loginSlice.actions;

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