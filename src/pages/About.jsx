
import React from "react";
import { Link } from "react-router-dom";

import facilities6 from "../assets/img/health/facilities-6.webp";
import staff8 from "../assets/img/health/staff-8.webp";

import client1 from "../assets/img/clients/clients-1.webp";
import client2 from "../assets/img/clients/clients-2.webp";
import client3 from "../assets/img/clients/clients-3.webp";
import client4 from "../assets/img/clients/clients-4.webp";
import client5 from "../assets/img/clients/clients-5.webp";

import "./About.css";

export default function About() {
  return (
    <main className="main">

      {/* ================= PAGE TITLE ================= */}
      <div className="page-title">

        <div className="heading">
          <div className="container">
            <div className="row justify-content-center text-center">

              <div className="col-lg-8">

                <h1 className="heading-title">
                  About
                </h1>

                <p className="mb-0">
                  Discover our commitment to compassionate healthcare,
                  advanced medical technology, and exceptional patient care.
                  We are dedicated to improving the health and well-being
                  of every patient and family we serve.
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
                <Link to="/">
                  Home
                </Link>
              </li>

              <li className="current">
                About
              </li>
            </ol>

          </div>
        </nav>

      </div>


      {/* ================= ABOUT SECTION ================= */}
      <section id="about" className="about section">

        <div className="container">

          <div className="row align-items-center">

            {/* LEFT CONTENT */}
            <div className="col-lg-6">

              <div className="about-content">

                <h2>
                  Compassionate Care for Every Family
                </h2>

                <p className="lead">
                  For over two decades, we have been dedicated to
                  providing exceptional healthcare services to our
                  community. Our commitment goes beyond medical
                  treatment—we believe in building lasting relationships
                  with our patients and their families.
                </p>

                <p>
                  Our experienced medical professionals work together
                  to provide personalized treatment using modern medical
                  technology and advanced healthcare facilities.
                </p>


                {/* STATS */}
                <div className="stats-grid">

                  <div className="stat-item">
                    <span className="stat-number">
                      15,000+
                    </span>

                    <span className="stat-label">
                      Patients Treated
                    </span>
                  </div>


                  <div className="stat-item">
                    <span className="stat-number">
                      25+
                    </span>

                    <span className="stat-label">
                      Years Experience
                    </span>
                  </div>


                  <div className="stat-item">
                    <span className="stat-number">
                      50+
                    </span>

                    <span className="stat-label">
                      Medical Specialists
                    </span>
                  </div>

                </div>

              </div>

            </div>


            {/* RIGHT IMAGE */}
            <div className="col-lg-6">

              <div className="image-wrapper">

                <img
                  src={facilities6}
                  className="img-fluid main-image"
                  alt="Healthcare facility"
                />

                <div className="floating-image">

                  <img
                    src={staff8}
                    className="img-fluid"
                    alt="Medical team"
                  />

                </div>

              </div>

            </div>

          </div>


          {/* ================= VALUES ================= */}
          <div className="values-section">

            <div className="row">

              <div className="col-lg-12 text-center">

                <h3>
                  Our Core Values
                </h3>

                <p className="section-description">
                  These principles guide everything we do in our
                  commitment to exceptional healthcare.
                </p>

              </div>

            </div>


            <div className="row">

              <ValueCard
                icon="bi-heart-pulse"
                title="Compassion"
                text="Providing care with empathy and understanding for every patient's unique needs and circumstances."
              />

              <ValueCard
                icon="bi-shield-check"
                title="Excellence"
                text="Maintaining the highest standards of medical care through continuous learning and innovation."
              />

              <ValueCard
                icon="bi-people"
                title="Integrity"
                text="Building trust through honest communication and ethical practices in all our interactions."
              />

              <ValueCard
                icon="bi-lightbulb"
                title="Innovation"
                text="Embracing cutting-edge technology and treatments to improve patient outcomes."
              />

            </div>

          </div>


          {/* ================= CERTIFICATIONS ================= */}
          <div className="certifications-section">

            <div className="row">

              <div className="col-lg-12 text-center">

                <h3>
                  Accreditations & Certifications
                </h3>

                <p className="section-description">
                  Recognized by leading healthcare organizations for
                  our commitment to quality care.
                </p>

              </div>

            </div>


            <div className="row justify-content-center">

              <Certification image={client1} />
              <Certification image={client2} />
              <Certification image={client3} />
              <Certification image={client4} />
              <Certification image={client5} />

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}


/* ================= VALUE CARD ================= */

function ValueCard({ icon, title, text }) {
  return (
    <div className="col-lg-3 col-md-6">

      <div className="value-item">

        <div className="value-icon">
          <i className={`bi ${icon}`}></i>
        </div>

        <h4>
          {title}
        </h4>

        <p>
          {text}
        </p>

      </div>

    </div>
  );
}


/* ================= CERTIFICATION ================= */

function Certification({ image }) {
  return (
    <div className="col-lg-2 col-md-3 col-sm-4 col-6">

      <div className="certification-item">

        <img
          src={image}
          className="img-fluid"
          alt="Healthcare certification"
        />

      </div>

    </div>
  );
}