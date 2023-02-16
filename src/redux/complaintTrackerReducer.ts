import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import moment from "moment";
import { client } from '../networking/client';
import URL from "../networking/endpoints";
import { convertTimeStampToDateString } from "../utils/helperFunctions";


export const getComplaintsListApi = createAsyncThunk("COMPLAINTS_TRACKER/getComplaintsListApi", async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.GET_COMPLAINTS(), payload);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getMoreComplaintsListApi = createAsyncThunk("COMPLAINTS_TRACKER/getMoreComplaintsListApi", async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.GET_COMPLAINTS(), payload);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getDetailsFromPoneNumber = createAsyncThunk("COMPLAINTS_TRACKER/getDetailsFromPoneNumber", async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.GET_DET_FROM_PHONE(payload["phoneNum"], payload["orgid"]),);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getComplainFactorDropDownData = createAsyncThunk("COMPLAINTS_TRACKER/getComplainFactorDropDownData", async (orgid, { rejectWithValue }) => {

    const response = await client.get(URL.GET_COMPLAIN_FACTOR_DATA(orgid),);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})
export const getLocationList = createAsyncThunk("COMPLAINTS_TRACKER/getLocationList", async (orgid, { rejectWithValue }) => {

    const response = await client.get(URL.LOCATION_LIST(orgid),);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getBranchData = createAsyncThunk("COMPLAINTS_TRACKER/getBranchData", async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.TARGET_DROPDOWN(
        payload["orgId"],
        payload["parent"],
        payload["child"],
        payload["parentId"]
    ));
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})
export const getDepartment = createAsyncThunk("COMPLAINTS_TRACKER/getDepartment", async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.TARGET_DROPDOWN(
        payload["orgId"],
        payload["parent"],
        payload["child"],
        payload["parentId"]
    ));
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})


export const getDesignation = createAsyncThunk("COMPLAINTS_TRACKER/getDesignation", async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.TARGET_DROPDOWN(
        payload["orgId"],
        payload["parent"],
        payload["child"],
        payload["parentId"]
    ));
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})


export const getEmployeeDetails = createAsyncThunk("COMPLAINTS_TRACKER/getEmployeeDetails", async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.GET_EMPLOYEE_DETAILS(
        payload["orgId"],
        payload["branchId"],
        payload["deptId"],
        payload["desigId"]));
    const json = await response.json();
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
});


export const getCountsComplaintsDashboard = createAsyncThunk("COMPLAINTS_TRACKER/getCountsComplaintsDashboard", async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.GET_DASHBOARD_COUNT_COMPLAINT(
        payload["empId"],
    ));
    const json = await response.json();
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
});

interface CustomerDetailModel {
    key: string;
    text: string;
}
interface DropDownModel {
    key: string;
    value: string;
    id: string;
    orgId: string;
}

export const complaintsSlice = createSlice({
    name: "COMPLAINTS_TRACKER",
    initialState: {
        page_number: 0,
        total_objects_count: 0,
        complaints_list: [],
        isLoading: false,
        isExtraLoading: false,
        mobile: "",
        date_of_birth: "",
        showDatepicker: false,
        datePickerKeyId: "",
        minDate: null,
        maxDate: null,
        location: "",
        branch: "",
        model: "",
        customerName: "",
        email: "",
        stage: "",
        stage_id: "",
        consultant: "",
        reporting_manager: "",
        showImagePicker: false,
        imagePickerKeyId: "",
        getDetailsFromPhoneRespnse: "",
        complaintFactorTypeDropdown: [],
        complaintFactorType: "",
        complainLocationDropDown: [],
        complainLocation: "",
        complainBranchDropDown: [],
        complainBranch: "",
        complainDepartmentDropDown: [],
        complainDepartment: "",
        complainDesignationDropDown: [],
        complainDesignation: "",
        complainEmployeeDropDown: [],
        complainEmployee: "",
        closeComplaintSource: "",
        closeComplaintFinalRate: "",
        closeComplaintRemarks: "",
        complaintCountDashboard:"",
        complaintDescription:""
    },
    reducers: {
        clearState: (state, action) => {
            state.mobile = "";
            state.date_of_birth = "";
            state.datePickerKeyId = "";
            state.showDatepicker = false;
            state.minDate = null;
            state.maxDate = null;
            state.location = "";
            state.branch = "";
            state.model = "";
            state.customerName = "";
            state.email = "";
            state.stage = "";
            state.stage_id = "";
            state.consultant = "";
            state.reporting_manager = "";
            state.showImagePicker = false
            state.imagePickerKeyId = "";
            state.getDetailsFromPhoneRespnse = "";
            state.complaintFactorTypeDropdown = [];
            state.complaintFactorType = "";
            state.complainLocationDropDown = [],
                state.complainLocation = "",
                state.complainBranchDropDown = [],
                state.complainBranch = "",
                state.complainDepartmentDropDown = [],
                state.complainDepartment = "",
                state.complainDesignationDropDown = [],
                state.complainDesignation = "",
                state.complainEmployeeDropDown = [],
                state.complainEmployee = "";
            state.closeComplaintSource = "",
                state.closeComplaintFinalRate = "",
                state.closeComplaintRemarks = "";
            state.complaintCountDashboard ="";
            state.complaintDescription = "";
        },
        clearStateFormData: (state, action) => {
            state.mobile = "";
            state.date_of_birth = "";
            state.datePickerKeyId = "";
            state.showDatepicker = false;
            state.minDate = null;
            state.maxDate = null;
            state.location = "";
            state.branch = "";
            state.model = "";
            state.customerName = "";
            state.email = "";
            state.stage = "";
            state.stage_id = "";
            state.consultant = "";
            state.reporting_manager = "";
            state.showImagePicker = false
            state.imagePickerKeyId = "";
            state.getDetailsFromPhoneRespnse = "";
            state.complaintFactorTypeDropdown = [];
            state.complaintFactorType = "";
            state.complainLocationDropDown = [],
                state.complainLocation = "",
                state.complainBranchDropDown = [],
                state.complainBranch = "",
                state.complainDepartmentDropDown = [],
                state.complainDepartment = "",
                state.complainDesignationDropDown = [],
                state.complainDesignation = "",
                state.complainEmployeeDropDown = [],
                state.complainEmployee = "";
            state.closeComplaintSource = "",
                state.closeComplaintFinalRate = "",
                state.closeComplaintRemarks = "";
            state.complaintCountDashboard = "";
            state.complaintDescription = "";
        },
        setImagePicker: (state, action) => {
            state.imagePickerKeyId = action.payload;
            state.showImagePicker = !state.showImagePicker;
        },
        setCustomerDetails: (state, action: PayloadAction<CustomerDetailModel>) => {
            const { key, text } = action.payload;

            const selectedDate = convertTimeStampToDateString(text, "DD/MM/YYYY");
            switch (key) {
                case "DATE_OF_BIRTH":
                    state.date_of_birth = selectedDate;
                    break;
                case "MOBILE":
                    state.mobile = text;
                    break;
                case "LOCATION":
                    state.location = text;
                    break;
                case "BRANCH":
                    state.branch = text;
                    break;
                case "MODEL":
                    state.model = text;
                    break;
                case "COUSTOMER_NAME":
                    state.customerName = text;
                    break;
                case "EMAIL":
                    state.email = text;
                    break;
                case "STAGE":
                    state.stage = text;
                    break;
                case "STAGE_ID":
                    state.stage_id = text;
                    break;
                case "CONSULTANT":
                    state.consultant = text;
                    break;
                case "REPORTING_MANAGER":
                    state.reporting_manager = text;
                    break;
                case "CLOSE_SOURCE":
                    state.closeComplaintSource = text;
                    break;
                case "CLOSE_FINALRATING":
                    state.closeComplaintFinalRate = text;
                    break;
                case "COMPLAINT_CLOSE_REMARKS":
                    state.closeComplaintRemarks = text;
                    break;
                case "COMPLAINT_DESCRIPTION":
                    state.complaintDescription = text;
                    break;

            }
        },
        updateSelectedDate: (state, action: PayloadAction<CustomerDetailModel>) => {
            const { key, text } = action.payload;
            const selectedDate = convertTimeStampToDateString(text, "DD/MM/YYYY");
            switch (key) {
                case "DATE_OF_BIRTH":
                    state.date_of_birth = selectedDate;
                    break;
                case "NONE":
                    break;
            }
            state.showDatepicker = !state.showDatepicker;
        },
        setDatePicker: (state, action) => {
            switch (action.payload) {
                case "DATE_OF_BIRTH":
                    // state.minDate = null;
                    // state.maxDate = new Date();
                    break;

            }
            state.datePickerKeyId = action.payload;
            state.showDatepicker = !state.showDatepicker;
        },
        setDropDownData: (state, action: PayloadAction<DropDownModel>) => {
            const { key, value, id, orgId } = action.payload;


            switch (key) {

                case "COMPLAIN_FACTOR_TYPE":
                    state.complaintFactorType = value;
                    break;
                case "COMPLAINT_LOCATION":
                    state.complainLocation = value;
                    break;
                case "COMPLAINT_BRANCH":
                    state.complainBranch = value;
                    break;
                case "COMPLAINT_DEPARTMENT":
                    state.complainDepartment = value;
                    break;
                case "COMPLAINT_DESIGNATION":
                    state.complainDesignation = value;
                    break;
                case "COMPLAINT_EMPLOYEE":
                    state.complainEmployee = value;
                    break;

            }
        },
    },

    extraReducers: (builder) => {
        // Get Complaints List
        builder.addCase(getComplaintsListApi.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(getComplaintsListApi.fulfilled, (state, action) => {
            if (action.payload) {
                const dataObj = action.payload;
                state.total_objects_count = dataObj.totalCnt ? dataObj.totalCnt : 0;
                state.page_number = dataObj.pageNo ? dataObj.pageNo : 0;
                state.complaints_list = dataObj.data ? dataObj.data : [];
            }
            state.isLoading = false;
        })
        builder.addCase(getComplaintsListApi.rejected, (state, action) => {
            state.isLoading = false;
        })
        // Get More Complaints List
        builder.addCase(getMoreComplaintsListApi.pending, (state, action) => {
            state.isExtraLoading = true;
        })
        builder.addCase(getMoreComplaintsListApi.fulfilled, (state, action) => {
            state.isExtraLoading = false;
            if (action.payload) {
                const dataObj = action.payload;
                state.page_number = dataObj.pageNo ? dataObj.pageNo : 0;
                const list = dataObj.data ? dataObj.data : [];
                state.complaints_list = [...state.complaints_list, ...list];
            }
        })
        builder.addCase(getMoreComplaintsListApi.rejected, (state, action) => {
            state.isExtraLoading = false;
        })


        // Get data from phone number
        builder.addCase(getDetailsFromPoneNumber.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(getDetailsFromPoneNumber.fulfilled, (state, action) => {
            state.isLoading = false;

            if (action.payload) {
                let dmsLeDDTO = action.payload.dmsEntity.dmsLeadDto;
                state.getDetailsFromPhoneRespnse = action.payload;
                state.location = dmsLeDDTO.referencenumber.split(" ")[0].toString()
                state.branch = dmsLeDDTO.referencenumber.toString()
                state.model = dmsLeDDTO.model.toString()
                state.customerName = dmsLeDDTO.firstName.toString() + " " + dmsLeDDTO.lastName.toString()
                state.email = dmsLeDDTO.email.toString();
                state.stage = dmsLeDDTO.leadStage.toString();
                state.stage_id = dmsLeDDTO.referencenumber.toString();
                state.consultant = dmsLeDDTO.salesConsultant.toString();
                state.reporting_manager = action.payload.dmsEntity.reportingManager.toString();
            }
        })
        builder.addCase(getDetailsFromPoneNumber.rejected, (state, action) => {
            state.isLoading = false;
        })



        builder.addCase(getComplainFactorDropDownData.pending, (state, action) => {
            state.isLoading = true;
            state.complaintFactorTypeDropdown = [];
        })
        builder.addCase(getComplainFactorDropDownData.fulfilled, (state, action) => {
            state.isLoading = false;

            if (action.payload) {
                state.complaintFactorTypeDropdown = action.payload;
            }
        })
        builder.addCase(getComplainFactorDropDownData.rejected, (state, action) => {
            state.isLoading = false;
            state.complaintFactorTypeDropdown = [];
        })



        builder.addCase(getLocationList.pending, (state, action) => {
            state.isLoading = true;
            state.complainLocationDropDown = [];
        })
        builder.addCase(getLocationList.fulfilled, (state, action) => {
            state.isLoading = false;

            if (action.payload) {
                state.complainLocationDropDown = action.payload;
            }
        })
        builder.addCase(getLocationList.rejected, (state, action) => {
            state.isLoading = false;
            state.complainLocationDropDown = [];
        })



        builder.addCase(getBranchData.pending, (state, action) => {
            state.isLoading = true;
            state.complainBranchDropDown = [];
        })
        builder.addCase(getBranchData.fulfilled, (state, action) => {
            state.isLoading = false;

            if (action.payload) {
                state.complainBranchDropDown = action.payload;
            }
        })
        builder.addCase(getBranchData.rejected, (state, action) => {
            state.isLoading = false;
            state.complainBranchDropDown = [];
        })


        builder.addCase(getDepartment.pending, (state, action) => {
            state.isLoading = true;
            state.complainDepartmentDropDown = [];
        })
        builder.addCase(getDepartment.fulfilled, (state, action) => {
            state.isLoading = false;

            if (action.payload) {
                state.complainDepartmentDropDown = action.payload;
            }
        })
        builder.addCase(getDepartment.rejected, (state, action) => {
            state.isLoading = false;
            state.complainDepartmentDropDown = [];
        })


        builder.addCase(getDesignation.pending, (state, action) => {
            state.isLoading = true;
            state.complainDesignationDropDown = [];
        })
        builder.addCase(getDesignation.fulfilled, (state, action) => {
            state.isLoading = false;

            if (action.payload) {
                state.complainDesignationDropDown = action.payload;
            }
        })
        builder.addCase(getDesignation.rejected, (state, action) => {
            state.isLoading = false;
            state.complainDesignationDropDown = [];
        })

        builder.addCase(getEmployeeDetails.pending, (state, action) => {
            state.isLoading = true;
            state.complainEmployeeDropDown = [];
        })
        builder.addCase(getEmployeeDetails.fulfilled, (state, action) => {
            state.isLoading = false;

            if (action.payload) {
                state.complainEmployeeDropDown = action.payload.dmsEntity.employees;
            }
        })
        builder.addCase(getEmployeeDetails.rejected, (state, action) => {
            state.isLoading = false;
            state.complainEmployeeDropDown = [];
        })


        builder.addCase(getCountsComplaintsDashboard.pending, (state, action) => {
            state.isLoading = true;
            state.complaintCountDashboard = "";
        })
        builder.addCase(getCountsComplaintsDashboard.fulfilled, (state, action) => {
            state.isLoading = false;

            if (action.payload) {
                state.complaintCountDashboard = action.payload;
            }
        })
        builder.addCase(getCountsComplaintsDashboard.rejected, (state, action) => {
            state.isLoading = false;
            state.complaintCountDashboard = "";
        })

    }
});

export const { clearState, setCustomerDetails, setDatePicker, setDropDownData, setImagePicker, updateSelectedDate } = complaintsSlice.actions;
export default complaintsSlice.reducer;
