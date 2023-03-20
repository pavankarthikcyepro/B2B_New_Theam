import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import URL from "../networking/endpoints";
import { client } from "../networking/client";

export const getEnquiryList = createAsyncThunk(
  "ENQUIRY/getEnquiryList",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(URL.LEADS_LIST_API_FILTER(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getMoreEnquiryList = createAsyncThunk(
  "ENQUIRY/getMoreEnquiryList",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(URL.GET_LEAD_LIST_2(), payload);

    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getLeadsList = createAsyncThunk(
  "ENQUIRY/getLeadsList",
  async (payload, { rejectWithValue }) => {
    let url = URL.GET_LEAD_LIST_2();
    if (payload?.isLive) {
      url = url + "Live";
    }
    const response = await client.post(url, payload.newPayload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);


export const getLeadsListReceptionist = createAsyncThunk(
  "ENQUIRY/getLeadsListReceptionist",
  async (payload, { rejectWithValue }) => {
    let url = URL.GET_LEAD_LIST_RECEPTINOST();
    // if (payload?.isLive) {
    //   url = url + "Live";
    // }
    const response = await client.post(url, payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

const enquirySlice = createSlice({
  name: "ENQUIRY",
  initialState: {
    enquiry_list: [],
    pageNumber: 0,
    totalPages: 1,
    isLoading: false,
    isLoadingExtraData: false,
    status: "",
    leadList: [],
    leadList_status: "",
    leadList_totoalElemntData: [],
    updateCount: "",
  },
  reducers: {
    clearEnqState: (state, action) => {
      (state.enquiry_list = []),
        (state.pageNumber = 0),
        (state.totalPages = 1),
        (state.isLoading = false),
        (state.isLoadingExtraData = false),
        (state.status = ""),
        (state.leadList = []),
        (state.leadList_status = ""),
        (state.leadList_totoalElemntData = []),
        (state.updateCount = "")
    },
    updateTheCount: (state, action) => {
      state.updateCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getEnquiryList.pending, (state) => {
      state.totalPages = 1;
      state.pageNumber = 0;
      state.enquiry_list = [];
      state.isLoading = true;
    });
    builder.addCase(getEnquiryList.fulfilled, (state, action) => {
      const dmsEntityObj = action.payload?.dmsEntity;
      state.totalPages = 1;
      state.pageNumber = 0;
      state.enquiry_list = [];
      if (dmsEntityObj) {
        state.totalPages = dmsEntityObj.leadDtoPage.totalPages;
        state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
        // state.enquiry_list = dmsEntityObj.leadDtoPage.content;
      }
      state.isLoading = false;
      state.status = "sucess";
    });
    builder.addCase(getEnquiryList.rejected, (state, action) => {
      state.totalPages = 1;
      state.pageNumber = 0;
      state.enquiry_list = [];
      state.isLoading = false;
      state.status = "failed";
    });
    builder.addCase(getMoreEnquiryList.pending, (state) => {
      // state.totalPages = 1
      // state.pageNumber = 0
      state.isLoadingExtraData = true;
    });
    builder.addCase(getMoreEnquiryList.fulfilled, (state, action) => {
      const dmsEntityObj = action.payload?.dmsEntity;
      state.totalPages = 1;
      state.pageNumber = 0;
      if (dmsEntityObj) {
        state.totalPages = dmsEntityObj.leadDtoPage.totalPages;
        state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
        const content = dmsEntityObj.leadDtoPage.content;
        state.leadList = [...state.leadList, ...content];
      }
      state.status = "sucess";
      state.isLoadingExtraData = false;
    });
    builder.addCase(getMoreEnquiryList.rejected, (state, action) => {
      state.isLoadingExtraData = false;
      state.status = "failed";
    });

    builder.addCase(getLeadsList.pending, (state, action) => {
      state.leadList = [];
      state.leadList_status = "pending";
    });
    builder.addCase(getLeadsList.fulfilled, (state, action) => {
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.totalPages = dmsEntityObj.leadDtoPage.totalPages;
        //   state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
        const content = dmsEntityObj.leadDtoPage.content;
        state.leadList = content;
        state.leadList_totoalElemntData = action.payload;
        state.leadList_status = "success";
        // state.enquiry_list = [...state.enquiry_list, ...content];
      }
    });
    builder.addCase(getLeadsList.rejected, (state, action) => {
      state.leadList = [];
      state.leadList_status = "rejected";
    });

    builder.addCase(getLeadsListReceptionist.pending, (state, action) => {
      state.leadList = [];
      state.leadList_status = "pending";
      state.isLoading = true;
    });
    builder.addCase(getLeadsListReceptionist.fulfilled, (state, action) => {
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.totalPages = dmsEntityObj.leadDtoPage.totalPages;
        //   state.pageNumber = dmsEntityObj.leadDtoPage.pageable.pageNumber;
        const content = dmsEntityObj.leadDtoPage.content;
        state.leadList = content;
        state.leadList_totoalElemntData = action.payload;
        state.leadList_status = "success";
        state.isLoading = false;
        // state.enquiry_list = [...state.enquiry_list, ...content];
      }

    });
    builder.addCase(getLeadsListReceptionist.rejected, (state, action) => {
      state.leadList = [];
      state.leadList_status = "rejected";
      state.isLoading = false;
    });
  }
});

export const { clearEnqState, updateTheCount } = enquirySlice.actions;
export default enquirySlice.reducer;
