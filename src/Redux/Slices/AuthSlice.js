import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");
const userInfoString = localStorage.getItem("userInfo");

// Parse the stored string back to an object
const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token,
    userInfo,
    isFetching: false,
    error: false,
    errMsg: "",
  },
  reducers: {
    loginStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      state.errMsg = "";
      state.isFetching = false;
      state.error = false;
      state.userInfo = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem("token", state.token);
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
    },
    loginFailure: (state, action) => {
      state.errMsg = action.payload;
      state.isFetching = false;
      state.error = true;
    },

    UpdateStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
    },
    UpdateSuccess: (state, action) => {
      state.errMsg = "";
      state.isFetching = false;
      state.userInfo = action.payload.user;
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
    },
    UpdateFailure: (state, action) => {
      state.errMsg = action.payload;
      state.isFetching = false;
      state.error = true;
    },
    logOut: (state, action) => {
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
    },
  },
});

export const {
  logOut,
  loginStart,
  loginSuccess,
  loginFailure,
  UpdateStart,
  UpdateSuccess,
  UpdateFailure,
} = authSlice.actions;
export default authSlice.reducer;
