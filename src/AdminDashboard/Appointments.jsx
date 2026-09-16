import { useEffect, useState } from "react";
import API from "../services/api";
import {
  Plus,
  Trash2,
  X,
  CalendarCheck,
  Search,
} from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "./Appointments.css";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // SEARCH & FILTER
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const initialForm = {
    patient: "",
    doctor: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    symptoms: "",
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FETCH DATA =================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [appointmentRes, doctorRes, patientRes] = await Promise.all([
        API.get("/appointments"),
        API.get("/doctors"),
        API.get("/patients"),
      ]);

      setAppointments(appointmentRes.data.appointments);
      setDoctors(doctorRes.data.doctors);
      setPatients(patientRes.data.patients);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch appointment data");
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= BOOK APPOINTMENT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/appointments", formData);

      toast.success("Appointment booked successfully!");

      setShowForm(false);
      setFormData(initialForm);

      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to book appointment"
      );
    }
  };

  // ================= UPDATE STATUS =================

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}/status`, {
        status,
      });

      toast.success("Appointment status updated!");

      fetchData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // ================= DELETE APPOINTMENT =================

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Appointment?",
      text: "This appointment will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/appointments/${id}`);

      toast.success("Appointment deleted successfully!");

      fetchData();
    } catch (error) {
      toast.error("Failed to delete appointment");
    }
  };

  // ================= CLOSE MODAL =================

  const handleClose = () => {
    setShowForm(false);
    setFormData(initialForm);
  };

  // ================= SEARCH + FILTER =================

  const filteredAppointments = appointments.filter((appointment) => {
    const searchText = search.toLowerCase();

    const patientName = appointment.patient?.name?.toLowerCase() || "";
    const doctorName = appointment.doctor?.name?.toLowerCase() || "";
    const reason = appointment.reason?.toLowerCase() || "";

    const matchesSearch =
      patientName.includes(searchText) ||
      doctorName.includes(searchText) ||
      reason.includes(searchText);

    const matchesStatus =
      statusFilter === "All" || appointment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ================= LOADING =================

  if (loading) {
    return <h2>Loading Appointments...</h2>;
  }

  // ================= UI =================

  return (
    <div>
      {/* PAGE HEADER */}

      <div className="page-header page-header-row">
        <div>
          <h1>Appointments</h1>
          <p>Manage hospital appointments</p>
        </div>

        <div className="page-actions">
          {/* SEARCH */}

          <div className="search-box">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search appointments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* STATUS FILTER */}

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* BOOK BUTTON */}

          <button className="primary-btn" onClick={() => setShowForm(true)}>
            <Plus size={18} />
            Book Appointment
          </button>
        </div>
      </div>

      {/* APPOINTMENTS TABLE */}

      <div className="table-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-message">
                    No appointments found
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{appointment.patient?.name || "Unknown"}</td>

                    <td>{appointment.doctor?.name || "Unknown"}</td>

                    <td>
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString()}
                    </td>

                    <td>{appointment.appointmentTime}</td>

                    <td>{appointment.reason || "-"}</td>

                    {/* STATUS */}

                    <td>
                      <select
                        className="status-select"
                        value={appointment.status}
                        onChange={(e) =>
                          updateStatus(appointment._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(appointment._id)}
                        title="Delete Appointment"
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD APPOINTMENT MODAL */}

      {showForm && (
        <div className="appt-modal-overlay">
          <div className="appt-modal">
            <div className="appt-modal-header">
              <h2>Book Appointment</h2>

              <button className="close-btn" onClick={handleClose}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="doctor-form">
              {/* PATIENT */}

              <select
                name="patient"
                value={formData.patient}
                onChange={handleChange}
                required
              >
                <option value="">Select Patient</option>

                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name} - {patient.phone}
                  </option>
                ))}
              </select>

              {/* DOCTOR */}

              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                required
              >
                <option value="">Select Doctor</option>

                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.department}
                  </option>
                ))}
              </select>

              {/* DATE */}

              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
              />

              {/* TIME */}

              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
              />

              {/* REASON */}

              <input
                type="text"
                name="reason"
                placeholder="Reason for Visit"
                value={formData.reason}
                onChange={handleChange}
              />

              {/* SYMPTOMS */}

              <textarea
                name="symptoms"
                placeholder="Symptoms"
                value={formData.symptoms}
                onChange={handleChange}
              />

              <button className="primary-btn" type="submit">
                <CalendarCheck size={18} />
                Book Appointment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}