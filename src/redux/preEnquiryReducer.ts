import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from '../networking/client';
import URL from "../networking/endpoints";

export const getPreEnquiryData = createAsyncThunk('PRE_ENQUIRY/getPreEnquiryData', async (payload, { rejectWithValue }) => {
  
  const response = await client.post(URL.LEADS_LIST_API_FILTER(), payload);
  const json = await response.json()
  
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getPreEnquiryDataLiveReceptionist = createAsyncThunk('PRE_ENQUIRY/getPreEnquiryDataLiveReceptionist', async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.GET_LIVE_LEAD_LIST_RECEPTINOST(), payload);
  const json = await response.json()

  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const getPreEnquiryDataLiveReceptionistManager = createAsyncThunk('PRE_ENQUIRY/getPreEnquiryDataLiveReceptionistManager', async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.GET_LIVE_LEAD_LIST_RECEPTINOST_MANAGER(), payload);
  const json = await response.json()

  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})


export const getMorePreEnquiryData = createAsyncThunk('PRE_ENQUIRY/getMorePreEnquiryData', async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.LEADS_LIST_API_FILTER(), payload);
  const json = await response.json()
  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

// for receptionist,cre,telecaller vol2
export const getReceptionistContactVol2 = createAsyncThunk('PRE_ENQUIRY/getReceptionistContactVol2', async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.CONTACT_RECEP_ETC(), payload);
  const json = await response.json()

  if (!response.ok) {
    return rejectWithValue(json);
  }
  return json;
})

export const preEnquirySlice = createSlice({
  name: "PRE_ENQUIRY",
  initialState: {
    pre_enquiry_list: [],
    modelVisible: false,
    pageNumber: 0,
    totalPages: 1,
    isLoading: false,
    isLoadingExtraData: false,
    status: "",
    pre_enquiry_list_TotalElements:0
  },
  reducers: {
    callPressed: (state, action) => {
      state.modelVisible = !state.modelVisible;
    },
    setPreEnquiryList: (state, action) => {
      state.pre_enquiry_list = JSON.parse(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getPreEnquiryData.pending, (state) => {
      state.totalPages = 1
      state.pageNumber = 0
      state.pre_enquiry_list = [];
      state.isLoading = true;
    })
    builder.addCase(getPreEnquiryData.fulfilled, (state, action) => {
      state.totalPages = 1
      state.pageNumber = 0
      state.pre_enquiry_list = [];
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.totalPages = dmsEntityObj.leadDtoPage.totalPages;
        state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
        state.pre_enquiry_list_TotalElements= action.payload;
        state.pre_enquiry_list = dmsEntityObj.leadDtoPage.content.length > 0 ? dmsEntityObj.leadDtoPage.content : [];

      }
      state.isLoading = false;
    })
    builder.addCase(getPreEnquiryData.rejected, (state) => {
      state.totalPages = 1
      state.pageNumber = 0
      state.pre_enquiry_list = [];
      state.isLoading = false;
    })
    builder.addCase(getMorePreEnquiryData.pending, (state) => {
      state.isLoadingExtraData = true;
    })
    builder.addCase(getMorePreEnquiryData.fulfilled, (state, action) => {
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
        const content = dmsEntityObj.leadDtoPage.content;
        state.pre_enquiry_list = [...state.pre_enquiry_list, ...content];
      }
      state.isLoadingExtraData = false;
    })
    builder.addCase(getMorePreEnquiryData.rejected, (state) => {
      state.isLoadingExtraData = false;
    })



    builder.addCase(getPreEnquiryDataLiveReceptionist.pending, (state) => {
      state.totalPages = 1
      state.pageNumber = 0
      state.pre_enquiry_list = [];
      state.isLoading = true;
    })
    builder.addCase(getPreEnquiryDataLiveReceptionist.fulfilled, (state, action) => {
      state.totalPages = 1
      state.pageNumber = 0
      state.pre_enquiry_list = [];
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.totalPages = dmsEntityObj.leadDtoPage.totalPages;
        state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
        state.pre_enquiry_list_TotalElements = action.payload;
        state.pre_enquiry_list = dmsEntityObj.leadDtoPage.content.length > 0 ? dmsEntityObj.leadDtoPage.content : [];

      }
      state.isLoading = false;
    })
    builder.addCase(getPreEnquiryDataLiveReceptionist.rejected, (state) => {
      state.totalPages = 1
      state.pageNumber = 0
      state.pre_enquiry_list = [];
      state.isLoading = false;
    })

    builder.addCase(getPreEnquiryDataLiveReceptionistManager.pending, (state) => {
      state.totalPages = 1
      state.pageNumber = 0
      state.pre_enquiry_list = [];
      state.isLoading = true;
    })
    builder.addCase(getPreEnquiryDataLiveReceptionistManager.fulfilled, (state, action) => {
      state.totalPages = 1
      state.pageNumber = 0
      state.pre_enquiry_list = [];
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.totalPages = dmsEntityObj.leadDtoPage.totalPages;
        state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
        state.pre_enquiry_list_TotalElements = action.payload;
        state.pre_enquiry_list = dmsEntityObj.leadDtoPage.content.length > 0 ? dmsEntityObj.leadDtoPage.content : [];

      }
      state.isLoading = false;
    })
    builder.addCase(getPreEnquiryDataLiveReceptionistManager.rejected, (state) => {
      state.totalPages = 1
      state.pageNumber = 0
      state.pre_enquiry_list = [];
      state.isLoading = false;
    })



    builder.addCase(getReceptionistContactVol2.pending, (state) => {
      state.totalPages = 1
      state.pageNumber = 0
      state.pre_enquiry_list = [];
      state.isLoading = true;
    })
    builder.addCase(getReceptionistContactVol2.fulfilled, (state, action) => {
      state.totalPages = 1
      state.pageNumber = 0
      state.pre_enquiry_list = [];
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.totalPages = dmsEntityObj.leadDtoPage.totalPages;
        state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
        state.pre_enquiry_list_TotalElements = action.payload;
        state.pre_enquiry_list = dmsEntityObj.leadDtoPage.content.length > 0 ? dmsEntityObj.leadDtoPage.content : [];

      }
      state.isLoading = false;
    })
    builder.addCase(getReceptionistContactVol2.rejected, (state) => {
      state.totalPages = 1
      state.pageNumber = 0
      state.pre_enquiry_list = [];
      state.isLoading = false;
    })
  }
});

export const { callPressed, setPreEnquiryList } = preEnquirySlice.actions;
export default preEnquirySlice.reducer;


// {
//   "startdate": "2021-09-09",
//   "enddate": "2021-22-09",
//   "model": [
//     {
//       "id": 1,
//       "name": "kwid"
//     }
//   ],
//   "categoryType": [
//     {
//       "id": 1,
//       "name": "hot"
//     }
//   ],
//   "sourceOfEnquiry": [
//     {
//       "id": 1,
//       "name": "WebSite"
//     }
//   ],
//   "empId": 1,
//   "status": "PREENQUIRY",
//   "offset": 0,
//   "limit": 5
// }