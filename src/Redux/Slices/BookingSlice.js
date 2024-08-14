import { createSlice } from "@reduxjs/toolkit";

const BookingSlice = createSlice({
    name: "booking",
    initialState: {
        isFetching: false,
        error: false,
        errMsg: "",
        bookings: []
    },
    reducers: {
        getAllbookingStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        getAllbookingSuccess: (state, action) => {
            state.error = false;
            state.bookings = action.payload.appointments;
            state.isFetching = false;
        },
        getAllbookingFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        addbookingStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        addbookingSuccess: (state) => {

            state.error = false;
            state.isFetching = false;
        },
        addbookingFailure: (state, action) => {

            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        updatebookingStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updatebookingSuccess: (state) => {

            state.error = false;
            state.isFetching = false;
        },
        updatebookingFailure: (state, action) => {

            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        removebookingStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        removebookingSuccess: (state) => {

            state.error = false;
            state.isFetching = false;
        },
        removebookingFailure: (state, action) => {

            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
    },
});

export const {
    getAllbookingStart,
    getAllbookingSuccess,
    getAllbookingFailure,
    addbookingStart,
    addbookingSuccess,
    addbookingFailure,
    updatebookingStart,
    updatebookingSuccess,
    updatebookingFailure,
    removebookingStart,
    removebookingSuccess,
    removebookingFailure,
} = BookingSlice.actions;
export default BookingSlice.reducer;