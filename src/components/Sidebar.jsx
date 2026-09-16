import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Stethoscope,
  Users,
  CalendarDays,
  Hospital,
  User,
  LogOut,
  Moon,
  Sun,
  X,
} from "lucide-react";

import Swal from "sweetalert2";

import "./Sidebar.css";


export default function Sidebar({
  darkMode,
  setDarkMode,
  sidebarOpen,
  setSidebarOpen,
}) {

  const navigate = useNavigate();


  // =========================================
  // ADMIN
  // =========================================

  const admin = JSON.parse(
    localStorage.getItem("user") || "null"
  );


  // =========================================
  // MENU ITEMS
  // =========================================

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Doctors",
      path: "/admin/doctors",
      icon: <Stethoscope size={20} />,
    },
    {
      name: "Patients",
      path: "/patients",
      icon: <Users size={20} />,
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: <CalendarDays size={20} />,
    },
  ];


  // =========================================
  // CLOSE MOBILE SIDEBAR
  // =========================================

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };


  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = async () => {

    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    });


    if (!result.isConfirmed) {
      return;
    }


    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/login");
  };


  return (
    <aside
      className={`sidebar ${
        sidebarOpen ? "sidebar-open" : ""
      }`}
    >

      {/* ================= LOGO ================= */}

      <div className="logo">

        <Hospital size={28} />

        <span>
          MediCare
        </span>


        {/* MOBILE CLOSE */}

        <button
          type="button"
          className="sidebar-close-btn"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={22} />
        </button>

      </div>


      {/* ================= MENU ================= */}

      <nav>

        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `menu-item ${
                isActive ? "active" : ""
              }`
            }
          >

            {item.icon}

            <span>
              {item.name}
            </span>

          </NavLink>

        ))}

      </nav>


      {/* ================= BOTTOM ================= */}

      <div className="sidebar-bottom">


        {/* THEME */}

        <button
          type="button"
          className="theme-btn"
          onClick={() =>
            setDarkMode(!darkMode)
          }
        >

          {darkMode ? (
            <>
              <Sun size={19} />

              <span>
                Light Mode
              </span>
            </>
          ) : (
            <>
              <Moon size={19} />

              <span>
                Dark Mode
              </span>
            </>
          )}

        </button>


        {/* PROFILE */}

        <div className="admin-profile">

          <div className="admin-avatar">
            <User size={20} />
          </div>

          <div className="admin-info">

            <strong>
              {admin?.name || "Admin"}
            </strong>

            <span>
              {admin?.email ||
                "admin@hospital.com"}
            </span>

          </div>

        </div>


        {/* LOGOUT */}

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >

          <LogOut size={19} />

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}