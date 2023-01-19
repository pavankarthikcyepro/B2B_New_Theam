import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";

export const getCurrentTasksListApi = createAsyncThunk(
  "MY_TASKS/getCurrentTasksListApi",
  async (endUrl, { rejectWithValue }) => {
    const url = URL.GET_CURRENT_TASK_LIST() + endUrl;
    const response = await client.get(url);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getPendingTasksListApi = createAsyncThunk(
  "MY_TASKS/getPendingTasksListApi",
  async (endUrl, { rejectWithValue }) => {
    const url = URL.GET_FEATURE_PENDING_TASK_LIST() + endUrl;
    const response = await client.get(url);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getMoreCurrentTasksListApi = createAsyncThunk(
  "MY_TASKS/getMoreCurrentTasksListApi",
  async (endUrl, { rejectWithValue }) => {
    const url = URL.GET_CURRENT_TASK_LIST() + endUrl;
    const response = await client.get(url);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getMorePendingTasksListApi = createAsyncThunk(
  "MY_TASKS/getMorePendingTasksListApi",
  async (endUrl, { rejectWithValue }) => {
    const url = URL.GET_FEATURE_PENDING_TASK_LIST() + endUrl;
    const response = await client.get(url);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getMyTasksListApi = createAsyncThunk(
  "MY_TASKS/getMyTasksListApi",
  async (userId, { rejectWithValue }) => {
    const payload = {
      loggedInEmpId: userId,
      onlyForEmp: true,
    };

    const url = URL.GET_MY_TASKS_NEW_DATA();
    const response = await client.post(url, payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getMyTeamsTasksListApi = createAsyncThunk(
  "MY_Teams_TASKS/getMyTeamsTasksListApi",
  async (userId, { rejectWithValue }) => {
    const payload = {
      loggedInEmpId: userId,
      onlyForEmp: false,
    };

    const url = URL.GET_MY_TASKS_NEW_DATA();
    const response = await client.post(url, payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getTodayMyTasksListApi = createAsyncThunk(
  "MY_TASKS/getTodayMyTasksListApi",
  async (payload, { rejectWithValue }) => {
    const url = URL.GET_MY_TASKS_NEW_DATA();
    const response = await client.post(url, payload);
    const json = await response.json();
    console.log(json, "json ======= ");
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getUpcomingMyTasksListApi = createAsyncThunk(
  "MY_TASKS/getUpcomingMyTasksListApi",
  async (payload, { rejectWithValue }) => {
    const url = URL.GET_MY_TASKS_NEW_DATA();
    const response = await client.post(url, payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getPendingMyTasksListApi = createAsyncThunk(
  "MY_TASKS/getPendingMyTasksListApi",
  async (payload, { rejectWithValue }) => {
    console.log("getPendingMyTasksListApi Payload",payload);
    
    const url = URL.GET_MY_TASKS_NEW_DATA();
    const response = await client.post(url, payload);
    const json = await response.json();
    console.log("getPendingMyTasksListApi res",json);

    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getRescheduleMyTasksListApi = createAsyncThunk(
  "MY_TASKS/getRescheduleMyTasksListApi",
  async (payload, { rejectWithValue }) => {
    const url = URL.GET_MY_TASKS_NEW_DATA();
    const response = await client.post(url, payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getCompletedMyTasksListApi = createAsyncThunk(
  "MY_TASKS/getCompletedMyTasksListApi",
  async (payload, { rejectWithValue }) => {
    const url = URL.GET_MY_TASKS_NEW_DATA();
    const response = await client.post(url, payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getTodayTeamTasksListApi = createAsyncThunk(
  "MY_TASKS/getTodayTeamTasksListApi",
  async (payload, { rejectWithValue }) => {
    const url = URL.GET_MY_TASKS_NEW_DATA();
    const response = await client.post(url, payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getUpcomingTeamTasksListApi = createAsyncThunk(
  "MY_TASKS/getUpcomingTeamTasksListApi",
  async (payload, { rejectWithValue }) => {
    const url = URL.GET_MY_TASKS_NEW_DATA();
    const response = await client.post(url, payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getPendingTeamTasksListApi = createAsyncThunk(
  "MY_TASKS/getPendingTeamTasksListApi",
  async (payload, { rejectWithValue }) => {
    console.log("getPendingTeamTasksListApi Payload ",payload);
    
    const url = URL.GET_MY_TASKS_NEW_DATA();
    const response = await client.post(url, payload);
    const json = await response.json();
    console.log("getPendingTeamTasksListApi Res ",json);
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getRescheduleTeamTasksListApi = createAsyncThunk(
  "MY_TASKS/getRescheduleTeamTasksListApi",
  async (payload, { rejectWithValue }) => {
    const url = URL.GET_MY_TASKS_NEW_DATA();
    const response = await client.post(url, payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getCompletedTeamTasksListApi = createAsyncThunk(
  "MY_TASKS/getCompletedTeamTasksListApi",
  async (payload, { rejectWithValue }) => {
    const url = URL.GET_MY_TASKS_NEW_DATA();
    const response = await client.post(url, payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getOrganizationHierarchyList = createAsyncThunk(
  "MY_TASKS/getOrganizationHierarchyList",
  async (payload: any, { rejectWithValue }) => {
    const response = await client.get(
      URL.ORG_HIRARCHY(payload.orgId, payload.branchId)
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

export const getRescheduled = createAsyncThunk(
  "MY_TASKS/getRescheduled",
  async (empId, { rejectWithValue }) => {
    const url = URL.MY_TASKS_RESCHEDULED_HISTORY(empId);
    const response = await client.get(url);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const role = createAsyncThunk("MY-_TASKS/role", (role) => {
  return role;
});

export const mytaskSlice = createSlice({
  name: "MY_TASKS",
  initialState: {
    // Current Tasks
    currentTableData: [],
    currentPageNumber: 0,
    currnetTotalPages: 1,
    isLoadingForCurrentTask: false,
    isLoadingExtraDataForCurrentTask: false,
    // Pending Tasks
    pendingTableData: [],
    pendingPageNumber: 0,
    pendingTotalPages: 1,
    isLoadingForPendingTask: false,
    isLoadingExtraDataForPendingTask: false,
    mytasksLisResponse: {},
    myTasksListResponseStatus: "",
    myTeamstasksListResponse: {},
    myTeamsTasksListResponseStatus: "",
    role: "",
    isLoading: true,
    isTeamsTaskLoading: true,
    myTodayData: [],
    myUpcomingData: [],
    myPendingData: [],
    myReData: [],
    teamTodayData: [],
    teamUpcomingData: [],
    teamPendingData: [],
    teamReData: [],
    index: 0,
    currentScreen: "",
    filter_drop_down_data: {},
    employees_drop_down_data: {},
    filterIds: {
      dealerCodes:[],
      levelSelectedIds: [],
      empSelectedIds: [],
    },
  },
  reducers: {
    updateIndex: (state, action) => {
      state.index = action.payload;
    },
    updateFilterDropDownData: (state, action) => {
      state.filter_drop_down_data = action.payload;
    },
    updateFilterIds: (state, action) => {
      state.filterIds = action.payload;
    },
    updateCurrentScreen: (state, action) => {
      state.currentScreen = action.payload;
    },
    updateEmpDropDown: (state, action) => {
      state.employees_drop_down_data = {};
    },
    myTaskClearState: (state, action) => {
      state.filter_drop_down_data = {};
      state.employees_drop_down_data = {};
      state.filterIds = {
        dealerCodes:[],
        levelSelectedIds: [],
        empSelectedIds: [],
      };
      state.currentScreen = "";
    },
  },
  extraReducers: (builder) => {
    // Get Current Task List
    builder.addCase(getCurrentTasksListApi.pending, (state) => {
      state.isLoadingForCurrentTask = true;
    });
    builder.addCase(getCurrentTasksListApi.fulfilled, (state, action) => {
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.currnetTotalPages = dmsEntityObj.myTasks.totalPages;
        state.currentPageNumber = dmsEntityObj.myTasks.pageable.pageNumber;
        state.currentTableData = dmsEntityObj.myTasks.content;
      }
      state.isLoadingForCurrentTask = false;
    });
    builder.addCase(getCurrentTasksListApi.rejected, (state, action) => {
      state.isLoadingForCurrentTask = false;
    });
    // Get More Current Task List
    builder.addCase(getMoreCurrentTasksListApi.pending, (state) => {
      state.isLoadingExtraDataForCurrentTask = true;
    });
    builder.addCase(getMoreCurrentTasksListApi.fulfilled, (state, action) => {
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.currentPageNumber = dmsEntityObj.myTasks.pageable.pageNumber;
        state.currentTableData = [
          ...state.currentTableData,
          ...dmsEntityObj.myTasks.content,
        ];
      }
      state.isLoadingExtraDataForCurrentTask = false;
    });
    builder.addCase(getMoreCurrentTasksListApi.rejected, (state, action) => {
      state.isLoadingExtraDataForCurrentTask = false;
    });
    // Get Pending Task List
    builder.addCase(getPendingTasksListApi.pending, (state) => {
      state.isLoadingForPendingTask = true;
    });
    builder.addCase(getPendingTasksListApi.fulfilled, (state, action) => {
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.pendingTotalPages = dmsEntityObj.myTasks.totalPages;
        state.pendingPageNumber = dmsEntityObj.myTasks.pageable.pageNumber;
        state.pendingTableData = dmsEntityObj.myTasks.content;
      }
      state.isLoadingForPendingTask = false;
    });
    builder.addCase(getPendingTasksListApi.rejected, (state, action) => {
      state.isLoadingForPendingTask = false;
    });
    // Get More Pending Task List
    builder.addCase(getMorePendingTasksListApi.pending, (state) => {
      state.isLoadingExtraDataForPendingTask = true;
    });
    builder.addCase(getMorePendingTasksListApi.fulfilled, (state, action) => {
      const dmsEntityObj = action.payload?.dmsEntity;
      if (dmsEntityObj) {
        state.pendingPageNumber = dmsEntityObj.myTasks.pageable.pageNumber;
        state.pendingTableData = [
          ...state.pendingTableData,
          ...dmsEntityObj.myTasks.content,
        ];
      }
      state.isLoadingExtraDataForPendingTask = false;
    });
    builder.addCase(getMorePendingTasksListApi.rejected, (state, action) => {
      state.isLoadingExtraDataForPendingTask = false;
    });
    // Get My Tasks List
    builder.addCase(getMyTasksListApi.pending, (state) => {
      state.mytasksLisResponse = {};
      state.myTasksListResponseStatus = "pending";
      state.isLoading = true;
    });
    builder.addCase(getMyTasksListApi.fulfilled, (state, action) => {
      state.mytasksLisResponse = action.payload;
      state.myTasksListResponseStatus = "success";
      state.isLoading = false;
    });
    builder.addCase(getMyTasksListApi.rejected, (state, action) => {
      state.mytasksLisResponse = action.payload;
      state.myTasksListResponseStatus = "failed";
      state.isLoading = false;
    });
    // Get My Teams Tasks List
    builder.addCase(getMyTeamsTasksListApi.pending, (state) => {
      state.myTeamstasksListResponse = {};
      state.myTeamsTasksListResponseStatus = "pending";
      state.isTeamsTaskLoading = true;
    });
    builder.addCase(getMyTeamsTasksListApi.fulfilled, (state, action) => {
      state.myTeamstasksListResponse = action.payload;
      state.myTeamsTasksListResponseStatus = "success";
      state.isTeamsTaskLoading = false;
    });
    builder.addCase(getMyTeamsTasksListApi.rejected, (state, action) => {
      state.myTeamstasksListResponse = action.payload;
      state.myTeamsTasksListResponseStatus = "failed";
      state.isTeamsTaskLoading = false;
    });
    // Store Role
    builder.addCase(role.fulfilled, (state: any, action) => {
      state.role = action.payload;
    });

    builder.addCase(getTodayMyTasksListApi.pending, (state) => {
      state.myTodayData = [];
      state.isLoading = true;
    });
    builder.addCase(getTodayMyTasksListApi.fulfilled, (state, action) => {
      state.myTodayData = action.payload.todaysData;
      state.isLoading = false;
    });
    builder.addCase(getTodayMyTasksListApi.rejected, (state, action) => {
      state.myTodayData = [];
      state.isLoading = false;
    });

    builder.addCase(getUpcomingMyTasksListApi.pending, (state) => {
      state.myUpcomingData = [];
      state.isLoading = true;
    });
    builder.addCase(getUpcomingMyTasksListApi.fulfilled, (state, action) => {
      state.myUpcomingData = action.payload.upcomingData;
      state.isLoading = false;
    });
    builder.addCase(getUpcomingMyTasksListApi.rejected, (state, action) => {
      state.myUpcomingData = [];
      state.isLoading = false;
    });

    builder.addCase(getPendingMyTasksListApi.pending, (state) => {
      state.myPendingData = [];
      state.isLoading = true;
    });
    builder.addCase(getPendingMyTasksListApi.fulfilled, (state, action) => {
      state.myPendingData = action.payload.pendingData;
      state.isLoading = false;
    });
    builder.addCase(getPendingMyTasksListApi.rejected, (state, action) => {
      state.myPendingData = [];
      state.isLoading = false;
    });

    builder.addCase(getRescheduleMyTasksListApi.pending, (state) => {
      state.myReData = [];
      state.isLoading = true;
    });
    builder.addCase(getRescheduleMyTasksListApi.fulfilled, (state, action) => {
      state.myReData = action.payload.rescheduledData;
      state.isLoading = false;
    });
    builder.addCase(getRescheduleMyTasksListApi.rejected, (state, action) => {
      state.myReData = [];
      state.isLoading = false;
    });

    builder.addCase(getCompletedMyTasksListApi.pending, (state) => {
      state.myReData = [];
      state.isLoading = true;
    });
    builder.addCase(getCompletedMyTasksListApi.fulfilled, (state, action) => {
      state.myReData = action.payload.completedData;
      state.isLoading = false;
    });
    builder.addCase(getCompletedMyTasksListApi.rejected, (state, action) => {
      state.myReData = [];
      state.isLoading = false;
    });

    builder.addCase(getTodayTeamTasksListApi.pending, (state) => {
      state.teamTodayData = [];
      state.isTeamsTaskLoading = true;
    });
    builder.addCase(getTodayTeamTasksListApi.fulfilled, (state, action) => {
      state.teamTodayData = action.payload.todaysData;
      state.isTeamsTaskLoading = false;
    });
    builder.addCase(getTodayTeamTasksListApi.rejected, (state, action) => {
      state.teamTodayData = [];
      state.isTeamsTaskLoading = false;
    });

    builder.addCase(getUpcomingTeamTasksListApi.pending, (state) => {
      state.teamUpcomingData = [];
      state.isTeamsTaskLoading = true;
    });
    builder.addCase(getUpcomingTeamTasksListApi.fulfilled, (state, action) => {
      state.teamUpcomingData = action.payload.upcomingData;
      state.isTeamsTaskLoading = false;
    });
    builder.addCase(getUpcomingTeamTasksListApi.rejected, (state, action) => {
      state.teamUpcomingData = [];
      state.isTeamsTaskLoading = false;
    });

    builder.addCase(getPendingTeamTasksListApi.pending, (state) => {
      state.teamPendingData = [];
      state.isTeamsTaskLoading = true;
    });
    builder.addCase(getPendingTeamTasksListApi.fulfilled, (state, action) => {
      state.teamPendingData = action.payload.pendingData;
      state.isTeamsTaskLoading = false;
    });
    builder.addCase(getPendingTeamTasksListApi.rejected, (state, action) => {
      state.teamPendingData = [];
      state.isTeamsTaskLoading = false;
    });

    builder.addCase(getRescheduleTeamTasksListApi.pending, (state) => {
      state.teamReData = [];
      state.isTeamsTaskLoading = false;
    });
    builder.addCase(
      getRescheduleTeamTasksListApi.fulfilled,
      (state, action) => {
        state.teamReData = action.payload.rescheduledData;
        state.isTeamsTaskLoading = false;
      }
    );
    builder.addCase(getRescheduleTeamTasksListApi.rejected, (state, action) => {
      state.teamReData = [];
      state.isTeamsTaskLoading = false;
    });

    builder.addCase(getCompletedTeamTasksListApi.pending, (state) => {
      state.teamReData = [];
      state.isTeamsTaskLoading = false;
    });
    builder.addCase(getCompletedTeamTasksListApi.fulfilled, (state, action) => {
      state.teamReData = action.payload.completedData;
      state.isTeamsTaskLoading = false;
    });
    builder
      .addCase(getCompletedTeamTasksListApi.rejected, (state, action) => {
        state.teamReData = [];
        state.isTeamsTaskLoading = false;
      })

      // Get Filter Dropdown list
      .addCase(getOrganizationHierarchyList.pending, (state, action) => {})
      .addCase(getOrganizationHierarchyList.fulfilled, (state, action) => {
        if (action.payload) {
          state.filter_drop_down_data = action.payload;
        }
      })
      .addCase(getOrganizationHierarchyList.rejected, (state, action) => {});

    // Get Employees Drop Down Data
    builder
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
      });

    // Task History rescheduled today
    builder.addCase(getRescheduled.pending, (state) => {});
    builder.addCase(getRescheduled.fulfilled, (state, action) => {});
    builder.addCase(getRescheduled.rejected, (state, action) => {});
  },
});

export const {
  updateIndex,
  updateFilterIds,
  updateCurrentScreen,
  updateEmpDropDown,
  myTaskClearState,
} = mytaskSlice.actions;
export default mytaskSlice.reducer;
