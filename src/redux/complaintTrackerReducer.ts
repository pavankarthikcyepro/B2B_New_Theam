import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import moment from "moment";
import { client } from '../networking/client';
import URL from "../networking/endpoints";
import { convertTimeStampToDateString } from "../utils/helperFunctions";
import { showToast } from "../utils/toast";


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

export const getEmpComplaintDashboard = createAsyncThunk("COMPLAINTS_TRACKER/getEmpComplaintDashboard", async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.GET_DET_COMPLAINT_EMP_DASHBOARD(payload["empId"]),);
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

    // const response = await client.get(URL.TARGET_DROPDOWN(
    //     payload["orgId"],
    //     payload["parent"],
    //     payload["child"],
    //     payload["parentId"]
    // ));
    const response = await client.get(URL.DEALER_CODE_BRANCH_LIST(payload["orgId"], payload["parentId"]));
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})
export const getBranchDataForRegister = createAsyncThunk("COMPLAINTS_TRACKER/getBranchDataForRegister", async (payload, { rejectWithValue }) => {

    // const response = await client.get(URL.TARGET_DROPDOWN(
    //     payload["orgId"],
    //     payload["parent"],
    //     payload["child"],
    //     payload["parentId"]
    // ));
    // const response = await client.get(URL.DEALER_CODE_LIST1(payload["orgId"]));
    const response = await client.get(URL.DEALER_CODE_BRANCH_LIST(payload["orgId"], payload["parentId"]));
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


export const postComplaintFirstTime = createAsyncThunk("COMPLAINTS_TRACKER/postComplaintFirstTime", async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.POST_COMPLAINT(), payload);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})


export const postComplaintClose = createAsyncThunk("COMPLAINTS_TRACKER/postComplaintClose", async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.POST_COMPLAINT_CLOSE(), payload);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getComplaintListFilter = createAsyncThunk("COMPLAINTS_TRACKER/getComplaintListFilter", async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.GET_COMPLAINT_LIST(), payload);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})
export const getComplaintListFilterClosed = createAsyncThunk("COMPLAINTS_TRACKER/getComplaintListFilterClosed", async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.GET_COMPLAINT_LIST(), payload);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getComplaitDetailsfromId = createAsyncThunk("COMPLAINTS_TRACKER/getComplaitDetailsfromId", async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.GEY_COMPLAINT_DET_FROMID(
        payload["complaintId"],
    ));
    const json = await response.json();
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
});


export const getComplaintMenuFilter = createAsyncThunk("COMPLAINTS_TRACKER/getComplaintMenuFilter", async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.GET_COMPLAINT_DROPDOWN_MAIN());
    const json = await response.json();
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
});


// need to complete API integration
export const getComplaintEmployees = createAsyncThunk("COMPLAINTS_TRACKER/getComplaintEmployees", async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.GET_COMPLAINT_CONSULTANT(payload["orgId"], payload["branchId"]));
    const json = await response.json();
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
});
export const getComplaintManager = createAsyncThunk("COMPLAINTS_TRACKER/getComplaintManager", async (empid, { rejectWithValue }) => {

    const response = await client.get(URL.GET_COMPLAINT_MANAGER(empid));
    const json = await response.json();
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
});


export const postDropComplaintSubMenu = createAsyncThunk("COMPLAINTS_TRACKER/postDropComplaintSubMenu", async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.POST_GETSUBMENU_COMPLAINT(), payload);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

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
        complaintDescription:"",
        postComplaintFirstTimeRes:"",
        complaintListRes:"",
        activeTotalCount:0,
        closeTotalCount:0,
        closeComplainListres:"",
        complaintDetailsFromIdRes:"",
        complaintdoc:"",
        complainCloserDoc:"",
        postComplaintCloseRes :"",
        complaintMainFilterData : "",
        complaintSubFilterData: "",
        complaintRegisterBranchDropDown:[],
        complaintEmployees:[],
        complaintManagers: [],
        complaintTrackerDashboardData:[]
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
                state.complaintRegisterBranchDropDown = [],
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
            state.postComplaintFirstTimeRes = "";
            state.complaintListRes = "";
            state.activeTotalCount=0;
            state.closeTotalCount= 0;
            state.closeComplainListres = "",
                state.complaintDetailsFromIdRes="",
                state.complaintdoc = "",
                state.complainCloserDoc = "",
                state.postComplaintCloseRes="",
                state.complaintMainFilterData = "",
                state.complaintSubFilterData = "",
                state.complaintEmployees = [],
                state.complaintManagers = [],
                state.complaintTrackerDashboardData = []
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
                state.complaintRegisterBranchDropDown = [],
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
            state.complaintDetailsFromIdRes = "",
                state.complaintdoc = ""
            state.complainCloserDoc = "",
             state.postComplaintFirstTimeRes = "",
                state.postComplaintCloseRes=""
        },
        clearStateFormDataBtnClick: (state, action) => {
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
            // state.complaintFactorTypeDropdown = [];
            state.complaintFactorType = "";
            // state.complainLocationDropDown = [],
                state.complainLocation = "",
                state.complainBranchDropDown = [],
                state.complaintRegisterBranchDropDown = [],
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
            state.complaintDetailsFromIdRes = "",
                state.complaintdoc = ""
            state.complainCloserDoc = "",
                state.postComplaintFirstTimeRes = "",
                state.postComplaintCloseRes = ""
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
                case "REG_LOCATION" :
                    state.location = value
                    break;
                case "REG_BRANCH":
                    state.branch = value
                    break;
                case "REG_MODEL":
                    state.model = value;
                    break;
                case "REG_STAGE":
                    state.stage = value;
                    break;
                case "REG_CONSULTANT":
                    state.consultant = value;
                    break;
                case "REG_MANAGER":
                    state.reporting_manager = value;
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
                state.location = dmsLeDDTO.locationName.toString()
                state.branch = dmsLeDDTO.branchName.toString()
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
            showToast("No records found for the submitted number.")
            
            
        })


        // Get data from phone number
        builder.addCase(getEmpComplaintDashboard.pending, (state, action) => {
            state.isLoading = true;
            state.complaintTrackerDashboardData = [];
        })
        builder.addCase(getEmpComplaintDashboard.fulfilled, (state, action) => {
            state.isLoading = false;

            if (action.payload) {
                state.complaintTrackerDashboardData = action.payload;
            }
        })
        builder.addCase(getEmpComplaintDashboard.rejected, (state, action) => {
            state.isLoading = false;
            state.complaintTrackerDashboardData = [];


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

        

        builder.addCase(getBranchDataForRegister.pending, (state, action) => {
            state.isLoading = true;
            state.complaintRegisterBranchDropDown = [];
        })
        builder.addCase(getBranchDataForRegister.fulfilled, (state, action) => {
            state.isLoading = false;

            if (action.payload) {
                state.complaintRegisterBranchDropDown = action.payload;
            }
        })
        builder.addCase(getBranchDataForRegister.rejected, (state, action) => {
            state.isLoading = false;
            state.complaintRegisterBranchDropDown = [];
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
        
        builder.addCase(postComplaintFirstTime.pending, (state, action) => {
            state.isLoading = true;
            state.postComplaintFirstTimeRes = "";
        })
        builder.addCase(postComplaintFirstTime.fulfilled, (state, action) => {
            state.isLoading = false;

            if (action.payload) {
                showToast("Successfully updated");
                state.postComplaintFirstTimeRes = action.payload;
            }
        })
        builder.addCase(postComplaintFirstTime.rejected, (state, action) => {
            state.isLoading = false;
            state.postComplaintFirstTimeRes = "";
        })


        builder.addCase(postComplaintClose.pending, (state, action) => {
            state.isLoading = true;
            state.postComplaintCloseRes = "";
        })
        builder.addCase(postComplaintClose.fulfilled, (state, action) => {
            state.isLoading = false;

            if (action.payload) {
                showToast("Successfully updated");
                state.postComplaintCloseRes = action.payload;
            }
        })
        builder.addCase(postComplaintClose.rejected, (state, action) => {
            state.isLoading = false;
            state.postComplaintCloseRes = "";
        })
        

        builder.addCase(getComplaintListFilter.pending, (state, action) => {
            state.isLoading = true;
            state.complaintListRes = "";
        })
        builder.addCase(getComplaintListFilter.fulfilled, (state, action) => {
            state.isLoading = false;

            if (action.payload) {
                state.complaintListRes = action.payload;
                state.activeTotalCount = action.payload.length;
            }
        })
        builder.addCase(getComplaintListFilter.rejected, (state, action) => {
            state.isLoading = false;
            state.complaintListRes = "";
        })


        builder.addCase(getComplaintListFilterClosed.pending, (state, action) => {
            state.isLoading = true;
            state.closeComplainListres = "";
        })
        builder.addCase(getComplaintListFilterClosed.fulfilled, (state, action) => {
            state.isLoading = false;

            if (action.payload) {
                state.closeComplainListres = action.payload;
                state.closeTotalCount = action.payload.length;
            }
        })
        builder.addCase(getComplaintListFilterClosed.rejected, (state, action) => {
            state.isLoading = false;
            state.closeComplainListres = "";
        })


        builder.addCase(getComplaitDetailsfromId.pending, (state, action) => {
            state.isLoading = true;
            state.complaintDetailsFromIdRes = "";
        })
        builder.addCase(getComplaitDetailsfromId.fulfilled, (state, action) => {
            state.isLoading = false;

            if (action.payload) {
                
                state.complaintDetailsFromIdRes = action.payload;
                state.getDetailsFromPhoneRespnse = action.payload;

                let response = action.payload;
                state.location = response.customeLocation?.toString();
                state.branch = response.branch?.toString()
                state.model = response.model?.toString()
                state.customerName = response.customerName?.toString(); 
                state.email = response.email?.toString();
                state.stage = response.currentStage?.toString();
                state.stage_id = response.currentStageIdNo?.toString();
                state.consultant = response.salesExecutiveName?.toString();
                state.reporting_manager = response.manager?.toString();
                state.mobile = response.mobileNo?.toString();
                state.complaintFactorType = response.complaintFactor?.toString();
                state.complainLocation = response.complaintLocation?.toString();
                state.complainBranch = response.compliantBranch?.toString();
                state.complainDepartment = response.department?.toString();
                state.complainDesignation = response.designation?.toString();
                state.complainEmployee = response.employee?.toString();
                state.complaintdoc = response.complaintDocument?.toString(); 
                state.complainCloserDoc = response.complaintCloserDocument?.toString();
                state.complaintDescription = response.complaintDecription?.toString();
                state.closeComplaintSource = response.closingSource?.toString();
                state.closeComplaintFinalRate = response.rating?.toString();
                state.closeComplaintRemarks = response.remarks?.toString();
            }
        })
        builder.addCase(getComplaitDetailsfromId.rejected, (state, action) => {
            state.isLoading = false;
            state.complaintDetailsFromIdRes = "";
        })


        builder.addCase(getComplaintMenuFilter.pending, (state, action) => {
            state.isLoading = true;
            state.complaintMainFilterData = "";
        })
        builder.addCase(getComplaintMenuFilter.fulfilled, (state, action) => {
            state.isLoading = false;

            if (action.payload) {
                state.complaintMainFilterData = action.payload;
                
            }
        })
        builder.addCase(getComplaintMenuFilter.rejected, (state, action) => {
            state.isLoading = false;
            state.complaintMainFilterData = "";
        })


        builder.addCase(postDropComplaintSubMenu.pending, (state, action) => {
            state.isLoading = true;
            state.complaintSubFilterData = "";
        })
        builder.addCase(postDropComplaintSubMenu.fulfilled, (state, action) => {
            state.isLoading = false;

            if (action.payload) {
                state.complaintSubFilterData = action.payload;

            }
        })
        builder.addCase(postDropComplaintSubMenu.rejected, (state, action) => {
            state.isLoading = false;
            state.complaintSubFilterData = "";
        })

        builder.addCase(getComplaintEmployees.pending, (state, action) => {
            state.isLoading = true;
            state.complaintEmployees = [];
        })
        builder.addCase(getComplaintEmployees.fulfilled, (state, action) => {
            state.isLoading = false;

            if (action.payload) {
                state.complaintEmployees = action.payload;

            }
        })
        builder.addCase(getComplaintEmployees.rejected, (state, action) => {
            state.isLoading = false;
            state.complaintEmployees = [];
        })


        builder.addCase(getComplaintManager.pending, (state, action) => {
            state.isLoading = true;
            state.complaintManagers = []
        })
        builder.addCase(getComplaintManager.fulfilled, (state, action) => {
            state.isLoading = false;

            if (action.payload) {
                state.complaintManagers = action.payload;

            }
        })
        builder.addCase(getComplaintManager.rejected, (state, action) => {
            state.isLoading = false;
            state.complaintManagers = []
        })
    }
});

export const { clearState, setCustomerDetails, setDatePicker,
    setDropDownData, clearStateFormDataBtnClick,
     setImagePicker, updateSelectedDate,clearStateFormData } = complaintsSlice.actions;
export default complaintsSlice.reducer;
