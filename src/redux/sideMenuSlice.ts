import { createSlice } from '@reduxjs/toolkit';
import { SETTINGS, SCHEDULE_FILL } from '../assets/svg';

const data = [
    {
        title: "Upcoming Deliveries",
        icon: SETTINGS,
        screen: 100
    },
    {
        title: "Complaints",
        icon: SCHEDULE_FILL,
        screen: 101
    },
    {
        title: "Settings",
        icon: SETTINGS,
        screen: 102
    }
]

export const sideMenuSlice = createSlice({
    name: 'SIDE_MENU',
    initialState: {
        tableData: data
    },
    reducers: {

    }
})

export const { } = sideMenuSlice.actions;
export default sideMenuSlice.reducer;