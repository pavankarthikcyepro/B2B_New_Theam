import { createSlice } from '@reduxjs/toolkit';

const newData = [
    {
        title: "Today",
        data: [
            {
                name: "You have been assigned a target for Aug 20",
                date: "2 hours ago"
            },
            {
                name: "General visitor request created for Aziz Khan @ 1PM",
                date: "5 hours ago"
            },
            {
                name: "You have a new missed activity under general tasks due for 3 days",
                date: "5 hours ago"
            },
            {
                name: "General visitor request created for Aziz Khan @ 1PM",
                date: "7 hours ago"
            }
        ]
    },
    {
        title: "Yesterday",
        data: [
            {
                name: "You have been assigned a target for Aug 20",
                date: "6 hours ago"
            },
            {
                name: "General visitor request created for Aziz Khan @ 1PM",
                date: "3 hours ago"
            },
            {
                name: "You have a new missed activity under general tasks due for 3 days",
                date: "4 hours ago"
            },
        ]
    },
    {
        title: "July 7",
        data: [
            {
                name: "You have been assigned a target for Aug 20",
                date: "1 hours ago"
            },
            {
                name: "General visitor request created for Aziz Khan @ 1PM",
                date: "2 hours ago"
            },
            {
                name: "You have a new missed activity under general tasks due for 3 days",
                date: "3 hours ago"
            },
        ]
    }
]

export const notificationSlice = createSlice({
    name: 'NOTIFICATIONS',
    initialState: {
        tableData: newData
    },
    reducers: {

    }
})

export const { } = notificationSlice.actions;
export default notificationSlice.reducer;