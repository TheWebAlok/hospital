import { useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  UserRound,
  CalendarCheck,
  LogOut,
  Stethoscope,
  Menu,
  X,
  Video
} from "lucide-react";

import "./DoctorLayout.css";

export default function DoctorLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const doctorName = storedUser.name || "Doctor";

  // =====================================================
  // ACTIVE MENU
  // =====================================================

  const isActive = (path) => {
    return location.pathname === path
      ? "active"
      : "";
  };

  // =====================================================
  // MOBILE CLOSE
  // =====================================================

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const goTo = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="doctor-layout">

      {/* =====================================================
          MOBILE HEADER
      ===================================================== */}

      <header className="doctor-mobile-header">

        <button
          type="button"
          className="doctor-mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open doctor menu"
          title="Open menu"
        >
          <Menu size={22} />
        </button>

        <span className="doctor-mobile-title">
          Doctor Panel
        </span>

      </header>

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <div
          className="doctor-sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* =====================================================
          LEFT SIDEBAR
      ===================================================== */}

      <aside
        className={`doctor-sidebar ${
          sidebarOpen
            ? "doctor-sidebar-open"
            : ""
        }`}
      >

        {/* =================================================
            SIDEBAR HEADER
        ================================================= */}

        <div className="doctor-sidebar-header">

          <div className="doctor-brand">

            <div className="doctor-logo-icon">
              <Stethoscope size={23} />
            </div>

            <span>
              Doctor Panel
            </span>

          </div>

          {/* MOBILE CLOSE */}

          <button
            type="button"
            className="doctor-sidebar-close-btn"
            onClick={closeSidebar}
            aria-label="Close doctor menu"
            title="Close menu"
          >
            <X size={21} />
          </button>

        </div>

        {/* =================================================
            SIDEBAR MENU
        ================================================= */}

        <nav className="doctor-sidebar-menu">

          {/* DASHBOARD */}

          <button
            type="button"
            className={isActive(
              "/doctor/dashboard"
            )}
            onClick={() =>
              goTo("/doctor/dashboard")
            }
          >
            <LayoutDashboard size={19} />

            <span>
              Dashboard
            </span>
          </button>

          {/* PROFILE */}

          <button
            type="button"
            className={isActive(
              "/doctor/profile"
            )}
            onClick={() =>
              goTo("/doctor/profile")
            }
          >
            <UserRound size={19} />

            <span>
              My Profile
            </span>
          </button>

          {/* APPOINTMENTS */}

          <button
            type="button"
            className={isActive(
              "/doctor/appointments"
            )}
            onClick={() =>
              goTo("/doctor/appointments")
            }
          >
            <CalendarCheck size={19} />

            <span>
              My Appointments
            </span>
          </button>
{/* VIDEO CONSULTATION */}

<button
  type="button"
  className={isActive("/doctor/video-consultation")}
  onClick={() =>
    goTo("/doctor/video-consultation")
  }
>
  <Video size={19} />

  <span>
    Video Consultation
  </span>
</button>
        </nav>

        {/* =================================================
            SIDEBAR BOTTOM
        ================================================= */}

        <div className="doctor-sidebar-bottom">

          {/* USER */}

          <div className="doctor-sidebar-user">

            <div className="doctor-user-avatar">
              {doctorName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="doctor-user-info">

              <strong>
                {doctorName}
              </strong>

              <span>
                Doctor
              </span>

            </div>

          </div>

          {/* LOGOUT */}

          <button
            type="button"
            className="doctor-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={18} />

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>

      {/* =====================================================
          RIGHT MAIN CONTENT
      ===================================================== */}

      <main className="doctor-main">

        <div className="doctor-content">

          <Outlet />

        </div>

      </main>

    </div>
  );
}