import { createSlice } from "@reduxjs/toolkit";

const ServiceSlice = createSlice({
    name: "Service",
    initialState: {
        isFetching: false,
        error: false,
        errMsg: "",
        Services: []
    },
    reducers: {
        getAllServiceStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        getAllServiceSuccess: (state, action) => {
            state.error = false;
            state.Services = action.payload.Services;
            state.isFetching = false;
        },
        getAllServiceFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        addServiceStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        addServiceSuccess: (state) => {
           
            state.error = false;
            state.isFetching = false;
        },
        addServiceFailure: (state, action) => {
           
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        updateServiceStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateServiceSuccess: (state) => {
           
            state.error = false;
            state.isFetching = false;
        },
        updateServiceFailure: (state, action) => {
          
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        removeServiceStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        removeServiceSuccess: (state) => {
          
            state.error = false;
            state.isFetching = false;
        },
        removeServiceFailure: (state, action) => {
           
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
    },
});

export const {
    getAllServiceStart,
    getAllServiceSuccess,
    getAllServiceFailure,
    addServiceStart,
    addServiceSuccess,
    addServiceFailure,
    updateServiceStart,
    updateServiceSuccess,
    updateServiceFailure,
    removeServiceStart,
    removeServiceSuccess,
    removeServiceFailure,
} = ServiceSlice.actions;
export default ServiceSlice.reducer;