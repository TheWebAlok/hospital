import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

import PharmacySidebar from "../components/PharmacySidebar";

import "./PharmacyLayout.css";

export default function PharmacyLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="pharmacy-layout">

      <header className="pharmacy-mobile-header">
        <button
          type="button"
          className="pharmacy-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <span className="pharmacy-mobile-title">
          Medical Store
        </span>
      </header>

      {sidebarOpen && (
        <div
          className="pharmacy-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <PharmacySidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="pharmacy-main">
        <Outlet />
      </main>

    </div>
  );
}