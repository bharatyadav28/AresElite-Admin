import { createSlice } from "@reduxjs/toolkit";

const AthleteSlice = createSlice({
    name: "athletes",
    initialState: {
        isFetching: false,
        error: false,
        errMsg: "",
        msg: '',
        athletes: []
    },
    reducers: {
        getAllAthleteStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        getAllAthleteSuccess: (state, action) => {
            state.error = false;
            state.athletes = action.payload.data;
            state.isFetching = false;
        },
        getAllAthleteFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        addAthleteStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        addAthleteSuccess: (state, action) => {
            state.error = false;
            state.athletes = action.payload.data;
            state.isFetching = false;
            state.msg = action.payload.message;
        },
        addAthleteFailure: (state, action) => {
            state.errMsg = action.payload.message;
            state.isFetching = false;
            state.error = true;
        },
        removeAthleteStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        removeAthleteSuccess: (state, action) => {
            state.error = false;
            state.isFetching = false;
        },
        removeAthleteFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        updateAthleteStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateAthleteSuccess: (state) => {
            state.error = false;
            state.isFetching = false;
        },
        updateAthleteFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        }
    },
});

export const {
    getAllAthleteStart,
    getAllAthleteSuccess,
    getAllAthleteFailure,
    addAthleteStart,
    addAthleteSuccess,
    addAthleteFailure,
    removeAthleteStart,
    removeAthleteSuccess,
    removeAthleteFailure,
    updateAthleteStart,
    updateAthleteSuccess,
    updateAthleteFailure,
} = AthleteSlice.actions;
export default AthleteSlice.reducer;