import { useEffect, useState } from "react";
import API from "../services/api";
import {
  CalendarCheck,
  Clock3,
  Users,
  CheckCircle,
  UserRound,
  Pencil,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./DoctorDashboard.css";

const FILE_BASE = "https://hostbackend-surl.onrender.com";

export default function DoctorDashboard() {
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const profileRes = await API.get("/doctors/me");

      const currentDoctor = profileRes.data.doctor;

      setDoctor(currentDoctor);

      const appointmentRes = await API.get("/appointments");

      const appointments =
        appointmentRes.data.appointments || [];

      const mine = appointments.filter(
        (appointment) =>
          appointment.doctor?._id === currentDoctor._id
      );

      setStats({
        total: mine.length,

        pending: mine.filter(
          (a) => a.status === "Pending"
        ).length,

        confirmed: mine.filter(
          (a) => a.status === "Confirmed"
        ).length,

        completed: mine.filter(
          (a) => a.status === "Completed"
        ).length,
      });
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="doc-dash-loading">
        Loading your dashboard...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="doc-dash-loading">
        Doctor profile not found.
      </div>
    );
  }

  return (
    <div className="doc-dash">

      {/* ================= WELCOME ================= */}

      <div className="doc-welcome-card">

        <div className="doc-welcome-content">

          <p className="doc-welcome-small">
            Welcome back, Doctor
          </p>

          <h1>
            Hello, Dr. {doctor.name}
          </h1>

          <p>
            Here's an overview of your medical practice.
          </p>

        </div>

        <div className="doc-welcome-icon">
          <UserRound size={42} />
        </div>

      </div>


      {/* ================= STATISTICS ================= */}

      <div className="doc-stats-grid">

        {/* TOTAL */}

        <div className="doc-stat-card">

          <div className="doc-stat-icon">
            <CalendarCheck size={24} />
          </div>

          <div className="doc-stat-content">
            <span>Total Appointments</span>
            <strong>{stats.total}</strong>
          </div>

        </div>


        {/* PENDING */}

        <div className="doc-stat-card">

          <div className="doc-stat-icon">
            <Clock3 size={24} />
          </div>

          <div className="doc-stat-content">
            <span>Pending</span>
            <strong>{stats.pending}</strong>
          </div>

        </div>


        {/* CONFIRMED */}

        <div className="doc-stat-card">

          <div className="doc-stat-icon">
            <Users size={24} />
          </div>

          <div className="doc-stat-content">
            <span>Confirmed</span>
            <strong>{stats.confirmed}</strong>
          </div>

        </div>


        {/* COMPLETED */}

        <div className="doc-stat-card">

          <div className="doc-stat-icon">
            <CheckCircle size={24} />
          </div>

          <div className="doc-stat-content">
            <span>Completed</span>
            <strong>{stats.completed}</strong>
          </div>

        </div>

      </div>


      {/* ================= MY PROFILE ================= */}

      <div className="doc-section-header">

        <div>
          <h2>My Profile</h2>

          <p>
            Your professional information
          </p>
        </div>

        <button
          className="doc-view-profile-btn"
          onClick={() => navigate("/doctor/profile")}
        >
          View Full Profile
        </button>

      </div>


      <div className="doc-profile-card">

        {/* PHOTO */}

        <div className="doc-profile-photo">

          {doctor.photo ? (
            <img
              src={`${FILE_BASE}${doctor.photo}`}
              alt={doctor.name}
            />
          ) : (
            <span>
              {doctor.name?.charAt(0).toUpperCase()}
            </span>
          )}

        </div>


        {/* INFORMATION */}

        <div className="doc-profile-info">

          <h1>{doctor.name}</h1>

          <p className="doc-profile-role">

            {doctor.specialization ||
              "Doctor"}

            {" · "}

            {doctor.department ||
              "Medical Department"}

          </p>


          <div className="doc-profile-meta">

            <span>
              <Mail size={15} />

              {doctor.email}
            </span>


            <span>
              <Phone size={15} />

              {doctor.phone ||
                "Phone not added"}
            </span>


            <span>
              <Briefcase size={15} />

              {doctor.experience || 0}
              {" "}yrs experience
            </span>

          </div>

        </div>


        {/* EDIT */}

        <button
          className="doc-edit-btn"
          onClick={() =>
            navigate("/doctor/profile")
          }
        >
          <Pencil size={16} />

          Edit Profile
        </button>

      </div>


      {/* ================= QUICK ACTIONS ================= */}

      <div className="doc-section-header quick-header">

        <div>
          <h2>Quick Actions</h2>

          <p>
            Manage your doctor's account
          </p>
        </div>

      </div>


      <div className="doc-quick-grid">

        <button
          className="doc-quick-card"
          onClick={() =>
            navigate("/doctor/appointments")
          }
        >

          <CalendarCheck size={25} />

          <div>
            <h3>My Appointments</h3>

            <p>
              View and manage patient appointments
            </p>
          </div>

        </button>


        <button
          className="doc-quick-card"
          onClick={() =>
            navigate("/doctor/profile")
          }
        >

          <UserRound size={25} />

          <div>
            <h3>My Profile</h3>

            <p>
              Update your professional information
            </p>
          </div>

        </button>

      </div>

    </div>
  );
}