import { createSlice } from "@reduxjs/toolkit";

const ClinicSlice = createSlice({
    name: "Clinics",
    initialState: {
        isFetching: false,
        error: false,
        errMsg: "",
        clinics: []
    },
    reducers: {
        getAllClinicsStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        getAllClinicsSuccess: (state, action) => {
            state.error = false;
            state.clinics = action.payload.data;
            state.isFetching = false;
        },
        getAllClinicsFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        addClinicStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        addClinicSuccess: (state, action) => {
            state.error = false;
            state.clinics = action.payload.data;
            state.isFetching = false;
        },
        addClinicFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        activateClinicStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        activateClinicSuccess: (state, action) => {
            state.error = false;
            state.clinics = action.payload.data;
            state.isFetching = false;
        },
        activateClinicFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        updateClinicStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        updateClinicSuccess: (state, action) => {
            state.error = false;
            state.clinics = action.payload.data;
            state.isFetching = false;
        },
        updateClinicFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        DeleteClinicStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        DeleteClinicSuccess: (state, action) => {
            state.error = false;
            state.clinics = action.payload.data;
            state.isFetching = false;
        },
        DeleteClinicFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
    },
});

export const {
    getAllClinicsStart,
    getAllClinicsSuccess,
    getAllClinicsFailure,
    updateClinicStart,
    updateClinicSuccess,
    updateClinicFailure,
    addClinicStart,
    addClinicSuccess,
    addClinicFailure,
    activateClinicStart,
    activateClinicSuccess,
    activateClinicFailure,
    DeleteClinicStart,
    DeleteClinicSuccess,
    DeleteClinicFailure,
} = ClinicSlice.actions;
export default ClinicSlice.reducer;