import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import {
  IssueStates,
  IssueCategory,Status
} from "../jsonData/raiseTicketScreenJsonData";


interface TextModel {
  key: string;
  text: string;
}

interface DropDownModel {
  key: string;
  value: string;
  id: string;
}

interface Item {
  name: string;
  id: string;
}


export const raiseTicketSlice = createSlice({
  name: "RAISE_A_TICKET",
  initialState: {
    issue_states_list: IssueStates,
    issue_categories_list: IssueCategory,
    ticket_status_list: Status,
    description:"",
    status: "",
    errorMsg: "",
    issue_state:"",
    issue_category:"",
    ticket_status:"",
    image:"",
    showImagePicker:false,
    imagePickerKeyId:"",
    isLoading:false
  },
  reducers: {
    clearState: (state) => {
      state.isLoading = false;
      state.status = "";
      state.errorMsg = "";
      state.description="";
      state.issue_state="";
      state.issue_category="";
      state.ticket_status="";
      state.image="";
      state.showImagePicker=false;
      state.issue_categories_list=null;
      state.issue_states_list=null;
      state.ticket_status_list=null;
    },
   
    setDropDownData: (state, action: PayloadAction<DropDownModel>) => {
      const { key, value, id } = action.payload; 
      switch (key) {
        case "ISSUE_STATES":
          state.issue_state = value;
        //   state.issue_states_list = CustomerTypesObj[value.toLowerCase()];
        //   state.customerType = "";
          break;
        case "ISSUE_CATEGORIES":
          state.issue_category = value;
          break;
        case "TICKET_STATUS":
          state.ticket_status = value;
          break;
      }
    },
   
    setDescriptionDetails: (state, action: PayloadAction<TextModel>) => {
      const { key, text } = action.payload;
      switch (key) {
        case "DESCRIPTION":
          state.description = text;
          break;
      }
    },
      setImagePicker: (state, action) => {
        console.log(action,"action >>>>>");    
        state.image = action.payload;
        state.showImagePicker = !state.showImagePicker;
    },

  },
});

export const {
   clearState,
   setDescriptionDetails,
   setDropDownData,
   setImagePicker
} = raiseTicketSlice.actions;
export default raiseTicketSlice.reducer;
