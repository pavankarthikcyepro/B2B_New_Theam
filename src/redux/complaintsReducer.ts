import { createSlice } from "@reduxjs/toolkit";

const data = [
  {
    complaintFactor: "Exchange price dissatisfaction",
    name: "Mr. Suresh Vishwas",
    place: "Hyderabad",
    enquiryID: "Enq190022342",
    enquiryDate: "14-02-2021",
    source: "Digital",
    dse: "Mahesh",
    car: "Elantra (VTTVTS/ Petrol/ Manual)",
    text: "I was not given the brochure to the home visit and was not happy with the service..",
  },
  {
    complaintFactor: "Quality of service",
    name: "Mr. Suresh Vishwas",
    place: "Hyderabad",
    enquiryID: "Enq190022342",
    enquiryDate: "14-02-2021",
    source: "Digital",
    dse: "Mahesh",
    car: "Elantra (VTTVTS/ Petrol/ Manual)",
    text: "I was not given the brochure to the home visit and was not happy with the service..",
  },
];

export const complaintsSlice = createSlice({
  name: "COMPLAINTS",
  initialState: {
    tableAry: data,
  },
  reducers: {},
});

export const {} = complaintsSlice.actions;
export default complaintsSlice.reducer;
