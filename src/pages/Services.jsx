import React from "react";
import { Link } from "react-router-dom";

import "./Services.css";

import cardiology from "../assets/img/health/cardiology-2.webp";
import neurology from "../assets/img/health/neurology-3.webp";
import orthopedics from "../assets/img/health/orthopedics-1.webp";
import pediatrics from "../assets/img/health/pediatrics-4.webp";
import emergency from "../assets/img/health/emergency-2.webp";
import laboratory from "../assets/img/health/laboratory-3.webp";

const services = [
  {
    title: "Cardiology",
    image: cardiology,
    icon: "bi-heart-pulse",
    description:
      "Comprehensive heart care with advanced diagnostic tools and treatment options for cardiovascular conditions.",
    features: ["ECG Testing", "Heart Surgery"],
  },
  {
    title: "Neurology",
    image: neurology,
    icon: "bi-activity",
    description:
      "Expert neurological care for brain and nervous system disorders with state-of-the-art imaging technology.",
    features: ["MRI Scans", "Stroke Care"],
  },
  {
    title: "Orthopedics",
    image: orthopedics,
    icon: "bi-bandaid",
    description:
      "Specialized bone and joint treatment including sports medicine and reconstructive surgery procedures.",
    features: ["Joint Replacement", "Sports Medicine"],
  },
  {
    title: "Pediatrics",
    image: pediatrics,
    icon: "bi-person-hearts",
    description:
      "Dedicated healthcare for children from infancy through adolescence with specialized treatment protocols.",
    features: ["Well-Child Visits", "Immunizations"],
  },
  {
    title: "Emergency Care",
    image: emergency,
    icon: "bi-ambulance",
    description:
      "24/7 emergency medical services with rapid response teams and critical care capabilities.",
    features: ["Trauma Center", "Critical Care"],
  },
  {
    title: "Laboratory Testing",
    image: laboratory,
    icon: "bi-microscope",
    description:
      "Advanced diagnostic laboratory services with comprehensive testing panels and rapid result delivery.",
    features: ["Blood Tests", "Pathology"],
  },
];

export default function Services() {
  return (
    <main className="services-page">

      {/* ================= PAGE TITLE ================= */}

      <div className="page-title">
        <div className="heading">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">

                <h1 className="heading-title">Services</h1>

                <p className="mb-0">
                  Odio et unde deleniti. Deserunt numquam exercitationem.
                  Officiis quo odio sint voluptas consequatur ut a odio
                  voluptatem. Sit dolorum debitis veritatis natus dolores.
                  Quasi ratione sint. Sit quaerat ipsum dolorem.
                </p>

              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}

        <nav className="breadcrumbs">
          <div className="container">
            <ol>
              <li>
                <Link to="/">Home</Link>
              </li>

              <li className="current">Services</li>
            </ol>
          </div>
        </nav>
      </div>

      {/* ================= SERVICES ================= */}

      <section className="services section">
        <div className="container">

          <div className="row gy-4">

            {services.map((service) => (
              <div
                className="col-lg-4 col-md-6"
                key={service.title}
              >
                <div className="service-item">

                  {/* Image */}

                  <div className="service-image">

                    <img
                      src={service.image}
                      alt={`${service.title} Services`}
                      className="img-fluid"
                    />

                    <div className="service-overlay">
                      <i className={`bi ${service.icon}`}></i>
                    </div>

                  </div>

                  {/* Content */}

                  <div className="service-content">

                    <h3>{service.title}</h3>

                    <p>{service.description}</p>

                    {/* Features */}

                    <div className="service-features">

                      {service.features.map((feature) => (
                        <span
                          className="feature-item"
                          key={feature}
                        >
                          <i className="bi bi-check"></i>
                          {feature}
                        </span>
                      ))}

                    </div>

                    {/* Learn More */}

                    <Link
                      to="/service-details"
                      className="service-btn"
                    >
                      <span>Learn More</span>
                      <i className="bi bi-arrow-right"></i>
                    </Link>

                  </div>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

    </main>
  );
}