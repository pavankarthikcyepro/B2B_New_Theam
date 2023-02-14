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
        location:"",
        branch:"",
        model:"",
        customerName:"",
        email:"",
        stage:"",
        stage_id:"",
        consultant:"",
        reporting_manager:""
    },
    reducers: {
        clearState: (state, action) => {
            state.mobile = "";
            state.date_of_birth = "";
            state.datePickerKeyId = "";
            state.showDatepicker = false;
            state.minDate= null;
            state.maxDate=null;
            state.location = "";
            state.branch = "";
            state.model = "";
            state.customerName= "",
            state.email = "",
            state.stage = "",
            state.stage_id = "",
                state.consultant = "",
                state.reporting_manager = ""
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
                
                case "CAR_MODEL":
                    state.carModel = value;
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
    }
});

export const { clearState, setCustomerDetails,setDatePicker, } = complaintsSlice.actions;
export default complaintsSlice.reducer;
