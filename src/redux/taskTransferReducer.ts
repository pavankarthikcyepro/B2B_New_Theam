import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from '../networking/client';
import URL from "../networking/endpoints";


export const getTaskList = createAsyncThunk("TASK_TRANSFER/getTaskList", async (payload, { rejectWithValue }) => {
    const response = await client.get(URL.GET_TASK_LIST(payload));
    const json = await response.json()
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
});

export const getBranchDropdown = createAsyncThunk("TASK_TRANSFER/getBranchDropdown", async (payload, { rejectWithValue }) => {
    console.log("BRANCH URL:", URL.TARGET_DROPDOWN(
        payload["orgId"],
        payload["parent"],
        payload["child"],
        payload["parentId"]
    ));
    
    const response = await client.get(URL.TARGET_DROPDOWN(
        payload["orgId"],
        payload["parent"],
        payload["child"],
        payload["parentId"]
    ));
    const json = await response.json();
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
});

export const getDeptDropdown = createAsyncThunk("TASK_TRANSFER/getDeptDropdown", async (payload, { rejectWithValue }) => {
    console.log("DEPT URL:", URL.TARGET_DROPDOWN(
        payload["orgId"],
        payload["parent"],
        payload["child"],
        payload["parentId"]
    ));
    
    const response = await client.get(URL.TARGET_DROPDOWN(
        payload["orgId"],
        payload["parent"],
        payload["child"],
        payload["parentId"]
    ));
    const json = await response.json();
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
});

export const getDeptDropdownTrans = createAsyncThunk("TASK_TRANSFER/getDeptDropdownTrans", async (payload, { rejectWithValue }) => {
    console.log("DEPT URL:", URL.TARGET_DROPDOWN(
        payload["orgId"],
        payload["parent"],
        payload["child"],
        payload["parentId"]
    ));
    
    const response = await client.get(URL.TARGET_DROPDOWN(
        payload["orgId"],
        payload["parent"],
        payload["child"],
        payload["parentId"]
    ));
    const json = await response.json();
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
});

export const getDesignationDropdown = createAsyncThunk("TASK_TRANSFER/getDesignationDropdown", async (payload, { rejectWithValue }) => {
    console.log("DESIG URL:", URL.TARGET_DROPDOWN(
        payload["orgId"],
        payload["parent"],
        payload["child"],
        payload["parentId"]
    ));
    
    const response = await client.get(URL.TARGET_DROPDOWN(
        payload["orgId"],
        payload["parent"],
        payload["child"],
        payload["parentId"]
    ));
    const json = await response.json();
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
});

export const getDesignationDropdownTrans = createAsyncThunk("TASK_TRANSFER/getDesignationDropdownTrans", async (payload, { rejectWithValue }) => {
    console.log("DESIG URL:", URL.TARGET_DROPDOWN(
        payload["orgId"],
        payload["parent"],
        payload["child"],
        payload["parentId"]
    ));
    
    const response = await client.get(URL.TARGET_DROPDOWN(
        payload["orgId"],
        payload["parent"],
        payload["child"],
        payload["parentId"]
    ));
    const json = await response.json();
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
});

export const getEmployeeDetails = createAsyncThunk("TASK_TRANSFER/getEmployeeDetails", async (payload, { rejectWithValue }) => {
    console.log("EMP URL:", URL.GET_EMPLOYEE_DETAILS(
        payload["orgId"],
        payload["branchId"],
        payload["deptId"],
        payload["desigId"]
    ));
    
    const response = await client.get(URL.GET_EMPLOYEE_DETAILS(
        payload["orgId"],
        payload["branchId"],
        payload["deptId"],
        payload["desigId"]));
    const json = await response.json();
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
});

export const getEmployeeDetailsTrans = createAsyncThunk("TASK_TRANSFER/getEmployeeDetailsTrans", async (payload, { rejectWithValue }) => {
    console.log("EMP URL:", URL.GET_EMPLOYEE_DETAILS(
        payload["orgId"],
        payload["branchId"],
        payload["deptId"],
        payload["desigId"]
    ));
    
    const response = await client.get(URL.GET_EMPLOYEE_DETAILS(
        payload["orgId"],
        payload["branchId"],
        payload["deptId"],
        payload["desigId"]));
    const json = await response.json();
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
});

export const submitTaskTransfer = createAsyncThunk("TASK_TRANSFER/submitTaskTransfer", async (payload, { rejectWithValue }) => {
    console.log("EMP URL:", URL.TRANSFER_TASK(
        payload["fromUserId"],
        payload["toUserId"]
    ), {
        fromEmpId: payload["fromUserId"].toString(),
        taskIdList: payload["taskIdList"],
        toEmpId: payload["toUserId"].toString()
    });

    const response = await client.post(URL.TRANSFER_TASK(
        payload["fromUserId"],
        payload["toUserId"]
    ), {
        fromEmpId: payload["fromUserId"].toString(),
        taskIdList: payload["taskIdList"],
        toEmpId: payload["toUserId"].toString()
    });
    const json = await response.json();
    if (!response.ok) {
        return rejectWithValue(json);
    }
    return json;
});

export const taskTransferSlice = createSlice({
    name: "TASK_TRANSFER",
    initialState: {
        isLoading: false,
        orgId: null,
        taskName: null,
        branchId: null,
        deptId: null,
        desigId: null,
        parent: null,
        child: null,
        parentId: null,

        branchList: [],
        deptList: [],
        designationList: [],
        employeeList: [],
        taskList: [],

        deptListTrans: [],
        designationListTrans: [],
        employeeListTrans: [],
        taskTransferStatus: ''
    },
    reducers: {
        updateStatus: (state, action) => {
            state.taskTransferStatus = "";
        }
    },
    extraReducers: (builder) => {
        // Get Branch List
        builder.addCase(getBranchDropdown.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(getBranchDropdown.fulfilled, (state, action) => {
            if (action.payload) {
                const dataObj = action.payload;
                state.branchList = dataObj ? dataObj : []
            }
            state.isLoading = false;
        })
        builder.addCase(getBranchDropdown.rejected, (state, action) => {
            state.isLoading = false;
        })

        // Get Department List
        builder.addCase(getDeptDropdown.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(getDeptDropdown.fulfilled, (state, action) => {
            if (action.payload) {
                const dataObj = action.payload;
                state.deptList = dataObj ? dataObj : []
            }
            state.isLoading = false;
        })
        builder.addCase(getDeptDropdown.rejected, (state, action) => {
            state.isLoading = false;
        })

        builder.addCase(getDeptDropdownTrans.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(getDeptDropdownTrans.fulfilled, (state, action) => {
            if (action.payload) {
                const dataObj = action.payload;
                state.deptListTrans = dataObj ? dataObj : []
            }
            state.isLoading = false;
        })
        builder.addCase(getDeptDropdownTrans.rejected, (state, action) => {
            state.isLoading = false;
        })

        // Get Designation List
        builder.addCase(getDesignationDropdown.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(getDesignationDropdown.fulfilled, (state, action) => {
            if (action.payload) {
                const dataObj = action.payload;
                state.designationList = dataObj ? dataObj : []
            }
            state.isLoading = false;
        })
        builder.addCase(getDesignationDropdown.rejected, (state, action) => {
            state.isLoading = false;
        })

        builder.addCase(getDesignationDropdownTrans.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(getDesignationDropdownTrans.fulfilled, (state, action) => {
            if (action.payload) {
                const dataObj = action.payload;
                state.designationListTrans = dataObj ? dataObj : []
            }
            state.isLoading = false;
        })
        builder.addCase(getDesignationDropdownTrans.rejected, (state, action) => {
            state.isLoading = false;
        })


        // Get Employees List
        builder.addCase(getEmployeeDetails.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(getEmployeeDetails.fulfilled, (state, action) => {
            if (action.payload?.success) {
                console.log("EMP:", JSON.stringify(action.payload));
                
                const dataObj = action.payload;
                state.employeeList = dataObj ? dataObj.dmsEntity.employees : []
            }
            state.isLoading = false;
        })
        builder.addCase(getEmployeeDetails.rejected, (state, action) => {
            state.isLoading = false;
        })

        builder.addCase(getEmployeeDetailsTrans.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(getEmployeeDetailsTrans.fulfilled, (state, action) => {
            if (action.payload?.success) {
                const dataObj = action.payload;
                state.employeeListTrans = dataObj ? dataObj.dmsEntity.employees : []
            }
            state.isLoading = false;
        })
        builder.addCase(getEmployeeDetailsTrans.rejected, (state, action) => {
            state.isLoading = false;
        })

        // Get Tasj=k List
        builder.addCase(getTaskList.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(getTaskList.fulfilled, (state, action) => {
            if (action.payload) {
                const dataObj = action.payload;
                state.taskList = dataObj ? dataObj : []
            }
            state.isLoading = false;
        })
        builder.addCase(getTaskList.rejected, (state, action) => {
            state.isLoading = false;
        })

        builder.addCase(submitTaskTransfer.pending, (state, action) => {
            
        })
        builder.addCase(submitTaskTransfer.fulfilled, (state, action) => {
            console.log("TTRTTRTR", action.payload);
            
            if (action.payload.success){
                state.taskTransferStatus = 'success'
            }
        })
        builder.addCase(submitTaskTransfer.rejected, (state, action) => {
            state.taskTransferStatus = 'faild'
        })
    }
});

export const { updateStatus } = taskTransferSlice.actions;
export default taskTransferSlice.reducer;
