import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Hospital,
} from "lucide-react";
import { toast } from "react-toastify";
import API from "../services/api";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // HANDLE LOGIN
  // =====================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = formData.email.trim();
    const password = formData.password;

    // ===================================================
    // BASIC VALIDATION
    // ===================================================

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // LOGIN API
      // =================================================

      const response = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      const { token, role, user } = response.data;

      // =================================================
      // INVALID RESPONSE
      // =================================================

      if (!token || !role || !user) {
        toast.error("Invalid login response from server.");
        return;
      }

      // =================================================
      // SAVE LOGIN DATA
      // =================================================

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("LOGIN ROLE:", role);
      console.log("USER:", user);

      // =================================================
      // SUCCESS
      // =================================================

      toast.success(
        response.data.message || "Login successful!"
      );

      // =================================================
      // ROLE BASED REDIRECT
      // =================================================

      if (role === "admin") {
        navigate("/dashboard", {
          replace: true,
        });
        return;
      }

      if (role === "doctor") {
        navigate("/doctor/dashboard", {
          replace: true,
        });
        return;
      }

      if (role === "pharmacist") {
        navigate("/pharmacy", {
          replace: true,
        });
        return;
      }

      // =================================================
      // UNKNOWN ROLE
      // =================================================

      toast.error("Your account does not have valid access.");

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");

      navigate("/login", {
        replace: true,
      });

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      // =================================================
      // REMOVE OLD LOGIN DATA
      // =================================================

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");

      // =================================================
      // SERVER ERROR MESSAGE
      // =================================================

      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;

      // =================================================
      // WRONG EMAIL / PASSWORD
      // =================================================

      if (status === 401) {
        toast.error(
          serverMessage ||
            "Invalid email or password."
        );
        return;
      }

      // =================================================
      // USER NOT FOUND / INVALID USER
      // =================================================

      if (status === 404) {
        toast.error(
          serverMessage ||
            "User not found. Please register first."
        );
        return;
      }

      // =================================================
      // BAD REQUEST
      // =================================================

      if (status === 400) {
        toast.error(
          serverMessage ||
            "Invalid login details."
        );
        return;
      }

      // =================================================
      // SERVER ERROR
      // =================================================

      if (status >= 500) {
        toast.error(
          "Server error. Please try again later."
        );
        return;
      }

      // =================================================
      // NETWORK ERROR
      // =================================================

      if (!error.response) {
        toast.error(
          "Unable to connect to server. Please check your connection."
        );
        return;
      }

      // =================================================
      // OTHER ERROR
      // =================================================

      toast.error(
        serverMessage ||
          "Login failed. Please check your email and password."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="login-page">

      <div className="login-card">

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="login-logo">
          <Hospital size={45} />
        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <h1>Hospital Login</h1>

        <p>
          Sign in to manage your hospital
        </p>

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleLogin}>

          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="input-group">

            <Mail size={20} />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="input-group">

            <Lock size={20} />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(
                  (prev) => !prev
                )
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

          {/* =================================================
              LOGIN BUTTON
          ================================================= */}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}