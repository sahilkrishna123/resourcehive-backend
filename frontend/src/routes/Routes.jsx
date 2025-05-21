// src/Route.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
// import AboutPage from "../pages/AboutPage";
// import ContactPage from "../pages/ContactPage";
import SignInSide from "../pages/user-signin/sign-in-side/SignInSide";
import SignUpSide from "../pages/user-signup/sign-up-side/SignUpSide";
import AdminForm from "../pages/form/admin/admin-form/AdminForm";
import ManagerForm from "../pages/form/manager/manager-form/ManagerForm";
import TechnicianForm from "../pages/form/technician/technician-form/TechnicianForm";
import Equipment from "../pages/dashboard/Admin/Pages/Equipment";
import HospitalRequests from "../pages/dashboard/Admin/Pages/HospitalRequests";
import Logout from "../pages/dashboard/Admin/Pages/Logout";
import Dashboard from "../pages/dashboard/Admin/Pages/Dashboard";
import ManagerHospitalSelection from "../pages/roleshospitalselection/manager/manager-hospital-selection/ManagerHospitalSelection";
import TechnicianHospitalSelection from "../pages/roleshospitalselection/technician/technician-hospital-selection/TechnicianHospitalSelection";
import MDashboard from "../pages/dashboard/Manager/Pages/MDashboard";
import MEquipment from "../pages/dashboard/Manager/Pages/MEquipment";
import MHospitalRequests from "../pages/dashboard/Manager/Pages/MHospitalRequests";
import MLogout from "../pages/dashboard/Manager/Pages/MLogout";
import MHospitals from "../pages/dashboard/Manager/Pages/MHospitals";
import MMaintenance from "../pages/dashboard/Manager/Pages/MMaintenance";
import Hospitals from "../pages/dashboard/Admin/Pages/Hospitals";
import THospitalRequests from "../pages/dashboard/Tech/Pages/THospitalRequests";
import THospitals from "../pages/dashboard/Tech/Pages/THospitals";
import TLogout from "../pages/dashboard/Tech/Pages/TLogout";
import TDashboard from "../pages/dashboard/Tech/Pages/TDashboard";
import ProtectedRoute from "../ProtectedRoute";

const RouteComponent = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/about" element={<AboutPage />} /> */}
      {/* <Route path="/contact" element={<ContactPage />} /> */}
      <Route path="/SignUp" element={<SignUpSide />} />
      <Route path="/SignIn" element={<SignInSide />} />

      {/* Protected Roles Form Routes */}
      <Route
        path="/managerform"
        element={
          <ProtectedRoute>
            <ManagerForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/technicianform"
        element={
          <ProtectedRoute>
            <TechnicianForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/adminform"
        element={
          <ProtectedRoute>
            <AdminForm />
          </ProtectedRoute>
        }
      />

      {/* Protected Roles Hospital Selection Routes */}
      <Route
        path="/hospitals/manager"
        element={
          <ProtectedRoute>
            <ManagerHospitalSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospitals/technician"
        element={
          <ProtectedRoute>
            <TechnicianHospitalSelection />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard Routes (Protected) */}
      <Route
        path="/adminDashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Equipment"
        element={
          <ProtectedRoute>
            <Equipment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/HospitalRequests"
        element={
          <ProtectedRoute>
            <HospitalRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Hospitals"
        element={
          <ProtectedRoute>
            <Hospitals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Logout"
        element={
          <ProtectedRoute>
            <Logout />
          </ProtectedRoute>
        }
      />

      {/* Manager Dashboard Routes (Protected) */}
      <Route
        path="/managerDashboard"
        element={
          <ProtectedRoute>
            <MDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/MEquipment"
        element={
          <ProtectedRoute>
            <MEquipment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/MHospitalRequests"
        element={
          <ProtectedRoute>
            <MHospitalRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/MHospitals"
        element={
          <ProtectedRoute>
            <MHospitals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/MLogout"
        element={
          <ProtectedRoute>
            <MLogout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/MMaintenance"
        element={
          <ProtectedRoute>
            <MMaintenance />
          </ProtectedRoute>
        }
      />

      {/* Technician Dashboard Routes (Protected) */}
      <Route
        path="/technicianDashboard"
        element={
          <ProtectedRoute>
            <TDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/TEquipment"
        element={
          <ProtectedRoute>
            <MEquipment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/THospitalRequests"
        element={
          <ProtectedRoute>
            <THospitalRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/THospitals"
        element={
          <ProtectedRoute>
            <THospitals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/TLogout"
        element={
          <ProtectedRoute>
            <TLogout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default RouteComponent;
