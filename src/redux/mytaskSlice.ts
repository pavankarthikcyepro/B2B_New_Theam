import { createSlice } from '@reduxjs/toolkit';


const datalist = [
    {
        taskName: "Proceed to Booking",
        taskStatus: "ASSIGNED",
        createdOn: "Tue Jun 29 2021",
        dmsLead: "GSGHS Vshsj",
        phoneNo: "+91 8488464949",
    },
    {
        taskName: "Test Drive",
        taskStatus: "SENT_FOR_APPROVAL",
        createdOn: "Tue Jun 29 2021",
        dmsLead: "GSGHS Vshsj",
        phoneNo: "+91 8488464949",
    },
    {
        taskName: "Pre Booking Follow Up",
        taskStatus: "ASSIGNED",
        createdOn: "Tue Jun 29 2021",
        dmsLead: "GSGHS Vshsj",
        phoneNo: "+91 8488464949",
    },
    {
        taskName: "Home Visit",
        taskStatus: "ASSIGNED",
        createdOn: "Tue Jun 29 2021",
        dmsLead: "GSGHS Vshsj",
        phoneNo: "+91 8488464949",
    },
    {
        taskName: "Enguiry Follow Up",
        taskStatus: "ASSIGNED",
        createdOn: "Tue Jun 29 2021",
        dmsLead: "GSGHS Vshsj",
        phoneNo: "+91 8488464949",
    },
];

export const mytaskSlice = createSlice({
    name: 'MY_TASKS',
    initialState: {
        tableData: datalist
    },
    reducers: {

    }
})

export const { } = mytaskSlice.actions;
export default mytaskSlice.reducer;