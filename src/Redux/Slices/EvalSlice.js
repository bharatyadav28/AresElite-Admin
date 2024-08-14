import { createSlice } from "@reduxjs/toolkit";

const EvaluatiionSlice = createSlice({
    name: "evaluation",
    initialState: {
        isFetching: false,
        error: false,
        errMsg: "",
        evaluationform: []
    },
    reducers: {
        getAllEvalStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        getAllEvalSuccess: (state, action) => {
            state.error = false;
            state.evaluationform = action.payload;
            state.isFetching = false;
        },
        getAllEvalFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        addEvalStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        addEvalSuccess: (state, action) => {
            state.error = false;
            state.isFetching = false;
        },
        addEvalFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        }
    },
});

export const {
    getAllEvalStart,
    getAllEvalSuccess,
    getAllEvalFailure,
    addEvalStart,
    addEvalSuccess,
    addEvalFailure,
} = EvaluatiionSlice.actions;
export default EvaluatiionSlice.reducer;