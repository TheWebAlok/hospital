import React, { useEffect, useState } from "react";

import {
  Hospital,
  Phone,
  Mail,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  LogIn,
  ShoppingCart,
  CalendarCheck,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const [mobileMoreOpen, setMobileMoreOpen] =
    useState(false);

  const [mobileDropdownOpen, setMobileDropdownOpen] =
    useState(false);

  const [mobileDeepOpen, setMobileDeepOpen] =
    useState(false);

  // =====================================================
  // AUTH STATE
  // =====================================================

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [userRole, setUserRole] = useState(
    localStorage.getItem("role") || ""
  );

  // =====================================================
  // CHECK AUTH
  // =====================================================

  const checkAuth = () => {
    const token =
      localStorage.getItem("token");

    let role =
      localStorage.getItem("role") ||
      localStorage.getItem("userRole") ||
      "";

    if (!role) {
      try {
        const user = JSON.parse(
          localStorage.getItem("user") || "null"
        );

        role = user?.role || "";
      } catch (error) {
        console.error(
          "User parse error:",
          error
        );
      }
    }

    setIsLoggedIn(!!token);
    setUserRole(role);
  };

  // =====================================================
  // INITIAL + STORAGE EVENT
  // =====================================================

  useEffect(() => {
    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  // =====================================================
  // SAME TAB AUTH UPDATE
  // =====================================================

  useEffect(() => {
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener(
      "auth-change",
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        "auth-change",
        handleAuthChange
      );
    };
  }, []);

  // =====================================================
  // CLOSE MENU
  // =====================================================

  const closeMenu = () => {
    setMenuOpen(false);
    setMobileMoreOpen(false);
    setMobileDropdownOpen(false);
    setMobileDeepOpen(false);
  };

  // =====================================================
  // ROLE DASHBOARD
  // =====================================================

  const getDashboardPath = () => {
    const role = String(
      userRole
    ).toLowerCase();

    if (role === "doctor") {
      return "/doctor/dashboard";
    }

    if (role === "pharmacist") {
      return "/pharmacy";
    }

    if (
      role === "admin" ||
      role === "owner"
    ) {
      return "/dashboard";
    }

    return "/";
  };

  // =====================================================
  // DASHBOARD TITLE
  // =====================================================

  const getDashboardTitle = () => {
    const role = String(
      userRole
    ).toLowerCase();

    if (role === "doctor") {
      return "Doctor Dashboard";
    }

    if (role === "pharmacist") {
      return "Pharmacy Dashboard";
    }

    if (
      role === "admin" ||
      role === "owner"
    ) {
      return "Dashboard";
    }

    return "Dashboard";
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setUserRole("");

    window.dispatchEvent(
      new Event("auth-change")
    );

    closeMenu();

    navigate("/login");
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLoginClick = () => {
    closeMenu();
  };

  return (
    <header className="site-header">

      {/* =================================================
          TOP BAR
      ================================================= */}

      <div className="site-topbar">

        <div className="container topbar-inner">

          <div className="topbar-contact">

            <a href="mailto:info@medicare.com">
              <Mail size={15} />

              <span>
                info@medicare.com
              </span>
            </a>

            <a href="tel:+919876543210">
              <Phone size={15} />

              <span>
                +91 98765 43210
              </span>
            </a>

          </div>

          <div className="topbar-contact emergency-contact">
            <span>
              24/7 Emergency:
              {" "}
              +91 98765 43210
            </span>
          </div>

        </div>

      </div>

      {/* =================================================
          BRANDING
      ================================================= */}

      <div className="site-branding">

        <div className="container branding-inner">

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className="site-logo"
            onClick={closeMenu}
          >
            <Hospital size={35} />

            <div>
              <h1>
                MediCare
              </h1>

              <span className="site-logo-subtitle">
                Hospital Management
              </span>
            </div>
          </Link>

          {/* =================================================
              DESKTOP / MOBILE PANEL
          ================================================= */}

          <div
            className={`nav-main-panel ${
              menuOpen ? "is-open" : ""
            }`}
          >

            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav
              className={`site-nav ${
                menuOpen ? "is-open" : ""
              }`}
            >

              <ul>

                {/* HOME */}

                <li>
                  <Link
                    to="/"
                    onClick={closeMenu}
                  >
                    Home
                  </Link>
                </li>

                {/* ABOUT */}

                <li>
                  <Link
                    to="/about"
                    onClick={closeMenu}
                  >
                    About
                  </Link>
                </li>

                {/* DEPARTMENTS */}

                <li>
                  <Link
                    to="/departments"
                    onClick={closeMenu}
                  >
                    Departments
                  </Link>
                </li>

                {/* SERVICES */}

                <li>
                  <Link
                    to="/services"
                    onClick={closeMenu}
                  >
                    Services
                  </Link>
                </li>

                {/* DOCTORS */}

                <li>
                  <Link
                    to="/doctors"
                    onClick={closeMenu}
                  >
                    Doctors
                  </Link>
                </li>

                {/* =================================================
                    MORE PAGES
                ================================================= */}

                <li className="nav-dropdown-wrapper">

                  <button
                    type="button"
                    className="nav-dropdown-trigger"
                    onClick={() => {
                      if (
                        window.innerWidth <= 960
                      ) {
                        setMobileMoreOpen(
                          !mobileMoreOpen
                        );

                        setMobileDropdownOpen(
                          false
                        );
                      }
                    }}
                  >

                    <span>
                      More Pages
                    </span>

                    <ChevronDown
                      size={14}
                      className={
                        mobileMoreOpen
                          ? "chevron-open"
                          : ""
                      }
                    />

                  </button>

                  <ul
                    className={`nav-dropdown ${
                      mobileMoreOpen
                        ? "is-open"
                        : ""
                    }`}
                  >

                    <li>
                      <Link
                        to="/department-details"
                        onClick={closeMenu}
                      >
                        Department Details
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/service-details"
                        onClick={closeMenu}
                      >
                        Service Details
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/appointment"
                        onClick={closeMenu}
                      >
                        Appointment
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/testimonials"
                        onClick={closeMenu}
                      >
                        Testimonials
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/faq"
                        onClick={closeMenu}
                      >
                        Frequently Asked Questions
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/gallery"
                        onClick={closeMenu}
                      >
                        Gallery
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/terms"
                        onClick={closeMenu}
                      >
                        Terms
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/privacy"
                        onClick={closeMenu}
                      >
                        Privacy
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/404"
                        onClick={closeMenu}
                      >
                        404
                      </Link>
                    </li>

                  </ul>

                </li>

                {/* =================================================
                    DROPDOWN
                ================================================= */}

                <li className="nav-dropdown-wrapper">

                  <button
                    type="button"
                    className="nav-dropdown-trigger"
                    onClick={() => {
                      if (
                        window.innerWidth <= 960
                      ) {
                        setMobileDropdownOpen(
                          !mobileDropdownOpen
                        );

                        setMobileMoreOpen(
                          false
                        );
                      }
                    }}
                  >

                    <span>
                      Dropdown
                    </span>

                    <ChevronDown
                      size={14}
                      className={
                        mobileDropdownOpen
                          ? "chevron-open"
                          : ""
                      }
                    />

                  </button>

                  <ul
                    className={`nav-dropdown ${
                      mobileDropdownOpen
                        ? "is-open"
                        : ""
                    }`}
                  >

                    <li>
                      <a href="#dropdown1">
                        Dropdown 1
                      </a>
                    </li>

                    {/* DEEP DROPDOWN */}

                    <li className="deep-dropdown">

                      <button
                        type="button"
                        className="deep-dropdown-trigger"
                        onClick={() => {
                          if (
                            window.innerWidth <= 960
                          ) {
                            setMobileDeepOpen(
                              !mobileDeepOpen
                            );
                          }
                        }}
                      >

                        <span>
                          Deep Dropdown
                        </span>

                        <ChevronDown
                          size={14}
                          className={
                            mobileDeepOpen
                              ? "chevron-open"
                              : ""
                          }
                        />

                      </button>

                      <ul
                        className={`deep-dropdown-menu ${
                          mobileDeepOpen
                            ? "is-open"
                            : ""
                        }`}
                      >

                        <li>
                          <a href="#deep1">
                            Deep Dropdown 1
                          </a>
                        </li>

                        <li>
                          <a href="#deep2">
                            Deep Dropdown 2
                          </a>
                        </li>

                        <li>
                          <a href="#deep3">
                            Deep Dropdown 3
                          </a>
                        </li>

                        <li>
                          <a href="#deep4">
                            Deep Dropdown 4
                          </a>
                        </li>

                        <li>
                          <a href="#deep5">
                            Deep Dropdown 5
                          </a>
                        </li>

                      </ul>

                    </li>

                    <li>
                      <a href="#dropdown2">
                        Dropdown 2
                      </a>
                    </li>

                    <li>
                      <a href="#dropdown3">
                        Dropdown 3
                      </a>
                    </li>

                    <li>
                      <a href="#dropdown4">
                        Dropdown 4
                      </a>
                    </li>

                  </ul>

                </li>

                {/* CONTACT */}

                <li>
                  <Link
                    to="/contact"
                    onClick={closeMenu}
                  >
                    Contact
                  </Link>
                </li>

              </ul>

            </nav>

            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div className="branding-actions">

             

              {/* APPOINTMENT */}

              <Link
                to="/appointment"
                className="nav-appointment-btn"
                onClick={closeMenu}
              >
                <CalendarCheck size={16} />

                <span>
                  Appointment
                </span>
              </Link>

              {/* ORDER MEDICINE */}

              <Link
                to="/order-medicine"
                className="nav-order-medicine-btn"
                onClick={closeMenu}
              >
                <ShoppingCart size={16} />

                <span>
                  Order Medicine
                </span>
              </Link>

            </div>
 {!isLoggedIn ? (
                <Link
                  to="/login"
                  className="nav-login-btn"
                  onClick={handleLoginClick}
                >
                  <LogIn size={16} />

                  <span>
                    Login
                  </span>
                </Link>
              ) : (
                <>
                  <Link
                    to={getDashboardPath()}
                    className="nav-dashboard-btn text-light"
                    onClick={closeMenu}
                  >
                    <LayoutDashboard size={16} />

                    <span className="text-light">
                      {getDashboardTitle()}
                    </span>
                  </Link>

                  <button
                    type="button"
                    className="nav-logout-btn"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />

                    <span>
                      Logout
                    </span>
                  </button>
                </>
              )}
          </div>

          {/* =================================================
              MOBILE MENU TOGGLE
          ================================================= */}

          <button
            type="button"
            className="mobile-nav-toggle"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label="Toggle navigation"
          >
            {menuOpen ? (
              <X size={27} />
            ) : (
              <Menu size={27} />
            )}
          </button>

        </div>

      </div>

    </header>
  );
}