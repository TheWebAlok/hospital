import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import {
  Stethoscope,
  FileText,
  CalendarCheck,
  Video,
} from "lucide-react";

import { toast } from "react-toastify";

import PrescriptionModal from "../components/PrescriptionModal";
import PrescriptionHistoryModal from "../components/PrescriptionHistoryModal";

import "./DoctorAppointments.css";

export default function DoctorAppointments() {
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [checkupPatient, setCheckupPatient] = useState(null);
  const [historyPatient, setHistoryPatient] = useState(null);

  // ================= LOAD DOCTOR =================

  useEffect(() => {
    loadDoctor();
  }, []);

  // ================= LOAD APPOINTMENTS =================

  useEffect(() => {
    if (doctor?._id) {
      fetchAppointments();
    }
  }, [doctor]);

  // ================= DOCTOR =================

  const loadDoctor = async () => {
    try {
      const res = await API.get("/doctors/me");

      setDoctor(res.data.doctor);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load doctor");
    }
  };

  // ================= APPOINTMENTS =================

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await API.get("/appointments");

      const allAppointments =
        res.data.appointments || [];

      const mine = allAppointments.filter(
        (appointment) =>
          appointment.doctor?._id === doctor._id
      );

      setAppointments(mine);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // ================= STATUS =================

  const updateStatus = async (id, status) => {
    try {
      await API.put(
        `/appointments/${id}/status`,
        { status }
      );

      toast.success("Status updated");

      fetchAppointments();
    } catch (error) {
      console.error(error);

      toast.error("Failed to update status");
    }
  };

  // ================= VIDEO CONSULTATION =================

  const startVideoConsultation = (appointment) => {
    if (!appointment?._id) {
      toast.error("Invalid appointment");
      return;
    }

    /*
      Temporary meeting ID:
      Appointment ID is used as the meeting ID.

      Later backend me videoConsultation.meetingId
      save karke isko replace kar sakte hain.
    */

    navigate(
      `/doctor/video-consultation?meetingId=${appointment._id}`
    );
  };

  // ================= UI =================

  return (
    <div className="doctor-appointments-page">

      {/* ================= HEADER ================= */}

      <div className="appointments-page-header">

        <div>
          <h1>My Appointments</h1>

          <p>
            Manage patients booked with you.
          </p>
        </div>

        <div className="appointments-count">

          <CalendarCheck size={19} />

          <span>
            {appointments.length} Appointments
          </span>

        </div>

      </div>

      {/* ================= TABLE ================= */}

      <div className="doctor-appointments-card">

        <div className="doctor-table-wrapper">

          <table>

            <thead>

              <tr>

                <th>PATIENT</th>

                <th>DATE</th>

                <th>TIME</th>

                <th>REASON</th>

                <th>STATUS</th>

                <th>ACTIONS</th>

              </tr>

            </thead>

            <tbody>

              {/* ================= LOADING ================= */}

              {loading ? (

                <tr>

                  <td
                    colSpan="6"
                    className="doctor-empty"
                  >
                    Loading appointments...
                  </td>

                </tr>

              ) : appointments.length === 0 ? (

                /* ================= EMPTY ================= */

                <tr>

                  <td
                    colSpan="6"
                    className="doctor-empty"
                  >

                    <CalendarCheck size={35} />

                    <span>
                      No appointments assigned
                      to you yet.
                    </span>

                  </td>

                </tr>

              ) : (

                /* ================= APPOINTMENTS ================= */

                appointments.map(
                  (appointment) => (

                    <tr
                      key={appointment._id}
                    >

                      {/* ================= PATIENT ================= */}

                      <td>

                        <strong>
                          {appointment.patient?.name ||
                            "Unknown"}
                        </strong>

                        <div className="doctor-subtext">

                          {appointment.patient?.phone ||
                            "-"}

                        </div>

                      </td>

                      {/* ================= DATE ================= */}

                      <td>

                        {appointment.appointmentDate
                          ? new Date(
                              appointment.appointmentDate
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}

                      </td>

                      {/* ================= TIME ================= */}

                      <td>

                        {appointment.appointmentTime ||
                          "-"}

                      </td>

                      {/* ================= REASON ================= */}

                      <td>

                        {appointment.reason ||
                          "-"}

                      </td>

                      {/* ================= STATUS ================= */}

                      <td>

                        <select
                          className="doctor-status-select"
                          value={
                            appointment.status ||
                            "Pending"
                          }
                          onChange={(e) =>
                            updateStatus(
                              appointment._id,
                              e.target.value
                            )
                          }
                        >

                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Confirmed">
                            Confirmed
                          </option>

                          <option value="Completed">
                            Completed
                          </option>

                          <option value="Cancelled">
                            Cancelled
                          </option>

                        </select>

                      </td>

                      {/* ================= ACTIONS ================= */}

                      <td>

                        <div className="doctor-row-actions">

                          {/* CHECKUP */}

                          <button
                            type="button"
                            className="doctor-checkup-btn"
                            title="Check-up / New Report"
                            onClick={() =>
                              setCheckupPatient(
                                appointment.patient
                              )
                            }
                          >

                            <Stethoscope size={17} />

                          </button>

                          {/* HISTORY */}

                          <button
                            type="button"
                            className="doctor-history-btn"
                            title="Previous Reports"
                            onClick={() =>
                              setHistoryPatient(
                                appointment.patient
                              )
                            }
                          >

                            <FileText size={17} />

                          </button>

                          {/* VIDEO */}

                          <button
                            type="button"
                            className="doctor-video-btn"
                            title="Start Video Consultation"
                            onClick={() =>
                              startVideoConsultation(
                                appointment
                              )
                            }
                          >

                            <Video size={17} />

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= NEW PRESCRIPTION ================= */}

      {checkupPatient && (

        <PrescriptionModal
          patient={checkupPatient}
          defaultDoctorName={doctor?.name}
          onClose={() =>
            setCheckupPatient(null)
          }
        />

      )}

      {/* ================= HISTORY ================= */}

      {historyPatient && (

        <PrescriptionHistoryModal
          patient={historyPatient}
          onClose={() =>
            setHistoryPatient(null)
          }
        />

      )}

    </div>
  );
}