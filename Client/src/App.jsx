import { useState } from "react";
import "./App.css";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { Routes, Route } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import "../src/style/animations.css";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import RoomPage from "./pages/RoomPage";
import RoomDetailServicePage from "./components/RoomStatus/RoomDetailStatus";
import ProtectedRoutes from "./components/ProtectedRoutes";
import LandingPage from "./pages/LandingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import EmployeePage from "./pages/EmployeePage";
import CleaningStaff from "./pages/CleaningStaffPage";
import UserService from "./pages/UserService";
import InvoicePage from "./components/Invoice/InvoicePage";
import PaymentPage from "./pages/PaymentPage";
import ReservationsPage from "./pages/ReservationPage";
import EmployeeCheckInPage from "./pages/EmployeeCheckInPage";
import EditInventoryPage from "./components/EditInventoryPage";


function App() {
  return (
    <>
      <section>
        <AuthProvider>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* ADMIN ONLY */}
            <Route element={<ProtectedRoutes allowedRoles={["ADMIN"]} />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>

            {/* EMPLOYEE + ADMIN */}
            <Route element={<ProtectedRoutes allowedRoles={["EMPLOYEE", "ADMIN"]} />}>
              <Route path="/employee" element={<EmployeePage />} />

              {/* ➤ RUTAS QUE FALTABAN */}
              <Route path="/employee/reservations" element={<ReservationsPage />} />
              <Route path="/employee/check-in" element={<EmployeeCheckInPage />} />
            </Route>

            {/* INVENTORY (ADMIN + CLEANING STAFF) */}
            <Route element={<ProtectedRoutes allowedRoles={["ADMIN", "CLEANING_STAFF"]} />}>
              <Route path="/inventory" element={<InvoicePage />} />
              <Route path="/inventory/edit" element={<EditInventoryPage />} />
            </Route>

            {/* CLEANING STAFF */}
            <Route element={<ProtectedRoutes allowedRoles={["CLEANING_STAFF", "ADMIN"]} />}>
              <Route path="/cleaning-staff" element={<CleaningStaff />} />
              <Route path="/services/:serviceId" element={<RoomDetailServicePage />}/>
            </Route>

            {/* USER + EMPLOYEE */}
            <Route element={<ProtectedRoutes allowedRoles={["USER", "EMPLOYEE"]} />}>
              <Route path="/rooms" element={<RoomPage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route path="/bookings/:id" element={<UserService />} />
              <Route path="/invoice/:bookingId" element={<InvoicePage />} />
            </Route>

          </Routes>
        </AuthProvider>

        {/* NOTIFICATIONS */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          transition={Bounce}
          theme="light"
        />
      </section>
    </>
  );
}

export default App;