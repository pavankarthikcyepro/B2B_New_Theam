import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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

const initialState = {
  // Customer Address
  pincode: "",
  urban_or_rural: 0,
  houseNum: "",
  streetName: "",
  village: "",
  mandal: "",
  city: "",
  district: "",
  state: "",
  isAddressSet: false,
};

const editCustomerInfoReducer = createSlice({
  name: "EDIT_CUSTOMER_INFO_SLICE",
  initialState: JSON.parse(JSON.stringify(initialState)),
  reducers: {
    clearStateData: () => JSON.parse(JSON.stringify(initialState)),
    setDropDownData: (state, action: PayloadAction<DropDownModelNew>) => {
      const { key, value, id } = action.payload;
    },
    setCommunicationAddress: (
      state,
      action: PayloadAction<PersonalIntroModel>
    ) => {
      const { key, text } = action.payload;
      switch (key) {
        case "PINCODE":
          state.pincode = text;
          break;
        case "RURAL_URBAN":
          state.urban_or_rural = Number(text);
          break;
        case "HOUSE_NO":
          state.houseNum = text;
          break;
        case "STREET_NAME":
          state.streetName = text;
          break;
        case "VILLAGE":
          state.village = text;
          break;
        case "MANDAL":
          state.mandal = text;
          break;
        case "CITY":
          state.city = text;
          break;
        case "STATE":
          state.state = text;
          break;
        case "DISTRICT":
          state.district = text;
          break;
      }
    },
    updateAddressByPincode: (state, action) => {
      state.village = action.payload.Block || "";
      state.mandal = state.mandal ? state.mandal : action.payload.Mandal || "";
      state.city = action.payload.District || "";
      state.district = action.payload.District || "";
      state.state = action.payload.State || "";
      if (Object.keys(action.payload).length > 0) {
        state.isAddressSet = true;
      } else {
        state.isAddressSet = false;
      }
    },
  },
});

export const {
  clearStateData,
  setDropDownData,
  setCommunicationAddress,
  updateAddressByPincode,
} = editCustomerInfoReducer.actions;
export default editCustomerInfoReducer.reducer;