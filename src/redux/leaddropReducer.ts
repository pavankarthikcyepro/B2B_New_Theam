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
    
    if(response.ok){
      if (payload[0].dmsLeadDropInfo.status ==="APPROVED"){
        showToast("Successfully approved");
      } else if (payload[0].dmsLeadDropInfo.status === "REJECTED"){
        showToast("Successfully rejected");
      }
    }
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const updateLeadStage = createAsyncThunk(
  "DROPANALYSIS/updateLeadStage",
  async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.UPDATE_DROP_STAGE(), payload);
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

export const getDropAnalysisRedirections  = createAsyncThunk(
  "DROPANALYSIS/getDropAnalysisRedirections",
  async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.DROP_ANALYSIS_LIST_REDIRECTIONS(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getDropAnalysisRedirectionsCRM = createAsyncThunk(
  "DROPANALYSIS/getDropAnalysisRedirectionsCRM",
  async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.DROP_ANALYSIS_LIST_REDIRECTIONS_CRM(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getDropAnalysisRedirectionsXrole = createAsyncThunk(
  "DROPANALYSIS/getDropAnalysisRedirectionsXrole",
  async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.DROP_ANALYSIS_LIST_REDIRECTIONS_XROLE(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getDropAnalysisSalesHome = createAsyncThunk(
  "DROPANALYSIS/getDropAnalysisSalesHome",
  async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.DROP_ANALYSIS_LIST_REDIRECTIONS_SALESHOME(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getDropAnalysisReceptionistVol2 = createAsyncThunk(
  "DROPANALYSIS/getDropAnalysisReceptionistVol2",
  async (payload, { rejectWithValue }) => {

    const response = await client.post(URL.DROP_ANALYSIS_LIST_RECEPTIONIST_VOL2(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getdropstagemenu = createAsyncThunk(
  "DROPANALYSIS/getdropstagemenu",
  async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.GET_DROPSTAGE_MENU(payload));
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);


export const getDropstagesubmenu = createAsyncThunk(
  "DROPANALYSIS/getDropstagesubmenu",
  async (payload, { rejectWithValue }) => {

    const response = await client.get(URL.GET_DROP_SUBMENU(payload));
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
    dropStageMenus:[],
    dropStageSubMenus: [],
    updateLeadStage:""
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
      state.defualtStatus= [],
        state.dropStageMenus = [],
        state.dropStageSubMenus = [],
        state.updateLeadStage = ""
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
        // showToast("Successfully updated");
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


    builder.addCase(updateLeadStage.pending, (state) => { state.updateLeadStage = "pending"; });
    builder.addCase(updateLeadStage.fulfilled, (state, action) => {

      // if (action.payload.length > 0) {
        // showToast("Successfully updated");
        state.updateLeadStage = "sucess";
      // }
      // const status = action.payload?.status;
      // if (status === 'SUCCESS') {

      // }
      // state.isLoadingExtraData = false;

    });
    builder.addCase(updateLeadStage.rejected, (state, action) => {
      state.updateLeadStage = "failed";
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


    builder.addCase(getDropAnalysisRedirections.pending, (state) => {
      state.totalPages = 1;
      state.pageNumber = 0;
      state.leadDropList = [];
      state.isLoading = true;
    });
    builder.addCase(getDropAnalysisRedirections.fulfilled, (state, action) => {
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
    builder.addCase(getDropAnalysisRedirections.rejected, (state, action) => {
      state.totalPages = 1;
      state.pageNumber = 0;
      state.leadDropList = [];
      state.isLoading = false;
      state.status = "failed";
    });



    builder.addCase(getDropAnalysisRedirectionsCRM.pending, (state) => {
      state.totalPages = 1;
      state.pageNumber = 0;
      state.leadDropList = [];
      state.isLoading = true;
    });
    builder.addCase(getDropAnalysisRedirectionsCRM.fulfilled, (state, action) => {
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
    builder.addCase(getDropAnalysisRedirectionsCRM.rejected, (state, action) => {
      state.totalPages = 1;
      state.pageNumber = 0;
      state.leadDropList = [];
      state.isLoading = false;
      state.status = "failed";
    });



    builder.addCase(getDropAnalysisRedirectionsXrole.pending, (state) => {
      state.totalPages = 1;
      state.pageNumber = 0;
      state.leadDropList = [];
      state.isLoading = true;
    });
    builder.addCase(getDropAnalysisRedirectionsXrole.fulfilled, (state, action) => {
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
    builder.addCase(getDropAnalysisRedirectionsXrole.rejected, (state, action) => {
      state.totalPages = 1;
      state.pageNumber = 0;
      state.leadDropList = [];
      state.isLoading = false;
      state.status = "failed";
    });




    builder.addCase(getDropAnalysisSalesHome.pending, (state) => {
      state.totalPages = 1;
      state.pageNumber = 0;
      state.leadDropList = [];
      state.isLoading = true;
    });
    builder.addCase(getDropAnalysisSalesHome.fulfilled, (state, action) => {
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
    builder.addCase(getDropAnalysisSalesHome.rejected, (state, action) => {
      state.totalPages = 1;
      state.pageNumber = 0;
      state.leadDropList = [];
      state.isLoading = false;
      state.status = "failed";
    });



    builder.addCase(getDropAnalysisReceptionistVol2.pending, (state) => {
      state.totalPages = 1;
      state.pageNumber = 0;
      state.leadDropList = [];
      state.isLoading = true;
    });
    builder.addCase(getDropAnalysisReceptionistVol2.fulfilled, (state, action) => {
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
    builder.addCase(getDropAnalysisReceptionistVol2.rejected, (state, action) => {
      state.totalPages = 1;
      state.pageNumber = 0;
      state.leadDropList = [];
      state.isLoading = false;
      state.status = "failed";
    });



    builder.addCase(getdropstagemenu.pending, (state) => {
      state.dropStageMenus =[];
    });
    builder.addCase(getdropstagemenu.fulfilled, (state, action) => {
      state.dropStageMenus = action.payload;

    });
    builder.addCase(getdropstagemenu.rejected, (state, action) => {
      state.dropStageMenus =[];
    });


    builder.addCase(getDropstagesubmenu.pending, (state) => {
      state.dropStageSubMenus = [];
    });
    builder.addCase(getDropstagesubmenu.fulfilled, (state, action) => {
      state.dropStageSubMenus = action.payload;

    });
    builder.addCase(getDropstagesubmenu.rejected, (state, action) => {
      state.dropStageSubMenus = [];
    });


  },
});

export const { clearLeadDropState } = leaddropListSlice.actions;
export default leaddropListSlice.reducer;
