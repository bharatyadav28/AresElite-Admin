import Swal from "sweetalert2";
import {
  getAllDocStart,
  getAllDocSuccess,
  getAllDocFailure,
  addDocStart,
  addDocSuccess,
  addDocFailure,
  removeDocStart,
  removeDocSuccess,
  removeDocFailure,
} from "./Slices/DoctorSlice";

import {
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
} from "./Slices/BookingSlice";

import {
  addAthleteStart,
  addAthleteSuccess,
  addAthleteFailure,
} from "./Slices/AthleteSlice";

import {
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
} from "./Slices/UsersSlice";

import {
  getAllPresStart,
  getAllPresSuccess,
  getAllPresFailure,
  addPresStart,
  addPresSuccess,
  addPresFailure,
} from "./Slices/PresSlice";

import {
  getAllSlotStart,
  getAllSlotSuccess,
  getAllSlotFailure,
  addSlotStart,
  addSlotSuccess,
  addSlotFailure,
  updateSlotStart,
  updateSlotSuccess,
  updateSlotFailure,
} from "./Slices/SlotSlice";

import {
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
} from "./Slices/ServiceSlice";

import {
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
} from "./Slices/PlansSlice";

import {
  getAllEvalStart,
  getAllEvalSuccess,
  getAllEvalFailure,
  addEvalStart,
  addEvalSuccess,
  addEvalFailure,
} from "./Slices/EvalSlice";

import { loginStart, loginSuccess, loginFailure } from "./Slices/AuthSlice";

import {
  getAllClinicsStart,
  getAllClinicsSuccess,
  getAllClinicsFailure,
  addClinicStart,
  addClinicSuccess,
  addClinicFailure,
  activateClinicStart,
  activateClinicSuccess,
  activateClinicFailure,
  DeleteClinicStart,
  DeleteClinicSuccess,
  DeleteClinicFailure,
  updateClinicStart,
  updateClinicSuccess,
  updateClinicFailure,
} from "./Slices/ClinicSlice";

import axiosInstance from "../utils/axiosUtil";
import {
  addDynamicDrillsFailure,
  addDynamicDrillsStart,
  addDynamicDrillsSuccess,
  getAllDynamicDrills,
  getAllDynamicDrillsFailure,
  getAllDynamicDrillsSuccess,
  updateDynamicDrillsStart,
  updateDynamicDrillsSuccess,
  updateDynamicDrillsFailure,
  deleteDynamicDrillsStart,
  deleteDynamicDrillsSuccess,
} from "./Slices/DynamicDrillsSlice";
let token = localStorage.getItem("token");

export const GetAllDoctors = async (dispatch) => {
  dispatch(getAllDocStart());
  try {
    const { data } = await axiosInstance.get("/api/admin/get_all_doctor", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(getAllDocSuccess(data));
  } catch (error) {
    dispatch(getAllDocFailure(error?.response?.data?.error));
  }
};

export const AddDoctor = async (dispatch, formdata) => {
  dispatch(addDocStart());
  try {
    const { data } = await axiosInstance.post(
      "/api/admin/register_doctor",
      formdata,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    Swal.fire({
      icon: "success",
      title: "Done...",
      text: "A Doctor profile is added successfully",
    });
    dispatch(addDocSuccess(data));
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error?.response?.data?.error?.message,
    });
    dispatch(addDocFailure(error?.response?.data?.error));
  }
};

export const updateDoctor = async (dispatch, formdata, id) => {
  dispatch(updateStart());
  try {
    const { data } = await axiosInstance.put(
      "/api/admin/update_user",
      formdata,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id,
        },
      }
    );
    Swal.fire({
      icon: "success",
      title: "Done...",
      text: "A Doctor profile is updated successfully",
    });
    dispatch(updateSuccess(data));
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error?.response?.data?.error?.message,
    });
    dispatch(updateFailure(error?.response?.data?.error));
  }
};

export const updateAthlete = async (dispatch, formdata, id) => {
  dispatch(updateStart());
  try {
    const { data } = await axiosInstance.put(
      "/api/admin/update_user",
      formdata,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id,
        },
      }
    );
    Swal.fire({
      icon: "success",
      title: "Done...",
      text: "A Athlete profile is updated successfully",
    });
    dispatch(updateSuccess(data));
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error?.response?.data?.error?.message,
    });
    dispatch(updateFailure(error?.response?.data?.error));
  }
};

export const AddAthlete = async (dispatch, formdata) => {
  dispatch(addAthleteStart());
  try {
    const { data } = await axiosInstance.post(
      "/api/admin/register_athlete",
      formdata,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    Swal.fire({
      icon: "success",
      title: "Done...",
      text: "Athlete profile has been added successfully",
    });
    dispatch(addAthleteSuccess(data));
    return data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error?.response?.data?.error?.message,
    });
    dispatch(addAthleteFailure(error?.response?.data?.error));
  }
};

export const RemoveDoctor = async (dispatch, formdata) => {
  const { Id } = formdata;
  dispatch(removeDocStart());
  try {
    const { data } = await axiosInstance.delete("/api/admin/delete_doc", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id: Id,
      },
    });
    dispatch(removeDocSuccess(data));
  } catch (error) {
    dispatch(removeDocFailure(error?.response?.data?.error));
  }
};

export const GetAllClinics = async (dispatch) => {
  dispatch(getAllClinicsStart());
  try {
    const { data } = await axiosInstance.get("/api/admin/get_all_clinics", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(getAllClinicsSuccess(data));
  } catch (error) {
    dispatch(getAllClinicsFailure(error?.response?.data?.error));
  }
};

export const GetAllSlots = async (dispatch, date) => {
  await GetAllDoctors(dispatch);
  await GetAllClinics(dispatch);
  dispatch(getAllSlotStart());
  try {
    const { data } = await axiosInstance.get("/api/admin/get_all_slots", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        date,
      },
    });
    dispatch(getAllSlotSuccess(data));
  } catch (error) {
    dispatch(getAllSlotFailure(error?.response?.data?.error));
  }
};

export const GetAllServices = async (dispatch) => {
  dispatch(getAllServiceStart());
  try {
    const { data } = await axiosInstance.get("/api/admin/service", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(getAllServiceSuccess(data));
  } catch (error) {
    dispatch(getAllServiceFailure(error?.response?.data?.error));
  }
};

export const GetAllPlans = async (dispatch) => {
  dispatch(getAllPlanStart());
  try {
    const { data } = await axiosInstance.get("/api/admin/plans", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(getAllPlanSuccess(data));
  } catch (error) {
    dispatch(getAllPlanFailure(error?.response?.data?.error));
  }
};

export const UpdateService = async (dispatch, formdata, id) => {
  dispatch(updateServiceStart());
  try {
    const { data } = await axiosInstance.put("/api/admin/service", formdata, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id,
      },
    });
    dispatch(updateServiceSuccess(data));
  } catch (error) {
    dispatch(updateServiceFailure(error?.response?.data?.error));
  }
};

export const RemoveService = async (dispatch, formdata) => {
  const { Id } = formdata;
  dispatch(removeServiceStart());
  try {
    const { data } = await axiosInstance.delete("/api/admin/service", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id: Id,
      },
    });
    dispatch(removeServiceSuccess(data));
  } catch (error) {
    dispatch(removeServiceFailure(error?.response?.data?.error));
  }
};

export const AddSlot = async (dispatch, formdata) => {
  dispatch(addSlotStart());
  try {
    const { data } = await axiosInstance.post("/api/admin/add_slot", formdata, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    Swal.fire({
      icon: "success",
      title: "Done...",
      text: "Slot added successfully.",
    });

    dispatch(addSlotSuccess(data));
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "oops...",
      text: error?.response?.data?.error?.message,
    });
    dispatch(addSlotFailure(error?.response?.data?.error));
  }
};

export const updateSlot = async (dispatch, id, formDataUpdate, date) => {
  dispatch(updateSlotStart());
  try {
    const { data } = await axiosInstance.put(
      "/api/admin/slot",
      formDataUpdate,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id,
          date,
        },
      }
    );
    Swal.fire({
      icon: "success",
      title: "Done...",
      text: "Slot updated successfully",
    });
    dispatch(updateSlotSuccess(data));
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "oops...",
      text: error?.response?.data?.error?.message,
    });
    dispatch(updateSlotFailure(error?.response?.data?.error));
  }
};

export const AddService = async (dispatch, formdata) => {
  dispatch(addServiceStart());
  try {
    const { data } = await axiosInstance.post("/api/admin/service", formdata, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(addServiceSuccess(data));
  } catch (error) {
    dispatch(addServiceFailure(error?.response?.data?.error));
  }
};

export const GetPrescriptionForm = async (dispatch) => {
  dispatch(getAllPresStart());
  try {
    const { data } = await axiosInstance.get("/api/doctor/get-pres-form", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(getAllPresSuccess(data));
  } catch (error) {
    dispatch(getAllPresFailure(error?.response?.data?.error));
  }
};

export const SetPrescriptionForm = async (dispatch, formdata) => {
  dispatch(addPresStart());
  try {
    const { data } = await axiosInstance.post(
      "/api/admin/set_pres_form",
      formdata,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(addPresSuccess(data));
  } catch (error) {
    dispatch(addPresFailure(error?.response?.data?.error));
  }
};

export const SetEvaluationForm = async (dispatch, formdata) => {
  dispatch(addEvalStart());
  try {
    const { data } = await axiosInstance.post(
      "/api/admin/set_eval_form",
      formdata,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(addEvalSuccess(data));
  } catch (error) {
    dispatch(addEvalFailure(error?.response?.data?.error));
  }
};

export const GetEvaluationForm = async (dispatch) => {
  dispatch(getAllEvalStart());
  try {
    const { data } = await axiosInstance.get("/api/doctor/get-eval-form", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(getAllEvalSuccess(data));
  } catch (error) {
    dispatch(getAllEvalFailure(error?.response?.data?.error));
  }
};

export const AddClinic = async (dispatch, formdata) => {
  const { name, address } = formdata;
  dispatch(addClinicStart());
  try {
    const { data } = await axiosInstance.post(
      "/api/admin/register_clinic",
      { name, address },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(addClinicSuccess(data));
  } catch (error) {
    dispatch(addClinicFailure(error?.response?.data?.error));
  }
};

export const Login = async (dispatch, formdata) => {
  dispatch(loginStart());
  try {
    const { data } = await axiosInstance.post("/api/admin/login", formdata);
    token = data.token;
    localStorage.setItem("token", data.token);
    Swal.fire({
      icon: "success",
      title: "Lets go...",
      text: "Logged in!",
    });
    dispatch(loginSuccess(data));
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.response.data.error.message,
    });
    dispatch(loginFailure(error?.response?.data?.error));
  }
};

export const GetAllUsers = async (dispatch, page, searchQuery, userType) => {
  dispatch(getStart());
  let role = "athlete,doctor";
  console.log("USer type", userType);
  if (userType) {
    role = userType;
  }
  try {
    const { data } = await axiosInstance.get("/api/admin/get_all_users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page_no: page,
        searchQuery: searchQuery,
        role: role,
      },
    });
    dispatch(getSuccess(data));
  } catch (error) {
    dispatch(getFailure(error?.response?.data?.error));
  }
};

export const GetAllShipmentUsers = async (
  dispatch,
  page,
  searchQuery,
  filters
) => {
  try {
    let filter = null;
    if (filters && (!filters.completed || !filters.pending)) {
      filter = filters.completed;
    }
    console.log("filter", filter);
    const { data } = await axiosInstance.get(
      `/api/admin/get_all_shipment_users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page_no: page,
          searchQuery: searchQuery,
          filter: filter,
        },
      }
    );
    return data;
  } catch (error) {
    dispatch(getFailure(error?.response?.data?.error));
  }
};

export const DeleteUser = async (dispatch, id) => {
  dispatch(deleteStart());
  try {
    const { data } = await axiosInstance.delete("/api/admin/delete_user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id,
      },
    });
    dispatch(deleteSuccess(data));
  } catch (error) {
    dispatch(deleteFailure(error?.response?.data?.error));
  }
};

export const DeleteClinic = async (dispatch, id) => {
  dispatch(DeleteClinicStart());
  try {
    const { data } = await axiosInstance.delete("/api/admin/delete_clinic", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id,
      },
    });
    if (!data.success) {
      throw new Error(data.error.message); // Throw the error if success is false
    }
    dispatch(DeleteClinicSuccess(data));
    return data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "oops...",
      text: error?.response?.data?.error?.message || "Clinic deletion failed",
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    dispatch(DeleteClinicFailure(error?.response?.data?.error));
  }
};

export const updateClinic = async (dispatch, id, formJson) => {
  dispatch(updateClinicStart());
  try {
    const { data } = await axiosInstance.put(
      "/api/admin/update_clinic",
      { data: formJson },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          clinicId: id,
        },
      }
    );
    Swal.fire({
      icon: "success",
      title: "Done...",
      text: "Clinic is updated successfully",
    });
    dispatch(updateClinicSuccess(data));
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "oops...",
      text: "Clinic is updation failed",
    });
    dispatch(updateClinicFailure(error?.response?.data?.error));
  }
};

export const ActivateUser = async (dispatch, id, currentPage) => {
  dispatch(activateStart());
  try {
    const { data } = await axiosInstance.get("/api/admin/make_active_user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id,
      },
    });
    if (currentPage) {
      data.currentPage = currentPage;
    }
    dispatch(activateSuccess(data));
  } catch (error) {
    dispatch(activateFailure(error?.response?.data?.error));
  }
};

export const ActivateClinic = async (dispatch, id, value) => {
  dispatch(activateClinicStart());
  try {
    const { data } = await axiosInstance.get("/api/admin/make_active_clinic", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id,
        date: value.$d,
      },
    });
    dispatch(activateClinicSuccess(data));
  } catch (error) {
    dispatch(activateClinicFailure(error?.response?.data?.error));
  }
};

export const GetBookings = async (dispatch, doctor, type) => {
  dispatch(getAllbookingStart());
  try {
    const { data } = await axiosInstance.get("/api/admin/get_bookings_by_doc", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        doctor,
        type,
      },
    });
    dispatch(getAllbookingSuccess(data));
  } catch (error) {
    dispatch(getAllbookingFailure(error?.response?.data?.error));
  }
};

export const GetAllDynamicDrills = async (dispatch, filterName) => {
  dispatch(getAllDynamicDrills());
  try {
    let url = `/api/admin/dynamic-drills`;
    if (filterName) {
      url += `?filterName=${filterName}`;
    }
    const { data } = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const dynamicDrills = data.dynamicDrills.sort((a, b) =>
      a.drillName.localeCompare(b.drillName)
    );

    dispatch(getAllDynamicDrillsSuccess(dynamicDrills));
  } catch (error) {
    dispatch(getAllDynamicDrillsFailure(error?.response?.data?.error));
  }
};

export const AddDynamicDrill = async (dispatch, data) => {
  dispatch(addDynamicDrillsStart());

  try {
    await axiosInstance.post(`/api/admin/dynamic-drills`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    Swal.fire({
      icon: "success",
      title: "Done...",
      text: "Drill added successfully",
    });
    dispatch(addDynamicDrillsSuccess());
    GetAllDynamicDrills(dispatch);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "oops...",
      text: "Drill Addition failed",
    });
    dispatch(addDynamicDrillsFailure(error?.response?.data?.error));
  }
};

export const UpdateDynamicDrill = async (dispatch, data, isEdit) => {
  dispatch(updateDynamicDrillsStart());
  console.log("data", data);

  try {
    await axiosInstance.put(`/api/admin/dynamic-drills/${isEdit}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    Swal.fire({
      icon: "success",
      title: "Done...",
      text: "Drill updated successfully",
    });
    dispatch(updateDynamicDrillsSuccess());
    GetAllDynamicDrills(dispatch);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "oops...",
      text: "Drill updation failed",
    });
    dispatch(updateDynamicDrillsFailure(error?.response?.data?.error));
  }
};

export const DeleteDynamicDrill = async (dispatch, id, setIsEdit) => {
  dispatch(deleteDynamicDrillsStart());

  try {
    await axiosInstance.delete(`/api/admin/dynamic-drills/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    Swal.fire({
      icon: "success",
      title: "Done...",
      text: "Drill deleted successfully",
    });
    dispatch(deleteDynamicDrillsSuccess());
    GetAllDynamicDrills(dispatch);
  } catch (error) {
    console.log("error", error);
    console.log(error?.response?.data?.error);
    Swal.fire({
      icon: "error",
      title: "oops...",
      text: "Drill deletion failed",
    });
    dispatch(updateDynamicDrillsFailure(error?.response?.data?.error));
  }
  setIsEdit(false);
};
