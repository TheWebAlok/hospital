import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

import staff10 from "../assets/img/health/staff-10.webp";
import facilities9 from "../assets/img/health/facilities-9.webp";
import cardiology from "../assets/img/health/cardiology-1.webp";
import neurology from "../assets/img/health/neurology-4.webp";
import consultation from "../assets/img/health/consultation-4.webp";

import maternal from "../assets/img/health/maternal-2.webp";
import vaccination from "../assets/img/health/vaccination-3.webp";
import emergency from "../assets/img/health/emergency-1.webp";
import facilities6 from "../assets/img/health/facilities-6.webp";

import staff2 from "../assets/img/health/staff-2.webp";
import staff6 from "../assets/img/health/staff-6.webp";
import staff4 from "../assets/img/health/staff-4.webp";
import staff8 from "../assets/img/health/staff-8.webp";
import staff11 from "../assets/img/health/staff-11.webp";
import staff14 from "../assets/img/health/staff-14.webp";

import "./Home.css";

export default function Home() {

  const [doctors, setDoctors] = useState([]);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [specialty, setSpecialty] = useState("All Specialties");
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [booking, setBooking] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    symptoms: "",
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    document.body.style.overflow = showAppointmentModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showAppointmentModal]);

  const loadDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const res = await API.get("/doctors/public");
      const data = res.data;
      const list = Array.isArray(data)
        ? data
        : data?.doctors || data?.data || [];
      setDoctors(list);
    } catch (error) {
      console.error("LOAD DOCTORS ERROR:", error);
      toast.error("Unable to load doctors.");
    } finally {
      setLoadingDoctors(false);
    }
  };

  const getDoctorImage = (doctor, index = 0) => {
    if (doctor?.photo) {
      if (doctor.photo.startsWith("http")) return doctor.photo;
      return `http://localhost:5000${doctor.photo.startsWith("/") ? "" : "/"}${doctor.photo}`;
    }

    const fallbackImages = [staff2, staff6, staff4, staff8, staff11, staff14];
    return fallbackImages[index % fallbackImages.length];
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const search = doctorSearch.trim().toLowerCase();
      const name = (doctor.name || "").toLowerCase();
      const dept = (doctor.department || "").toLowerCase();
      const spec = (doctor.specialization || "").toLowerCase();

      const matchesSearch =
        !search ||
        name.includes(search) ||
        dept.includes(search) ||
        spec.includes(search);

      const matchesSpecialty =
        specialty === "All Specialties" ||
        dept.includes(specialty.toLowerCase()) ||
        spec.includes(specialty.toLowerCase());

      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, doctorSearch, specialty]);

  const openAppointmentModal = (doctor = null) => {
    setSelectedDoctor(doctor);
    setBookingSuccess(false);
    setBooking({
      name: "",
      phone: "",
      email: "",
      age: "",
      gender: "",
      appointmentDate: "",
      appointmentTime: "",
      reason: "",
      symptoms: "",
    });
    setShowAppointmentModal(true);
  };

  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    setBookingSuccess(false);
    setSelectedDoctor(null);
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor?._id) {
      toast.error("Please select a doctor.");
      return;
    }

    if (
      !booking.name.trim() ||
      !booking.phone.trim() ||
      !booking.age ||
      !booking.gender ||
      !booking.appointmentDate ||
      !booking.appointmentTime
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      await API.post("/appointments/public", {
        name: booking.name.trim(),
        email: booking.email.trim(),
        phone: booking.phone.trim(),
        age: Number(booking.age),
        gender: booking.gender,
        department: selectedDoctor.department || "",
        appointmentDate: booking.appointmentDate,
        appointmentTime: booking.appointmentTime,
        doctor: selectedDoctor._id,
        message: booking.symptoms.trim(),
        reason: booking.reason.trim(),
      });

      setBookingSuccess(true);
      toast.success("Appointment booked successfully.");
    } catch (error) {
      console.error("BOOK APPOINTMENT ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Unable to book appointment."
      );
    }
  };

  const specialties = [
    "All Specialties",
    ...Array.from(
      new Set(
        doctors
          .flatMap((doctor) => [doctor.department, doctor.specialization])
          .filter(Boolean)
      )
    ),
  ];
  return (
    <main>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="container">
          <div className="row align-items-center g-5">

            <div className="col-lg-6">
              <div className="hero-content">

                <div className="d-flex flex-wrap gap-3 mb-4">
                  <div className="badge-item">
                    <i className="bi bi-shield-check"></i>
                    <span>Accredited</span>
                  </div>

                  <div className="badge-item">
                    <i className="bi bi-clock"></i>
                    <span>24/7 Emergency</span>
                  </div>

                  <div className="badge-item">
                    <i className="bi bi-star-fill"></i>
                    <span>4.9/5 Rating</span>
                  </div>
                </div>

                <h1 className="display-4 fw-bold">
                  Excellence in{" "}
                  <span className="text-primary">Healthcare</span>{" "}
                  With Compassionate Care
                </h1>

                <p className="lead text-muted mt-4">
                  We provide high-quality healthcare services with
                  experienced medical professionals, advanced technology,
                  and compassionate patient care.
                </p>

                <div className="row mt-4">
                  <div className="col-4">
                    <h3 className="fw-bold">15+</h3>
                    <p className="text-muted">Years Experience</p>
                  </div>

                  <div className="col-4">
                    <h3 className="fw-bold">5000+</h3>
                    <p className="text-muted">Patients Treated</p>
                  </div>

                  <div className="col-4">
                    <h3 className="fw-bold">50+</h3>
                    <p className="text-muted">Medical Experts</p>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-3 mt-4">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={() => openAppointmentModal()}
                  >
                    Book Appointment
                  </button>

                  <a
                    href="https://www.youtube.com/watch?v=Y7f98aduVJ8"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-primary btn-lg"
                  >
                    <i className="bi bi-play-circle me-2"></i>
                    Watch Our Story
                  </a>
                </div>

                <div className="emergency-contact mt-4 d-flex align-items-center gap-3">
                  <div className="emergency-icon">
                    <i className="bi bi-telephone-fill"></i>
                  </div>

                  <div>
                    <small className="text-muted d-block">
                      Emergency Hotline
                    </small>
                    <strong>+1 (555) 911-2468</strong>
                  </div>
                </div>

              </div>
            </div>

            <div className="col-lg-6">
  <div className="hero-image-wrapper">

    <img
      src={staff10}
      alt="Modern Healthcare Facility"
      className="hero-main-image"
    />

    {/* APPOINTMENT CARD */}

    <div className="hero-floating-card hero-appointment-card">

      <div className="d-flex gap-3 align-items-center">

        <i className="bi bi-calendar-check fs-2 text-primary"></i>

        <div>
          <h6 className="mb-1">
            Next Available
          </h6>

          <p className="mb-0">
            Today 2:30 PM
          </p>

          <small>
            Dr. Sarah Johnson
          </small>
        </div>

      </div>

    </div>


    {/* RATING CARD */}

    <div className="hero-floating-card hero-rating-card">

      <div className="text-center">

        <div className="text-warning hero-stars">
          ★★★★★
        </div>

        <h6 className="mb-0">
          4.9/5
        </h6>

        <small>
          1,234 Reviews
        </small>

      </div>

    </div>

  </div>
</div>

          </div>
        </div>
      </section>


      {/* ================= ABOUT ================= */}
      <section className="py-5 bg-light">
        <div className="container py-5">

          <div className="row align-items-center g-5">

            <div className="col-lg-6">
              <h2 className="fw-bold">
                Compassionate Care, Advanced Medicine
              </h2>

              <p className="lead mt-3">
                For over two decades, we've been dedicated to providing
                exceptional healthcare that combines cutting-edge medical
                technology with the personal touch our patients deserve.
              </p>

              <p className="text-muted">
                Our multidisciplinary team of specialists works
                collaboratively to ensure every patient receives
                comprehensive care tailored to their unique needs.
              </p>

              <div className="row mt-4">

                <div className="col-4">
                  <h3 className="fw-bold text-primary">15K+</h3>
                  <p>Patients Served</p>
                </div>

                <div className="col-4">
                  <h3 className="fw-bold text-primary">25+</h3>
                  <p>Years Excellence</p>
                </div>

                <div className="col-4">
                  <h3 className="fw-bold text-primary">50+</h3>
                  <p>Specialists</p>
                </div>

              </div>

              <Link
                to="/about"
                className="btn btn-primary mt-3"
              >
                Learn More About Us
              </Link>
            </div>

            <div className="col-lg-6">
              <div className="position-relative">

                <img
                  src={facilities9}
                  alt="Modern medical facility"
                  className="img-fluid rounded-4 shadow"
                />

                <div className="about-floating-card">
                  <i className="bi bi-heart-pulse text-primary fs-2"></i>
                  <div>
                    <h5>24/7 Emergency Care</h5>
                    <p className="mb-0">
                      Always here when you need us most
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ================= DEPARTMENTS ================= */}
      <section className="py-5">
        <div className="container py-5">

          <div className="text-center mb-5">
            <h2 className="fw-bold">Featured Departments</h2>
            <p className="text-muted">
              Specialized healthcare services from experienced professionals.
            </p>
          </div>

          <div className="row g-4">

            <DepartmentCard
              title="Cardiovascular Medicine"
              description="Advanced diagnostic imaging and interventional procedures for comprehensive heart health management."
              image={cardiology}
              icon="bi-heart-pulse"
            />

            <DepartmentCard
              title="Neurological Sciences"
              description="Cutting-edge neuroimaging and neurosurgical expertise for complex brain and spinal cord conditions."
              image={neurology}
              icon="bi-cpu"
            />

            <SimpleDepartment
              icon="bi-shield-plus"
              title="Orthopedic Surgery"
              text="Comprehensive musculoskeletal care utilizing advanced techniques and joint replacement procedures."
              items={["Sports Medicine", "Joint Replacement", "Spine Surgery"]}
            />

            <SimpleDepartment
              icon="bi-people"
              title="Pediatric Care"
              text="Child-centered healthcare services from newborn to adolescence."
              items={[
                "Neonatal Intensive Care",
                "Developmental Pediatrics",
                "Pediatric Surgery",
              ]}
            />

            <SimpleDepartment
              icon="bi-activity"
              title="Cancer Treatment"
              text="Multidisciplinary oncology program offering personalized cancer care."
              items={[
                "Precision Medicine",
                "Immunotherapy",
                "Radiation Oncology",
              ]}
            />

          </div>

          <div className="emergency-banner mt-5 p-4 rounded-4">
            <div className="row align-items-center">

              <div className="col-lg-8">
                <h3>Emergency Services Available 24/7</h3>
                <p className="mb-0">
                  Our emergency department is equipped with advanced
                  technology and experienced emergency physicians.
                </p>
              </div>

              <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                <a
                  href="tel:+15551234567"
                  className="btn btn-light"
                >
                  <i className="bi bi-telephone-fill me-2"></i>
                  Call Emergency
                </a>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ================= SERVICES ================= */}
      <section className="py-5 bg-light">
        <div className="container py-5">

          <div className="text-center mb-5">
            <h2 className="fw-bold">Featured Services</h2>
            <p className="text-muted">
              Comprehensive medical services for every stage of life.
            </p>
          </div>

          <div className="row g-0 shadow rounded-4 overflow-hidden bg-white">

            <div className="col-lg-8">
              <img
                src={consultation}
                alt="Premier Healthcare Services"
                className="img-fluid w-100 service-main-image"
              />

              <div className="p-4">
                <span className="badge bg-primary mb-3">
                  Emergency Care
                </span>

                <h2>Comprehensive Healthcare Excellence</h2>

                <p className="text-muted">
                  We deliver high-quality healthcare services using
                  modern technology and patient-focused treatment.
                </p>

                <Link
                  to="/services"
                  className="btn btn-primary"
                >
                  Explore Our Services
                </Link>
              </div>
            </div>

            <div className="col-lg-4 p-4">

              <ServiceItem
                icon="bi-capsule"
                title="Dermatology Clinic"
                text="Complete skin care and dermatology services."
              />

              <ServiceItem
                icon="bi-bandaid"
                title="Surgery Center"
                text="Advanced surgical procedures and patient care."
              />

              <ServiceItem
                icon="bi-activity"
                title="Diagnostics Lab"
                text="Modern diagnostic and laboratory services."
              />

            </div>

          </div>


          <div className="row g-4 mt-4">

            <SmallService
              image={maternal}
              title="Maternal Care"
              text="Expert pregnancy & delivery support"
            />

            <SmallService
              image={vaccination}
              title="Vaccination"
              text="Complete immunization programs"
            />

            <SmallService
              image={emergency}
              title="Emergency Care"
              text="24/7 critical care services"
            />

            <SmallService
              image={facilities6}
              title="Advanced Technology"
              text="State-of-the-art medical equipment"
            />

          </div>

        </div>
      </section>


      {/* ================= DOCTORS ================= */}
      <section className="py-5">
        <div className="container py-5">

          <div className="text-center mb-5">
            <h2 className="fw-bold">Find A Doctor</h2>
            <p className="text-muted">
              Search through our experienced medical professionals.
            </p>
          </div>

          {/* Search */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8">

              <div className="p-4 bg-light rounded-4">

                <h3 className="text-center mb-4">
                  Find Your Perfect Healthcare Provider
                </h3>

                <div className="row g-3">

                  <div className="col-md-5">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Enter doctor name"
                      value={doctorSearch}
                      onChange={(e) => setDoctorSearch(e.target.value)}
                    />
                  </div>

                  <div className="col-md-4">
                    <select
                      className="form-select form-select-lg"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                    >
                      {specialties.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <button
                      type="button"
                      className="btn btn-primary btn-lg w-100"
                      onClick={() =>
                        document
                          .getElementById("doctor-results")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      <i className="bi bi-search me-2"></i>
                      Find Doctors
                    </button>
                  </div>

                </div>

              </div>

            </div>
          </div>


          <div id="doctor-results" className="row g-4">
            {loadingDoctors ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-3">Loading doctors...</p>
              </div>
            ) : filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor, index) => (
                <DoctorCard
                  key={doctor._id || index}
                  doctor={doctor}
                  image={getDoctorImage(doctor, index)}
                  name={doctor.name}
                  specialty={
                    doctor.specialization ||
                    doctor.department ||
                    "Medical Specialist"
                  }
                  experience={`${doctor.experience || 0} years experience`}
                  rating={doctor.rating || "5.0"}
                  reviews={doctor.reviews || "0"}
                  onBook={() => openAppointmentModal(doctor)}
                />
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <div className="p-5 bg-light rounded-4">
                  <i className="bi bi-person-x fs-1 text-muted"></i>
                  <h4 className="mt-3">No doctors found</h4>
                  <p className="text-muted mb-0">
                    Try another doctor name or specialty.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-5">
            <Link to="/doctors" className="btn btn-outline-primary">
              View All Doctors
              <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>

        </div>
      </section>


      {/* ================= CTA ================= */}
      <section className="py-5 bg-light">
        <div className="container py-5">

          <div className="row align-items-center g-5">

            <div className="col-lg-6">

              <h1 className="fw-bold">
                Excellence in Medical Care, Every Day
              </h1>

              <p className="lead text-muted">
                Our experienced medical team is committed to providing
                compassionate and advanced healthcare every day.
              </p>

              <div className="d-flex flex-wrap gap-3">

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => openAppointmentModal()}
                >
                  Schedule Consultation
                  <i className="bi bi-arrow-right ms-2"></i>
                </button>

                <Link
                  to="/services"
                  className="btn btn-outline-primary"
                >
                  Explore Services
                  <i className="bi bi-arrow-right ms-2"></i>
                </Link>

              </div>

            </div>

            <div className="col-lg-6">
              <img
                src={facilities9}
                alt="Medical Excellence"
                className="img-fluid rounded-4 shadow"
              />
            </div>

          </div>


          <div className="row g-0 mt-5 bg-white rounded-4 shadow-sm">

            <Feature
              icon="bi-shield-check"
              title="Advanced Technology"
              text="Modern equipment and advanced medical technology."
            />

            <Feature
              icon="bi-clock"
              title="24/7 Availability"
              text="Healthcare support available whenever you need us."
            />

            <Feature
              icon="bi-people"
              title="Expert Team"
              text="Experienced and dedicated medical professionals."
            />

          </div>


          <div className="contact-block mt-5 p-4 rounded-4">

            <div className="row align-items-center">

              <div className="col-lg-8">
                <h2>Need Immediate Medical Assistance?</h2>
                <p className="mb-0">
                  Our emergency response team is available around the clock.
                </p>
              </div>

              <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                <a
                  href="tel:5551234567"
                  className="btn btn-primary me-2"
                >
                  <i className="bi bi-telephone me-2"></i>
                  (555) 123-4567
                </a>

                <Link
                  to="/contact"
                  className="btn btn-outline-primary"
                >
                  Find Location
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= APPOINTMENT MODAL ================= */}
      {showAppointmentModal && (
        <div
          className="home-appointment-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeAppointmentModal();
          }}
        >
          <div className="home-appointment-modal">
            <div className="home-appointment-header">
              <div>
                <h3 className="mb-1">
                  <i className="bi bi-calendar-check text-primary me-2"></i>
                  Book Appointment
                </h3>
                <p className="text-muted mb-0">
                  Fill in your details to request an appointment.
                </p>
              </div>

              <button
                type="button"
                className="home-modal-close"
                onClick={closeAppointmentModal}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {bookingSuccess ? (
              <div className="home-booking-success text-center">
                <div className="success-icon">
                  <i className="bi bi-check-lg"></i>
                </div>
                <h3 className="mt-3">Appointment Requested!</h3>
                <p className="text-muted">
                  Your appointment request has been submitted successfully.
                  Our team will contact you for confirmation.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={closeAppointmentModal}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                {!selectedDoctor ? (
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Select Doctor <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select form-select-lg"
                      value=""
                      onChange={(e) => {
                        const doctor = doctors.find(
                          (item) => item._id === e.target.value
                        );
                        if (doctor) setSelectedDoctor(doctor);
                      }}
                      required
                    >
                      <option value="">Choose a doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          {doctor.name} —{" "}
                          {doctor.specialization ||
                            doctor.department ||
                            "Specialist"}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="selected-doctor-box mb-4">
                    <img
                      src={getDoctorImage(
                        selectedDoctor,
                        doctors.findIndex(
                          (item) => item._id === selectedDoctor._id
                        )
                      )}
                      alt={selectedDoctor.name}
                    />
                    <div>
                      <small className="text-muted">Appointment with</small>
                      <h5 className="mb-1">{selectedDoctor.name}</h5>
                      <span>
                        {selectedDoctor.specialization ||
                          selectedDoctor.department ||
                          "Medical Specialist"}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary ms-auto"
                      onClick={() => setSelectedDoctor(null)}
                    >
                      Change
                    </button>
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={booking.name}
                      onChange={handleBookingChange}
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Phone <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={booking.phone}
                      onChange={handleBookingChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={booking.email}
                      onChange={handleBookingChange}
                      placeholder="Enter email"
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">
                      Age <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      min="1"
                      max="120"
                      className="form-control"
                      value={booking.age}
                      onChange={handleBookingChange}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">
                      Gender <span className="text-danger">*</span>
                    </label>
                    <select
                      name="gender"
                      className="form-select"
                      value={booking.gender}
                      onChange={handleBookingChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Appointment Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      name="appointmentDate"
                      className="form-control"
                      min={new Date().toISOString().split("T")[0]}
                      value={booking.appointmentDate}
                      onChange={handleBookingChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Appointment Time <span className="text-danger">*</span>
                    </label>
                    <input
                      type="time"
                      name="appointmentTime"
                      className="form-control"
                      value={booking.appointmentTime}
                      onChange={handleBookingChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Reason for Visit</label>
                    <input
                      type="text"
                      name="reason"
                      className="form-control"
                      value={booking.reason}
                      onChange={handleBookingChange}
                      placeholder="e.g. General check-up, consultation"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Symptoms / Message</label>
                    <textarea
                      name="symptoms"
                      className="form-control"
                      rows="3"
                      value={booking.symptoms}
                      onChange={handleBookingChange}
                      placeholder="Tell us about your symptoms or message"
                    ></textarea>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={closeAppointmentModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={!selectedDoctor}
                  >
                    <i className="bi bi-calendar-check me-2"></i>
                    Confirm Appointment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}


/* ================= COMPONENTS ================= */

function DepartmentCard({ title, description, image, icon }) {
  return (
    <div className="col-lg-6">
      <div className="department-card h-100">

        <div className="p-4">
          <span className="badge bg-primary mb-3">
            Specialized Care
          </span>

          <h3>{title}</h3>

          <p className="text-muted">
            {description}
          </p>

          <div className="mb-3">
            <div>
              <i className="bi bi-check-circle-fill text-primary me-2"></i>
              24/7 Emergency Care
            </div>

            <div>
              <i className="bi bi-check-circle-fill text-primary me-2"></i>
              Minimally Invasive Procedures
            </div>
          </div>

          <Link to="/departments" className="btn btn-link p-0">
            Explore {title}
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>

        <div className="position-relative">
          <img
            src={image}
            alt={title}
            className="img-fluid department-image"
          />

          <div className="department-icon">
            <i className={`bi ${icon}`}></i>
          </div>
        </div>

      </div>
    </div>
  );
}


function SimpleDepartment({ icon, title, text, items }) {
  return (
    <div className="col-lg-4">
      <div className="simple-department h-100 p-4">

        <div className="department-symbol">
          <i className={`bi ${icon}`}></i>
        </div>

        <h4>{title}</h4>

        <p className="text-muted">
          {text}
        </p>

        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <Link to="/departments" className="btn btn-link p-0">
          Learn More
        </Link>

      </div>
    </div>
  );
}


function ServiceItem({ icon, title, text }) {
  return (
    <div className="service-item d-flex gap-3 mb-4">

      <div className="service-icon">
        <i className={`bi ${icon}`}></i>
      </div>

      <div>
        <h5>{title}</h5>
        <p className="text-muted mb-1">{text}</p>

        <Link to="/services" className="text-primary">
          Learn More
        </Link>
      </div>

    </div>
  );
}


function SmallService({ image, title, text }) {
  return (
    <div className="col-lg-3 col-md-6">

      <div className="small-service bg-white rounded-3 shadow-sm overflow-hidden h-100">

        <img
          src={image}
          alt={title}
          className="img-fluid w-100"
        />

        <div className="p-3">
          <h5>{title}</h5>
          <span className="text-muted">{text}</span>
        </div>

      </div>

    </div>
  );
}


function DoctorCard({
  doctor,
  image,
  name,
  specialty,
  experience,
  rating,
  reviews,
  onBook,
}) {
  return (
    <div className="col-lg-4 col-md-6">
      <div className="doctor-card h-100">
        <div className="d-flex align-items-center gap-3">
          <img
            src={image}
            alt={name}
            className="doctor-avatar"
            onError={(e) => {
              e.currentTarget.src = staff2;
            }}
          />

          <div>
            <h5 className="mb-1">{name}</h5>

            <span className="badge bg-light text-primary">
              {specialty}
            </span>

            <div className="small text-muted mt-2">
              <i className="bi bi-award me-1"></i>
              {experience}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <span className="text-warning">★★★★★</span>
          <strong className="ms-2">{rating}</strong>
          <span className="text-muted ms-2">({reviews} reviews)</span>
        </div>

        <div className="d-flex gap-2 mt-3">
          <Link
            to="/doctors"
            className="btn btn-outline-secondary btn-sm"
          >
            View Details
          </Link>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onBook}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}


function Feature({ icon, title, text }) {
  return (
    <div className="col-lg-4 p-4 border-end">

      <div className="feature-icon mb-3">
        <i className={`bi ${icon}`}></i>
      </div>

      <h4>{title}</h4>

      <p className="text-muted mb-0">
        {text}
      </p>

    </div>
  );
}