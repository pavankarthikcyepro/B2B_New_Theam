import { createSlice } from "@reduxjs/toolkit";

const DataList = [
  {
    universalId: "1-1-469f20c6-146e-409c-9029-3ff146cd544b",
    leadId: 374,
    firstName: "Yashvanth",
    lastName: "One",
    createdDate: 1624270138000,
    dateOfBirth: null,
    enquirySource: "Field",
    enquiryDate: 1624270137881,
    model: "Aura",
    enquirySegment: "Personal",
    phone: "1234569870",
    leadStage: "PREENQUIRY",
    customerType: "Self Employed",
    alternativeNumber: "",
    enquiryCategory: null,
    createdBy: "Ummireddi Ganapathi Rao",
    salesConsultant: null,
    email: "",
    leadStatus: null,
  },
  {
    universalId: "1-1-a6dbd770-565f-4205-8b00-18273f41228f",
    leadId: 373,
    firstName: "Yashvanth",
    lastName: "Three",
    createdDate: 1624270086000,
    dateOfBirth: null,
    enquirySource: "Field",
    enquiryDate: 1624270085672,
    model: "Aura",
    enquirySegment: "Personal",
    phone: "1234569870",
    leadStage: "PREENQUIRY",
    customerType: "Self Employed",
    alternativeNumber: "",
    enquiryCategory: null,
    createdBy: "Ummireddi Ganapathi Rao",
    salesConsultant: null,
    email: "",
    leadStatus: null,
  },
  {
    universalId: "1-1-a6dbd770-565f-4205-8b00-18273f41228f",
    leadId: 373,
    firstName: "Yashvanth",
    lastName: "Three",
    createdDate: 1624270086000,
    dateOfBirth: null,
    enquirySource: "Field",
    enquiryDate: 1624270085672,
    model: "Aura",
    enquirySegment: "Personal",
    phone: "1234569870",
    leadStage: "PREENQUIRY",
    customerType: "Self Employed",
    alternativeNumber: "",
    enquiryCategory: null,
    createdBy: "Ummireddi Ganapathi Rao",
    salesConsultant: null,
    email: "",
    leadStatus: null,
  },
  {
    universalId: "1-1-a6dbd770-565f-4205-8b00-18273f41228f",
    leadId: 373,
    firstName: "Yashvanth",
    lastName: "Three",
    createdDate: 1624270086000,
    dateOfBirth: null,
    enquirySource: "Field",
    enquiryDate: 1624270085672,
    model: "Aura",
    enquirySegment: "Personal",
    phone: "1234569870",
    leadStage: "PREENQUIRY",
    customerType: "Self Employed",
    alternativeNumber: "",
    enquiryCategory: null,
    createdBy: "Ummireddi Ganapathi Rao",
    salesConsultant: null,
    email: "",
    leadStatus: null,
  },
];
const enquirySlice = createSlice({
  name: "ENQUIRY",
  initialState: {
    enquiry_list: DataList,
    pageNumber: 0,
    totalPages: 1,
  },

  reducers: {},
});
export const {} = enquirySlice.actions;
export default enquirySlice.reducer;
