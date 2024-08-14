import { createSlice } from "@reduxjs/toolkit";

const DoctorSlice = createSlice({
    name: "doctors",
    initialState: {
        isFetching: false,
        error: false,
        msg: '',
        doctors: [],
    },
    reducers: {
        getAllDocStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        getAllDocSuccess: (state, action) => {
            state.error = false;
            state.doctors = action.payload.data;
            state.isFetching = false;
        },
        getAllDocFailure: (state, action) => {
            state.msg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        addDocStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        addDocSuccess: (state, action) => {
            state.error = false;
            state.doctors = action.payload.data;
            state.isFetching = false;
            state.msg = action.payload.message;
        },
        addDocFailure: (state, action) => {
            state.msg = action.payload.message;
            state.isFetching = false;
            state.error = true;
        },
        removeDocStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        removeDocSuccess: (state, action) => {
            state.error = false;
            state.isFetching = false;
        },
        removeDocFailure: (state, action) => {
            state.msg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        updateDocStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateDocSuccess: (state) => {
            state.error = false;
            state.isFetching = false;
        },
        updateDocFailure: (state, action) => {
            state.msg = action.payload;
            state.isFetching = false;
            state.error = true;
        }
    },
});

export const {
    getAllDocStart,
    getAllDocSuccess,
    getAllDocFailure,
    addDocStart,
    addDocSuccess,
    addDocFailure,
    removeDocStart,
    removeDocSuccess,
    removeDocFailure,
    updateDocStart,
    updateDocSuccess,
    updateDocFailure,
} = DoctorSlice.actions;
export default DoctorSlice.reducer;