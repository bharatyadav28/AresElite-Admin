import { createSlice } from "@reduxjs/toolkit";


// Parse the stored string back to an object

const usersSlice = createSlice({
    name: "auth",
    initialState: {
        users: [],
        isFetching: false,
        error: false,
        errMsg: "",
        msg: '',
        currentPage: 1,
        totalPages: 1
    },
    reducers: {
        getStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        getSuccess: (state, action) => {
            state.errMsg = "";
            state.isFetching = false;
            state.users = action.payload.users;
            state.msg = "Success";
            state.error = false;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
        },
        getFailure: (state, action) => {
            state.msg = action?.payload?.message;
            state.isFetching = false;
            state.error = true;
        },
        deleteStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        deleteSuccess: (state, action) => {
            state.msg = action?.payload?.message;
            state.isFetching = false;
            state.users = action.payload.users;
        },
        deleteFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        activateStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        activateSuccess: (state, action) => {
            state.msg = action?.payload?.message;
            state.isFetching = false;
            state.users = action.payload.users;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
        },
        activateFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
        updateStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
        },
        updateSuccess: (state, action) => {
            state.msg = action?.payload?.message;
            state.isFetching = false;
        },
        updateFailure: (state, action) => {
            state.errMsg = action.payload;
            state.isFetching = false;
            state.error = true;
        },
    },
});

export const {
    getStart,
    getSuccess,
    getFailure,
    deleteStart,
    deleteSuccess,
    deleteFailure,
    activateStart,
    activateSuccess,
    activateFailure,
    updateStart,
    updateSuccess,
    updateFailure,
} = usersSlice.actions;
export default usersSlice.reducer;
