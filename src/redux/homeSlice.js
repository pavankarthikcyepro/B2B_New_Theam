import { createSlice } from '@reduxjs/toolkit';

const data = [
    {
        title: "Pre-Enquiry",
        count: 12
    },
    {
        title: "My Task",
        count: 10
    }
]

const dates = [
    {
        month: "MAY",
        date: 1,
        day: "Mon"
    },
    {
        month: "MAY",
        date: 2,
        day: 'Tue'
    },
    {
        month: "MAY",
        date: 3,
        day: 'Wed'
    },
    {
        month: "MAY",
        date: 4,
        day: 'Thu'
    },
    {
        month: "MAY",
        date: 5,
        day: 'Fri'
    },
]

export const homeSlice = createSlice({
    name: 'HOME',
    initialState: {
        serchtext: "",
        tableData: data,
        datesData: dates,
        dateSelectedIndex: 0
    },
    reducers: {
        dateSelected: (state, action) => {
            state.dateSelectedIndex = action.payload;
        }
    }
})

export const { dateSelected } = homeSlice.actions;
export default homeSlice.reducer;