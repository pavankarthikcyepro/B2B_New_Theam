import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import { EnquiryTypes, SourceOfEnquiryTypes, CustomerTypesObj } from "../jsonData/preEnquiryScreenJsonData";

interface TextModel {
    key: string,
    text: string
}

interface Item {
    name: string,
    id: string
}

export const createPreEnquiry = createAsyncThunk('ADD_PRE_ENQUIRY_SLICE/createPreEnquiry', async (data) => {

    const response = client.post(data['url'], data['body']);
    return response;
})

export const updatePreEnquiry = createAsyncThunk('ADD_PRE_ENQUIRY_SLICE/updatePreEnquiry', async (data) => {

    const response = client.put(data['url'], data['body']);
    return response;
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
            state.isLoading = false;
            state.status = "";
            state.errorMsg = "";
            state.create_enquiry_response_obj = {}
        },
        setCreateEnquiryCheckbox: (state, action) => {
            state.create_enquiry_checked = !state.create_enquiry_checked;
        },
        showDropDown: (state, action) => {
            switch (action.payload) {
                case "ENQUIRY_SEGMENT":
                    break;
                case "CAR_MODEL":
                    break;
                case "CUSTOMER_TYPE":
                    break;
                case "SOURCE_OF_ENQUIRY":
                    break;
            }
            state.drop_down_key_id = action.payload;
            state.show_drop_down = !state.show_drop_down;
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
        setCarModel: (state, action: PayloadAction<string>) => {
            state.carModel = action.payload;
            state.show_model_drop_down = !state.show_model_drop_down;
        },
        setEnquiryType: (state, action: PayloadAction<Item>) => {
            state.enquiryType = action.payload.name;
            state.customer_type_list = CustomerTypesObj[action.payload.name.toLowerCase()];
            state.customerType = "";
            state.show_enquiry_segment_drop_down = !state.show_enquiry_segment_drop_down;
        },
        setCustomerType: (state, action: PayloadAction<string>) => {
            state.customerType = action.payload;
            state.show_customer_type_drop_down = !state.show_customer_type_drop_down;
        },
        setSourceOfEnquiry: (state, action: PayloadAction<Item>) => {
            state.sourceOfEnquiry = action.payload.name;
            state.sourceOfEnquiryId = action.payload.id;
            state.show_source_type_drop_down = !state.show_source_type_drop_down;
        },
        showModelSelect: (state, action) => {
            state.show_model_drop_down = !state.show_model_drop_down;
        },
        showEnquirySegmentSelect: (state, action) => {
            state.show_enquiry_segment_drop_down = !state.show_enquiry_segment_drop_down;
        },
        showCustomerTypeSelect: (state, action) => {
            state.show_customer_type_drop_down = !state.show_customer_type_drop_down;
        },
        showSourceOfEnquirySelect: (state, action) => {
            state.show_source_type_drop_down = !state.show_source_type_drop_down;
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
                if (action.payload.success) {
                    state.status = "success";
                    state.create_enquiry_response_obj = action.payload
                } else {
                    state.errorMsg = action.payload.errorMessage;
                }
                state.isLoading = false;
            })
            .addCase(createPreEnquiry.rejected, (state, action) => {
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
                if (action.payload.success) {
                    state.status = "success";
                    state.create_enquiry_response_obj = action.payload
                } else {
                    state.errorMsg = action.payload.errorMessage;
                }
                state.isLoading = false;
            })
            .addCase(updatePreEnquiry.rejected, (state, action) => {
                state.isLoading = false;
                state.status = "failed";
            })
    }
});

export const {
    clearState,
    setCreateEnquiryCheckbox,
    setPreEnquiryDetails,
    setCarModel,
    setEnquiryType,
    setCustomerType,
    setSourceOfEnquiry,
    showModelSelect,
    showCustomerTypeSelect,
    showEnquirySegmentSelect,
    showSourceOfEnquirySelect,
    setCustomerTypeList,
    setCarModalList,
    setExistingDetails
} = addPreEnquirySlice.actions;
export default addPreEnquirySlice.reducer;
