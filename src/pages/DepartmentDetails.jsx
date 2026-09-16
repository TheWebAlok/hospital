import React from "react";
import { Link } from "react-router-dom";
import "./DepartmentDetails.css";

import neurologyImage from "../assets/img/health/neurology-2.webp";
import neurologyExpert from "../assets/img/health/neurology-4.webp";

const services = [
  {
    icon: "bi-lightning-charge",
    title: "Epilepsy Treatment",
    description:
      "Nulla porttitor accumsan tincidunt. Cras ultricies ligula sed magna dictum porta.",
  },
  {
    icon: "bi-search",
    title: "Diagnostic Imaging",
    description:
      "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis.",
  },
  {
    icon: "bi-heart-pulse",
    title: "Stroke Prevention",
    description:
      "Donec sollicitudin molestie malesuada. Proin eget tortor risus cras ultricies ligula.",
  },
  {
    icon: "bi-person-gear",
    title: "Movement Disorders",
    description:
      "Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.",
  },
  {
    icon: "bi-moon",
    title: "Sleep Disorders",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.",
  },
  {
    icon: "bi-shield-check",
    title: "Memory Care",
    description:
      "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a vestibulum ac diam.",
  },
];

const expertise = [
  "Board-certified neurologists and neurosurgeons",
  "State-of-the-art diagnostic equipment and facilities",
  "Comprehensive care from diagnosis to rehabilitation",
  "Personalized treatment plans for every patient",
];

export default function DepartmentDetails() {
  return (
    <main className="department-details-page">

      {/* =====================================================
          PAGE TITLE
      ===================================================== */}
      <div className="page-title">

        <div className="heading">
          <div className="container">

            <div className="row justify-content-center text-center">
              <div className="col-lg-8">

                <h1 className="heading-title">
                  Department Details
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
                <Link to="/">Home</Link>
              </li>

              <li className="current">
                Department Details
              </li>

            </ol>

          </div>

        </nav>

      </div>


      {/* =====================================================
          DEPARTMENT DETAILS
      ===================================================== */}
      <section className="department-details section">

        <div className="container">

          {/* =================================================
              HERO
          ================================================= */}
          <div className="row align-items-center">

            {/* LEFT */}
            <div className="col-xl-6 col-lg-7">

              <div className="department-hero">

                <div className="badge-wrap">
                  <span className="specialty-badge">
                    Neurology
                  </span>
                </div>

                <h1 className="department-title">
                  Advanced Neurological Care
                </h1>

                <p className="department-intro">
                  Vestibulum ante ipsum primis in faucibus orci luctus et
                  ultrices posuere cubilia curae. Donec velit neque, auctor
                  sit amet aliquam vel, ullamcorper sit amet ligula.
                </p>


                {/* Highlights */}
                <div className="key-highlights">

                  <div className="highlight-item">
                    <span className="highlight-number">
                      24/7
                    </span>

                    <span className="highlight-text">
                      Emergency Neurology
                    </span>
                  </div>


                  <div className="highlight-item">
                    <span className="highlight-number">
                      15+
                    </span>

                    <span className="highlight-text">
                      Specialist Neurologists
                    </span>
                  </div>


                  <div className="highlight-item">
                    <span className="highlight-number">
                      95%
                    </span>

                    <span className="highlight-text">
                      Patient Satisfaction
                    </span>
                  </div>

                </div>


                {/* Buttons */}
                <div className="action-group">

                  <Link
                    to="/appointment"
                    className="btn-primary"
                  >
                    Schedule Consultation
                  </Link>

                  <Link
                    to="/services"
                    className="btn-secondary"
                  >
                    <span>View All Services</span>

                    <i className="bi bi-arrow-right"></i>
                  </Link>

                </div>

              </div>

            </div>


            {/* RIGHT IMAGE */}
            <div className="col-xl-6 col-lg-5">

              <div className="department-visual">

                <div className="image-container">

                  <img
                    src={neurologyImage}
                    alt="Neurology Department"
                    className="primary-image"
                  />


                  {/* Floating Card */}
                  <div className="floating-card">

                    <div className="card-icon">
                      <i className="bi bi-brain"></i>
                    </div>

                    <div className="card-content">

                      <h4>
                        Brain Health Experts
                      </h4>

                      <p>
                        Comprehensive neurological assessment and treatment
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              SERVICES OVERVIEW
          ================================================= */}
          <div className="services-overview">

            <div className="row justify-content-center">

              <div className="col-lg-8">

                <div className="overview-header">

                  <h3>
                    Our Neurological Services
                  </h3>

                  <p>
                    Curabitur arcu erat, accumsan id imperdiet et,
                    porttitor at sem. Mauris blandit aliquet elit,
                    eget tincidunt nibh pulvinar a.
                  </p>

                </div>

              </div>

            </div>


            {/* Services */}
            <div className="row gy-4 services-grid">

              {services.map((service) => (
                <div
                  className="col-lg-4 col-md-6"
                  key={service.title}
                >

                  <div className="service-item">

                    <div className="service-icon">
                      <i
                        className={`bi ${service.icon}`}
                      ></i>
                    </div>

                    <h4>
                      {service.title}
                    </h4>

                    <p>
                      {service.description}
                    </p>

                  </div>

                </div>
              ))}

            </div>

          </div>


          {/* =================================================
              EXPERT CARE
          ================================================= */}
          <div className="expert-care-section">

            <div className="row align-items-center">

              {/* IMAGE */}
              <div className="col-lg-5">

                <div className="expert-image">

                  <img
                    src={neurologyExpert}
                    alt="Neurological Expert"
                    className="img-fluid"
                  />

                </div>

              </div>


              {/* CONTENT */}
              <div className="col-lg-7">

                <div className="expert-content">

                  <h3>
                    Leading Neurological Expertise
                  </h3>

                  <p className="lead">
                    Vivamus magna justo, lacinia eget consectetur sed,
                    convallis at tellus. Sed porttitor lectus nibh donec
                    rutrum congue leo eget malesuada.
                  </p>


                  {/* Expertise */}
                  <div className="expertise-list">

                    {expertise.map((item) => (
                      <div
                        className="expertise-item"
                        key={item}
                      >

                        <i className="bi bi-check2"></i>

                        <span>
                          {item}
                        </span>

                      </div>
                    ))}

                  </div>


                  {/* Contact Information */}
                  <div className="department-contact-info">

                    <div className="contact-item">

                      <i className="bi bi-telephone"></i>

                      <div>

                        <span className="contact-label">
                          Emergency Neurology
                        </span>

                        <a
                          href="tel:+15552345678"
                          className="contact-value"
                        >
                          +1 (555) 234-5678
                        </a>

                      </div>

                    </div>


                    <div className="contact-item">

                      <i className="bi bi-calendar-check"></i>

                      <div>

                        <span className="contact-label">
                          Appointments
                        </span>

                        <span className="contact-value">
                          Mon - Fri, 8:00 AM - 6:00 PM
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}