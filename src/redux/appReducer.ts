import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import {
    EnquiryTypes,
    SourceOfEnquiryTypes,
    CustomerTypesObj,
} from "../jsonData/preEnquiryScreenJsonData";
import { showToast } from "../utils/toast";
import URL from "../networking/endpoints";
import { convertToDate } from "../utils/helperFunctions";
import moment from "moment";

interface TextModel {
    key: string;
    text: string;
}

interface DropDownModel {
    key: string;
    value: string;
    id: string;
}

interface Item {
    name: string;
    id: string;
}

export const appSlice = createSlice({
    name: "APP_SLICE",
    initialState: {
        selectedTab: 'PE',
        searchKey: '',
        isOpenModal: false,
        isSearch: false
    },
    reducers: {
        updateTAB: (state, action) => {
            state.selectedTab = action.payload
        },
        updateSearchKey: (state, action) => {
            state.searchKey = action.payload
        },
        updateModal: (state, action) => {
            state.isOpenModal = action.payload
        },
        updateIsSearch: (state, action) => {
            state.isSearch = action.payload
        },
    },
    // extraReducers: (builder) => {
    //     builder
    // },
});

export const {
    updateTAB,
    updateSearchKey,
    updateModal,
    updateIsSearch
} = appSlice.actions;
export default appSlice.reducer;
