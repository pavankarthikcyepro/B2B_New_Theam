import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";
import * as AsyncStore from "../asyncStore";
import empData from "../get_target_params_for_emp.json";
import allData from "../get_target_params_for_all_emps.json";
import targetData from "../get_target_params.json";
import { showToast } from "../utils/toast";

const data = [
  {
    title: "Pre-Enquiry",
    count: 12,
  },
  {
    title: "My Task",
    count: 10,
  },
];

const dates = [
  {
    month: "MAY",
    date: 1,
    day: "Mon",
  },
  {
    month: "MAY",
    date: 2,
    day: "Tue",
  },
  {
    month: "MAY",
    date: 3,
    day: "Wed",
  },
  {
    month: "MAY",
    date: 4,
    day: "Thu",
  },
  {
    month: "MAY",
    date: 5,
    day: "Fri",
  },
];

export const getMenuList = createAsyncThunk(
  "HOME/getMenuList",
  async (name, { rejectWithValue }) => {
    const response = await client.get(URL.MENULIST_API(name));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getOrganaizationHirarchyList = createAsyncThunk(
  "HOME/getOrganaizationHirarchyList",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.get(
      URL.ORG_HIRARCHY(payload.orgId, payload.empId)
    );
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getCustomerTypeList = createAsyncThunk(
  "HOME/getCustomerTypeList",
  async (ordId, { rejectWithValue }) => {
    const response = await client.get(URL.CUSTOMER_TYPE(ordId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getSourceOfEnquiryList = createAsyncThunk(
  "HOME/getSourceOfEnquiryList",
  async (orgId, { rejectWithValue }) => {
    const response = await client.get(URL.GET_SOURCE_OF_ENQUIRY(orgId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getVehicalModalList = createAsyncThunk(
  "HOME/getVehicalModalList",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(URL.GET_VEHICAL_MODAL(), payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getLeadSourceTableList = createAsyncThunk(
  "HOME/getLeadSourceTableList",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(URL.LEAD_SOURCE_DATA(), payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getVehicleModelTableList = createAsyncThunk(
  "HOME/getVehicleModelTableList",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(URL.VEHICLE_MODEL_DATA(), payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getEventTableList = createAsyncThunk(
  "HOME/getEventTableList",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(URL.EVENT_DATA(), payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getTaskTableList = createAsyncThunk(
  "HOME/getTaskTableList",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(URL.TASKS_DATA(), payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getLostDropChartData = createAsyncThunk(
  "HOME/getLostDropChartData",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(URL.GET_LOST_DROP_CHART_DATA(), payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getTargetParametersData = createAsyncThunk(
  "HOME/getTargetParametersData",
  async (payload: any, { rejectWithValue }) => {
    if (payload.isTeamPresent) {
      delete payload.isTeamPresent;
    }
    const response = await client.post(URL.GET_TARGET_PARAMS(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getTargetParametersAllData = createAsyncThunk(
  "HOME/getTargetParametersAllData",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(URL.GET_TARGET_PARAMS_ALL(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getNewTargetParametersAllData = createAsyncThunk(
  "HOME/getNewTargetParametersAllData",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(URL.GET_TEAMS_TARGET_PARAMS(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getTotalTargetParametersData = createAsyncThunk(
  "HOME/getTotalTargetParametersData",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(URL.GET_TARGET_PARAMS(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getUserWiseTargetParameters = createAsyncThunk(
  "HOME/getUserWiseTargetParameters",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(URL.GET_TEAMS_TARGET_PARAMS(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getUserWiseTargetParameters2 = createAsyncThunk(
  "HOME/getUserWiseTargetParameters2",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(URL.GET_TEAMS_EVENT_PARAMS(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getTotalOftheTeam = createAsyncThunk(
  "HOME/getTotalOftheTeam",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(URL.GET_TOTAL_OF_TEAM(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getTargetParametersEmpDataInsights = createAsyncThunk(
  "HOME/getTargetParametersEmpDataInsights",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(URL.GET_TOTAL_TARGET_PARAMS(), payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getTargetParametersEmpData = createAsyncThunk(
  "HOME/getTargetParametersEmpData",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(URL.GET_TARGET_PARAMS_EMP(), payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;

    // if(payload.isTeamPresent == true){
    //   const url1 = URL.GET_TOTAL_TARGET_PARAMS();
    //   const response = await client.post(url1, payload);
    //   const json = await response.json();

    //       delete payload.isTeamPresent;

    //   if (!response.ok) {
    //     return rejectWithValue(json);
    //   }
    //   return json;
    // }
    // else if(payload.isTeamPresent == false){
    //  const url1 = URL.GET_TARGET_PARAMS_EMP();
    //  const response = await client.post(url1, payload);
    //  const json = await response.json();
    //  delete payload.isTeamPresent;
    //  if (!response.ok) {
    //    return rejectWithValue(json);
    //  }
    //  return json;
    // }
  }
);

export const getGroupDealerRanking = createAsyncThunk(
  "HOME/getGroupDealerRanking",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(
      URL.GET_TARGET_GROUP_RANKING(payload.orgId),
      payload.payload
    );
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getDealerRanking = createAsyncThunk(
  "HOME/getDealerRanking",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(
      URL.GET_TARGET_RANKING(payload.orgId, payload.branchId),
      payload.payload
    );
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getEmployeesDropDownData = createAsyncThunk(
  "HOME/getEmployeesDropDownData",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(
      URL.GET_EMPLOYEES_DROP_DOWN_DATA(payload.orgId, payload.empId),
      payload.selectedIds
    );
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getCRMEmployeesDropDownData = createAsyncThunk(
  "HOME/getCRMEmployeesDropDownData",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(
      URL.GET_CRM_EMPLOYEES_DROP_DOWN_DATA(payload.orgId, payload.empId),
      payload.selectedIds
    );
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);
export const getSalesData = createAsyncThunk(
  "HOME/getSalesData",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(URL.GET_SALES_DATA(), payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getSalesComparisonData = createAsyncThunk(
  "HOME/getSalesComparisonData",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(
      URL.GET_SALES_COMPARISON_DATA(),
      payload
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getBranchIds = createAsyncThunk(
  "HOME/getBranchIds",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.get(URL.GET_BRANCH());
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const downloadFile = createAsyncThunk(
  "HOME/downloadFile",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(URL.DOWNLOAD_FILE(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const updateIsTeam = createAsyncThunk(
  "HOME/updateIsTeam",
  async (payload: any) => {
    return payload;
  }
);

export const updateIsModalVisible = createAsyncThunk(
  "HOME/updateIsModalVisible",
  async (payload: any) => {
    return payload;
  }
);

export const updateTheTeamAttendanceFilter = createAsyncThunk(
  "HOME/updateTheTeamAttendanceFilter",
  async (payload: any) => {
    return payload;
  }
);
export const updateTheTeamAttendanceFilterDate = createAsyncThunk(
  "HOME/updateTheTeamAttendanceFilterDate",
  async (payload: any) => {
    return payload;
  }
);

export const getEmployeesList = createAsyncThunk(
  "HOME/getEmployeesList",
  async (payload, { rejectWithValue }) => {
    const response = await client.get(URL.GET_EMPLOYEE_LIST(payload["empId"]));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getDeptDropdown = createAsyncThunk(
  "TASK_TRANSFER/getDeptDropdown",
  async (payload, { rejectWithValue }) => {
    const response = await client.get(
      URL.TARGET_DROPDOWN(
        payload["orgId"],
        payload["parent"],
        payload["child"],
        payload["parentId"]
      )
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getDesignationDropdown = createAsyncThunk(
  "TASK_TRANSFER/getDesignationDropdown",
  async (payload, { rejectWithValue }) => {
    const response = await client.get(
      URL.TARGET_DROPDOWN(
        payload["orgId"],
        payload["parent"],
        payload["child"],
        payload["parentId"]
      )
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getReportingManagerList = createAsyncThunk(
  "HOME/getReportingManagerList",
  async (orgID, { rejectWithValue }) => {
    const response = await client.get(URL.GET_REPORTING_MANAGER_LIST(orgID));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const delegateTask = createAsyncThunk(
  "HOME/delegateTask",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(
      URL.TRANSFER_TASK(payload["fromUserId"], payload["toUserId"]),
      {
        fromEmpId: payload["fromUserId"].toString(),
        toEmpId: payload["toUserId"].toString(),
      }
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const updateEmployeeDataBasedOnDelegate = createAsyncThunk(
  "HOME/updateEmployeeDataBasedOnDelegate",
  async (body, { rejectWithValue }) => {
    const response = await client.put(
      URL.EMPLOYEE_DATA_UPDATE(body["empID"], body["managerID"])
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getLeaderBoardList = createAsyncThunk(
  "HOME/getLeaderBoardList",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(
      URL.GET_LEADERBOARD_DATA_branch(payload.orgId, payload.branchId),
      payload
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getLeaderBoardListWithoutFilter = createAsyncThunk(
  "HOME/getLeaderBoardListWithoutFilter",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.post(
      URL.GET_DEALER_RANKING_DATA(payload.orgId),
      payload
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getBranchRanksList = createAsyncThunk(
  "HOME/getBranchRanksList",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(
      URL.GET_BRANCH_RANKING_DATA_branch(payload.orgId, payload.branchId),
      payload
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getEventSourceModel = createAsyncThunk(
  "HOME/getEventSourceModel",
  async (data: any, { rejectWithValue }) => {
    const { type, payload, key } = data;
    const url = URL.EVENT_DASHBOARD();

    const response = await client.post(url, payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getEventSourceModelForSelf = createAsyncThunk(
  "HOME/getEventSourceModelForSelf",
  async (data: any, { rejectWithValue }) => {
    const { type, payload, key } = data;
    const url = URL.EVENT_DASHBOARD();

    const response = await client.post(url, payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getBranchRanksListWithoutFilter = createAsyncThunk(
  "HOME/getBranchRanksListWithoutFilter",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(
      URL.GET_TARGET_RANKING(payload.orgId, payload.branchId),
      payload
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);
export const getSourceModelDataForSelf = createAsyncThunk(
  "HOME/getSourceModelDataForSelf",
  async (data: any, { rejectWithValue }) => {
    const { type, payload, key } = data;
    const url =
      type === "SELF"
        ? key == "LIVE-LEADS"
          ? URL.GET_LIVE_LEADS_MODEL_SOURCE_SELF()
          : URL.GET_TOTAL_TARGET_PARAMS() + "_model_source"
        : type === "INSIGHTS"
        ? key == "LIVE-LEADS"
          ? URL.GET_LIVE_LEADS_MODEL_SOURCE_INSIGHTS()
          : URL.GET_TOTAL_TARGET_PARAMS() + "_model_source"
        : key == "LIVE-LEADS"
        ? URL.GET_LIVE_LEADS_INSIGHTS() + "_model_source"
        : URL.GET_TOTAL_TARGET_PARAMS() + "_model_source";

    const response = await client.post(url, payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getSourceModelDataForInsights = createAsyncThunk(
  "HOME/getSourceModelDataForInsights",
  async (data: any, { rejectWithValue }) => {
    const payload = data.payload;

    const response = await client.post(URL.MODEL_SOURCE_INSIGHTS(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getSourceModelDataForTeam = createAsyncThunk(
  "HOME/getSourceModelDataForTeam",
  async (data: any, { rejectWithValue }) => {
    const payload = data.payload;

    const response = await client.post(URL.MODEL_SOURCE_TEAM(), payload);
    const json = await response.json();

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getReceptionistData = createAsyncThunk(
  "HOME/getReceptionistData",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(URL.RECEPTIONIST_DASHBOARD(), payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getReceptionistManagerData = createAsyncThunk(
  "HOME/getReceptionistManagerData",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(
      URL.RECEPTIONIST_MANAGER_DASHBOARD(),
      payload
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getCRM_ReceptionistManagerData = createAsyncThunk(
  "HOME/getCRM_ReceptionistManagerData",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(
      URL.RECEPTIONIST_MANAGER_DASHBOARD_CRM(),
      payload
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getReceptionistSource = createAsyncThunk(
  "HOME/getReceptionistSource",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(URL.RECEPTIONIST_SOURCE(), payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getReceptionistModel = createAsyncThunk(
  "HOME/getReceptionistModel",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(URL.RECEPTIONIST_MODEL(), payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getReceptionistManagerSource = createAsyncThunk(
  "HOME/getReceptionistManagerSource",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(
      URL.RECEPTIONIST_MANAGER_SOURCE(),
      payload
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getReceptionistManagerModel = createAsyncThunk(
  "HOME/getReceptionistManagerModel",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(
      URL.RECEPTIONIST_MANAGER_MODEL(),
      payload
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

const AVAILABLE_SCREENS = [
  {
    menuId: 81,
    displayName: "EMS",
  },
  {
    menuId: 100,
    displayName: "Event Management",
  },
];

export const homeSlice = createSlice({
  name: "HOME",
  initialState: {
    serchtext: "",
    employeeId: "",
    tableData: data,
    datesData: dates,
    menuList: [],
    vehicle_model_list_for_filters: [],
    customer_type_list: [],
    source_of_enquiry_list: [],
    dateSelectedIndex: 0,
    login_employee_details: {},
    filter_drop_down_data: [],
    lead_source_table_data: [],
    vehicle_model_table_data: [],
    events_table_data: [],
    task_table_data: {},
    lost_drop_chart_data: {},
    employees_drop_down_data: {},
    target_parameters_data: targetData,
    all_target_parameters_data: allData.overallTargetAchivements,
    // all_emp_parameters_data: allData.employeeTargetAchievements,
    all_emp_parameters_data: [],
    org_is_loading: false,
    emp_is_loading: false,
    sales_data: {},
    sales_comparison_data: [],
    branchesList: [],
    allGroupDealerData: [],
    allDealerData: [],
    isTeam: false,
    isTeamPresent: false,
    isMD: false,
    isRankHide: false,
    isDSE: false,
    self_target_parameters_data: empData,
    insights_target_parameters_data: empData,
    totalParameters: [],
    employee_list: [],
    reporting_manager_list: [],
    isLoading: false,
    isEventLoading: false,
    leaderboard_list: [],
    branchrank_list: [],
    designationList: [],
    deptList: [],
    sourceModelData: [],
    eventSourceModelForSelf: [],
    isModalVisible: false,
    bannerList: [],
    receptionistData: {
      RetailCount: 0,
      bookingsCount: 0,
      consultantList: [],
      totalAllocatedCount: 0,
      totalDroppedCount: 0,
      contactsCount: 0,
      enquirysCount: 0,
      totalLostCount: 0,
      fullResponse: "",
    },
    receptionistModel: [],
    receptionistSource: [],
    selectedIDS: [],
    selectedDate: {},
    filterIds: {
      startDate: "",
      endDate: "",
      levelSelected: [],
      empSelected: [],
      allEmpSelected: [],
      employeeName: [],
    },
    leaderShipFIlterId: [],
    receptionistFilterIds: [],
    crm_employees_drop_down_data: {},
    dealerFilter: {},
    filterPayload: {},
    filterSelectedData: {},
    levelSelected: [],
    saveCRMfilterObj: {
      startDate: "",
      endDate: "",
      levelSelected: "",
      selectedempId: "",
      dealerCodes: "",
    },
    newUpdateAvailable: false,
  },
  reducers: {
    dateSelected: (state, action) => {
      state.dateSelectedIndex = action.payload;
    },
    updateFilterDropDownData: (state, action) => {
      state.filter_drop_down_data = action.payload;
    },
    updateLeaderShipFilter: (state, action) => {
      state.leaderShipFIlterId = action.payload;
    },
    updateReceptionistFilterids: (state, action) => {
      state.receptionistFilterIds = action.payload;
    },
    updateFilterIds: (state, action) => {
      state.filterIds = action.payload;
    },
    updateEmpDropDown: (state, action) => {
      state.employees_drop_down_data = {};
    },
    updateIsTeamPresent: (state, action) => {
      state.isTeamPresent = action.payload;
    },
    updateIsMD: (state, action) => {
      state.isMD = action.payload;
    },
    updateIsRankHide: (state, action) => {
      state.isRankHide = action.payload;
    },
    updateIsDSE: (state, action) => {
      state.isDSE = action.payload;
    },
    SetNewUpdateAvailable: (state, action) => {
      state.newUpdateAvailable = action.payload;
    },
    updateTargetData: (state, action) => {
      state.target_parameters_data = action.payload.targetData;
      state.all_target_parameters_data = action.payload.allTargetData;
      // state.all_emp_parameters_data = action.payload.allEmpData;
      if (state.isDSE) {
        state.self_target_parameters_data = action.payload.empData;
      } else {
        state.insights_target_parameters_data = action.payload.empData;
      }
    },
    updateDealerFilterData: (state, action) => {
      state.dealerFilter = action.payload;
    },
    updateFilterSelectedData: (state, action) => {
      state.filterSelectedData = action.payload;
    },
    updateFilterLevelSelectedData: (state, action) => {
      state.levelSelected = action.payload;
    },
    updateLiveLeadObjectData: (state, action) => {
      state.saveCRMfilterObj = action.payload;
    },
    clearState: (state, action) => {
      state.serchtext = "";
      state.employeeId = "";
      state.tableData = data;
      state.datesData = dates;
      state.menuList = [];
      state.bannerList = [];
      state.vehicle_model_list_for_filters = [];
      state.customer_type_list = [];
      state.source_of_enquiry_list = [];
      state.dateSelectedIndex = 0;
      state.login_employee_details = {};
      state.filter_drop_down_data = [];
      // state.filterIds = {},
      state.lead_source_table_data = [];
      state.vehicle_model_table_data = [];
      state.events_table_data = [];
      state.task_table_data = {};
      state.lost_drop_chart_data = {};
      state.employees_drop_down_data = {};
      state.target_parameters_data = targetData;
      state.all_target_parameters_data = allData.overallTargetAchivements;
      // state.all_emp_parameters_data = allData.employeeTargetAchievements
      state.all_emp_parameters_data = [];
      state.org_is_loading = false;
      state.emp_is_loading = false;
      state.sales_data = {};
      state.sales_comparison_data = [];
      state.branchesList = [];
      state.allGroupDealerData = [];
      state.allDealerData = [];
      state.isTeam = false;
      state.isTeamPresent = false;
      state.isMD = false;
      state.isRankHide = false;
      state.isDSE = false;
      state.employee_list = [];
      state.reporting_manager_list = [];
      state.isLoading = false;
      state.isEventLoading = false;
      state.leaderboard_list = [];
      state.branchrank_list = [];
      state.self_target_parameters_data = empData;
      state.insights_target_parameters_data = empData;
      state.receptionistData = {
        RetailCount: 0,
        bookingsCount: 0,
        consultantList: [],
        totalAllocatedCount: 0,
        totalDroppedCount: 0,
        contactsCount: 0,
        enquirysCount: 0,
        totalLostCount: 0,
        fullResponse: "",
      };
      state.filterIds = {
        startDate: "",
        endDate: "",
        levelSelected: [],
        empSelected: [],
        allEmpSelected: [],
        employeeName: [],
      };
      state.leaderShipFIlterId = [];
      state.receptionistFilterIds = [];
      state.crm_employees_drop_down_data = {};
      // state.dealerFilter= { }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMenuList.pending, (state, action) => {
        state.branchesList = [];
      })
      .addCase(getMenuList.fulfilled, (state, action) => {
        const dmsEntityObj = action.payload.dmsEntity;
        const menuList = dmsEntityObj.menuList;
        const { banners } = dmsEntityObj;

        if (banners.length > 0) {
          state.bannerList = banners;
        }

        if (menuList.length > 0) {
          let newMenuList = [];
          menuList.forEach((item) => {
            newMenuList.push({
              screen: item.menuId,
              title: item.displayName,
            });
          });
          state.menuList = newMenuList;
        }

        const empId = dmsEntityObj.loginEmployee.empId;
        AsyncStore.storeData(AsyncStore.Keys.EMP_ID, empId.toString());
        state.login_employee_details = dmsEntityObj.loginEmployee;
        AsyncStore.storeData(
          AsyncStore.Keys.LOGIN_EMPLOYEE,
          JSON.stringify(dmsEntityObj.loginEmployee)
        );
        state.employeeId = empId;
        state.branchesList = dmsEntityObj.loginEmployee.branchs;
        AsyncStore.storeData(
          "BRANCHES_DATA",
          JSON.stringify(dmsEntityObj.loginEmployee.branchs)
        );
      })
      .addCase(getMenuList.rejected, (state, action) => {
        state.branchesList = [];
      })
      .addCase(updateIsTeam.fulfilled, (state, action) => {
        state.isTeam = action.payload;
      })
      .addCase(updateIsModalVisible.fulfilled, (state, action) => {
        state.isModalVisible = action.payload;
      })
      .addCase(updateTheTeamAttendanceFilter.fulfilled, (state, action) => {
        state.selectedIDS = action.payload;
      })
      .addCase(updateTheTeamAttendanceFilterDate.fulfilled, (state, action) => {
        state.selectedDate = action.payload;
      })
      .addCase(getCustomerTypeList.fulfilled, (state, action) => {
        const data = action.payload;
        let typeList = [];
        data.forEach((item) => {
          typeList.push({ id: item.id, name: item.customerType });
        });
        state.customer_type_list = typeList;
      })
      // Get Source of Enquiry List
      .addCase(getSourceOfEnquiryList.pending, (state, action) => {
        state.source_of_enquiry_list = [];
      })
      .addCase(getSourceOfEnquiryList.fulfilled, (state, action) => {
        if (action.payload) {
          const sourceList = action.payload;
          let modalList = [];
          if (sourceList.length > 0) {
            sourceList.forEach((item) => {
              modalList.push({ ...item, isChecked: false });
            });
          }
          state.source_of_enquiry_list = modalList;
        }
      })
      .addCase(getSourceOfEnquiryList.rejected, (state, action) => {
        state.source_of_enquiry_list = [];
      })
      // Get Vehical Modal List
      .addCase(getVehicalModalList.pending, (state, action) => {
        state.vehicle_model_list_for_filters = [];
      })
      .addCase(getVehicalModalList.fulfilled, (state, action) => {
        if (action.payload) {
          const modalList = action.payload;
          let sourceList = [];
          if (modalList.length > 0) {
            modalList.forEach((item) => {
              sourceList.push({ ...item, isChecked: false });
            });
          }
          state.vehicle_model_list_for_filters = modalList;
        }
      })
      .addCase(getVehicalModalList.rejected, (state, action) => {
        state.vehicle_model_list_for_filters = [];
      })
      // Get Filter Dropdown list
      .addCase(getOrganaizationHirarchyList.pending, (state, action) => {})
      .addCase(getOrganaizationHirarchyList.fulfilled, (state, action) => {
        if (action.payload) {
          state.filter_drop_down_data = action.payload;
        }
      })
      .addCase(getOrganaizationHirarchyList.rejected, (state, action) => {})
      // Get Lead Source Table List
      .addCase(getLeadSourceTableList.pending, (state, action) => {
        state.lead_source_table_data = [];
      })
      .addCase(getLeadSourceTableList.fulfilled, (state, action) => {
        if (action.payload) {
          state.lead_source_table_data = action.payload;
        }
      })
      .addCase(getLeadSourceTableList.rejected, (state, action) => {
        state.lead_source_table_data = [];
      })
      // Get Vehicle Model Table List
      .addCase(getVehicleModelTableList.pending, (state, action) => {
        state.vehicle_model_table_data = [];
      })
      .addCase(getVehicleModelTableList.fulfilled, (state, action) => {
        if (action.payload) {
          state.vehicle_model_table_data = action.payload;
        }
      })
      .addCase(getVehicleModelTableList.rejected, (state, action) => {
        state.vehicle_model_table_data = [];
      })
      // Get Event Table List
      .addCase(getEventTableList.pending, (state, action) => {
        state.events_table_data = [];
      })
      .addCase(getEventTableList.fulfilled, (state, action) => {
        if (action.payload) {
          state.events_table_data = action.payload;
        }
      })
      .addCase(getEventTableList.rejected, (state, action) => {
        state.events_table_data = [];
      })
      // Get Event Table List
      .addCase(getTaskTableList.pending, (state, action) => {
        state.task_table_data = {};
      })
      .addCase(getTaskTableList.fulfilled, (state, action) => {
        if (action.payload) {
          state.task_table_data = action.payload;
        }
      })
      .addCase(getTaskTableList.rejected, (state, action) => {
        state.task_table_data = {};
      })
      // Get Lost Drop Chart Data
      .addCase(getLostDropChartData.pending, (state, action) => {
        state.lost_drop_chart_data = {};
      })
      .addCase(getLostDropChartData.fulfilled, (state, action) => {
        if (action.payload) {
          state.lost_drop_chart_data = action.payload;
        }
      })
      .addCase(getLostDropChartData.rejected, (state, action) => {
        state.lost_drop_chart_data = {};
      })
      // Get Target Parameters Data
      .addCase(getTargetParametersData.pending, (state, action) => {
        // state.target_parameters_data = [];
      })
      .addCase(getTargetParametersData.fulfilled, (state, action) => {
        if (action.payload) {
          // state.target_parameters_data = [];
          state.target_parameters_data = action.payload;
          AsyncStore.storeData("TARGET_DATA", JSON.stringify(action.payload));
        }
      })
      .addCase(getTargetParametersData.rejected, (state, action) => {
        // state.target_parameters_data = [];
      })
      .addCase(getTargetParametersAllData.pending, (state, action) => {
        // state.all_target_parameters_data = [];
        // state.all_emp_parameters_data = [];
      })
      .addCase(getTargetParametersAllData.fulfilled, (state, action) => {
        if (action.payload) {
          // state.all_target_parameters_data = [];
          // state.all_emp_parameters_data = [];
          state.isTeamPresent =
            action.payload.employeeTargetAchievements.length > 1;
          state.all_target_parameters_data =
            action.payload.overallTargetAchivements;
          state.all_emp_parameters_data =
            action.payload.employeeTargetAchievements;
          AsyncStore.storeData(
            "TARGET_ALL",
            JSON.stringify(action.payload.overallTargetAchivements)
          );
          AsyncStore.storeData(
            "TARGET_EMP_ALL",
            JSON.stringify(action.payload.employeeTargetAchievements)
          );
        }
      })
      .addCase(getTargetParametersAllData.rejected, (state, action) => {
        // state.all_target_parameters_data = [];
        // state.all_emp_parameters_data = [];
      })
      .addCase(getGroupDealerRanking.pending, (state, action) => {
        state.allGroupDealerData = [];
      })
      .addCase(getGroupDealerRanking.fulfilled, (state, action) => {
        if (action.payload) {
          state.allGroupDealerData = action.payload;
        }
      })
      .addCase(getGroupDealerRanking.rejected, (state, action) => {
        state.allGroupDealerData = [];
      })

      .addCase(getDealerRanking.pending, (state, action) => {
        state.allDealerData = [];
      })
      .addCase(getDealerRanking.fulfilled, (state, action) => {
        if (action.payload) {
          state.allDealerData = action.payload;
        }
      })
      .addCase(getDealerRanking.rejected, (state, action) => {
        state.allDealerData = [];
      })

      // Get Employees Drop Down Data
      .addCase(getEmployeesDropDownData.pending, (state, action) => {
        state.employees_drop_down_data = {};
      })
      .addCase(getEmployeesDropDownData.fulfilled, (state, action) => {
        if (action.payload) {
          state.employees_drop_down_data = action.payload;
        }
      })
      .addCase(getEmployeesDropDownData.rejected, (state, action) => {
        state.employees_drop_down_data = {};
      })

      // Get  CRM Employees Drop Down Data
      .addCase(getCRMEmployeesDropDownData.pending, (state, action) => {
        state.crm_employees_drop_down_data = {};
      })
      .addCase(getCRMEmployeesDropDownData.fulfilled, (state, action) => {
        if (action.payload) {
          state.crm_employees_drop_down_data = action.payload;
        }
      })
      .addCase(getCRMEmployeesDropDownData.rejected, (state, action) => {
        state.crm_employees_drop_down_data = {};
      })
      // Get Sales Data
      .addCase(getSalesData.pending, (state, action) => {
        state.sales_data = {};
      })
      .addCase(getSalesData.fulfilled, (state, action) => {
        if (action.payload) {
          state.sales_data = action.payload;
        }
      })
      .addCase(getSalesData.rejected, (state, action) => {
        state.sales_data = {};
      })
      // Get Sales Comparison Data
      .addCase(getSalesComparisonData.pending, (state, action) => {
        state.sales_comparison_data = [];
      })
      .addCase(getSalesComparisonData.fulfilled, (state, action) => {
        if (action.payload) {
          state.sales_comparison_data = action.payload;
        }
      })
      .addCase(getSalesComparisonData.rejected, (state, action) => {
        state.sales_comparison_data = [];
      })
      .addCase(getTargetParametersEmpData.pending, (state, action) => {
        //state.self_target_parameters_data = [];
        state.isLoading = true;
      })
      .addCase(getTargetParametersEmpData.fulfilled, (state, action) => {
        state.isModalVisible = false;
        if (action.payload) {
          state.self_target_parameters_data = action.payload;
          AsyncStore.storeData("TARGET_EMP", JSON.stringify(action.payload));
        } else {
          state.self_target_parameters_data = empData;
        }
        state.isLoading = false;
        state.isModalVisible = true;
      })
      .addCase(getTargetParametersEmpData.rejected, (state, action) => {
        //state.self_target_parameters_data = [];
        state.isLoading = false;
        state.isModalVisible = false;
      })
      .addCase(getTargetParametersEmpDataInsights.pending, (state, action) => {
        //state.self_target_parameters_data = [];
        state.isLoading = true;
      })
      .addCase(
        getTargetParametersEmpDataInsights.fulfilled,
        (state, action) => {
          state.isModalVisible = false;
          if (action.payload) {
            state.insights_target_parameters_data = action.payload;
            AsyncStore.storeData("TARGET_EMP", JSON.stringify(action.payload));
          }
          state.isLoading = false;
          state.isModalVisible = true;
        }
      )
      .addCase(getTargetParametersEmpDataInsights.rejected, (state, action) => {
        //state.self_target_parameters_data = [];
        state.isLoading = false;
        state.isModalVisible = false;
      })

      .addCase(getNewTargetParametersAllData.pending, (state, action) => {
        // state.all_target_parameters_data = [];
        // state.all_emp_parameters_data = [];
      })
      .addCase(getNewTargetParametersAllData.fulfilled, (state, action) => {
        if (action.payload) {
          // state.all_target_parameters_data = [];
          // state.all_emp_parameters_data = [];
          state.isTeamPresent =
            action.payload.employeeTargetAchievements.length > 1;
          state.all_target_parameters_data =
            action.payload.overallTargetAchivements;
          state.all_emp_parameters_data =
            action.payload.employeeTargetAchievements;
          AsyncStore.storeData(
            "TARGET_ALL",
            JSON.stringify(action.payload.overallTargetAchivements)
          );
          AsyncStore.storeData(
            "TARGET_EMP_ALL",
            JSON.stringify(action.payload.employeeTargetAchievements)
          );
        }
      })
      .addCase(getNewTargetParametersAllData.rejected, (state, action) => {
        // state.all_target_parameters_data = [];
        // state.all_emp_parameters_data = [];
      })

      .addCase(getTotalTargetParametersData.pending, (state, action) => {
        if (action.payload) {
          state.totalParameters = action.payload;
        }
      })
      .addCase(getTotalTargetParametersData.fulfilled, (state, action) => {
        if (action.payload) {
          state.totalParameters = action.payload;
        }
      })
      .addCase(getTotalTargetParametersData.rejected, (state, action) => {})

      .addCase(getEmployeesList.pending, (state, action) => {
        // state.employee_list = [];
        state.isLoading = true;
        state.isModalVisible = false;
      })
      .addCase(getEmployeesList.fulfilled, (state, action) => {
        if (action.payload) {
          const dataObj = action.payload;
          // state.employee_list = dataObj ? dataObj.dmsEntity.employees : [];
          state.employee_list = dataObj ? dataObj : [];
          state.isLoading = false;
        }
      })
      .addCase(getEmployeesList.rejected, (state, action) => {
        // state.employee_list = [];
        state.isLoading = false;
      })
      .addCase(getReportingManagerList.pending, (state, action) => {
        // state.reporting_manager_list = [];
        state.isLoading = true;
      })
      .addCase(getReportingManagerList.fulfilled, (state, action) => {
        if (action.payload) {
          const dataObj = action.payload;
          state.reporting_manager_list = dataObj ? dataObj : [];
          state.isLoading = false;
        }
      })
      .addCase(getReportingManagerList.rejected, (state, action) => {
        // state.reporting_manager_list = [];
        state.isLoading = false;
      })
      .addCase(updateEmployeeDataBasedOnDelegate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateEmployeeDataBasedOnDelegate.fulfilled, (state, action) => {
        const dataObj = action.payload;
        state.isLoading = false;
        if (action.payload.success) {
          showToast("Successfully updated");
        }
      })
      .addCase(updateEmployeeDataBasedOnDelegate.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getLeaderBoardList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLeaderBoardList.fulfilled, (state, action) => {
        const dataObj = action.payload;
        state.leaderboard_list = dataObj ? dataObj : [];
        if (!dataObj || dataObj.length === 0) showToast("No data available");
        state.isLoading = false;
      })
      .addCase(getLeaderBoardList.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(getLeaderBoardListWithoutFilter.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLeaderBoardListWithoutFilter.fulfilled, (state, action) => {
        const dataObj = action.payload;
        state.leaderboard_list = dataObj ? dataObj : [];
        if (!dataObj || dataObj.length === 0) showToast("No data available");
        state.isLoading = false;
      })
      .addCase(getLeaderBoardListWithoutFilter.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(getBranchRanksList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBranchRanksList.fulfilled, (state, action) => {
        const dataObj = action.payload;
        state.branchrank_list = dataObj ? dataObj : [];
        if (!dataObj || dataObj.length === 0) showToast("No data available");
        state.isLoading = false;
      })
      .addCase(getBranchRanksList.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(getBranchRanksListWithoutFilter.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBranchRanksListWithoutFilter.fulfilled, (state, action) => {
        const dataObj = action.payload;
        state.branchrank_list = dataObj ? dataObj : [];
        if (!dataObj || dataObj.length === 0) showToast("No data available");
        state.isLoading = false;
      })
      .addCase(getBranchRanksListWithoutFilter.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getSourceModelDataForSelf.pending, (state, action) => {
        state.isLoading = true;
        state.sourceModelData = [];
      })
      .addCase(getSourceModelDataForSelf.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.sourceModelData = action.payload;
        }
      })
      .addCase(getSourceModelDataForSelf.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(getEventSourceModelForSelf.pending, (state, action) => {
        state.isEventLoading = true;
        state.eventSourceModelForSelf = [];
      })
      .addCase(getEventSourceModelForSelf.fulfilled, (state, action) => {
        state.isEventLoading = false;
        if (action.payload) {
          const tmpArr = action.payload;
          tmpArr.sort(function (a, b) {
            return new Date(b.eventDate) - new Date(a.eventDate);
          });
          state.eventSourceModelForSelf = tmpArr.reverse();
        }
      })
      .addCase(getEventSourceModelForSelf.rejected, (state, action) => {
        state.isEventLoading = false;
      })

      .addCase(getEventSourceModel.pending, (state, action) => {
        state.isEventLoading = true;
        state.sourceModelData = [];
      })
      .addCase(getEventSourceModel.fulfilled, (state, action) => {
        state.isEventLoading = false;

        if (action.payload) {
          const tmpArr = action.payload;
          tmpArr.sort(function (a, b) {
            return new Date(b.eventDate) - new Date(a.eventDate);
          });
          state.sourceModelData = tmpArr.reverse();
        }
      })
      .addCase(getEventSourceModel.rejected, (state, action) => {
        state.isEventLoading = false;
      })
      .addCase(getReceptionistData.pending, (state) => {})
      .addCase(getReceptionistData.fulfilled, (state, action) => {
        const dataObj = action.payload;
        state.receptionistData = {
          RetailCount: dataObj.RetailCount,
          bookingsCount: dataObj.bookingsCount,
          consultantList: dataObj.consultantList,
          totalAllocatedCount: dataObj.totalAllocatedCount,
          totalDroppedCount: dataObj.totalDroppedCount,
          contactsCount: dataObj.contactsCount,
          enquirysCount: dataObj.enquirysCount,
          totalLostCount: dataObj.totalLostCount,
          fullResponse: dataObj,
        };
      })
      .addCase(getReceptionistData.rejected, (state, action) => {})
      .addCase(getReceptionistManagerData.pending, (state) => {})
      .addCase(getReceptionistManagerData.fulfilled, (state, action) => {
        const dataObj = action.payload;
        state.receptionistData = {
          RetailCount: dataObj.RetailCount,
          bookingsCount: dataObj.bookingsCount,
          consultantList: dataObj.consultantList,
          totalAllocatedCount: dataObj.totalAllocatedCount,
          totalDroppedCount: dataObj.totalDroppedCount,
          contactsCount: dataObj.contactsCount,
          enquirysCount: dataObj.enquirysCount,
          totalLostCount: dataObj.totalLostCount,
        };
      })
      .addCase(getReceptionistManagerData.rejected, (state, action) => {})

      .addCase(getCRM_ReceptionistManagerData.pending, (state) => {})
      .addCase(getCRM_ReceptionistManagerData.fulfilled, (state, action) => {
        const dataObj = action.payload;
        state.receptionistData = {
          RetailCount: dataObj.totalRetailCount,
          bookingsCount: dataObj.totalBookingCount,
          consultantList: dataObj.manager,
          totalAllocatedCount: dataObj.enquirysCount,
          totalDroppedCount: dataObj.totalDroppedCount,
          contactsCount: dataObj.totalPreInquiryCount,
          enquirysCount: dataObj.totalEnquiryCount,
          totalLostCount: dataObj.totalLostCount,
          fullResponse: dataObj,
        };
      })
      .addCase(getCRM_ReceptionistManagerData.rejected, (state, action) => {})

      .addCase(getReceptionistSource.pending, (state) => {})
      .addCase(getReceptionistSource.fulfilled, (state, action) => {
        const dataObj = action.payload;
        state.receptionistSource = dataObj;
      })
      .addCase(getReceptionistSource.rejected, (state, action) => {})
      .addCase(getReceptionistManagerSource.pending, (state) => {})
      .addCase(getReceptionistManagerSource.fulfilled, (state, action) => {
        const dataObj = action.payload;
        state.receptionistSource = dataObj;
      })
      .addCase(getReceptionistManagerSource.rejected, (state, action) => {})
      .addCase(getReceptionistModel.pending, (state) => {})
      .addCase(getReceptionistModel.fulfilled, (state, action) => {
        const dataObj = action.payload;
        state.receptionistModel = dataObj;
      })
      .addCase(getReceptionistModel.rejected, (state, action) => {})
      .addCase(getReceptionistManagerModel.pending, (state) => {})
      .addCase(getReceptionistManagerModel.fulfilled, (state, action) => {
        const dataObj = action.payload;
        state.receptionistModel = dataObj;
      })
      .addCase(getReceptionistManagerModel.rejected, (state, action) => {});

    builder.addCase(getDeptDropdown.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getDeptDropdown.fulfilled, (state, action) => {
      if (action.payload) {
        const dataObj = action.payload;
        state.deptList = dataObj ? dataObj : [];
      }
      state.isLoading = false;
    });
    builder.addCase(getDeptDropdown.rejected, (state, action) => {
      state.isLoading = false;
    });

    // Get Designation List
    builder.addCase(getDesignationDropdown.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getDesignationDropdown.fulfilled, (state, action) => {
      if (action.payload) {
        const dataObj = action.payload;
        state.designationList = dataObj ? dataObj : [];
      }
      state.isLoading = false;
    });
    builder.addCase(getDesignationDropdown.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

export const {
  dateSelected,
  updateFilterDropDownData,
  updateIsTeamPresent,
  updateIsMD,
  updateIsRankHide,
  updateIsDSE,
  clearState,
  updateTargetData,
  updateFilterIds,
  updateEmpDropDown,
  updateLeaderShipFilter,
  updateReceptionistFilterids,
  updateDealerFilterData,
  updateFilterLevelSelectedData,
  updateFilterSelectedData,
  updateLiveLeadObjectData,
  SetNewUpdateAvailable,
} = homeSlice.actions;
export default homeSlice.reducer;
