import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";

export const EnquiryTypes = [
    {
        "id": "1",
        "name": "Personal"
    },
    {
        "id": "2",
        "name": "Commercial"
    },
    {
        "id": "3",
        "name": "Company"
    }
];

export const SourceOfEnquiryTypes = [
    {
        id: 1,
        name: 'ShowRoom',
    },
    {
        id: 2,
        name: 'Field',
    },
    {
        id: 3,
        name: 'Digital Marketing',
    },
    {
        id: 4,
        name: 'Event',
    },
    {
        id: 5,
        name: 'Social Network',
    },
    {
        id: 6,
        name: 'Reference',
    },
    {
        id: 7,
        name: 'Website',
    },
    {
        id: 8,
        name: 'App',
    },
    {
        id: 9,
        name: 'NewsPaper',
    },
    {
        id: 10,
        name: 'Leasing',
    },
    {
        id: 11,
        name: 'Workshop',
    },
    {
        id: 12,
        name: 'DSA',
    },
    {
        id: 13,
        name: 'Freelancer',
    },
    {
        id: 14,
        name: 'Other',
    }
];

interface Item {
    name: string,
    id: string
}

export const createPreEnquiry = createAsyncThunk('ADD_PRE_ENQUIRY_SLICE/createPreEnquiry', async (data) => {

    const response = client.post(data['url'], data['body']);
    return response;
})

export const addPreEnquirySlice = createSlice({
    name: "ADD_PRE_ENQUIRY_SLICE",
    initialState: {
        create_enquiry_checked: false,
        firstName: "Test_New",
        lastName: "a1",
        mobile: "8888888801",
        alterMobile: "",
        email: "test01@gmail.com",
        pincode: "",
        carModel: "",
        enquiryType: "",
        customerType: "",
        sourceOfEnquiry: "",
        sourceOfEnquiryId: null,
        companyName: "",
        enquiry_type_list: EnquiryTypes,
        source_of_enquiry_type_list: SourceOfEnquiryTypes,
        show_model_drop_down: false,
        show_enquiry_segment_drop_down: false,
        show_customer_type_drop_down: false,
        show_source_type_drop_down: false,
        isLoading: false,
        status: "",
        errorMsg: ""
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
        },
        setCreateEnquiryCheckbox: (state, action) => {
            state.create_enquiry_checked = !state.create_enquiry_checked;
        },
        setFirstName: (state, action: PayloadAction<string>) => {
            state.firstName = action.payload;
        },
        setLastName: (state, action: PayloadAction<string>) => {
            state.lastName = action.payload;
        },
        setMobile: (state, action: PayloadAction<string>) => {
            state.mobile = action.payload;
        },
        setAlterMobile: (state, action: PayloadAction<string>) => {
            state.alterMobile = action.payload;
        },
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setPincode: (state, action: PayloadAction<string>) => {
            state.pincode = action.payload;
        },
        setCarModel: (state, action: PayloadAction<string>) => {
            state.carModel = action.payload;
            state.show_model_drop_down = !state.show_model_drop_down;
        },
        setEnquiryType: (state, action: PayloadAction<string>) => {
            state.enquiryType = action.payload;
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
        setCompanyName: (state, action: PayloadAction<string>) => {
            state.companyName = action.payload;
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
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPreEnquiry.pending, (state, action) => {
                state.isLoading = true;
                state.status = "pending";
                console.log('res1: ', action.payload);
            })
            .addCase(createPreEnquiry.fulfilled, (state, action) => {
                console.log('res2: ', action.payload.success);
                if (action.payload.success) {
                    state.status = "success";
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
    }
});

export const {
    clearState,
    setCreateEnquiryCheckbox,
    setFirstName,
    setLastName,
    setMobile,
    setAlterMobile,
    setEmail,
    setPincode,
    setCarModel,
    setEnquiryType,
    setCustomerType,
    setSourceOfEnquiry,
    setCompanyName,
    showModelSelect,
    showCustomerTypeSelect,
    showEnquirySegmentSelect,
    showSourceOfEnquirySelect
} = addPreEnquirySlice.actions;
export default addPreEnquirySlice.reducer;
