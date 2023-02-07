import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import URL from "../networking/endpoints";
import { client } from "../networking/client";
import { showToast } from "../utils/toast";

export const getMenu = createAsyncThunk(
  "DROPANALYSIS/getMenu",
  async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.GET_MENU_DROP_DOWN_DATA());
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getStatus = createAsyncThunk(
  "DROPANALYSIS/getStatus",
  async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.GET_ALL_STATUS());
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getSubMenu = createAsyncThunk(
  "DROPANALYSIS/getSubMenu",
  async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.GET_SUB_MENU(payload));
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getLeadsList = createAsyncThunk(
  "DROPANALYSIS/getLeadsList",
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

export const getLeadDropList = createAsyncThunk(
  "DROPANALYSIS/getLeaddropList",
  async (payload, { rejectWithValue }) => {    
    const response = await client.get(
      URL.GET_LEADDROP_LIST(
        payload.branchId,
        payload.empName,
        payload.orgId,
        payload.offset,
        payload.limit,
        payload.startdate,
        payload.enddate
      )
    );
    const json = await response.json();
    
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);
export const getMoreLeadDropList = createAsyncThunk(
  "DROPANALYSIS/getMoreLeaddropList",
  async (payload, { rejectWithValue }) => {
    const response = await client.get(
      URL.GET_LEADDROP_LIST(
        payload.branchId,
        payload.empName,
        payload.orgId,
        payload.offset,
        payload.limit
      )
    );
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const updateSingleApproval = createAsyncThunk(
  "DROPANALYSIS/updateSingleApproval",
  async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.UPDATE_SINGLEAPPROVAL(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const leadStatusDropped = createAsyncThunk(
  "DROPANALYSIS/leadStatusDropped",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(
      `${URL.LEAD_DROPPED()}/${payload.leadDropId}`,
      {}
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const revokeDrop = createAsyncThunk(
  "DROPANALYSIS/revokeDrop",
  async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.REVOKE(payload["leadId"]));
    // const json = await response.json()


    if (!response.ok) {
      return rejectWithValue(response);
    }
    return response;
  }
);

export const updateBulkApproval = createAsyncThunk(
  "DROPANALYSIS/updateBulkApproval",
  async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.UPDATE_BULKAPPROVAL(), payload);
    const json = await response.json();
    
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getDropAnalysisFilter = createAsyncThunk(
  "DROPANALYSIS/getDropAnalysisFilter",
  async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.DROP_ANALYSIS_LIST_FILTER(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);
const leaddropListSlice = createSlice({
  name: "DROPANALYSIS",
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
    leadList: [],
    defualtStatus: [],
  },
  reducers: {
    clearLeadDropState :(state, action) => {
      state.leadDropList= [],
      state.pageNumber= 0,
      state.totalPages= 1,
      state.isLoading= false,
      state.isLoadingExtraData= false,
      state.status= "",
      state.approvalStatus= "",
      state.subMenu= [],
      state.menu= [],
      state.leadList= [],
      state.defualtStatus= []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMenu.pending, (state, action) => {
      state.menu = [];
    });
    builder.addCase(getMenu.fulfilled, (state, action) => {
      state.menu = action.payload;
    });
    builder.addCase(getMenu.rejected, (state, action) => {
      state.menu = [];
    });
    builder.addCase(getSubMenu.pending, (state, action) => {
      state.subMenu = [];
    });
    builder.addCase(getSubMenu.fulfilled, (state, action) => {
      state.subMenu = action.payload;
    });
    builder.addCase(getSubMenu.rejected, (state, action) => {
      state.subMenu = [];
    });
    builder.addCase(getStatus.pending, (state, action) => {
      state.defualtStatus = [];
    });
    builder.addCase(getStatus.fulfilled, (state, action) => {
      state.defualtStatus = action.payload;
    });
    builder.addCase(getStatus.rejected, (state, action) => {
      state.defualtStatus = [];
    });
    builder.addCase(getLeadDropList.pending, (state, action) => {
      state.totalPages = 1;
      state.pageNumber = 0;
      state.leadDropList = [];
      state.isLoading = true;
    });
    builder.addCase(getLeadDropList.fulfilled, (state, action) => {
      const dmsLeadDropInfos = action.payload.dmsLeadDropInfos;
     
      state.totalPages = 1;
      state.pageNumber = 0;
      state.leadDropList = [];
      if (dmsLeadDropInfos) {
        state.totalPages = dmsLeadDropInfos.totalPages;
        state.pageNumber = dmsLeadDropInfos.pageable.pageNumber;
        state.leadDropList = dmsLeadDropInfos.content;
       
      }
      state.isLoading = false;
      state.status = "sucess";
    });
    builder.addCase(getLeadDropList.rejected, (state, action) => {

      state.totalPages = 1;
      state.pageNumber = 0;
      state.leadDropList = [];
      state.isLoading = false;
      state.status = "failed";
    });
    builder.addCase(getLeadsList.pending, (state, action) => {
      state.leadList = [];
    });
    builder.addCase(getLeadsList.fulfilled, (state, action) => {
      state.leadList = action.payload;
    });
    builder.addCase(getLeadsList.rejected, (state, action) => {
      state.leadList = [];
    });
    builder.addCase(getMoreLeadDropList.pending, (state) => {
      state.totalPages = 1;
      state.pageNumber = 0;
      state.isLoadingExtraData = true;
    });
    builder.addCase(getMoreLeadDropList.fulfilled, (state, action) => {

      const dmsLeadDropInfos = action.payload?.dmsLeadDropInfos;
      state.totalPages = 1;
      state.pageNumber = 0;
      if (dmsLeadDropInfos) {
        state.totalPages = dmsLeadDropInfos.totalPages;
        state.pageNumber = dmsLeadDropInfos.pageable.pageNumber;
        const content = dmsLeadDropInfos.content;
        state.leadDropList = [...state.leadDropList, ...content];
      }
      state.status = "sucess";
      state.isLoadingExtraData = false;
    });
    builder.addCase(getMoreLeadDropList.rejected, (state, action) => {
      state.isLoadingExtraData = false;
      state.status = "failed";
    });

    builder.addCase(updateSingleApproval.pending, (state) => {});
    builder.addCase(updateSingleApproval.fulfilled, (state, action) => {
      const status = action.payload?.status;
      // if (status === 'SUCCESS') {
      //     showToast("Successfully updated");

      // }
      state.isLoadingExtraData = false;
      state.approvalStatus = "sucess";
    });
    builder.addCase(updateSingleApproval.rejected, (state, action) => {});
    
    builder.addCase(leadStatusDropped.pending, (state) => {});
    builder.addCase(leadStatusDropped.fulfilled, (state, action) => {});
    builder.addCase(leadStatusDropped.rejected, (state, action) => {});

    builder.addCase(revokeDrop.pending, (state) => {});
    builder.addCase(revokeDrop.fulfilled, (state, action) => {
    });
    builder.addCase(revokeDrop.rejected, (state, action) => {});

    builder.addCase(updateBulkApproval.pending, (state) => {});
    builder.addCase(updateBulkApproval.fulfilled, (state, action) => {
      
      if (action.payload.length > 0) {
        showToast("Successfully updated");
        state.approvalStatus = "sucess";
      }
      // const status = action.payload?.status;
      // if (status === 'SUCCESS') {

      // }
      // state.isLoadingExtraData = false;
      
    });
    builder.addCase(updateBulkApproval.rejected, (state, action) => {
      state.approvalStatus = "failed";
    });

    builder.addCase(getDropAnalysisFilter.pending, (state) => {
      state.totalPages = 1;
      state.pageNumber = 0;
      state.leadDropList = [];
      state.isLoading = true;
    });
    builder.addCase(getDropAnalysisFilter.fulfilled, (state, action) => {
      const dmsLeadDropInfos = action.payload.dmsLeadDropInfos;

      state.totalPages = 1;
      state.pageNumber = 0;
      state.leadDropList = [];
      if (dmsLeadDropInfos) {
        state.totalPages = dmsLeadDropInfos.totalPages;
        state.pageNumber = dmsLeadDropInfos.pageable.pageNumber;
        state.leadDropList = dmsLeadDropInfos.content;

      }
      state.isLoading = false;
      state.status = "sucess";
      
    });
    builder.addCase(getDropAnalysisFilter.rejected, (state, action) => {
      state.totalPages = 1;
      state.pageNumber = 0;
      state.leadDropList = [];
      state.isLoading = false;
      state.status = "failed";
    });
  },
});

export const { clearLeadDropState } = leaddropListSlice.actions;
export default leaddropListSlice.reducer;
