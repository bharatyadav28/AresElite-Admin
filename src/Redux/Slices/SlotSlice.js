import { createSlice } from "@reduxjs/toolkit";

const SlotSlice = createSlice({
    name: "slot",
    initialState: {
        isFetching: false,
        error: false,
        errMsg: "",
        slots: [],
        doctor: {}
    },
    reducers: {
        getAllSlotStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        getAllSlotSuccess: (state, action) => {
            state.error = false;
            state.slots = action.payload.data;
            state.doctor = action.payload.doctors;
            state.isFetching = false;
        },
        getAllSlotFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        addSlotStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        addSlotSuccess: (state) => {
            state.error = false;
            state.isFetching = false;
        },
        addSlotFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        createSlotStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        createSlotSuccess: (state) => {
            state.error = false;
            state.isFetching = false;
        },
        createSlotFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        updateSlotStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateSlotSuccess: (state) => {
            state.error = false;
            state.isFetching = false;
        },
        updateSlotFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
    },
});

export const {
    getAllSlotStart,
    getAllSlotSuccess,
    getAllSlotFailure,
    addSlotStart,
    addSlotSuccess,
    addSlotFailure,
    createSlotStart,
    createSlotSuccess,
    createSlotFailure,
    updateSlotStart,
    updateSlotSuccess,
    updateSlotFailure,
} = SlotSlice.actions;
export default SlotSlice.reducer;