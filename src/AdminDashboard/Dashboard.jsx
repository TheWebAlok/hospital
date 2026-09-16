import { useEffect, useState } from "react";
import API from "../services/api";
import {
Stethoscope,
Users,
CalendarDays,
Clock,
CheckCircle,
Activity,
} from "lucide-react";
import "./Dashboard.css";

export default function Dashboard() {
const [stats, setStats] = useState({
totalDoctors: 0,
totalPatients: 0,
totalAppointments: 0,
pendingAppointments: 0,
confirmedAppointments: 0,
completedAppointments: 0,
});

const [recentAppointments, setRecentAppointments] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
fetchDashboard();
}, []);

const fetchDashboard = async () => {
  try {
    setLoading(true);

    const [dashboardRes, appointmentRes] =
      await Promise.all([
        API.get("/dashboard"),
        API.get("/appointments"),
      ]);

    setStats(dashboardRes.data.stats);

    // Recent 20 appointments
    const latestAppointments =
      appointmentRes.data.appointments.slice(0, 20);

    setRecentAppointments(latestAppointments);

  } catch (error) {
    console.error("Dashboard Error:", error);
  } finally {
    setLoading(false);
  }
};

const cards = [
{
title: "Total Doctors",
value: stats.totalDoctors,
icon: <Stethoscope size={26} />,
},
{
title: "Total Patients",
value: stats.totalPatients,
icon: <Users size={26} />,
},
{
title: "Appointments",
value: stats.totalAppointments,
icon: <CalendarDays size={26} />,
},
{
title: "Pending",
value: stats.pendingAppointments,
icon: <Clock size={26} />,
},
{
title: "Confirmed",
value: stats.confirmedAppointments,
icon: <CheckCircle size={26} />,
},
{
title: "Completed",
value: stats.completedAppointments,
icon: <Activity size={26} />,
},
];

if (loading) {
return <h2>Loading Dashboard...</h2>;
}

return (
  <div className="dashboard-container">


  {/* HEADER */}

  <div className="page-header">
    <h1>Hospital Dashboard</h1>

    <p>
      Welcome to MediCare Hospital Management System
    </p>
  </div>

  {/* STATISTICS */}

  <div className="stats-grid">
    {cards.map((card) => (
      <div
        className="stat-card"
        key={card.title}
      >
        <div className="stat-card-top">
          <h3>{card.title}</h3>

          {card.icon}
        </div>

        <h2>{card.value}</h2>
      </div>
    ))}
  </div>

  {/* RECENT APPOINTMENTS */}

  <div className="recent-section">

    <div className="section-header">
      <div>
        <h2>Recent Appointments</h2>

        <p>
          Latest hospital appointments
        </p>
      </div>
    </div>

    <div className="table-card">
      <div className="table-wrapper">

        <table>

          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {recentAppointments.length === 0 ? (

              <tr>
                <td
                  colSpan="5"
                  className="empty-message"
                >
                  No appointments found
                </td>
              </tr>

            ) : (

              recentAppointments.map(
                (appointment) => (

                  <tr
                    key={appointment._id}
                  >

                    <td>
                      {appointment.patient?.name ||
                        "Unknown"}
                    </td>

                    <td>
                      {appointment.doctor?.name ||
                        "Unknown"}
                    </td>

                    <td>
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {appointment.appointmentTime}
                    </td>

                    <td>

                      <span
                        className={`status-badge ${appointment.status?.toLowerCase()}`}
                      >
                        {appointment.status}
                      </span>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>
    </div>

  </div>

</div>


);
}