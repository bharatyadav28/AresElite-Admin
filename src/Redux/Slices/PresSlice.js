import { createSlice } from "@reduxjs/toolkit";

const PrescriptionSlice = createSlice({
    name: "prescription",
    initialState: {
        isFetching: false,
        error: false,
        errMsg: "",
        prescriptionform: []
    },
    reducers: {
        getAllPresStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        getAllPresSuccess: (state, action) => {
            state.error = false;
            state.prescriptionform = action.payload;
            state.isFetching = false;
        },
        getAllPresFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        addPresStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        addPresSuccess: (state, action) => {
            state.error = false;
            state.isFetching = false;
        },
        addPresFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        }
    },
});

export const {
    getAllPresStart,
    getAllPresSuccess,
    getAllPresFailure,
    addPresStart,
    addPresSuccess,
    addPresFailure,
} = PrescriptionSlice.actions;
export default PrescriptionSlice.reducer;