import { createSlice } from "@reduxjs/toolkit";

const DynamicDrillSlice = createSlice({
  name: "evaluation",
  initialState: {
    isFetching: false,
    error: false,
    errMsg: "",
    dynamicDrills: [],
  },
  reducers: {
    getAllDynamicDrills: (state, action) => {
      state.isFetching = true;
      state.error = false;
    },
    getAllDynamicDrillsSuccess: (state, action) => {
      state.error = false;
      state.dynamicDrills = action.payload;
      state.isFetching = false;
    },
    getAllDynamicDrillsFailure: (state, action) => {
      state.errMsg = action.payload;
      state.isFetching = false;
      state.error = true;
    },
    addDynamicDrillsStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
    },
    addDynamicDrillsSuccess: (state, action) => {
      state.error = false;
      state.isFetching = false;
    },
    addDynamicDrillsFailure: (state, action) => {
      state.errMsg = action.payload;
      state.isFetching = false;
      state.error = true;
    },

    updateDynamicDrillsStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
    },

    updateDynamicDrillsSuccess: (state, action) => {
      state.error = false;
      state.isFetching = false;
    },
    updateDynamicDrillsFailure: (state, action) => {
      state.errMsg = action.payload;
      state.isFetching = false;
      state.error = true;
    },

    deleteDynamicDrillsStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
    },

    deleteDynamicDrillsSuccess: (state, action) => {
      state.error = false;
      state.isFetching = false;
    },
    deleteDynamicDrillsFailure: (state, action) => {
      state.errMsg = action.payload;
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  getAllDynamicDrills,
  getAllDynamicDrillsSuccess,
  getAllDynamicDrillsFailure,
  addDynamicDrillsStart,
  addDynamicDrillsSuccess,
  addDynamicDrillsFailure,
  updateDynamicDrillsStart,
  updateDynamicDrillsSuccess,
  updateDynamicDrillsFailure,
  deleteDynamicDrillsStart,
  deleteDynamicDrillsSuccess,
  deleteDynamicDrillsFailure,
} = DynamicDrillSlice.actions;
export default DynamicDrillSlice.reducer;
