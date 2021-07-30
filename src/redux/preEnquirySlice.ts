import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from '../networking/client';
import URL from "../networking/endpoints";

const data = [
  {
    id: 1,
    name: "Mr. Sunil Prakash",
    role: "Digital Marketing",
    date: "19 May 2020",
    vehicle: "Aura",
    type: "HOT",
    imageUrl: "https://image.flaticon.com/icons/png/512/3059/3059606.png",
  },
  {
    id: 2,
    name: "Mr. Sunil Prakash",
    role: "Digital Marketing",
    date: "19 May 2020",
    vehicle: "Creta",
    type: "WARM",
    imageUrl: "https://image.flaticon.com/icons/png/512/3059/3059606.png",
  },
  {
    id: 3,
    name: "Mr. Sunil Prakash",
    role: "Digital Marketing",
    date: "19 May 2020",
    vehicle: "Elentra",
    type: "COLD",
    imageUrl: "https://image.flaticon.com/icons/png/512/3059/3059606.png",
  },
  {
    id: 4,
    name: "Mr. Sunil Prakash",
    role: "Digital Marketing",
    date: "19 May 2020",
    vehicle: "Elite i20",
    type: "HOT",
    imageUrl: "https://image.flaticon.com/icons/png/512/3059/3059606.png",
  },
];

export const getPreEnquiryData = createAsyncThunk('PRE_ENQUIRY/getPreEnquiryData', async (inputData) => {

  let url = URL.LEADS_LIST_API() + "?limit=10&offset=" + 0 + "&status=PREENQUIRY&empId=" + 2;
  const response = await client.get(url);
  return response
})

export const preEnquirySlice = createSlice({
  name: "PRE_ENQUIRY",
  initialState: {
    sampleDataAry: data,
    modelVisible: false,
    sortAndFilterVisible: false,
    pageNum: 0
  },
  reducers: {
    callPressed: (state, action) => {
      state.modelVisible = !state.modelVisible;
    },
    sortAndFilterPressed: (state, action) => {
      state.sortAndFilterVisible = !state.sortAndFilterVisible;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getPreEnquiryData.pending, (state) => {

    })
    builder.addCase(getPreEnquiryData.fulfilled, (state, action) => {
      console.log('res: ', action.payload);
    })
    builder.addCase(getPreEnquiryData.rejected, (state) => {

    })
  }
});

export const { callPressed, sortAndFilterPressed } = preEnquirySlice.actions;
export default preEnquirySlice.reducer;
