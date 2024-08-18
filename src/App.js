import Home from "./Layout/Home";
import Register from "./Layout/Register";

import LoginForm from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import UserManagement from "./Pages/UserManagement";
import Clinics from "./Pages/Clinics";
import AddDoctorForm from "./Pages/AddDoctorForm";
import AddAthleteForm from "./Pages/AddAthleteForm";
import SlotManagement from "./Pages/SlotManagement";
import EvalformManagement from "./Pages/EvalformManagement";
import DrillsFormManagement from "./Pages/DrillsFormManagement";
import TrainingSessionManagement from "./Pages/TrainingSessionManagement";

import "./App.css";
import { Routes, Route } from "react-router-dom";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import BookingManagement from "./Pages/BookingManagement";
import PresformManagement from "./Pages/PresFormManagement";
import DiagnosisformManagement from "./Pages/DiagnosisformManagement";
import PlanManagement from "./Pages/PlanManagement";
import Shipment from "./components/shipment/View";

import Profile from "./Pages/Profile";
import TransactionManagement from "./Pages/TransactionManagement";
import TermsAndConditions from "./components/contents/TermsAndConditions";
import PrivacyPolicy from "./components/contents/PrivacyPolicy";
import ServiceManagement from "./Pages/ServiceManagement";
import DrillNames from "./Pages/DrillNames";
import DrillInputs from "./Pages/DrillInputs";
import DrillColVal from "./Pages/DrillColVal";

const theme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#7257FF",
      dark: "#000",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#fff",
      contrastText: "#000",
    },
  },
});

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route
            path="/"
            element={
              <Home>
                <Dashboard />
              </Home>
            }
          />

          <Route
            path="/profile"
            element={
              <Home>
                <Profile />
              </Home>
            }
          />

          <Route
            path="/user_management"
            element={
              <Home>
                <UserManagement />
              </Home>
            }
          />

          <Route
            path="/user_management/shipment"
            element={
              <Home>
                <Shipment />
              </Home>
            }
          />

          <Route
            path="/user_management/shipment/create"
            element={
              <Home>
                <Shipment />
              </Home>
            }
          />

          <Route
            path="/clinics"
            element={
              <Home>
                <Clinics />
              </Home>
            }
          />

          <Route
            path="/training_session_management"
            element={
              <Home>
                <TrainingSessionManagement />
              </Home>
            }
          />

          <Route
            path="/addDoc"
            element={
              <Home>
                <AddDoctorForm />
              </Home>
            }
          />
          <Route
            path="/addAth"
            element={
              <Home>
                <AddAthleteForm />
              </Home>
            }
          />
          <Route
            path="/slots"
            element={
              <Home>
                <SlotManagement />
              </Home>
            }
          />
          <Route
            path="/plans"
            element={
              <Home>
                <PlanManagement />
              </Home>
            }
          />
          <Route
            path="/eval-form"
            element={
              <Home>
                <EvalformManagement />
              </Home>
            }
          />
          <Route
            path="/pres-form"
            element={
              <Home>
                <PresformManagement />
              </Home>
            }
          />
          <Route
            path="/diagnosis-form"
            element={
              <Home>
                <DiagnosisformManagement />
              </Home>
            }
          />
          <Route
            path="/drills-form"
            element={
              <Home>
                <DrillsFormManagement />
              </Home>
            }
          />
          <Route
            path="/bookings"
            element={
              <Home>
                <BookingManagement />
              </Home>
            }
          />

          <Route
            path="/transactions"
            element={
              <Home>
                <TransactionManagement />
              </Home>
            }
          />

          <Route
            path="/terms_conditions"
            element={
              <Home>
                <TermsAndConditions />
              </Home>
            }
          />

          <Route
            path="/privacy_policy"
            element={
              <Home>
                <PrivacyPolicy />
              </Home>
            }
          />

          <Route
            path="/service"
            element={
              <Home>
                <ServiceManagement />
              </Home>
            }
          />

          <Route
            path="/register"
            element={
              <Register>
                <LoginForm />
              </Register>
            }
          />

          <Route
            path="/drill-names"
            element={
              <Home>
                <DrillNames />
              </Home>
            }
          />
          <Route
            path="/drill-inputs"
            element={
              <Home>
                <DrillInputs />
              </Home>
            }
          />

          <Route
            path="/drill-col-val"
            element={
              <Home>
                <DrillColVal />
              </Home>
            }
          />
        </Routes>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
