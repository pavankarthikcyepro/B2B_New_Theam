import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../networking/client";
import URL from "../networking/endpoints";
import { showToast } from "../utils/toast";

export const sentEmiCalculate = createAsyncThunk(
  "EMI_CALCULATOR_SLICE/sentEmiCalculate",
  async (payload, { rejectWithValue }) => {
    const response = await client.post(URL.EMI_CALCULATOR(), payload);
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue(json);
    }
    return json;
  }
);

interface TextModel {
  key: string;
  text: string;
}

const initialState = {
  isLoading: false,
  loanAmount: "",
  interestRate: "",
  loanTenure: "",
  emiResponse: ""
};

export const emiCalculatorReducer = createSlice({
  name: "EMI_CALCULATOR_SLICE",
  initialState: JSON.parse(JSON.stringify(initialState)),
  reducers: {
    clearEmiCalculatorData: () => JSON.parse(JSON.stringify(initialState)),
    setInputDetails: (state, action: PayloadAction<TextModel>) => {
      state.emiResponse = "";
      const { key, text } = action.payload;
      switch (key) {
        case "LOAN_AMOUNT":
          state.loanAmount = text;
          break;
        case "INTEREST_RATE":
          state.interestRate = text;
          break;
        case "LOAN_TENURE":
          state.loanTenure = text;
          break;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sentEmiCalculate.pending, (state, action) => {
        state.isLoading = true;
        state.emiResponse = "";
      })
      .addCase(sentEmiCalculate.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action?.payload) {
          state.emiResponse = action.payload
        }
      })
      .addCase(sentEmiCalculate.rejected, (state, action) => {
        state.isLoading = false;
        state.emiResponse = "";
        if (action.payload.message) {
          showToast(`${action.payload.message}`);
        } else {
          showToast(`Something went wrong`);
        }
      });
  },
});

export const { clearEmiCalculatorData, setInputDetails } =
  emiCalculatorReducer.actions;
export default emiCalculatorReducer.reducer;