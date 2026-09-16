import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Award,
  Building2,
  Mail,
  Phone,
  Stethoscope,
  Loader2,
  X,
  CalendarDays,
  Clock3,
  UserRound,
  CheckCircle2,
} from "lucide-react";

import API from "../services/api";
import { toast } from "react-toastify";

import "./Doctor.css";

export default function Doctor() {
  // =====================================================
  // DOCTORS
  // =====================================================

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // APPOINTMENT MODAL
  // =====================================================

  const [selectedDoctor, setSelectedDoctor] =
    useState(null);

  const [showAppointmentModal, setShowAppointmentModal] =
    useState(false);

  const [booking, setBooking] = useState(false);

  const [bookingSuccess, setBookingSuccess] =
    useState(false);

  // =====================================================
  // APPOINTMENT FORM
  // =====================================================

  const initialAppointmentForm = {
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    symptoms: "",
  };

  const [appointmentForm, setAppointmentForm] =
    useState(initialAppointmentForm);

  // =====================================================
  // FETCH DOCTORS
  // =====================================================

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      // GET:
      // http://localhost:5000/api/doctors/public

      const response = await API.get(
        "/doctors/public"
      );

      console.log(
        "PUBLIC DOCTORS RESPONSE:",
        response.data
      );

      const doctorList =
        response.data?.doctors ||
        response.data?.data ||
        [];

      setDoctors(
        Array.isArray(doctorList)
          ? doctorList
          : []
      );
    } catch (error) {
      console.error(
        "FETCH PUBLIC DOCTORS ERROR:",
        error
      );

      setDoctors([]);

      toast.error(
        error.response?.data?.message ||
          "Failed to load doctors"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DOCTOR IMAGE
  // =====================================================

  const getDoctorImage = (photo) => {
    if (!photo) {
      return "";
    }

    if (
      photo.startsWith("http://") ||
      photo.startsWith("https://")
    ) {
      return photo;
    }

    return `http://localhost:5000${photo}`;
  };

  // =====================================================
  // EXPERIENCE
  // =====================================================

  const getExperience = (experience) => {
    const years = Number(experience);

    if (!years || years <= 0) {
      return "Experienced Doctor";
    }

    return `${years}+ Years Experience`;
  };

  // =====================================================
  // DEPARTMENT
  // =====================================================

  const getDepartment = (department) => {
    if (!department) {
      return "Medical Department";
    }

    return `${department} Dept.`;
  };

  // =====================================================
  // OPEN APPOINTMENT MODAL
  // =====================================================

  const openAppointmentModal = (doctor) => {
    setSelectedDoctor(doctor);

    setAppointmentForm({
      ...initialAppointmentForm,
    });

    setBookingSuccess(false);

    setShowAppointmentModal(true);

    // Prevent background scrolling
    document.body.style.overflow = "hidden";
  };

  // =====================================================
  // CLOSE APPOINTMENT MODAL
  // =====================================================

  const closeAppointmentModal = () => {
    if (booking) {
      return;
    }

    setShowAppointmentModal(false);

    setSelectedDoctor(null);

    setBookingSuccess(false);

    setAppointmentForm({
      ...initialAppointmentForm,
    });

    document.body.style.overflow = "";
  };

  // =====================================================
  // CLEANUP BODY SCROLL
  // =====================================================

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleAppointmentChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setAppointmentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // BOOK APPOINTMENT
  // =====================================================

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    if (!selectedDoctor?._id) {
      toast.error(
        "Doctor information is missing."
      );
      return;
    }

    try {
      setBooking(true);

      // =================================================
      // IMPORTANT
      // Backend expects:
      //
      // name
      // email
      // phone
      // age
      // gender
      // doctor
      // appointmentDate
      // appointmentTime
      // department
      // message
      // =================================================

      const payload = {
        name: appointmentForm.name.trim(),

        email:
          appointmentForm.email.trim(),

        phone:
          appointmentForm.phone.trim(),

        age: Number(
          appointmentForm.age
        ),

        gender:
          appointmentForm.gender,

        department:
          selectedDoctor.department ||
          "",

        appointmentDate:
          appointmentForm.appointmentDate,

        appointmentTime:
          appointmentForm.appointmentTime,

        doctor:
          selectedDoctor._id,

        message:
          appointmentForm.symptoms.trim(),

        // Reason is sent as department by
        // existing backend. We also keep it
        // available in frontend.
        reason:
          appointmentForm.reason.trim(),
      };

      console.log(
        "BOOK APPOINTMENT PAYLOAD:",
        payload
      );

      const response = await API.post(
        "/appointments/public",
        payload
      );

      console.log(
        "BOOK APPOINTMENT RESPONSE:",
        response.data
      );

      setBookingSuccess(true);

      toast.success(
        "Appointment booked successfully!"
      );

      // Clear form after successful booking
      setAppointmentForm({
        ...initialAppointmentForm,
      });
    } catch (error) {
      console.error(
        "BOOK APPOINTMENT ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to book appointment"
      );
    } finally {
      setBooking(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="doctor-page">

      {/* =================================================
          PAGE TITLE
      ================================================= */}

      <div className="page-title">

        <div className="heading">

          <div className="container">

            <div className="row justify-content-center text-center">

              <div className="col-lg-8">

                <h1 className="heading-title">
                  Doctors
                </h1>

                <p className="mb-0">
                  Meet our experienced medical
                  professionals dedicated to providing
                  compassionate care, advanced treatment,
                  and the best possible healthcare
                  experience for every patient.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <nav className="breadcrumbs">

          <div className="container">

            <ol>

              <li>
                <Link to="/">
                  Home
                </Link>
              </li>

              <li className="current">
                Doctors
              </li>

            </ol>

          </div>

        </nav>

      </div>

      {/* =================================================
          DOCTORS
      ================================================= */}

      <section className="doctors section">

        <div className="container">

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="doctors-loading">

              <Loader2
                size={35}
                className="doctor-loading-icon"
              />

              <p>
                Loading doctors...
              </p>

            </div>
          )}

          {/* =================================================
              NO DOCTORS
          ================================================= */}

          {!loading &&
            doctors.length === 0 && (
              <div className="no-doctors">

                <Stethoscope size={50} />

                <h3>
                  No Doctors Available
                </h3>

                <p>
                  Doctors will appear here once
                  they are added to the hospital.
                </p>

                <button
                  type="button"
                  onClick={fetchDoctors}
                  className="doctor-refresh-btn"
                >
                  Try Again
                </button>

              </div>
            )}

          {/* =================================================
              DOCTOR GRID
          ================================================= */}

          {!loading &&
            doctors.length > 0 && (
              <div className="row gy-4">

                {doctors.map((doctor) => {

                  const imageUrl =
                    getDoctorImage(
                      doctor.photo
                    );

                  return (
                    <div
                      className="col-lg-3 col-md-6"
                      key={doctor._id}
                    >

                      <div className="doctor-card">

                        {/* =================================
                            DOCTOR IMAGE
                        ================================= */}

                        <div className="doctor-image">

                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={
                                doctor.name ||
                                "Doctor"
                              }
                              className="img-fluid"
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";

                                const fallback =
                                  e.currentTarget
                                    .nextElementSibling;

                                if (fallback) {
                                  fallback.style.display =
                                    "flex";
                                }
                              }}
                            />
                          ) : null}

                          {/* IMAGE FALLBACK */}

                          <div
                            className="doctor-image-fallback"
                            style={{
                              display: imageUrl
                                ? "none"
                                : "flex",
                            }}
                          >
                            <Stethoscope
                              size={70}
                            />
                          </div>

                          {/* =================================
                              HOVER OVERLAY
                          ================================= */}

                          <div className="doctor-overlay">

                            <div className="social-links">

                              {/* LINKEDIN */}

                              {doctor.linkedin && (
                                <a
                                  href={
                                    doctor.linkedin
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  aria-label="LinkedIn"
                                >
                                  <span className="linkedin-text">
                                    in
                                  </span>
                                </a>
                              )}

                              {/* EMAIL */}

                              {doctor.email && (
                                <a
                                  href={`mailto:${doctor.email}`}
                                  aria-label="Email"
                                >
                                  <Mail
                                    size={17}
                                  />
                                </a>
                              )}

                              {/* PHONE */}

                              {doctor.phone && (
                                <a
                                  href={`tel:${doctor.phone}`}
                                  aria-label="Phone"
                                >
                                  <Phone
                                    size={17}
                                  />
                                </a>
                              )}

                            </div>

                          </div>

                        </div>

                        {/* =================================
                            DOCTOR CONTENT
                        ================================= */}

                        <div className="doctor-content">

                          <h4>
                            {doctor.name ||
                              "Doctor"}
                          </h4>

                          <span className="specialty">
                            {doctor.specialization ||
                              doctor.department ||
                              "Medical Specialist"}
                          </span>

                          <p>
                            {doctor.bio ||
                              `Experienced medical professional specializing in ${
                                doctor.specialization ||
                                doctor.department ||
                                "healthcare"
                              }, dedicated to providing quality patient care.`}
                          </p>

                          {/* META */}

                          <div className="doctor-meta">

                            <div className="experience">

                              <Award
                                size={15}
                              />

                              <span>
                                {getExperience(
                                  doctor.experience
                                )}
                              </span>

                            </div>

                            <div className="department">

                              <Building2
                                size={15}
                              />

                              <span>
                                {getDepartment(
                                  doctor.department
                                )}
                              </span>

                            </div>

                          </div>

                          {/* =================================
                              BOOK APPOINTMENT
                          ================================= */}

                          <button
                            type="button"
                            className="btn-appointment"
                            onClick={() =>
                              openAppointmentModal(
                                doctor
                              )
                            }
                          >
                            Book Appointment
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

        </div>

      </section>

      {/* =====================================================
          APPOINTMENT MODAL
      ===================================================== */}

      {showAppointmentModal &&
        selectedDoctor && (
          <div
            className="doctor-appointment-overlay"
            onMouseDown={(e) => {
              if (
                e.target ===
                e.currentTarget
              ) {
                closeAppointmentModal();
              }
            }}
          >

            <div className="doctor-appointment-modal">

              {/* =================================================
                  MODAL HEADER
              ================================================= */}

              <div className="doctor-modal-header">

                <div>
                  <span className="doctor-modal-small-title">
                    BOOK APPOINTMENT
                  </span>

                  <h2>
                    Schedule Appointment
                  </h2>

                  <p>
                    Book an appointment with
                    your selected doctor.
                  </p>
                </div>

                <button
                  type="button"
                  className="doctor-modal-close"
                  onClick={
                    closeAppointmentModal
                  }
                  disabled={booking}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>

              </div>

              {/* =================================================
                  SUCCESS
              ================================================= */}

              {bookingSuccess ? (
                <div className="doctor-booking-success">

                  <div className="success-icon">
                    <CheckCircle2
                      size={45}
                    />
                  </div>

                  <h3>
                    Appointment Booked!
                  </h3>

                  <p>
                    Your appointment with{" "}
                    <strong>
                      {selectedDoctor.name}
                    </strong>{" "}
                    has been booked
                    successfully.
                  </p>

                  <div className="success-doctor-info">

                    <strong>
                      {selectedDoctor.name}
                    </strong>

                    <span>
                      {selectedDoctor.specialization ||
                        selectedDoctor.department}
                    </span>

                  </div>

                  <button
                    type="button"
                    className="doctor-modal-done-btn"
                    onClick={
                      closeAppointmentModal
                    }
                  >
                    Done
                  </button>

                </div>
              ) : (
                <>
                  {/* =================================================
                      SELECTED DOCTOR
                  ================================================= */}

                  <div className="selected-doctor-box">

                    <div className="selected-doctor-image">

                      {selectedDoctor.photo ? (
                        <img
                          src={getDoctorImage(
                            selectedDoctor.photo
                          )}
                          alt={
                            selectedDoctor.name
                          }
                        />
                      ) : (
                        <Stethoscope
                          size={32}
                        />
                      )}

                    </div>

                    <div className="selected-doctor-details">

                      <span>
                        Selected Doctor
                      </span>

                      <h3>
                        {selectedDoctor.name}
                      </h3>

                      <p>
                        {selectedDoctor.specialization ||
                          "Medical Specialist"}
                      </p>

                      <small>
                        {selectedDoctor.department ||
                          "Medical Department"}
                      </small>

                    </div>

                  </div>

                  {/* =================================================
                      FORM
                  ================================================= */}

                  <form
                    className="doctor-appointment-form"
                    onSubmit={
                      handleBookAppointment
                    }
                  >

                    <div className="doctor-form-title">
                      <UserRound size={17} />

                      <span>
                        Patient Details
                      </span>
                    </div>

                    <div className="doctor-form-grid">

                      {/* NAME */}

                      <div className="doctor-form-group">

                        <label>
                          Full Name
                        </label>

                        <input
                          type="text"
                          name="name"
                          placeholder="Enter full name"
                          value={
                            appointmentForm.name
                          }
                          onChange={
                            handleAppointmentChange
                          }
                          required
                        />

                      </div>

                      {/* PHONE */}

                      <div className="doctor-form-group">

                        <label>
                          Phone Number
                        </label>

                        <input
                          type="tel"
                          name="phone"
                          placeholder="Enter phone number"
                          value={
                            appointmentForm.phone
                          }
                          onChange={
                            handleAppointmentChange
                          }
                          required
                        />

                      </div>

                      {/* EMAIL */}

                      <div className="doctor-form-group">

                        <label>
                          Email
                        </label>

                        <input
                          type="email"
                          name="email"
                          placeholder="Enter email"
                          value={
                            appointmentForm.email
                          }
                          onChange={
                            handleAppointmentChange
                          }
                          required
                        />

                      </div>

                      {/* AGE */}

                      <div className="doctor-form-group">

                        <label>
                          Age
                        </label>

                        <input
                          type="number"
                          name="age"
                          min="1"
                          max="120"
                          placeholder="Age"
                          value={
                            appointmentForm.age
                          }
                          onChange={
                            handleAppointmentChange
                          }
                          required
                        />

                      </div>

                      {/* GENDER */}

                      <div className="doctor-form-group">

                        <label>
                          Gender
                        </label>

                        <select
                          name="gender"
                          value={
                            appointmentForm.gender
                          }
                          onChange={
                            handleAppointmentChange
                          }
                          required
                        >

                          <option value="">
                            Select Gender
                          </option>

                          <option value="Male">
                            Male
                          </option>

                          <option value="Female">
                            Female
                          </option>

                          <option value="Other">
                            Other
                          </option>

                        </select>

                      </div>

                    </div>

                    {/* =================================================
                        APPOINTMENT DETAILS
                    ================================================= */}

                    <div className="doctor-form-title appointment-detail-title">

                      <CalendarDays
                        size={17}
                      />

                      <span>
                        Appointment Details
                      </span>

                    </div>

                    <div className="doctor-form-grid">

                      {/* DATE */}

                      <div className="doctor-form-group">

                        <label>
                          Appointment Date
                        </label>

                        <div className="doctor-input-icon">

                          <CalendarDays
                            size={16}
                          />

                          <input
                            type="date"
                            name="appointmentDate"
                            min={
                              new Date()
                                .toISOString()
                                .split("T")[0]
                            }
                            value={
                              appointmentForm.appointmentDate
                            }
                            onChange={
                              handleAppointmentChange
                            }
                            required
                          />

                        </div>

                      </div>

                      {/* TIME */}

                      <div className="doctor-form-group">

                        <label>
                          Appointment Time
                        </label>

                        <div className="doctor-input-icon">

                          <Clock3
                            size={16}
                          />

                          <input
                            type="time"
                            name="appointmentTime"
                            value={
                              appointmentForm.appointmentTime
                            }
                            onChange={
                              handleAppointmentChange
                            }
                            required
                          />

                        </div>

                      </div>

                    </div>

                    {/* =================================================
                        REASON
                    ================================================= */}

                    <div className="doctor-form-group doctor-full-field">

                      <label>
                        Reason for Appointment
                      </label>

                      <input
                        type="text"
                        name="reason"
                        placeholder="Example: Heart checkup"
                        value={
                          appointmentForm.reason
                        }
                        onChange={
                          handleAppointmentChange
                        }
                      />

                    </div>

                    {/* =================================================
                        SYMPTOMS
                    ================================================= */}

                    <div className="doctor-form-group doctor-full-field">

                      <label>
                        Symptoms / Message
                      </label>

                      <textarea
                        name="symptoms"
                        rows="3"
                        placeholder="Describe symptoms or any additional information..."
                        value={
                          appointmentForm.symptoms
                        }
                        onChange={
                          handleAppointmentChange
                        }
                      />

                    </div>

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="doctor-modal-actions">

                      <button
                        type="button"
                        className="doctor-cancel-btn"
                        onClick={
                          closeAppointmentModal
                        }
                        disabled={booking}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="doctor-confirm-btn"
                        disabled={booking}
                      >
                        {booking ? (
                          <>
                            <Loader2
                              size={17}
                              className="button-spinner"
                            />

                            Booking...
                          </>
                        ) : (
                          <>
                            <CalendarDays
                              size={17}
                            />

                            Confirm Appointment
                          </>
                        )}
                      </button>

                    </div>

                  </form>
                </>
              )}

            </div>

          </div>
        )}

    </main>
  );
}