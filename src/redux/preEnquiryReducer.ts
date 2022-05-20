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

export const getMorePreEnquiryData = createAsyncThunk('PRE_ENQUIRY/getMorePreEnquiryData', async (payload, { rejectWithValue }) => {

  const response = await client.post(URL.LEADS_LIST_API_FILTER(), payload);
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
    carModels: []
  },
  reducers: {
    callPressed: (state, action) => {
      state.modelVisible = !state.modelVisible;
    },
    setPreEnquiryList: (state, action) => {
      state.pre_enquiry_list = JSON.parse(action.payload);
    },
    setCarModels: (state, action) => {
      state.carModels = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getPreEnquiryData.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(getPreEnquiryData.fulfilled, (state, action) => {
      
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        // console.log('$$$$res: ', JSON.stringify(dmsEntityObj.leadDtoPage.content));
        state.totalPages = dmsEntityObj.leadDtoPage.totalPages;
        state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
        state.pre_enquiry_list = dmsEntityObj.leadDtoPage.content;
      }
      state.isLoading = false;
    })
    builder.addCase(getPreEnquiryData.rejected, (state) => {
      state.isLoading = false;
    })
    builder.addCase(getMorePreEnquiryData.pending, (state) => {
      state.isLoadingExtraData = true;
    })
    builder.addCase(getMorePreEnquiryData.fulfilled, (state, action) => {
      console.log('res: ', action.payload);
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
  }
});

export const { callPressed, setPreEnquiryList, setCarModels } = preEnquirySlice.actions;
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