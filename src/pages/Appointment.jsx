import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  CalendarDays,
  Clock3,
  UserRound,
  CheckCircle2,
  ClipboardList,
  Phone,
  Stethoscope,
  RefreshCw,
  AlertCircle,
  Video,
} from "lucide-react";

import API from "../services/api";
import { toast } from "react-toastify";

import "./Appointment.css";

export default function Appointment() {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingAppointments, setLoadingAppointments] =
    useState(true);

  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    department: "",
    date: "",
    time: "",
    doctor: "",
    message: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  // =====================================================
  // FETCH DOCTORS
  // =====================================================

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);

      const response = await API.get("/doctors/public");

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
        "FETCH DOCTORS ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load doctors"
      );

      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // =====================================================
  // FETCH ALL APPOINTMENTS
  // =====================================================

  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);

      const response = await API.get(
        "/appointments"
      );

      console.log(
        "APPOINTMENTS API RESPONSE:",
        response.data
      );

      const appointmentList = Array.isArray(
        response.data?.appointments
      )
        ? response.data.appointments
        : [];

      // =================================================
      // LATEST FIRST
      // =================================================

      const sortedAppointments = [
        ...appointmentList,
      ].sort((a, b) => {
        const dateA = new Date(
          a.appointmentDate || 0
        ).getTime();

        const dateB = new Date(
          b.appointmentDate || 0
        ).getTime();

        if (dateA !== dateB) {
          return dateB - dateA;
        }

        return (
          parseTimeToMinutes(
            b.appointmentTime
          ) -
          parseTimeToMinutes(
            a.appointmentTime
          )
        );
      });

      setAppointments(
        sortedAppointments
      );
    } catch (error) {
      console.error(
        "FETCH APPOINTMENTS ERROR:",
        error
      );

      setAppointments([]);

      // 401 means user is not logged in.
      // Do not show unnecessary toast.
      if (error.response?.status !== 401) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load appointments"
        );
      }
    } finally {
      setLoadingAppointments(false);
    }
  };

  // =====================================================
  // TIME SORT HELPER
  // =====================================================

  const parseTimeToMinutes = (time) => {
    if (!time) return 0;

    const value = String(time)
      .trim()
      .toUpperCase();

    // Example: 11:00 AM
    const match = value.match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)$/
    );

    if (match) {
      let hours = Number(match[1]);

      const minutes = Number(match[2]);

      const period = match[3];

      if (
        period === "AM" &&
        hours === 12
      ) {
        hours = 0;
      }

      if (
        period === "PM" &&
        hours !== 12
      ) {
        hours += 12;
      }

      return hours * 60 + minutes;
    }

    // Example: 11:00
    const simpleMatch = value.match(
      /^(\d{1,2}):(\d{2})$/
    );

    if (simpleMatch) {
      return (
        Number(simpleMatch[1]) * 60 +
        Number(simpleMatch[2])
      );
    }

    return 0;
  };

  // =====================================================
  // DATE HELPERS
  // =====================================================

  const getDateKey = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getDateFromToday = (daysAgo) => {
    const date = new Date();

    date.setHours(0, 0, 0, 0);

    date.setDate(
      date.getDate() - daysAgo
    );

    return getDateKey(date);
  };

  // =====================================================
  // TODAY
  // =====================================================

  const todayKey =
    getDateFromToday(0);

  // =====================================================
  // YESTERDAY
  // =====================================================

  const yesterdayKey =
    getDateFromToday(1);

  // =====================================================
  // TODAY APPOINTMENTS
  // =====================================================

  const todayAppointments =
    appointments.filter(
      (appointment) =>
        getDateKey(
          appointment.appointmentDate
        ) === todayKey
    );

  // =====================================================
  // YESTERDAY APPOINTMENTS
  // =====================================================

  const yesterdayAppointments =
    appointments.filter(
      (appointment) =>
        getDateKey(
          appointment.appointmentDate
        ) === yesterdayKey
    );

  // =====================================================
  // LAST 10 DAYS
  // EXCLUDING TODAY + YESTERDAY
  // =====================================================

  const lastTenDaysKeys = [];

  for (let i = 2; i <= 11; i++) {
    lastTenDaysKeys.push(
      getDateFromToday(i)
    );
  }

  const lastTenDaysAppointments =
    appointments.filter(
      (appointment) =>
        lastTenDaysKeys.includes(
          getDateKey(
            appointment.appointmentDate
          )
        )
    );

  // =====================================================
  // OLDER APPOINTMENTS
  // =====================================================

  const displayedRecentAppointmentIds =
    new Set([
      ...todayAppointments.map(
        (item) => item._id
      ),
      ...yesterdayAppointments.map(
        (item) => item._id
      ),
      ...lastTenDaysAppointments.map(
        (item) => item._id
      ),
    ]);

  const olderAppointments =
    appointments.filter(
      (appointment) =>
        !displayedRecentAppointmentIds.has(
          appointment._id
        )
    );

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date not available";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // GET DOCTOR NAME
  // =====================================================

  const getDoctorName = (appointment) => {
    if (
      appointment?.doctor &&
      typeof appointment.doctor ===
        "object"
    ) {
      return (
        appointment.doctor.name ||
        "Doctor not assigned"
      );
    }

    if (
      typeof appointment?.doctor ===
      "string"
    ) {
      const doctor = doctors.find(
        (item) =>
          item._id ===
          appointment.doctor
      );

      return (
        doctor?.name ||
        "Doctor not assigned"
      );
    }

    return "Doctor not assigned";
  };

  // =====================================================
  // GET DOCTOR DEPARTMENT
  // =====================================================

  const getDepartment = (appointment) => {
    if (
      appointment?.doctor &&
      typeof appointment.doctor ===
        "object"
    ) {
      return (
        appointment.doctor.department ||
        appointment.reason ||
        "General"
      );
    }

    return (
      appointment.reason ||
      "General"
    );
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    const value = String(
      status || "Pending"
    )
      .toLowerCase()
      .trim();

    return value.replace(
      /\s+/g,
      "-"
    );
  };

  // =====================================================
  // VIDEO CONSULTATION CHECK
  // =====================================================

  const hasVideoConsultation = (
    appointment
  ) => {
    // Current local Socket.IO flow: use the appointment
    // ID as the video room ID so the button is visible
    // even before a separate meetingId is stored.
    return Boolean(appointment?._id);
  };

  // =====================================================
  // JOIN VIDEO CONSULTATION
  // =====================================================

  const joinVideoConsultation = (
    appointment
  ) => {
    // Prefer a backend-generated meetingId when available.
    // Fall back to appointment _id for the current testing flow.
    const meetingId =
      appointment?.videoConsultation?.meetingId ||
      appointment?._id;

    if (!meetingId) {
      toast.error(
        "Unable to open video consultation."
      );
      return;
    }

    navigate(
      `/patient/video-consultation?meetingId=${encodeURIComponent(
        meetingId
      )}`
    );
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (submitted) {
      setSubmitted(false);
    }
  };
// =====================================================
// HANDLE DOCTOR OFFER
// =====================================================

const handleOffer = async (offer) => {
  try {
    if (!offer) {
      console.warn("Empty WebRTC offer received");
      return;
    }

    // Create peer connection if needed
    if (!peerConnectionRef.current) {
      createPeerConnection();
    }

    const peerConnection =
      peerConnectionRef.current;

    // -------------------------------------------------
    // IMPORTANT:
    // Patient is ANSWERER.
    // Ignore duplicate/unexpected offers.
    // -------------------------------------------------

    if (
      peerConnection.signalingState !== "stable"
    ) {
      console.warn(
        "Ignoring duplicate/unexpected offer. Current signaling state:",
        peerConnection.signalingState
      );

      return;
    }

    // -------------------------------------------------
    // Set Doctor Offer
    // -------------------------------------------------

    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    // -------------------------------------------------
    // Make Answer
    // -------------------------------------------------

    const answer =
      await peerConnection.createAnswer();

    // -------------------------------------------------
    // Make sure we are still in correct state
    // -------------------------------------------------

    if (
      peerConnection.signalingState !==
      "have-remote-offer"
    ) {
      console.warn(
        "Cannot create answer. Current signaling state:",
        peerConnection.signalingState
      );

      return;
    }

    await peerConnection.setLocalDescription(
      answer
    );

    // -------------------------------------------------
    // Send Answer to Doctor
    // -------------------------------------------------

    if (socketRef.current?.connected) {
      socketRef.current.emit(
        "webrtc-answer",
        {
          meetingId,
          answer,
        }
      );

      console.log(
        "WebRTC answer sent successfully"
      );
    }
  } catch (err) {
    console.error(
      "Offer handling error:",
      err
    );
  }
};
  // =====================================================
  // BOOK APPOINTMENT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await API.post(
        "/appointments/public",
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          age: formData.age,
          gender: formData.gender,
          department:
            formData.department,
          appointmentDate:
            formData.date,
          appointmentTime:
            formData.time,
          doctor: formData.doctor,
          message:
            formData.message,
        }
      );

      toast.success(
        "Appointment booked successfully!"
      );

      setSubmitted(true);

      setFormData({
        ...initialForm,
      });

      // Immediately refresh list
      await fetchAppointments();
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
      setSubmitting(false);
    }
  };

  // =====================================================
  // APPOINTMENT CARD
  // =====================================================

  const AppointmentCard = ({
    appointment,
  }) => {
    const patient =
      appointment?.patient || {};

    return (
      <div className="appointment-list-card">

        {/* =================================================
            CARD TOP
        ================================================= */}

        <div className="appointment-card-top">

          <div className="appointment-patient">

            <div className="patient-avatar">
              {(
                patient.name ||
                "P"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="patient-main-info">

              <h4>
                {patient.name ||
                  "Patient"}
              </h4>

              <div className="patient-contact">

                <Phone size={12} />

                <span>
                  {patient.phone ||
                    "No phone number"}
                </span>

              </div>

            </div>

          </div>

          <span
            className={`appointment-status ${getStatusClass(
              appointment.status
            )}`}
          >
            {appointment.status ||
              "Pending"}
          </span>

        </div>

        {/* =================================================
            APPOINTMENT DETAILS
        ================================================= */}

        <div className="appointment-card-info">

          {/* DOCTOR */}

          <div className="appointment-info-item">

            <span className="info-label">

              <Stethoscope size={12} />

              Doctor

            </span>

            <strong>
              {getDoctorName(
                appointment
              )}
            </strong>

          </div>

          {/* DATE */}

          <div className="appointment-info-item">

            <span className="info-label">

              <CalendarDays size={12} />

              Date

            </span>

            <strong>
              {formatDate(
                appointment.appointmentDate
              )}
            </strong>

          </div>

          {/* TIME */}

          <div className="appointment-info-item">

            <span className="info-label">

              <Clock3 size={12} />

              Time

            </span>

            <strong>
              {appointment.appointmentTime ||
                "--"}
            </strong>

          </div>

          {/* DEPARTMENT */}

          <div className="appointment-info-item">

            <span className="info-label">

              <ClipboardList size={12} />

              Department

            </span>

            <strong>
              {getDepartment(
                appointment
              )}
            </strong>

          </div>

        </div>

        {/* =================================================
            REASON
        ================================================= */}

        {appointment.reason && (
          <div className="appointment-extra">

            <span>
              Reason:
            </span>{" "}

            {appointment.reason}

          </div>
        )}

        {/* =================================================
            SYMPTOMS
        ================================================= */}

        {appointment.symptoms && (
          <div className="appointment-extra">

            <span>
              Symptoms:
            </span>{" "}

            {appointment.symptoms}

          </div>
        )}

        {/* =================================================
            VIDEO CONSULTATION
        ================================================= */}

        {hasVideoConsultation(
          appointment
        ) && (
          <div className="appointment-video-section">

            <div className="video-consultation-info">

              <div className="video-consultation-title">

                <Video size={17} />

                <div>

                  <strong>
                    Video Consultation
                  </strong>

                  <span>
                    Join your doctor for a video
                    consultation.
                  </span>

                </div>

              </div>

              <button
                type="button"
                className="patient-video-btn"
                onClick={() =>
                  joinVideoConsultation(
                    appointment
                  )
                }
              >

                <Video size={17} />

                <span>
                  Join Video
                </span>

              </button>

            </div>

          </div>
        )}

      </div>
    );
  };

  // =====================================================
  // APPOINTMENT GROUP
  // =====================================================

  const AppointmentGroup = ({
    title,
    subtitle,
    icon,
    appointments:
      groupAppointments,
  }) => {
    return (
      <div className="appointment-group">

        <div className="appointment-group-header">

          <div className="group-heading-left">

            <div className="group-icon">
              {icon}
            </div>

            <div>

              <h3>
                {title}
              </h3>

              <span>
                {subtitle ||
                  `${
                    groupAppointments.length
                  } ${
                    groupAppointments.length ===
                    1
                      ? "appointment"
                      : "appointments"
                  }`}
              </span>

            </div>

          </div>

          <div className="group-count">
            {groupAppointments.length}
          </div>

        </div>

        {groupAppointments.length ===
        0 ? (
          <div className="no-appointments">

            <CalendarDays size={17} />

            <span>
              No appointments
            </span>

          </div>
        ) : (
          <div className="appointment-group-list">

            {groupAppointments.map(
              (appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={
                    appointment
                  }
                />
              )
            )}

          </div>
        )}

      </div>
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="appointment-page">

      {/* =================================================
          PAGE TITLE
      ================================================= */}

      <div className="page-title">

        <div className="heading">

          <div className="container">

            <div className="row justify-content-center text-center">

              <div className="col-lg-8">

                <h1 className="heading-title">
                  Appointment
                </h1>

                <p className="mb-0">
                  Schedule your appointment
                  with our experienced
                  healthcare professionals.
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
                </Link> &nbsp; / 
                 Appointment
              </li>

              

            </ol>

          </div>

        </nav>

      </div>

      {/* =================================================
          APPOINTMENT SECTION
      ================================================= */}

      <section className="appointmnet section">

        <div className="container">

          <div className="appointment-layout">

            {/* =================================================
                LEFT SIDE - FORM
            ================================================= */}

            <div className="appointment-form-column">

              <div className="booking-wrapper">

                {/* HEADER */}

                <div className="booking-header">

                  <h2>
                    Schedule Your Appointment
                  </h2>

                  <p>
                    Book your medical
                    appointment in just a
                    few simple steps.
                  </p>

                </div>

                {/* =================================================
                    STEPS
                ================================================= */}

                <div className="booking-steps">

                  <div className="step">

                    <div className="step-icon">
                      <CalendarDays
                        size={21}
                      />
                    </div>

                    <div className="step-content">

                      <h4>
                        Select Service
                      </h4>

                      <p>
                        Choose your medical
                        service
                      </p>

                    </div>

                  </div>

                  <div className="step">

                    <div className="step-icon">
                      <Clock3 size={21} />
                    </div>

                    <div className="step-content">

                      <h4>
                        Pick Date &amp; Time
                      </h4>

                      <p>
                        Select appointment
                        slot
                      </p>

                    </div>

                  </div>

                  <div className="step">

                    <div className="step-icon">
                      <UserRound
                        size={21}
                      />
                    </div>

                    <div className="step-content">

                      <h4>
                        Confirm Details
                      </h4>

                      <p>
                        Confirm your
                        information
                      </p>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    FORM
                ================================================= */}

                <div className="appointment-form">

                  <form
                    onSubmit={
                      handleSubmit
                    }
                  >

                    <div className="row gy-4">

                      {/* NAME */}

                      <div className="col-md-6">
<label htmlFor="name" className="form-label">Name</label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="form-control"
                          placeholder="Full Name"
                          value={
                            formData.name
                          }
                          onChange={
                            handleChange
                          }
                          required
                        />

                      </div>

                      {/* EMAIL */}

                      <div className="col-md-6">
<label htmlFor="email" className="form-label">Email ID</label>

                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="form-control"
                          placeholder="Email Address"
                          value={
                            formData.email
                          }
                          onChange={
                            handleChange
                          }
                          required
                        />

                      </div>

                      {/* PHONE */}

                      <div className="col-md-6">
<label htmlFor="phone" className="form-label">Phone Number</label>

                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          className="form-control"
                          placeholder="Phone Number"
                          value={
                            formData.phone
                          }
                          onChange={
                            handleChange
                          }
                          required
                        />

                      </div>

                      {/* AGE */}

                      <div className="col-md-6">
<label htmlFor="age" className="form-label">Age</label>

                        <input
                          type="number"
                          name="age"
                          id="age"
                          className="form-control"
                          placeholder="Age"
                          min="0"
                          value={
                            formData.age
                          }
                          onChange={
                            handleChange
                          }
                          required
                        />

                      </div>

                      {/* GENDER */}

                      <div className="col-md-6">
<label htmlFor="gender" className="form-label">Gender</label>

                        <select
                          name="gender"
                          id="gender"
                          className="form-select"
                          value={
                            formData.gender
                          }
                          onChange={
                            handleChange
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

                      {/* DEPARTMENT */}

                      <div className="col-md-6">
<label htmlFor="department" className="form-label">Department</label>

                        <select
                          name="department"
                          id="department"
                          className="form-select"
                          value={
                            formData.department
                          }
                          onChange={
                            handleChange
                          }
                          required
                        >

                          <option value="">
                            Select Department
                          </option>

                          <option value="general">
                            General Consultation
                          </option>

                          <option value="cardiology">
                            Cardiology
                          </option>

                          <option value="neurology">
                            Neurology
                          </option>

                          <option value="orthopedics">
                            Orthopedics
                          </option>

                          <option value="pediatrics">
                            Pediatrics
                          </option>

                          <option value="dermatology">
                            Dermatology
                          </option>

                          <option value="oncology">
                            Oncology
                          </option>

                        </select>

                      </div>

                      {/* DATE */}

                      <div className="col-md-6">
<label htmlFor="date" className="form-label">Choose Meeting Date</label>

                        <input
                          type="date"
                          id="date"
                          name="date"
                          className="form-control"
                          value={
                            formData.date
                          }
                          onChange={
                            handleChange
                          }
                          required
                        />

                      </div>

                      {/* TIME */}

                      <div className="col-md-6">
<label htmlFor="time" className="form-label">Choose Meeting Time</label>

                        <input
                          type="time"
                          name="time"
                          id="time"
                          className="form-control"
                          value={
                            formData.time
                          }
                          onChange={
                            handleChange
                          }
                          required
                        />

                      </div>

                      {/* DOCTOR */}

                      <div className="col-12">
<label htmlFor="doctor" className="form-label">Select Doctors</label>

                        <select
                          name="doctor"
                          id="doctor"
                          className="form-select"
                          value={
                            formData.doctor
                          }
                          onChange={
                            handleChange
                          }
                          required
                          disabled={
                            loadingDoctors
                          }
                        >

                          <option value="">
                            {loadingDoctors
                              ? "Loading doctors..."
                              : "Select Doctor"}
                          </option>

                          {doctors.map(
                            (doctor) => (
                              <option
                                key={
                                  doctor._id
                                }
                                value={
                                  doctor._id
                                }
                              >
                                {
                                  doctor.name
                                }

                                {doctor.department
                                  ? ` - ${doctor.department}`
                                  : ""}
                              </option>
                            )
                          )}

                        </select>

                      </div>

                      {/* MESSAGE */}

                      <div className="col-12">
<label htmlFor="message" className="form-label">Message</label>

                        <textarea
                          name="message"
                          id="message"
                          className="form-control"
                          rows="4"
                          placeholder="Additional notes or symptoms (optional)"
                          value={
                            formData.message
                          }
                          onChange={
                            handleChange
                          }
                        />

                      </div>

                      {/* SUCCESS */}

                      {submitted && (
                        <div className="col-12">

                          <div className="sent-message">

                            <CheckCircle2
                              size={18}
                            />

                            <span>
                              Your appointment
                              has been
                              scheduled.
                              Thank you!
                            </span>

                          </div>

                        </div>
                      )}

                      {/* BUTTON */}

                      <div className="col-12">

                        <button
                          type="submit"
                          className="btn-book"
                          disabled={
                            submitting
                          }
                        >
                          {submitting
                            ? "Booking..."
                            : "Book Appointment Now"}
                        </button>

                      </div>

                    </div>

                  </form>

                </div>

                {/* =================================================
                    EMERGENCY
                ================================================= */}

                <div className="emergency-info">

                  <p>

                    <AlertCircle
                      size={16}
                    />

                    <span>
                      For medical emergencies,
                      please call{" "}
                      <strong>
                        911
                      </strong>{" "}
                      or go to the nearest
                      emergency room.
                    </span>

                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                RIGHT SIDE - APPOINTMENT LIST
            ================================================= */}

            <aside className="appointment-list-sidebar">

              <div className="appointment-list-box">

                {/* LIST HEADER */}

                <div className="appointment-list-heading">

                  <div>

                    <span className="list-small-title">
                      APPOINTMENTS
                    </span>

                    <h2>
                      Appointment List
                    </h2>

                    <p>
                      All scheduled appointments
                    </p>

                  </div>

                  <div className="appointment-header-actions">

                    <button
                      type="button"
                      className="refresh-appointments-btn"
                      onClick={
                        fetchAppointments
                      }
                      title="Refresh appointments"
                      disabled={
                        loadingAppointments
                      }
                    >

                      <RefreshCw
                        size={16}
                        className={
                          loadingAppointments
                            ? "refresh-spin"
                            : ""
                        }
                      />

                    </button>

                    <div className="total-appointment-count">
                      {
                        appointments.length
                      }
                    </div>

                  </div>

                </div>

                {/* LIST BODY */}

                {loadingAppointments ? (

                  <div className="appointment-loading">

                    <div className="loading-spinner"></div>

                    <p>
                      Loading appointments...
                    </p>

                  </div>

                ) : appointments.length ===
                  0 ? (

                  <div className="appointment-empty-all">

                    <ClipboardList
                      size={42}
                    />

                    <h3>
                      No Appointments
                    </h3>

                    <p>
                      There are no
                      appointments in the
                      system yet.
                    </p>

                    <button
                      type="button"
                      onClick={
                        fetchAppointments
                      }
                      className="empty-refresh-btn"
                    >
                      Refresh
                    </button>

                  </div>

                ) : (

                  <div className="appointment-groups">

                    {/* TODAY */}

                    <AppointmentGroup
                      title="Today"
                      subtitle="Today's appointments"
                      icon={
                        <CalendarDays
                          size={18}
                        />
                      }
                      appointments={
                        todayAppointments
                      }
                    />

                    {/* YESTERDAY */}

                    <AppointmentGroup
                      title="Yesterday"
                      subtitle="Yesterday's appointments"
                      icon={
                        <Clock3
                          size={18}
                        />
                      }
                      appointments={
                        yesterdayAppointments
                      }
                    />

                    {/* LAST 10 DAYS */}

                    <AppointmentGroup
                      title="Last 10 Days"
                      subtitle="Previous 10 days"
                      icon={
                        <ClipboardList
                          size={18}
                        />
                      }
                      appointments={
                        lastTenDaysAppointments
                      }
                    />

                    {/* OLDER */}

                    {olderAppointments.length >
                      0 && (
                      <AppointmentGroup
                        title="Older Appointments"
                        subtitle="Previous appointments"
                        icon={
                          <ClipboardList
                            size={18}
                          />
                        }
                        appointments={
                          olderAppointments
                        }
                      />
                    )}

                  </div>

                )}

              </div>

            </aside>

          </div>

        </div>

      </section>

    </main>
  );
}