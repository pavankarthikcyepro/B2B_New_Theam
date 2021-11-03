import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from '../networking/client';
import URL from "../networking/endpoints";

export const getUpcmoingDeliveriesListApi = createAsyncThunk('UPCOMING_DELIVERIES_SLICE/getUpcmoingDeliveriesListApi', async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.LEADS_LIST_API_FILTER(), payload);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getMoreUpcmoingDeliveriesListApi = createAsyncThunk('UPCOMING_DELIVERIES_SLICE/getMoreUpcmoingDeliveriesListApi', async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.LEADS_LIST_API_FILTER(), payload);
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const slice = createSlice({
    name: "UPCOMING_DELIVERIES_SLICE",
    initialState: {
        data_list: [],
        pageNumber: 0,
        totalPages: 1,
        isLoading: false,
        isLoadingExtraData: false,
        status: ""
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getUpcmoingDeliveriesListApi.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(getUpcmoingDeliveriesListApi.fulfilled, (state, action) => {
            console.log('res: ', action.payload);
            const dmsEntityObj = action.payload?.dmsEntity;
            if (dmsEntityObj) {
                state.totalPages = dmsEntityObj.leadDtoPage.totalPages;
                state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
                state.data_list = dmsEntityObj.leadDtoPage.content;
            }
            state.isLoading = false;
        })
        builder.addCase(getUpcmoingDeliveriesListApi.rejected, (state) => {
            state.isLoading = false;
        })
        builder.addCase(getMoreUpcmoingDeliveriesListApi.pending, (state) => {
            state.isLoadingExtraData = true;
        })
        builder.addCase(getMoreUpcmoingDeliveriesListApi.fulfilled, (state, action) => {
            console.log('res: ', action.payload);
            const dmsEntityObj = action.payload?.dmsEntity;
            if (dmsEntityObj) {
                state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
                const content = dmsEntityObj.leadDtoPage.content;
                state.data_list = [...state.data_list, ...content];
            }
            state.isLoadingExtraData = false;
        })
        builder.addCase(getMoreUpcmoingDeliveriesListApi.rejected, (state) => {
            state.isLoadingExtraData = false;
        })
    }
});

export const { } = slice.actions;
export default slice.reducer;
