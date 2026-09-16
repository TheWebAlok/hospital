import React from "react";
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  Pill,
  Edit3,
} from "lucide-react";
import "./PharmacistProfile.css";

export default function PharmacistProfile() {
  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const pharmacist = {
    name: storedUser.name || "Pharmacist",
    email: storedUser.email || "Not available",
    phone: storedUser.phone || "Not available",
    role: storedUser.role || "pharmacist",
  };

  const firstLetter =
    pharmacist.name.charAt(0).toUpperCase();

  return (
    <div className="pharmacist-profile">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="pharmacist-profile-header">

        <div>
          <h1>My Profile</h1>

          <p>
            Manage your pharmacist account information
          </p>
        </div>

        <div className="profile-role-badge">
          <Pill size={16} />
          Pharmacist
        </div>

      </div>

      {/* =================================================
          PROFILE CARD
      ================================================= */}

      <div className="pharmacist-profile-card">

        {/* PROFILE TOP */}

        <div className="pharmacist-profile-top">

          <div className="pharmacist-avatar">
            {firstLetter}
          </div>

          <div className="pharmacist-main-info">

            <h2>
              {pharmacist.name}
            </h2>

            <p>
              <Mail size={16} />
              {pharmacist.email}
            </p>

            <span className="active-badge">
              <span className="active-dot"></span>
              Active Account
            </span>

          </div>

          <button
            type="button"
            className="profile-edit-btn"
          >
            <Edit3 size={17} />
            Edit Profile
          </button>

        </div>

        {/* =================================================
            INFORMATION
        ================================================= */}

        <div className="profile-section">

          <div className="profile-section-title">
            <UserRound size={19} />

            <h3>
              Personal Information
            </h3>
          </div>

          <div className="profile-info-grid">

            {/* NAME */}

            <div className="profile-info-item">

              <span className="info-label">
                Full Name
              </span>

              <div className="info-value">
                <UserRound size={17} />
                {pharmacist.name}
              </div>

            </div>

            {/* EMAIL */}

            <div className="profile-info-item">

              <span className="info-label">
                Email Address
              </span>

              <div className="info-value">
                <Mail size={17} />
                {pharmacist.email}
              </div>

            </div>

            {/* PHONE */}

            <div className="profile-info-item">

              <span className="info-label">
                Phone Number
              </span>

              <div className="info-value">
                <Phone size={17} />
                {pharmacist.phone}
              </div>

            </div>

            {/* ROLE */}

            <div className="profile-info-item">

              <span className="info-label">
                Account Role
              </span>

              <div className="info-value">
                <ShieldCheck size={17} />
                Pharmacist
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            ACCOUNT INFORMATION
        ================================================= */}

        <div className="profile-section">

          <div className="profile-section-title">
            <ShieldCheck size={19} />

            <h3>
              Account Information
            </h3>
          </div>

          <div className="account-info-box">

            <div>
              <span>
                Account Status
              </span>

              <strong>
                Active
              </strong>
            </div>

            <div>
              <span>
                User Role
              </span>

              <strong>
                Pharmacist
              </strong>
            </div>

            <div>
              <span>
                Access
              </span>

              <strong>
                Pharmacy Management
              </strong>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}