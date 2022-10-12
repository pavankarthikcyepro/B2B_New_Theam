import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import URL from "../networking/endpoints";
import { client } from '../networking/client';
import { showToast } from '../utils/toast';

export const getMenu = createAsyncThunk('DROPANALYSIS/getMenu', async (payload, { rejectWithValue }) => {

    console.log("PAYLOAD EN: ", URL.GET_MENU_DROP_DOWN_DATA());

    const response = await client.get(URL.GET_MENU_DROP_DOWN_DATA());
    const json = await response.json()
    console.log("ENQ LIST:", JSON.stringify(json));

    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getSubMenu = createAsyncThunk('DROPANALYSIS/getSubMenu', async (payload, { rejectWithValue }) => {

    console.log("PAYLOAD EN: ", URL.GET_SUB_MENU(payload));

    const response = await client.get(URL.GET_SUB_MENU(payload));
    const json = await response.json()
    console.log("ENQ LIST:", JSON.stringify(json));

    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const getLeadsList = createAsyncThunk(
    "DROPANALYSIS/getLeadsList",
    async (payload, { rejectWithValue }) => {
        console.log(
          "PAYLOAD getLeadsList EN: ",
          URL.GET_LEAD_LIST(
            payload.branchId,
            payload.empName,
            payload.empId,
            payload.offSet,
            payload.limit
          )
        );
        console.log(payload.body);
        

        const response = await client.post(
            URL.GET_LEAD_LIST(
                payload.branchId,
                payload.empName,
                payload.empId,
                payload.offSet,
                payload.limit
            ),
            payload.body
        );
        const json = await response.json();
        console.log("ENQ getLeadsList LIST:", JSON.stringify(json));

        if (!response.ok) {
            return rejectWithValue(json);
        }
        return json;
    }
);

export const getLeadDropList = createAsyncThunk('DROPANALYSIS/getLeaddropList', async (payload, { rejectWithValue }) => {

    console.log("PAYLOAD EN: ", URL.GET_LEADDROP_LIST(payload.branchId, payload.empName, payload.orgId, payload.offset, payload.limit));

    const response = await client.get(
        URL.GET_LEADDROP_LIST(
            payload.branchId,
            payload.empName,
            payload.orgId,
            payload.offset,
            payload.limit
        ),
        payload.body
    );
    const json = await response.json()
    console.log("ENQ LIST:", JSON.stringify(json));

    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})
export const getMoreLeadDropList = createAsyncThunk('DROPANALYSIS/getMoreLeaddropList', async (payload, { rejectWithValue }) => {

    console.log("PAYLOAD EN: ", JSON.stringify(payload));
    console.log("ENQ LIST:", "hi");

    const response = await client.get(URL.GET_LEADDROP_LIST(payload.branchId, payload.empName, payload.orgId, payload.offset, payload.limit));
    const json = await response.json()

    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const updateSingleApproval = createAsyncThunk('DROPANALYSIS/updateSingleApproval', async (payload, { rejectWithValue }) => {

    console.log("PAYLOAD EN: ", JSON.stringify(payload));

    const response = await client.post(URL.UPDATE_SINGLEAPPROVAL(), payload);
    const json = await response.json()
    console.log("ENQ LIST:", JSON.stringify(json));

    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

export const revokeDrop = createAsyncThunk('DROPANALYSIS/revokeDrop', async (payload, { rejectWithValue }) => {

    console.log("PAYLOAD REVOKE: ", URL.REVOKE(payload["leadId"]));

    const response = await client.get(URL.REVOKE(payload["leadId"]));
    // const json = await response.json()

    console.log("REVOKE RES: ", response);

    if (!response.ok) {
        return rejectWithValue(response);
    }
    return response;
})

export const updateBulkApproval = createAsyncThunk('DROPANALYSIS/updateBulkApproval', async (payload, { rejectWithValue }) => {

    console.log("PAYLOAD EN: ", JSON.stringify(payload));

    const response = await client.post(URL.UPDATE_BULKAPPROVAL(), payload);
    const json = await response.json()
    console.log("ENQ LIST:", JSON.stringify(json));

    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})
const leaddropListSlice = createSlice({
    name: 'DROPANALYSIS',
    initialState: {
        leadDropList: [],
        pageNumber: 0,
        totalPages: 1,
        isLoading: false,
        isLoadingExtraData: false,
        status: "",
        approvalStatus: "",
        subMenu: [],
        menu: [],
        leadList: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getMenu.pending, (state, action) => {
            console.log("dropanalysis getMenu pending", action)
            state.menu = []
        })
        builder.addCase(getMenu.fulfilled, (state, action) => {
            console.log("dropanalysis getMenu sucess", JSON.stringify(action));
            state.menu = action.payload;
        })
        builder.addCase(getMenu.rejected, (state, action) => {
            console.log("dropanalysis getMenu", "rejected")
            state.menu = []
        })
        builder.addCase(getSubMenu.pending, (state, action) => {
            console.log("dropanalysis pending", action)
            state.subMenu = []
        })
        builder.addCase(getSubMenu.fulfilled, (state, action) => {
            console.log("dropanalysis sucess", JSON.stringify(action));
            state.subMenu = action.payload;
        })
        builder.addCase(getSubMenu.rejected, (state, action) => {
            console.log("dropanalysis", "rejected")
            state.subMenu = []
        })
        builder.addCase(getLeadDropList.pending, (state, action) => {
            console.log("dropanalysis pending", action)
            state.totalPages = 1
            state.pageNumber = 0
            state.leadDropList = []
            state.isLoading = true;
        })
        builder.addCase(getLeadDropList.fulfilled, (state, action) => {

            const dmsLeadDropInfos = action.payload?.dmsLeadDropInfos;
            state.totalPages = 1
            state.pageNumber = 0
            state.leadDropList = []
            if (dmsLeadDropInfos) {
                state.totalPages = dmsLeadDropInfos.totalPages;
                state.pageNumber = dmsLeadDropInfos.pageable.pageNumber;
                state.leadDropList = dmsLeadDropInfos.content;
            }
            state.isLoading = false;
            state.status = "sucess";
        })
        builder.addCase(getLeadDropList.rejected, (state, action) => {
            console.log("dropanalysis", "rejected")

            state.totalPages = 1
            state.pageNumber = 0
            state.leadDropList = []
            state.isLoading = false;
            state.status = "failed";
        })
        builder.addCase(getLeadsList.pending, (state, action) => {
            console.log("dropanalysis pending", action);
            state.leadList = [];
        });
        builder.addCase(getLeadsList.fulfilled, (state, action) => {
            state.leadList = action.payload;
        });
        builder.addCase(getLeadsList.rejected, (state, action) => {
            console.log("dropanalysis", "rejected");
            state.leadList = [];

        });
        builder.addCase(getMoreLeadDropList.pending, (state) => {
            state.totalPages = 1
            state.pageNumber = 0
            state.isLoadingExtraData = true;
        })
        builder.addCase(getMoreLeadDropList.fulfilled, (state, action) => {
            // console.log('res: ', action.payload);
            console.log("dropanalysis success", action.payload)


            const dmsLeadDropInfos = action.payload?.dmsLeadDropInfos;
            state.totalPages = 1
            state.pageNumber = 0
            if (dmsLeadDropInfos) {
                state.totalPages = dmsLeadDropInfos.totalPages;
                state.pageNumber = dmsLeadDropInfos.pageable.pageNumber;
                const content = dmsLeadDropInfos.content;
                state.leadDropList = [...state.leadDropList, ...content];
            }
            state.status = "sucess";
            state.isLoadingExtraData = false;

        })
        builder.addCase(getMoreLeadDropList.rejected, (state, action) => {
            state.isLoadingExtraData = false;
            state.status = "failed";
        })

        builder.addCase(updateSingleApproval.pending, (state) => {
        })
        builder.addCase(updateSingleApproval.fulfilled, (state, action) => {
            // console.log('res: ', action.payload);
            const status = action.payload?.status;
            // if (status === 'SUCCESS') {
            //     showToast("Successfully updated");

            // }
            state.isLoadingExtraData = false;
            state.approvalStatus = "sucess";
        })
        builder.addCase(updateSingleApproval.rejected, (state, action) => {

        })

        builder.addCase(revokeDrop.pending, (state) => {
        })
        builder.addCase(revokeDrop.fulfilled, (state, action) => {
            // console.log('res: ', action.payload);

        })
        builder.addCase(revokeDrop.rejected, (state, action) => {

        })

        builder.addCase(updateBulkApproval.pending, (state) => {
        })
        builder.addCase(updateBulkApproval.fulfilled, (state, action) => {
            console.log('builk uplres: ', action.payload);
            if (action.payload.length > 0) {
                showToast("Successfully updated");

            }
            // const status = action.payload?.status;
            // if (status === 'SUCCESS') {

            // }
            // state.isLoadingExtraData = false;
            state.approvalStatus = "sucess";
        })
        builder.addCase(updateBulkApproval.rejected, (state, action) => {
            state.approvalStatus = "failed";
        })

    }
})

export const { } = leaddropListSlice.actions;
export default leaddropListSlice.reducer;