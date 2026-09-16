import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DoctorProfileById = () => {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // BACKEND API
  // ==========================================

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ==========================================
  // DOCTOR IMAGE
  // ==========================================

  const getDoctorImage = (photo) => {
    if (!photo) {
      return "";
    }

    // If already a complete URL
    if (
      photo.startsWith("http://") ||
      photo.startsWith("https://")
    ) {
      return photo;
    }

    // Same backend used by Doctors page
    return `https://hostbackend-surl.onrender.com${photo}`;
  };

  // ==========================================
  // FETCH DOCTOR
  // ==========================================

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/api/doctors/${id}`
        );

        console.log(
          "Doctor API Response:",
          response.data
        );

        if (
          response.data?.success &&
          response.data?.doctor
        ) {
          setDoctor(response.data.doctor);
        } else {
          setError("Doctor not found.");
        }
      } catch (err) {
        console.error(
          "Doctor profile error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load doctor profile."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctor();
    }
  }, [id, API_URL]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        />

        <p className="mt-3">
          Loading doctor profile...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  // ==========================================
  // DOCTOR NOT FOUND
  // ==========================================

  if (!doctor) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Doctor not found.
        </div>
      </div>
    );
  }

  // ==========================================
  // IMAGE URL
  // ==========================================

  const imageUrl = getDoctorImage(
    doctor.photo
  );

  console.log(
    "Doctor Photo:",
    doctor.photo
  );

  console.log(
    "Doctor Image URL:",
    imageUrl
  );

  // ==========================================
  // PROFILE
  // ==========================================

  return (
    <div className="container py-5">

      <div className="card shadow-sm border-0">

        <div className="card-body p-4">

          <div className="row align-items-center">

            {/* =================================
                DOCTOR PHOTO
            ================================= */}

            <div className="col-md-4 text-center mb-4 mb-md-0">

              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={
                    doctor.name || "Doctor"
                  }
                  className="img-fluid rounded-circle shadow"
                  style={{
                    width: "180px",
                    height: "180px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    console.error(
                      "Doctor image failed:",
                      imageUrl
                    );

                    e.currentTarget.style.display =
                      "none";

                    const fallback =
                      document.getElementById(
                        "doctor-image-fallback"
                      );

                    if (fallback) {
                      fallback.style.display =
                        "flex";
                    }
                  }}
                />
              ) : null}

              {/* FALLBACK */}

              <div
                id="doctor-image-fallback"
                className="bg-light rounded-circle mx-auto align-items-center justify-content-center"
                style={{
                  width: "180px",
                  height: "180px",
                  display: imageUrl
                    ? "none"
                    : "flex",
                }}
              >
                <span
                  style={{
                    fontSize: "60px",
                  }}
                >
                  👨‍⚕️
                </span>
              </div>

            </div>

            {/* =================================
                DOCTOR INFORMATION
            ================================= */}

            <div className="col-md-8">

              <h2 className="fw-bold mb-2">
                {doctor.name}
              </h2>

              <h5 className="text-primary mb-1">
                {doctor.specialization ||
                  "Medical Specialist"}
              </h5>

              <p className="text-muted mb-3">
                {doctor.department ||
                  "Medical Department"}{" "}
                Department
              </p>

              <hr />

              <div className="row">

                {/* EXPERIENCE */}

                <div className="col-md-6 mb-3">

                  <strong>
                    Experience
                  </strong>

                  <div>
                    {doctor.experience || 0} years
                  </div>

                </div>

                {/* PHONE */}

                <div className="col-md-6 mb-3">

                  <strong>
                    Phone
                  </strong>

                  <div>
                    {doctor.phone ||
                      "Not available"}
                  </div>

                </div>

                {/* AVAILABLE TIME */}

                <div className="col-md-6 mb-3">

                  <strong>
                    Available Time
                  </strong>

                  <div>
                    {doctor.availableTime ||
                      "Not available"}
                  </div>

                </div>

                {/* AVAILABLE DAYS */}

                <div className="col-md-6 mb-3">

                  <strong>
                    Available Days
                  </strong>

                  <div>
                    {doctor.availableDays?.length
                      ? doctor.availableDays.join(
                          ", "
                        )
                      : "Not available"}
                  </div>

                </div>

              </div>

              {/* =================================
                  BIO
              ================================= */}

              {doctor.bio && (
                <div className="mt-3">

                  <h5>
                    About Doctor
                  </h5>

                  <p className="text-muted">
                    {doctor.bio}
                  </p>

                </div>
              )}

              {/* =================================
                  LINKEDIN
              ================================= */}

              {doctor.linkedin && (
                <a
                  href={doctor.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary mt-2"
                >
                  LinkedIn
                </a>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default DoctorProfileById;