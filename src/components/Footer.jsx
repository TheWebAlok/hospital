import React from "react";
import {
  Hospital,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-5">

      <div className="container py-5">

        <div className="row g-4">

          {/* About */}
          <div className="col-lg-4 col-md-6">

            <div className="d-flex align-items-center gap-2 mb-3">

              <Hospital size={35} className="text-primary" />

              <h3 className="mb-0">
                MediCare
              </h3>

            </div>

            <p className="text-secondary">
              MediCare Hospital provides quality healthcare
              services with experienced doctors, modern
              technology and compassionate patient care.
            </p>

            <p className="text-secondary mb-1">
              Trusted healthcare since 2010.
            </p>

          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">

            <h5 className="mb-3">
              Quick Links
            </h5>

            <div className="d-flex flex-column gap-2">

              <a
                href="/"
                className="text-secondary text-decoration-none"
              >
                Home
              </a>

              <a
                href="/#about"
                className="text-secondary text-decoration-none"
              >
                About
              </a>

              <a
                href="/#departments"
                className="text-secondary text-decoration-none"
              >
                Departments
              </a>

              <a
                href="/#doctors"
                className="text-secondary text-decoration-none"
              >
                Doctors
              </a>

              <a
                href="/#contact"
                className="text-secondary text-decoration-none"
              >
                Contact
              </a>

            </div>

          </div>

          {/* Services */}
          <div className="col-lg-3 col-md-6">

            <h5 className="mb-3">
              Our Services
            </h5>

            <div className="d-flex flex-column gap-2">

              <span className="text-secondary">
                Emergency Care
              </span>

              <span className="text-secondary">
                Cardiology
              </span>

              <span className="text-secondary">
                Neurology
              </span>

              <span className="text-secondary">
                Pediatrics
              </span>

              <span className="text-secondary">
                Orthopedics
              </span>

            </div>

          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6">

            <h5 className="mb-3">
              Contact Us
            </h5>

            <div className="d-flex flex-column gap-3">

              <div className="d-flex gap-2">
                <MapPin size={20} className="text-primary" />

                <span className="text-secondary">
                  Mohali, Punjab, India
                </span>
              </div>

              <div className="d-flex gap-2">
                <Phone size={20} className="text-primary" />

                <span className="text-secondary">
                  +91 98765 43210
                </span>
              </div>

              <div className="d-flex gap-2">
                <Mail size={20} className="text-primary" />

                <span className="text-secondary">
                  info@medicare.com
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom */}
      <div className="border-top border-secondary">

        <div className="container py-3">

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

            <p className="mb-0 text-secondary">
              © 2026 MediCare Hospital. All Rights Reserved.
            </p>

            <p className="mb-0 text-secondary">
              Designed & Developed with ❤️
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
}