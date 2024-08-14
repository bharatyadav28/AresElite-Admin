import { createSlice } from "@reduxjs/toolkit";

const PlanSlice = createSlice({
    name: "Plan",
    initialState: {
        isFetching: false,
        error: false,
        errMsg: "",
        Plans: []
    },
    reducers: {
        getAllPlanStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        getAllPlanSuccess: (state, action) => {
            state.error = false;
            state.Plans = action.payload.plans;
            state.isFetching = false;
        },
        getAllPlanFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        addPlanStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        addPlanSuccess: (state) => {
           
            state.error = false;
            state.isFetching = false;
        },
        addPlanFailure: (state, action) => {
           
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        updatePlanStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updatePlanSuccess: (state) => {
           
            state.error = false;
            state.isFetching = false;
        },
        updatePlanFailure: (state, action) => {
          
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        removePlanStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        removePlanSuccess: (state) => {
          
            state.error = false;
            state.isFetching = false;
        },
        removePlanFailure: (state, action) => {
           
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
    },
});

export const {
    getAllPlanStart,
    getAllPlanSuccess,
    getAllPlanFailure,
    addPlanStart,
    addPlanSuccess,
    addPlanFailure,
    updatePlanStart,
    updatePlanSuccess,
    updatePlanFailure,
    removePlanStart,
    removePlanSuccess,
    removePlanFailure,
} = PlanSlice.actions;
export default PlanSlice.reducer;