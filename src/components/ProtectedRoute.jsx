import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Not logged in at all
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but this route is restricted to specific roles
  // (e.g. admin route being opened by a doctor, or vice versa)
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Send them to the dashboard that actually matches their role
    // instead of dumping them back on /login while they're still
    // authenticated.
    if (role === "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    if (role === "doctor") {
      return <Navigate to="/doctor/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}