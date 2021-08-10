import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const genderData = [
    {
        id: 1,
        name: 'Male'
    },
    {
        id: 2,
        name: 'Female'
    }
]

const salutationData = [
    {
        id: 1,
        name: 'Mr'
    },
    {
        id: 2,
        name: 'Mrs'
    }
]

const relationTypeData = [
    {
        id: 1,
        name: 'S/O'
    },
    {
        id: 2,
        name: 'D/0'
    }
]

interface PersonalIntroModel {
    key: string,
    text: string
}

interface DropDownModel {
    id: string,
    name: string,
    keyId: string
}

const enquiryDetailsOverViewSlice = createSlice({
    name: "ENQUIRY_DETAILS_OVERVIEW_SLICE",
    initialState: {
        status: "",
        isLoading: false,
        openAccordian: 0,
        showDatepicker: false,
        showDropDownpicker: false,
        dropDownData: genderData,
        dropDownTitle: "",
        dropDownKeyId: "",
        enableEdit: false,
        // Personal Intro
        firstName: "",
        lastName: "",
        relationName: "",
        mobile: "",
        alterMobile: "",
        email: "",
        dateOfBirth: "",
        anniversaryDate: "",
        relation: "",
        gender: "",
        salutaion: "",
        // Communication Address
        pincode: "",
        urban_or_rural: 0, // 1: urban, 2: 
        houseNum: "",
        streetName: "",
        village: "",
        city: "",
        state: "",
        district: "",

        permanent_address: true,
        p_pincode: "",
        p_urban_or_rural: 0, // 1: urban, 2: 
        p_houseNum: "",
        p_streetName: "",
        p_village: "",
        p_city: "",
        p_state: "",
        p_district: "",
    },
    reducers: {
        setEditable: (state, action) => {
            console.log('pressed')
            state.enableEdit = !state.enableEdit;
        },
        setAccordian: (state, action) => {
            console.log('payload: ', action.payload);
            if (action.payload != state.openAccordian) {
                state.openAccordian = action.payload;
            } else {
                state.openAccordian = 0;
            }
        },
        setDropDown: (state, action) => {
            switch (action.payload) {
                case "SALUTATION":
                    state.dropDownData = salutationData;
                    state.dropDownTitle = "Select Salutation";
                    state.dropDownKeyId = "SALUTATION";
                    break;
                case "GENDER":
                    state.dropDownData = genderData;
                    state.dropDownTitle = "Select Gender";
                    state.dropDownKeyId = "GENDER";
                    break;
                case "RELATION":
                    state.dropDownData = relationTypeData;
                    state.dropDownTitle = "Select Relation";
                    state.dropDownKeyId = "RELATION";
                    break;
            }
            state.showDropDownpicker = !state.showDropDownpicker;
        },
        updateSelectedDropDownData: (state, action: PayloadAction<DropDownModel>) => {
            const { id, name, keyId } = action.payload;
            switch (keyId) {
                case "SALUTATION":
                    state.salutaion = name;
                    break;
                case "GENDER":
                    state.gender = name;
                    break;
                case "RELATION":
                    state.relation = name;
                    break;
            }
            state.showDropDownpicker = !state.showDropDownpicker;
        },
        setDatePicker: (state, action) => {
            console.log('datepicker payload: ', action.payload);
            state.showDatepicker = !state.showDatepicker;
        },
        setPersonalIntro: (state, action: PayloadAction<PersonalIntroModel>) => {
            const { key, text } = action.payload;
            switch (key) {
                case "FIRST_NAME":
                    state.firstName = text;
                    break;
                case "LAST_NAME":
                    state.lastName = text;
                    break;
                case "RELATION_NAME":
                    state.relationName = text;
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
                case "DOB":
                    state.dateOfBirth = text;
                    break;
                case "ANNIVE_DATE":
                    state.anniversaryDate = text;
                    break;
            }
        },
        setCommunicationAddress: (state, action: PayloadAction<PersonalIntroModel>) => {
            const { key, text } = action.payload;
            switch (key) {
                case "PINCODE":
                    state.pincode = text;
                    break;
                case "RURAL_URBAN":
                    state.urban_or_rural = Number(text);
                    break;
                case "HOUSE_NO":
                    state.houseNum = text;
                    break;
                case "STREET_NAME":
                    state.streetName = text;
                    break;
                case "VILLAGE":
                    state.village = text;
                    break;
                case "CITY":
                    state.city = text;
                    break;
                case "DISTRICT":
                    state.district = text;
                    break;
                case "STATE":
                    state.state = text;
                    break;
                case "PERMANENT_ADDRESS":
                    state.permanent_address = !state.permanent_address;
                    break;
            }
        }
    }
});

export const {
    setAccordian,
    setDatePicker,
    setEditable,
    setDropDown,
    setPersonalIntro,
    setCommunicationAddress,
    updateSelectedDropDownData
} = enquiryDetailsOverViewSlice.actions;
export default enquiryDetailsOverViewSlice.reducer;