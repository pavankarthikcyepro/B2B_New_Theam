import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HomeVisitTextModel {
    key: string,
    text: string
}

const slice = createSlice({
    name: "HOME_VISIT_SLICE",
    initialState: {
        reason: "",
        customer_remarks: "",
        employee_remarks: ""
    },
    reducers: {
        setHomeVisitDetails: (state, action: PayloadAction<HomeVisitTextModel>) => {
            const { key, text } = action.payload;
            switch (key) {
                case "REASON":
                    state.reason = text;
                    break;
                case "CUSTOMER_REMARKS":
                    state.customer_remarks = text;
                    break;
                case "EMPLOYEE_REMARKS":
                    state.employee_remarks = text;
                    break;
            }
        }
    }
});

export const { setHomeVisitDetails } = slice.actions;
export default slice.reducer;