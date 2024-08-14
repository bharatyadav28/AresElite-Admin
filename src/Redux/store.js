import { configureStore } from "@reduxjs/toolkit";
import DoctorSlice from "./Slices/DoctorSlice";
import AthleteSlice from "./Slices/AthleteSlice";
import AuthSlice from "./Slices/AuthSlice";
import PresSlice from "./Slices/PresSlice";
import EvalSlice from "./Slices/EvalSlice";
import ClinicSlice from "./Slices/ClinicSlice";
import SlotSlice from "./Slices/SlotSlice";
import ServiceSlice from "./Slices/ServiceSlice";
import PlanSlice from "./Slices/PlansSlice";
import UsersSlice from "./Slices/UsersSlice";
import BookingSlice from "./Slices/BookingSlice";

export default configureStore({
    reducer: {
        auth: AuthSlice,
        doc: DoctorSlice,
        athlete: AthleteSlice,
        pres: PresSlice,
        eval: EvalSlice,
        clinic: ClinicSlice,
        slot: SlotSlice,
        service: ServiceSlice,
        plan: PlanSlice,
        users: UsersSlice,
        booking: BookingSlice
    }
})