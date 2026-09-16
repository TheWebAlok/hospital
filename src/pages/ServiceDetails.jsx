import React from "react";
import { Link } from "react-router-dom";

import neurologyImage from "../assets/img/health/neurology-2.webp";

import "./ServiceDetails.css";

const details = [
  {
    icon: "bi-activity",
    title: "Neurological Assessment",
    text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam.",
  },
  {
    icon: "bi-diagram-2",
    title: "Brain Imaging & Diagnosis",
    text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.",
  },
  {
    icon: "bi-prescription2",
    title: "Treatment Planning",
    text: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim laborum.",
  },
];

const features = [
  {
    icon: "bi-award",
    text: "Board Certified Specialists",
  },
  {
    icon: "bi-clock-history",
    text: "Same Day Appointments",
  },
  {
    icon: "bi-shield-plus",
    text: "Advanced Treatment Options",
  },
  {
    icon: "bi-heart-pulse",
    text: "Patient-Centered Care",
  },
];

const conditions = [
  "Stroke Recovery",
  "Epilepsy Management",
  "Memory Disorders",
  "Headache Disorders",
  "Movement Disorders",
  "Peripheral Neuropathy",
  "Multiple Sclerosis",
  "Parkinson's Disease",
];

export default function ServiceDetails() {
  return (
    <main className="service-details-page">

      {/* ================= PAGE TITLE ================= */}

      <div className="page-title">
        <div className="heading">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">

                <h1 className="heading-title">
                  Service Details
                </h1>

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
                <Link to="/">Home</Link> &nbsp; / Service Details
                
              </li>

             
            </ol>
          </div>
        </nav>
      </div>

      {/* ================= SERVICE DETAILS ================= */}

      <section className="service-details-2 section">
        <div className="container">

          {/* Header */}

          <div className="row">
            <div className="col-lg-8 mx-auto text-center mb-5">

              <div className="service-header">

                <div className="service-category">
                  <span>Advanced Neurology</span>
                </div>

                <h2>
                  Comprehensive Neurological Care Services
                </h2>

                <p className="lead">
                  Expert diagnosis and treatment for complex neurological
                  conditions using state-of-the-art technology
                </p>

              </div>
            </div>
          </div>

          {/* Details + Image */}

          <div className="row gy-4 align-items-center">

            {/* Details */}

            <div className="col-lg-5">

              <div className="service-details">

                {details.map((item) => (
                  <div
                    className="detail-item"
                    key={item.title}
                  >
                    <div className="icon-wrapper">
                      <i className={`bi ${item.icon}`}></i>
                    </div>

                    <div className="content">
                      <h4>{item.title}</h4>
                      <p>{item.text}</p>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* Image */}

            <div className="col-lg-7">

              <div className="service-visual">

                <img
                  src={neurologyImage}
                  alt="Neurology Services"
                  className="img-fluid"
                />

                <div className="visual-overlay">

                  <div className="stats-card">

                    <div className="stat">
                      <span className="number">
                        95%
                      </span>

                      <span className="label">
                        Success Rate
                      </span>
                    </div>

                    <div className="stat">
                      <span className="number">
                        24/7
                      </span>

                      <span className="label">
                        Emergency Care
                      </span>
                    </div>

                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* ================= OVERVIEW ================= */}

          <div className="row gy-4 mt-5">

            <div className="col-12">

              <div className="service-overview">

                <div className="row align-items-center">

                  {/* Why Choose */}

                  <div className="col-lg-6">

                    <h3>
                      Why Choose Our Neurology Department
                    </h3>

                    <p>
                      Lorem ipsum dolor sit amet consectetur adipiscing
                      elit sed do eiusmod tempor incididunt ut labore et
                      dolore magna aliqua. Ut enim ad minim veniam quis
                      nostrud exercitation ullamco laboris nisi ut aliquip
                      ex ea commodo consequat.
                    </p>

                    <div className="features-grid">

                      {features.map((feature) => (
                        <div
                          className="feature"
                          key={feature.text}
                        >
                          <i className={`bi ${feature.icon}`}></i>

                          <span>
                            {feature.text}
                          </span>
                        </div>
                      ))}

                    </div>

                  </div>

                  {/* Conditions */}

                  <div className="col-lg-6">

                    <div className="treatment-areas">

                      <h4>
                        Conditions We Treat
                      </h4>

                      <div className="condition-tags">

                        {conditions.map((condition) => (
                          <span
                            className="tag"
                            key={condition}
                          >
                            {condition}
                          </span>
                        ))}

                      </div>

                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* ================= ACTION CARDS ================= */}

          <div className="row gy-4 mt-5">

            {/* Consultation */}

            <div className="col-lg-4">

              <div className="action-card primary">

                <div className="card-header">

                  <i className="bi bi-calendar-check"></i>

                  <h4>
                    Schedule Consultation
                  </h4>

                </div>

                <p>
                  Book your neurological evaluation with our expert team
                </p>

                <div className="card-footer">

                  <Link
                    to="/appointment"
                    className="btn-action"
                  >
                    Book Now
                  </Link>

                  <span className="availability">
                    Next available: Tomorrow
                  </span>

                </div>

              </div>
            </div>

            {/* Emergency */}

            <div className="col-lg-4">

              <div className="action-card secondary">

                <div className="card-header">

                  <i className="bi bi-telephone"></i>

                  <h4>
                    Emergency Consultation
                  </h4>

                </div>

                <p>
                  24/7 neurological emergency support and rapid response
                </p>

                <div className="card-footer">

                  <a
                    href="tel:+15551234567"
                    className="btn-action"
                  >
                    Call Now
                  </a>

                  <span className="availability">
                    +1 (555) 123-4567
                  </span>

                </div>

              </div>
            </div>

            {/* Second Opinion */}

            <div className="col-lg-4">

              <div className="action-card tertiary">

                <div className="card-header">

                  <i className="bi bi-file-text"></i>

                  <h4>
                    Get Second Opinion
                  </h4>

                </div>

                <p>
                  Expert review of existing diagnoses and treatment plans
                </p>

                <div className="card-footer">

                  <button
                    type="button"
                    className="btn-action"
                  >
                    Request Review
                  </button>

                  <span className="availability">
                    Response within 48h
                  </span>

                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}