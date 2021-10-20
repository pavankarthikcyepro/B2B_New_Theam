import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import { EnquiryTypes, SourceOfEnquiryTypes, CustomerTypesObj } from "../jsonData/preEnquiryScreenJsonData";
import { showToast } from "../utils/toast";
import URL from "../networking/endpoints";
import { convertToDate } from "../utils/helperFunctions";
import moment from "moment";

interface TextModel {
    key: string,
    text: string
}

interface DropDownModel {
    key: string,
    value: string,
    id: string
}

interface Item {
    name: string,
    id: string
}

export const createPreEnquiry = createAsyncThunk('ADD_PRE_ENQUIRY_SLICE/createPreEnquiry', async (data, { rejectWithValue }) => {

    const response = await client.post(data['url'], data['body']);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const continueToCreatePreEnquiry = createAsyncThunk('ADD_PRE_ENQUIRY_SLICE/continueToCreatePreEnquiry', async (data, { rejectWithValue }) => {

    const response = await client.post(data['url'], data['body']);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const updatePreEnquiry = createAsyncThunk('ADD_PRE_ENQUIRY_SLICE/updatePreEnquiry', async (data, { rejectWithValue }) => {

    const response = await client.put(data['url'], data['body']);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getEventListApi = createAsyncThunk('ADD_PRE_ENQUIRY_SLICE/getEventListApi', async (payload: any, { rejectWithValue }) => {

    const customConfig = {
        branchid: payload.branchId,
        orgid: payload.orgId
    }
    const response = await client.get(URL.GET_EVENT_LIST(payload.startDate, payload.endDate, payload.empId), customConfig);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const addPreEnquirySlice = createSlice({
    name: "ADD_PRE_ENQUIRY_SLICE",
    initialState: {
        create_enquiry_checked: false,
        firstName: "",
        lastName: "",
        mobile: "",
        alterMobile: "",
        email: "",
        pincode: "",
        carModel: "",
        enquiryType: "",
        customerType: "",
        sourceOfEnquiry: "",
        sourceOfEnquiryId: null,
        eventName: "",
        eventStartDate: "",
        eventEndDate: "",
        companyName: "",
        other: "",
        drop_down_data: [],
        drop_down_key_id: "",
        show_drop_down: false,
        enquiry_type_list: EnquiryTypes,
        source_of_enquiry_type_list: SourceOfEnquiryTypes,
        show_model_drop_down: false,
        show_enquiry_segment_drop_down: false,
        show_customer_type_drop_down: false,
        show_source_type_drop_down: false,
        isLoading: false,
        status: "",
        errorMsg: "",
        vehicle_modal_list: [],
        customer_type_list: [],
        create_enquiry_response_obj: {},
        event_list: [],
        event_list_response_status: ""
    },
    reducers: {
        clearState: (state) => {
            state.create_enquiry_checked = false;
            state.firstName = "";
            state.lastName = "";
            state.mobile = "";
            state.alterMobile = "";
            state.email = "";
            state.pincode = "";
            state.carModel = "";
            state.enquiryType = "";
            state.customerType = "";
            state.sourceOfEnquiry = "";
            state.sourceOfEnquiryId = null;
            state.companyName = "";
            state.eventName = "";
            state.eventStartDate = "";
            state.eventEndDate = "";
            state.isLoading = false;
            state.status = "";
            state.errorMsg = "";
            state.create_enquiry_response_obj = {};
            state.event_list = [];
            state.event_list_response_status = "";
        },
        setCreateEnquiryCheckbox: (state, action) => {
            state.create_enquiry_checked = !state.create_enquiry_checked;
        },
        setDropDownData: (state, action: PayloadAction<DropDownModel>) => {
            const { key, value, id } = action.payload;
            switch (key) {
                case "ENQUIRY_SEGMENT":
                    state.enquiryType = value;
                    state.customer_type_list = CustomerTypesObj[value.toLowerCase()];
                    state.customerType = "";
                    break;
                case "CAR_MODEL":
                    state.carModel = value;
                    break;
                case "CUSTOMER_TYPE":
                    state.customerType = value;
                    break;
                case "SOURCE_OF_ENQUIRY":
                    if (value === "Event") {
                        const currentDate = moment().format("YYYY-MM-DD");
                        state.eventStartDate = currentDate;
                        state.eventEndDate = currentDate;
                        state.eventName = "";
                    }
                    state.sourceOfEnquiry = value;
                    state.sourceOfEnquiryId = id;
                    break;
                case "EVENT_NAME":
                    state.eventName = value;
                    break;
            }
        },
        updateSelectedDate: (state, action: PayloadAction<TextModel>) => {
            const { key, text } = action.payload;
            const date = convertToDate(text, "YYYY-MM-DD");
            switch (key) {
                case "START_DATE":
                    state.eventStartDate = date;
                    state.eventName = "";
                    break;
                case "END_DATE":
                    state.eventEndDate = date;
                    state.eventName = "";
                    break;
            }
        },
        setPreEnquiryDetails: (state, action: PayloadAction<TextModel>) => {
            const { key, text } = action.payload;
            switch (key) {
                case "FIRST_NAME":
                    state.firstName = text;
                    break;
                case "LAST_NAME":
                    state.lastName = text;
                    break;
                case "MOBILE":
                    state.mobile = text;
                    break;
                case "ALTER_MOBILE":
                    state.alterMobile = text;
                    break;
                case "EMAIL":
                    state.email = text;
                    break;
                case "COMPANY_NAME":
                    state.companyName = text;
                    break;
                case "OTHER":
                    state.other = text;
                    break;
                case "PINCODE":
                    state.pincode = text;
                    break;
            }
        },
        setCustomerTypeList: (state, action) => {
            state.customer_type_list = JSON.parse(action.payload);
        },
        setCarModalList: (state, action) => {
            state.vehicle_modal_list = JSON.parse(action.payload);
        },
        setExistingDetails: (state, action) => {

            const preEnquiryDetails = action.payload.dmsLeadDto;
            let dmsAccountOrContactObj = {};
            if (action.payload.dmsAccountDto) {
                dmsAccountOrContactObj = action.payload.dmsAccountDto;
            } else {
                dmsAccountOrContactObj = action.payload.dmsContactDto;
            }

            state.firstName = preEnquiryDetails.firstName;
            state.lastName = preEnquiryDetails.lastName;
            state.mobile = preEnquiryDetails.phone;
            state.alterMobile = dmsAccountOrContactObj["secondaryPhone"] || "";
            state.email = preEnquiryDetails.email;
            state.pincode = preEnquiryDetails.pincode;
            state.carModel = preEnquiryDetails.model;
            state.enquiryType = preEnquiryDetails.enquirySegment;
            state.enquiry_type_list = CustomerTypesObj[preEnquiryDetails.enquirySegment.toLowerCase()];
            state.customerType = dmsAccountOrContactObj["customerType"] || "";
            state.sourceOfEnquiry = preEnquiryDetails.enquirySource;
            state.sourceOfEnquiryId = preEnquiryDetails.sourceOfEnquiry;
            state.companyName = dmsAccountOrContactObj["company"] || "";
            state.other = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPreEnquiry.pending, (state, action) => {
                state.isLoading = true;
                state.status = "pending";
            })
            .addCase(createPreEnquiry.fulfilled, (state, action) => {
                //console.log('res2: ', action.payload);
                if (action.payload.errorMessage) {
                    showToast(action.payload.errorMessage);
                } else {
                    state.create_enquiry_response_obj = action.payload
                }
                state.isLoading = false;
            })
            .addCase(createPreEnquiry.rejected, (state, action) => {
                const message = action.payload["message"] || "";
                if (message) {
                    showToast(message)
                }
                state.isLoading = false;
                state.status = "failed";
                console.log('res3: ', action.payload);
            })
            .addCase(updatePreEnquiry.pending, (state, action) => {
                state.isLoading = true;
                state.status = "pending";
            })
            .addCase(updatePreEnquiry.fulfilled, (state, action) => {
                console.log('res2: ', action.payload);
                if (action.payload.errorMessage) {
                    showToast(action.payload.errorMessage);
                } else {
                    state.create_enquiry_response_obj = action.payload
                }
                state.isLoading = false;
            })
            .addCase(updatePreEnquiry.rejected, (state, action) => {
                state.isLoading = false;
                state.status = "failed";
            })
            .addCase(continueToCreatePreEnquiry.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(continueToCreatePreEnquiry.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(continueToCreatePreEnquiry.rejected, (state, action) => {
                state.isLoading = false;
            })
            // Get Event List
            .addCase(getEventListApi.pending, (state, action) => {
                state.event_list = [];
                state.event_list_response_status = "pending";
                state.isLoading = true;
            })
            .addCase(getEventListApi.fulfilled, (state, action) => {
                console.log("S getEventListApi: ", JSON.stringify(action.payload));
                if (action.payload) {
                    state.event_list = action.payload;
                }
                state.event_list_response_status = "success";
                state.isLoading = false;
            })
            .addCase(getEventListApi.rejected, (state, action) => {
                console.log("F getEventListApi: ", JSON.stringify(action.payload));
                state.event_list_response_status = "failed";
                state.isLoading = false;
            })
    }
});

export const {
    clearState,
    setCreateEnquiryCheckbox,
    setPreEnquiryDetails,
    setDropDownData,
    setCustomerTypeList,
    setCarModalList,
    setExistingDetails,
    updateSelectedDate
} = addPreEnquirySlice.actions;
export default addPreEnquirySlice.reducer;
