import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import { SourceOfEnquiryTypes } from "../jsonData/preEnquiryScreenJsonData";
import { showToast } from "../utils/toast";
import URL from "../networking/endpoints";
import { convertToDate } from "../utils/helperFunctions";
import moment from "moment";
import * as AsyncStore from "../asyncStore";
import { loginSlice } from "../redux/loginReducer";
import { useSelector } from "react-redux";

interface TextModel {
  key: string;
  text: string;
}

interface DropDownModel {
  key: string;
  value: string;
  id: string;
  orgId: string;
}

interface Item {
  name: string;
  id: string;
}

export const getPreEnquiryDetails = createAsyncThunk(
  "ADD_PRE_ENQUIRY_SLICE/getPreEnquiryDetails",
  async (universalId, { rejectWithValue }) => {
    const response = await client.get(URL.CONTACT_DETAILS(universalId));

    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const createPreEnquiry = createAsyncThunk(
  "ADD_PRE_ENQUIRY_SLICE/createPreEnquiry",
  async (data, { rejectWithValue }) => {
    const response = await client.post(data["url"], data["body"]);

    try {
      const json = await response.json();
      if (response.status != 200) {
        return rejectWithValue(json);
      }
      return json;
    } catch (error) {
      return rejectWithValue({
        message: "Json parse error: " + JSON.stringify(response),
      });
    }
  }
);

export const continueToCreatePreEnquiry = createAsyncThunk(
  "ADD_PRE_ENQUIRY_SLICE/continueToCreatePreEnquiry",
  async (data, { rejectWithValue }) => {
    const response = await client.post(data["url"], data["body"]);

    try {
      const json = await response.json();
      if (response.status != 200) {
        return rejectWithValue(json);
      }
      return json;
    } catch (error) {
      return rejectWithValue({ message: "Json parse error: " + response });
    }
  }
);

export const updatePreEnquiry = createAsyncThunk(
  "ADD_PRE_ENQUIRY_SLICE/updatePreEnquiry",
  async (data, { rejectWithValue }) => {
    const response = await client.put(data["url"], data["body"]);
    try {
      const json = await response.json();
      if (response.status != 200) {
        return rejectWithValue(json);
      }
      return json;
    } catch (error) {
      return rejectWithValue({ message: "Json parse error: " + response });
    }
  }
);

export const getEventListApi = createAsyncThunk(
  "ADD_PRE_ENQUIRY_SLICE/getEventListApi",
  async (payload: any, { rejectWithValue }) => {
    const customConfig = {
      branchid: payload.branchId,
      orgid: payload.orgId,
    };
    const response = await client.get(
      URL.GET_EVENT_LIST(payload.startDate, payload.endDate, payload.empId),
      customConfig
    );

    try {
      const json = await response.json();
      if (response.status != 200) {
        return rejectWithValue(json);
      }
      return json;
    } catch (error) {
      return rejectWithValue({ message: "Json parse error: " + response });
    }
  }
);

export const getEventConfigList = createAsyncThunk(
  "ADD_PRE_ENQUIRY_SLICE/getEventConfigList",
  async (payload: any, { rejectWithValue }) => {
    const customConfig = {
      branchid: payload.branchId,
      orgid: payload.orgId,
    };
    const response = await client.get(
      URL.GET_EVENTS_NEW(payload.startDate, payload.endDate, payload.empId),
      customConfig
    );

    try {
      const json = await response.json();
      if (response.status != 200) {
        return rejectWithValue(json);
      }
      return json;
    } catch (error) {
      return rejectWithValue({ message: "Json parse error: " + response });
    }
  }
);

export const getCustomerTypesApi = createAsyncThunk(
  "ADD_PRE_ENQUIRY_SLICE/getCustomerTypesApi",
  async (orgId, { rejectWithValue }) => {
    const response = await client.get(URL.GET_CUSTOMER_TYPES(orgId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getEnquiryTypesApi = createAsyncThunk(
  "ADD_PRE_ENQUIRY_SLICE/getEnquiryTypesApi",
  async (orgId, { rejectWithValue }) => {
    const response = await client.get(URL.GET_ENQUIRY_TYPE(orgId));
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

export const getBranchList = createAsyncThunk(
  "ADD_PRE_ENQUIRY_SLICE/getBranchList",
  async (payload, { rejectWithValue }) => {
    const response = await client.get(
      URL.DEALER_CODE_BRANCH_LIST(payload["orgId"], payload["locationId"])
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

const getAsyncstoreData = async () => {
  const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
};

export const addPreEnquirySlice = createSlice({
  name: "ADD_PRE_ENQUIRY_SLICE",
  initialState: {
    create_enquiry_checked: false,
    firstName: "",
    lastName: "",
    mobile: "",
    alterMobile: "",
    email: "",
    pincode: "",
    carModel: "",
    enquiryType: "",
    customerType: "",
    sourceOfEnquiry: "",
    sourceOfEnquiryId: null,
    subSourceOfEnquiry: "",
    subSourceOfEnquiryId: null,
    eventName: "",
    eventStartDate: "",
    eventEndDate: "",
    companyName: "",
    other: "",
    other_company_name: "",
    drop_down_data: [],
    drop_down_key_id: "",
    show_drop_down: false,
    enquiry_type_list: [],
    source_of_enquiry_type_list: SourceOfEnquiryTypes,
    show_model_drop_down: false,
    show_enquiry_segment_drop_down: false,
    show_customer_type_drop_down: false,
    show_source_type_drop_down: false,
    isLoading: false,
    status: "",
    errorMsg: "",
    customer_type_list: [],
    createEnquiryStatus: "",
    updateEnquiryStatus: "",
    create_enquiry_response_obj: {},
    event_list: [],
    event_list_response_status: "",
    event_list_Config: [],
    event_list_response_Config_status: "",
    customer_types_response: [],
    selectedLocation: "",
    selectedOrgId: "",
    selectedBranch: "",
    selectedBranchId: "",
    branchList: [],
  },
  reducers: {
    clearState: (state) => {
      state.create_enquiry_checked = false;
      state.firstName = "";
      state.lastName = "";
      state.mobile = "";
      state.alterMobile = "";
      state.email = "";
      state.pincode = "";
      state.carModel = "";
      state.enquiryType = "";
      state.customerType = "";
      state.sourceOfEnquiry = "";
      state.sourceOfEnquiryId = null;
      state.subSourceOfEnquiry = "";
      state.subSourceOfEnquiryId = null;
      state.companyName = "";
      state.other = "";
      state.other_company_name = "";
      state.eventName = "";
      state.eventStartDate = "";
      state.eventEndDate = "";
      state.isLoading = false;
      state.status = "";
      state.errorMsg = "";
      state.createEnquiryStatus = "";
      state.updateEnquiryStatus = "";
      state.create_enquiry_response_obj = {};
      state.event_list = [];
      state.event_list_Config = [];
      state.event_list_response_status = "";
      state.event_list_response_Config_status = "";
      state.customer_types_response = [];
      state.enquiry_type_list = [];
      state.customer_type_list = [];
      state.selectedLocation = "";
      state.selectedOrgId = "";
      state.selectedBranch = "";
      state.selectedBranchId = "";
      state.branchList = [];
    },
    setCreateEnquiryCheckbox: (state, action) => {
      state.create_enquiry_checked = !state.create_enquiry_checked;
    },
    updateEnqStatus: (state, action) => {
      state.updateEnquiryStatus = action.payload;
    },
    setDropDownData: (state, action: PayloadAction<DropDownModel>) => {
      const { key, value, id, orgId } = action.payload;
      switch (key) {
        case "ENQUIRY_SEGMENT":
          state.enquiryType = value;
          let data = state.customer_types_response;
          let newData = data?.filter((val) => val?.enquiry_segment == value);
          state.customer_type_list = newData;
          state.customerType = "";

          break;
        case "CAR_MODEL":
          state.carModel = value;
          break;
        case "CUSTOMER_TYPE":
          state.customerType = value;
          break;
        case "SOURCE_OF_ENQUIRY":
          if (value === "Event") {
            const currentDate = moment().format("YYYY-MM-DD");
            state.eventStartDate = currentDate;
            state.eventEndDate = currentDate;
            state.eventName = "";
          }
          state.sourceOfEnquiry = value;
          state.sourceOfEnquiryId = id;
          state.subSourceOfEnquiry = "";
          state.subSourceOfEnquiryId = null;
          break;
        case "SUB_SOURCE_OF_ENQUIRY":
          state.subSourceOfEnquiry = value;
          state.subSourceOfEnquiryId = id;
          break;
        case "EVENT_NAME":
          state.eventName = value;
          break;
        case "LOCATION":
          state.selectedLocation = value;
          state.branchList = [];
          state.selectedBranch = "";
          state.selectedBranchId = "";
          state.sourceOfEnquiry = "";
          state.sourceOfEnquiryId = null;
          state.subSourceOfEnquiry = "";
          state.subSourceOfEnquiryId = null;
          break;
        case "ORG_ID":
          state.selectedOrgId = value;
          break;
        case "BRANCH":
          state.selectedBranch = value;
          state.sourceOfEnquiry = "";
          state.sourceOfEnquiryId = null;
          state.subSourceOfEnquiry = "";
          state.subSourceOfEnquiryId = null;
          break;
        case "BRANCH_ID":
          state.selectedBranchId = value;
          break;
      }
    },
    updateSelectedDate: (state, action: PayloadAction<TextModel>) => {
      const { key, text } = action.payload;
      const date = convertToDate(text, "YYYY-MM-DD");
      switch (key) {
        case "START_DATE":
          state.eventStartDate = date;
          state.eventName = "";
          break;
        case "END_DATE":
          state.eventEndDate = date;
          state.eventName = "";
          break;
      }
    },
    setPreEnquiryDetails: (state, action: PayloadAction<TextModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "FIRST_NAME":
          state.firstName = text;
          break;
        case "LAST_NAME":
          state.lastName = text;
          break;
        case "MOBILE":
          state.mobile = text;
          break;
        case "ALTER_MOBILE":
          state.alterMobile = text;
          break;
        case "EMAIL":
          state.email = text;
          break;
        case "COMPANY_NAME":
          state.companyName = text;
          break;
        case "OTHER":
          state.other = text;
          break;
        case "OTHER_COMPANY_NAME":
          state.other_company_name = text;
          break;
        case "PINCODE":
          state.pincode = text;
          break;
      }
    },
    setCustomerTypeList: (state, action) => {
      state.customer_type_list = JSON.parse(action.payload);
    },
    setExistingDetails: (state, action) => {
      let orgId = "0";
      const preEnquiryDetails = action.payload.dmsLeadDto;
      const preDetails = action.payload.dmsAccountDto;
      orgId = preEnquiryDetails?.organizationId
        ? `${preEnquiryDetails?.organizationId}`
        : "0";
      let dmsAccountOrContactObj = {};
      if (action.payload.dmsAccountDto) {
        dmsAccountOrContactObj = action.payload.dmsAccountDto;
        if (!orgId) {
          orgId = `${dmsAccountOrContactObj["orgId"]}`;
        }
      } else {
        dmsAccountOrContactObj = action.payload.dmsContactDto;
        if (!orgId) {
          orgId = `${dmsAccountOrContactObj["orgId"]}`;
        }
      }

      state.firstName = preEnquiryDetails.firstName;
      state.lastName = preEnquiryDetails.lastName;
      state.mobile = preEnquiryDetails.phone;
      state.alterMobile = dmsAccountOrContactObj["secondaryPhone"] || "";
      state.email = preEnquiryDetails.email;

      state.pincode =
        action.payload.dmsAddressList.length > 0
          ? action.payload.dmsAddressList[0].pincode
          : "";
      state.carModel = preEnquiryDetails.model;
      if (preEnquiryDetails.enquirySegment) {
        state.enquiryType = preEnquiryDetails.enquirySegment;
        let data = state.customer_types_response;
        let newData = data?.filter(
          (val) => val?.enquiry_segment == preEnquiryDetails.enquirySegment
        );
        state.customer_type_list = newData;
        state.customerType = dmsAccountOrContactObj["customerType"] || "";
      } else {
        state.customerType = "";
        state.enquiryType = "";
        state.customer_type_list = [];
      }
      state.sourceOfEnquiry = preEnquiryDetails.enquirySource;
      state.sourceOfEnquiryId = preEnquiryDetails.sourceOfEnquiry;
      state.subSourceOfEnquiry = preEnquiryDetails.subSource;
      state.subSourceOfEnquiryId = preEnquiryDetails.subSourceOfEnquiry;
      state.companyName = dmsAccountOrContactObj["company"] || "";
      state.other = preEnquiryDetails.company;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPreEnquiry.pending, (state, action) => {
        state.isLoading = true;
        state.createEnquiryStatus = "pending";
        state.create_enquiry_response_obj = {};
      })
      .addCase(createPreEnquiry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.create_enquiry_response_obj = action.payload;
        state.createEnquiryStatus = "success";
      })
      .addCase(createPreEnquiry.rejected, (state, action) => {
        state.isLoading = false;
        state.create_enquiry_response_obj = action.payload;
        state.createEnquiryStatus = "failed";
      })
      .addCase(updatePreEnquiry.pending, (state, action) => {
        state.isLoading = true;
        state.create_enquiry_response_obj = {};
        state.updateEnquiryStatus = "pending";
      })
      .addCase(updatePreEnquiry.fulfilled, (state, action) => {
        if (action.payload.errorMessage) {
          showToast(action.payload.errorMessage);
        } else {
          state.create_enquiry_response_obj = action.payload;
        }
        state.isLoading = false;
        state.updateEnquiryStatus = "success";
      })
      .addCase(updatePreEnquiry.rejected, (state, action) => {
        state.isLoading = false;
        state.create_enquiry_response_obj = {};
        state.updateEnquiryStatus = "failed";
      })
      .addCase(continueToCreatePreEnquiry.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(continueToCreatePreEnquiry.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(continueToCreatePreEnquiry.rejected, (state, action) => {
        state.isLoading = false;
      })
      // Get Event List
      .addCase(getEventListApi.pending, (state, action) => {
        state.event_list = [];
        state.event_list_response_status = "pending";
        state.isLoading = true;
      })
      .addCase(getEventListApi.fulfilled, (state, action) => {
        if (action.payload) {
          state.event_list = action.payload;
        }
        state.event_list_response_status = "success";
        state.isLoading = false;
      })
      .addCase(getEventListApi.rejected, (state, action) => {
        state.event_list_response_status = "failed";
        state.isLoading = false;
      })

      // Get Event List configuration
      .addCase(getEventConfigList.pending, (state, action) => {
        state.event_list_Config = [];
        state.event_list_response_Config_status = "pending";
        state.isLoading = true;
      })
      .addCase(getEventConfigList.fulfilled, (state, action) => {
        if (action.payload) {
          state.event_list_Config = action.payload;
        }
        state.event_list_response_Config_status = "success";
        state.isLoading = false;
      })
      .addCase(getEventConfigList.rejected, (state, action) => {
        state.event_list_response_Config_status = "failed";
        state.isLoading = false;
        state.event_list_Config = [];
      })

      .addCase(getPreEnquiryDetails.pending, (state, action) => {})
      .addCase(getPreEnquiryDetails.fulfilled, (state, action) => {})
      .addCase(getPreEnquiryDetails.rejected, (state, action) => {});

    builder
      .addCase(getBranchList.pending, (state, action) => {
        state.branchList = [];
      })
      .addCase(getBranchList.fulfilled, (state, action) => {
        let newArr = [];
        for (let i = 0; i < action.payload.length; i++) {
          const element = action.payload[i];
          let newObj = {
            ...element,
            name: element.branchName,
          };
          newArr.push(newObj);
        }
        state.branchList = [...newArr];
      })
      .addCase(getBranchList.rejected, (state, action) => {
        state.branchList = [];
      });

    // Get Customer Types
    builder.addCase(getCustomerTypesApi.pending, (state, action) => {
      state.customer_types_response = [];
      state.isLoading = true;
    });
    builder.addCase(getCustomerTypesApi.fulfilled, (state, action) => {
      if (action.payload) {
        state.customer_types_response = action.payload;
      }
      state.isLoading = false;
    });
    builder.addCase(getCustomerTypesApi.rejected, (state, action) => {
      state.customer_types_response = [];
      state.isLoading = false;
    });
    builder.addCase(getEnquiryTypesApi.pending, (state, action) => {
      state.enquiry_type_list = [];
      state.isLoading = true;
    });
    builder.addCase(getEnquiryTypesApi.fulfilled, (state, action) => {
      state.enquiry_type_list = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getEnquiryTypesApi.rejected, (state, action) => {
      state.enquiry_type_list = [];
      state.isLoading = false;
    });
  },
});

export const {
  clearState,
  setCreateEnquiryCheckbox,
  setPreEnquiryDetails,
  setDropDownData,
  setCustomerTypeList,
  setExistingDetails,
  updateSelectedDate,
  updateEnqStatus,
} = addPreEnquirySlice.actions;
export default addPreEnquirySlice.reducer;
