import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from '../networking/client';
import URL from "../networking/endpoints";
import * as AsyncStore from '../asyncStore';


export const getCallRecordingCredentials = createAsyncThunk("CALLRECORDING/getCallRecordingCredentials", async (data: any, { rejectWithValue }) => {

    const response = await client.get(URL.GET_CALL_RECORDING_EXTENSIONID(data.empId, data.orgId));
    const json = await response.json()
    console.log("hello --------------",data.empId +"/"+data.orgId+json)
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
})

// export const getMoreComplaintsListApi = createAsyncThunk("COMPLAINTS/getMoreComplaintsListApi", async (payload, { rejectWithValue }) => {

//     const response = await client.post(URL.GET_COMPLAINTS(), payload);
//     const json = await response.json()
//     if (!response.ok) {
//         return rejectWithValue(json);
//     }
//     return json;
// })


export const callrecordingSlice = createSlice({
    name: "CALLRECORDING",
    initialState: {
        extensionId: 0,
        user_name:'',
        password: '',
        complaints_list: [],
        isLoading: false,
        isExtraLoading: false
    },
    reducers: {},
    extraReducers: (builder) => {
        // Get Complaints List
        builder.addCase(getCallRecordingCredentials.pending, (state, action) => {
            console.log("S  callrecording data: ", 'pending');
            state.isLoading = true;
        })
        builder.addCase(getCallRecordingCredentials.fulfilled, (state, action) => {
             console.log("S  callrecording data: ", action.payload);
            if (action.payload) {
                const dataObj = action.payload;
                state.user_name = dataObj[0]?.extensionId ? dataObj[0]?.extensionId : "";
                state.password = dataObj[0]?.sipIaxPassword ? dataObj[0]?.sipIaxPassword : "";
                AsyncStore.storeData(AsyncStore.Keys.EXTENSION_ID, state.user_name.toString())
                AsyncStore.storeData(AsyncStore.Keys.EXTENSSION_PWD, state.password.toString())

                console.log("invicidual data", state.user_name)
              //  state.complaints_list = dataObj.data ? dataObj.data : [];
            }
            state.isLoading = false;
        })
        builder.addCase(getCallRecordingCredentials.rejected, (state, action) => {
            console.log("S  callrecording data: ", 'rejected');          
              state.isLoading = false;
        })
        // // Get More Complaints List
        // builder.addCase(getMoreComplaintsListApi.pending, (state, action) => {
        //     state.isExtraLoading = true;
        // })
        // builder.addCase(getMoreComplaintsListApi.fulfilled, (state, action) => {
        //     state.isExtraLoading = false;
        //     if (action.payload) {
        //         const dataObj = action.payload;
        //         state.page_number = dataObj.pageNo ? dataObj.pageNo : 0;
        //         const list = dataObj.data ? dataObj.data : [];
        //         state.complaints_list = [...state.complaints_list, ...list];
        //     }
        // })
        // builder.addCase(getMoreComplaintsListApi.rejected, (state, action) => {
        //     state.isExtraLoading = false;
        // })
    }
});

export const { } = callrecordingSlice.actions;
export default callrecordingSlice.reducer;
