import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
        companyName: "",
        isLoading: false,
        enquiry_type_list: EnquiryTypes,
        source_of_enquiry_type_list: SourceOfEnquiryTypes,
        show_model_drop_down: false,
        show_enquiry_segment_drop_down: false,
        show_customer_type_drop_down: false,
        show_source_type_drop_down: false
    },
    reducers: {
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
        setSourceOfEnquiry: (state, action: PayloadAction<string>) => {
            state.sourceOfEnquiry = action.payload;
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
});

export const {
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
