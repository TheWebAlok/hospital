import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

import Sidebar from "../components/Sidebar";

import "./AdminLayout.css";

export default function AdminLayout({
  darkMode,
  setDarkMode,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className={`app-layout ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >

      {/* ================= MOBILE HEADER ================= */}

      <div className="mobile-header">

        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          type="button"
        >
          {sidebarOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>

        <div className="mobile-logo">
          MediCare
        </div>

      </div>


      {/* ================= OVERLAY ================= */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* ================= SIDEBAR ================= */}

      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />


      {/* ================= MAIN CONTENT ================= */}

      <main className="main-content">
        <Outlet />
      </main>

    </div>
  );
}