import { createSlice } from '@reduxjs/toolkit';


const data = [
    {
        id: 1,
        name: 'Mr. Sunil Prakash',
        role: 'Digital Marketing',
        date: '19 May 2020',
        vehicle: 'Aura',
        type: 'HOT',
        imageUrl: "https://image.flaticon.com/icons/png/512/3059/3059606.png",
    },
    {
        id: 2,
        name: 'Mr. Sunil Prakash',
        role: 'Digital Marketing',
        date: '19 May 2020',
        vehicle: 'Creta',
        type: 'WARM',
        imageUrl: "https://image.flaticon.com/icons/png/512/3059/3059606.png",
    },
    {
        id: 3,
        name: 'Mr. Sunil Prakash',
        role: 'Digital Marketing',
        date: '19 May 2020',
        vehicle: 'Elentra',
        type: 'COLD',
        imageUrl: "https://image.flaticon.com/icons/png/512/3059/3059606.png",
    },
    {
        id: 4,
        name: 'Mr. Sunil Prakash',
        role: 'Digital Marketing',
        date: '19 May 2020',
        vehicle: 'Elite i20',
        type: 'HOT',
        imageUrl: "https://image.flaticon.com/icons/png/512/3059/3059606.png",
    },
]

export const preEnquirySlice = createSlice({
    name: 'PRE_ENQUIRY',
    initialState: {
        sampleDataAry: data
    },
    reducers: {

    }
})

export const { } = preEnquirySlice.actions;
export default preEnquirySlice.reducer;