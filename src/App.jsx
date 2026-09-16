import {
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

// =====================================================
// PUBLIC SITE COMPONENTS
// =====================================================

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// =====================================================
// ADMIN COMPONENTS
// =====================================================

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Departments from "./pages/Departments";
import DepartmentDetails from "./pages/DepartmentDetails";
import Doctor from "./pages/Doctor";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Testimonials from "./pages/Testimonials";
import FAQ from "./pages/FAQ";
import Gallery from "./pages/Gallery";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Appointment from "./pages/Appointment";
import NotFound from "./pages/NotFound";

// =====================================================
// AUTH PAGES
// =====================================================

import Login from "./components/Login";
import Register from "./components/Register";

// =====================================================
// ADMIN DASHBOARD PAGES
// =====================================================

import Dashboard from "./AdminDashboard/Dashboard";
import Doctors from "./AdminDashboard/Doctors";
import Patients from "./AdminDashboard/Patients";
import Appointments from "./AdminDashboard/Appointments";

// =====================================================
// PHARMACY
// =====================================================

import PharmacySidebar from "./components/pharmacy/PharmacySidebar";

import PharmacyDashboard from "./pages/pharmacy/PharmacyDashboard";
import Medicines from "./pages/pharmacy/Medicines";
import Stores from "./pages/pharmacy/Stores";
import Categories from "./pages/pharmacy/Categories";
import Suppliers from "./pages/pharmacy/Suppliers";
import Sales from "./pages/pharmacy/Sales";
import Billing from "./pages/pharmacy/Billing";
import ExpiryAlerts from "./pages/pharmacy/ExpiryAlerts";

import PharmacistProfile from "./components/pharmacy/PharmacistProfile";
import OrderMedicine from "./pages/OrderMedicine";
import MedicineOrders from "./pages/pharmacy/MedicineOrders";

// =====================================================
// DOCTOR
// =====================================================

import "./App.css";
import "./layouts/PharmacyLayout.css";
import DoctorDashboard from "./AdminDashboard/DoctorDashboard";
import DoctorLayout from "./layouts/DoctorLayout";
import DoctorProfile from "./AdminDashboard/DoctorProfile";
import DoctorAppointments from "./AdminDashboard/DoctorAppointments";
import DoctorVideoConsultation from "./AdminDashboard/DoctorVideoConsultation";
import PatientVideoConsultation from "./AdminDashboard/PatientVideoConsultation";
import AIHealthAssistant from "./components/AIHealthAssistant";
import DoctorProfileById from "./pages/DoctorProfileById";
import CookieConsent from "./components/CookieConsent";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// =====================================================
// PUBLIC LAYOUT
// =====================================================

function PublicLayout() {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
 {/* AI Health Assistant - All Client Pages */}
      <AIHealthAssistant />
      <CookieConsent />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}

// =====================================================
// PHARMACY LAYOUT
// MOBILE MENU + SIDEBAR
// =====================================================

function PharmacyLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="pharmacy-layout">

      {/* =================================================
          MOBILE HEADER
      ================================================= */}

      <header className="pharmacy-mobile-header">

        <button
          type="button"
          className="pharmacy-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open pharmacy menu"
          title="Open menu"
        >
          <Menu size={22} />
        </button>

        <span className="pharmacy-mobile-title">
          Medical Store
        </span>

      </header>

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="pharmacy-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <PharmacySidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="pharmacy-main">
        <Outlet />
      </main>

    </div>
  );
}

// =====================================================
// APP
// =====================================================

function App() {

  // ===================================================
  // DARK MODE
  // ===================================================

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // ===================================================
  // APPLY DARK MODE
  // ===================================================

  useEffect(() => {

    if (darkMode) {

      document.body.classList.add("dark-mode");

      localStorage.setItem("theme", "dark");

    } else {

      document.body.classList.remove("dark-mode");

      localStorage.setItem("theme", "light");

    }

  }, [darkMode]);

  // ===================================================
  // ROUTES
  // ===================================================

  return (
    <Routes>

      {/* =================================================
          PUBLIC WEBSITE ROUTES
      ================================================= */}

      <Route element={<PublicLayout />}>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        
        {/* ABOUT */}

        <Route
          path="/about"
          element={<About />}
        />

        {/* CONTACT */}

        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* DEPARTMENTS */}

        <Route
          path="/departments"
          element={<Departments />}
        />

        {/* DEPARTMENT DETAILS */}

        <Route
          path="/department-details"
          element={<DepartmentDetails />}
        />

        {/* DOCTORS */}

        <Route
          path="/doctors"
          element={<Doctor />}
        />

        {/* SERVICES */}

        <Route
          path="/services"
          element={<Services />}
        />

        {/* SERVICE DETAILS */}

        <Route
          path="/service-details"
          element={<ServiceDetails />}
        />

        {/* TESTIMONIALS */}

        <Route
          path="/testimonials"
          element={<Testimonials />}
        />

        {/* FAQ */}

        <Route
          path="/faq"
          element={<FAQ />}
        />

        {/* GALLERY */}

        <Route
          path="/gallery"
          element={<Gallery />}
        />

        {/* TERMS */}

        <Route
          path="/terms"
          element={<Terms />}
        />

        {/* PRIVACY */}

        <Route
          path="/privacy"
          element={<Privacy />}
        />

        {/* PUBLIC APPOINTMENT */}

        <Route
          path="/appointment"
          element={<Appointment />}
        />

        {/* ORDER MEDICINE */}

        <Route
          path="/order-medicine"
          element={<OrderMedicine />}
        />
        <Route
          path="/patient/video-consultation"
          element={<PatientVideoConsultation />}
        />

        <Route
          path="/ai-assistant"
          element={<AIHealthAssistant />}
        />
        <Route path="/doctors/:id" element={<DoctorProfileById />} />
      </Route>

      {/* =================================================
          AUTH ROUTES
      ================================================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* =================================================
          PROTECTED ADMIN ROUTES
      ================================================= */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          </ProtectedRoute>
        }
      >

        {/* ADMIN DASHBOARD */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* ADMIN DOCTORS */}

        <Route
          path="/admin/doctors"
          element={<Doctors />}
        />

        {/* ADMIN PATIENTS */}

        <Route
          path="/patients"
          element={<Patients />}
        />

        {/* ADMIN APPOINTMENTS */}

        <Route
          path="/appointments"
          element={<Appointments />}
        />

      </Route>

      {/* =================================================
          PROTECTED DOCTOR ROUTES
      ================================================= */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorLayout />
          </ProtectedRoute>
        }
      >

        <Route
          path="/doctor/dashboard"
          element={<DoctorDashboard />}
        />

        <Route
          path="/doctor/profile"
          element={<DoctorProfile />}
        />

        <Route
          path="/doctor/appointments"
          element={<DoctorAppointments />}
        />
        <Route
          path="/doctor/video-consultation"
          element={<DoctorVideoConsultation />}
        />
      </Route>

      {/* =================================================
          PHARMACY ROUTES
          ADMIN + PHARMACIST
      ================================================= */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["admin", "pharmacist"]}
          >
            <PharmacyLayout />
          </ProtectedRoute>
        }
      >

        {/* PHARMACY DASHBOARD */}

        <Route
          path="/pharmacy"
          element={<PharmacyDashboard />}
        />

        {/* PHARMACY PROFILE */}

        <Route
          path="/pharmacy/profile"
          element={<PharmacistProfile />}
        />

        {/* MEDICINES */}

        <Route
          path="/pharmacy/medicines"
          element={<Medicines />}
        />

        {/* MEDICINE ORDERS */}

        <Route
          path="/pharmacy/orders"
          element={<MedicineOrders />}
        />

        {/* STORES */}

        <Route
          path="/pharmacy/stores"
          element={<Stores />}
        />

        {/* CATEGORIES */}

        <Route
          path="/pharmacy/categories"
          element={<Categories />}
        />

        {/* SUPPLIERS */}

        <Route
          path="/pharmacy/suppliers"
          element={<Suppliers />}
        />

        {/* SALES */}

        <Route
          path="/pharmacy/sales"
          element={<Sales />}
        />

        {/* BILLING */}

        <Route
          path="/pharmacy/billing"
          element={<Billing />}
        />

        {/* EXPIRY ALERTS */}

        <Route
          path="/pharmacy/expiry-alerts"
          element={<ExpiryAlerts />}
        />

      </Route>

      {/* =================================================
          404
      ================================================= */}

      <Route
        path="*"
        element={
          <PublicLayout>
            <NotFound />
          </PublicLayout>
        }
      />

    </Routes>
  );
}

export default App;