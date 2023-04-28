import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import URL from "../networking/endpoints";
import { showToast } from "../utils/toast";
import { client } from "../networking/client";

interface DropDownModelNew {
  key: string;
  value: string;
  id?: string;
  orgId?: string;
}

interface PersonalIntroModel {
  key: string;
  text: string;
}

export const createQuery = createAsyncThunk(
  "SERVICE_QUERY_CRUD_SLICE/createQuery",
  async (payload, { rejectWithValue }) => {
    const { tenantId, queryData } = payload;
    const response = await client.post(URL.CREATE_QUERY(tenantId), queryData);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const updateQuery = createAsyncThunk(
  "SERVICE_QUERY_CRUD_SLICE/updateQuery",
  async (payload, { rejectWithValue }) => {
    const { tenantId, queryData, queryId } = payload;
    const response = await client.put(
      URL.UPDATE_QUERY(tenantId, queryId),
      queryData
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const closeQuery = createAsyncThunk(
  "SERVICE_QUERY_CRUD_SLICE/closeQuery",
  async (payload, { rejectWithValue }) => {
    const { tenantId, queryData, queryId } = payload;
    const response = await client.put(
      URL.UPDATE_QUERY(tenantId, queryId),
      queryData
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

const initialState = {
  isLoading: false,
  enqDept: "",
  purposeOfEnq: "",
  purposeOfEnqResponse: [],
  customerRemarks: "",
  crmRemarks: "",
  createQueryResponseStatus: "pending",
  updateQueryResponseStatus: "pending",
  closeQueryResponseStatus: "pending",
};

const queryCrudReducer = createSlice({
  name: "SERVICE_QUERY_CRUD_SLICE",
  initialState: JSON.parse(JSON.stringify(initialState)),
  reducers: {
    clearStateData: () => JSON.parse(JSON.stringify(initialState)),
    setDropDownData: (state, action: PayloadAction<DropDownModelNew>) => {
      const { key, value } = action.payload;
      switch (key) {
        case "ENQ_DEPT":
          state.enqDept = value;
          state.purposeOfEnq = "";
          if (!value) {
            state.purposeOfEnqResponse = [];
          }
          break;
        case "PURPOSE_ENQ_LIST":
          state.purposeOfEnqResponse = value;
          break;
        case "PURPOSE_OF_ENQ":
          state.purposeOfEnq = value;
          break;
      }
    },
    setInputInfo: (state, action: PayloadAction<PersonalIntroModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "CUSTOMER_REMARKS":
          state.customerRemarks = text;
          break;
        case "CRM_REMARKS":
          state.crmRemarks = text;
          break;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createQuery.pending, (state, action) => {
        state.isLoading = true;
        state.createQueryResponseStatus = "pending";
      })
      .addCase(createQuery.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.createQueryResponseStatus = "success";
        }
      })
      .addCase(createQuery.rejected, (state, action) => {
        state.isLoading = false;
        state.createQueryResponseStatus = "failed";
        if (action.payload.message) {
          showToast(`${action.payload.message}`);
        } else {
          showToast(`Something went wrong`);
        }
      });
    
    builder
      .addCase(closeQuery.pending, (state, action) => {
        state.isLoading = true;
        state.closeQueryResponseStatus = "pending";
      })
      .addCase(closeQuery.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.closeQueryResponseStatus = "success";
        }
      })
      .addCase(closeQuery.rejected, (state, action) => {
        state.isLoading = false;
        state.closeQueryResponseStatus = "failed";
        if (action.payload.message) {
          showToast(`${action.payload.message}`);
        } else {
          showToast(`Something went wrong`);
        }
      });
    }
});

export const { clearStateData, setDropDownData, setInputInfo } =
  queryCrudReducer.actions;
export default queryCrudReducer.reducer;
