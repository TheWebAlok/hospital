import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Pill,
  Store,
  Layers,
  Truck,
  ShoppingCart,
  Receipt,
  Clock3,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import "./PharmacySidebar.css";

export default function PharmacySidebar({
  sidebarOpen,
  setSidebarOpen,
}) {

  const menuItems = [
    {
      name: "Dashboard",
      path: "/pharmacy",
      icon: <LayoutDashboard size={19} />,
    },
    {
      name: "My Profile",
      path: "/pharmacy/profile",
      icon: <User size={19} />,
    },
    {
      name: "Medicine Orders",
      path: "/pharmacy/orders",
      icon: <ShoppingBag size={19} />,
    },
    {
      name: "Medicines",
      path: "/pharmacy/medicines",
      icon: <Pill size={19} />,
    },
    {
      name: "Stores",
      path: "/pharmacy/stores",
      icon: <Store size={19} />,
    },
    {
      name: "Categories",
      path: "/pharmacy/categories",
      icon: <Layers size={19} />,
    },
    {
      name: "Suppliers",
      path: "/pharmacy/suppliers",
      icon: <Truck size={19} />,
    },
    {
      name: "Sales",
      path: "/pharmacy/sales",
      icon: <ShoppingCart size={19} />,
    },
    {
      name: "Billing",
      path: "/pharmacy/billing",
      icon: <Receipt size={19} />,
    },
    {
      name: "Expiry Alerts",
      path: "/pharmacy/expiry-alerts",
      icon: <Clock3 size={19} />,
    },
  ];

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <aside
      className={`pharmacy-sidebar ${
        sidebarOpen
          ? "pharmacy-sidebar-open"
          : ""
      }`}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="pharmacy-sidebar-header">

        <div className="pharmacy-sidebar-brand">

          <div className="pharmacy-brand-icon">
            <Pill size={22} />
          </div>

          <div className="pharmacy-brand-text">

            <strong>
              Medical Store
            </strong>

            <span>
              Pharmacy Management
            </span>

          </div>

        </div>

        {/* MOBILE CLOSE */}

        <button
          type="button"
          className="pharmacy-close-btn"
          onClick={closeSidebar}
          aria-label="Close pharmacy menu"
          title="Close menu"
        >
          <X size={21} />
        </button>

      </div>

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <nav className="pharmacy-nav">

        <div className="pharmacy-nav-title">
          PHARMACY
        </div>

        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `pharmacy-menu-item ${
                isActive
                  ? "active"
                  : ""
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

      {/* =================================================
          BOTTOM
      ================================================= */}

      <div className="pharmacy-sidebar-bottom">

        <div className="pharmacy-sidebar-footer">

          <Pill size={18} />

          <div>

            <strong>
              Pharmacy System
            </strong>

            <span>
              Hospital Management
            </span>

          </div>

        </div>

      </div>

    </aside>
  );
}