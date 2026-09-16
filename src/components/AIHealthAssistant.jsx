import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./AIHealthAssistant.css";

const AIHealthAssistant = () => {
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ CHANGED: default true, so chat opens automatically on every page refresh
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fever assessment form
  const [feverForm, setFeverForm] = useState(null);
  const [feverData, setFeverData] = useState({
    age: "",
    duration: "",
    temperature: "",
    previousMedicine: "",
    medicineName: "",
    symptoms: "",
    allergies: "",
    medicalConditions: "",
  });

  // ==========================================
  // DOCTOR IMAGE URL
  // ==========================================

  const getDoctorImage = (photo) => {
    if (!photo) return "";

    if (photo.startsWith("http://") || photo.startsWith("https://")) {
      return photo;
    }

    return `https://hostbackend-surl.onrender.com${photo}`;
  };

  // ==========================================
  // BOOK APPOINTMENT
  // ==========================================

  const bookAppointment = (doctorId) => {
    if (!doctorId) return;

    window.location.href = `/appointment?doctor=${doctorId}`;
  };

  // ==========================================
  // VIEW DOCTOR PROFILE
  // ==========================================

  const viewDoctorProfile = (doctorId) => {
    if (!doctorId) return;

    window.location.href = `/doctors/${doctorId}`;
  };

  // ==========================================
  // ADD ASSISTANT MESSAGE
  // ==========================================

  const addAssistantMessage = (data) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: data?.reply || "Sorry, I could not generate a response.",
        doctors: data?.doctors || [],
        specialization: data?.specialization || null,
        doctor: data?.doctor || null,
        advice: data?.advice || "",
      },
    ]);
  };

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/ai/chat`, {
        message: userMessage,
      });

      console.log("AI Response:", response.data);

      // Open fever assessment form
      if (response.data?.type === "FEVER_ASSESSMENT") {
        setFeverForm(response.data.form || { type: "fever" });

        setFeverData({
          age: "",
          duration: "",
          temperature: "",
          previousMedicine: "",
          medicineName: "",
          symptoms: "",
          allergies: "",
          medicalConditions: "",
        });
      }

      addAssistantMessage(response.data);
    } catch (error) {
      console.error("AI Error:", error);

      addAssistantMessage({
        reply:
          error.response?.data?.message ||
          "Sorry, AI service is currently unavailable. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FEVER FORM CHANGE
  // ==========================================

  const handleFeverChange = (e) => {
    const { name, value } = e.target;

    setFeverData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT FEVER ASSESSMENT
  // ==========================================

  const submitFeverAssessment = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (
      !feverData.age ||
      !feverData.duration ||
      !feverData.temperature ||
      !feverData.previousMedicine
    ) {
      alert("Please fill all required fever details.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/ai/fever-assessment`,
        feverData
      );

      console.log("Fever Assessment Response:", response.data);

      addAssistantMessage(response.data);

      // Close form after successful submission
      setFeverForm(null);

      // Reset form
      setFeverData({
        age: "",
        duration: "",
        temperature: "",
        previousMedicine: "",
        medicineName: "",
        symptoms: "",
        allergies: "",
        medicalConditions: "",
      });
    } catch (error) {
      console.error("Fever Assessment Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error.response?.data?.message ||
            "Unable to process your fever assessment. Please contact the hospital.",
          doctors: [],
          specialization: null,
          doctor: null,
          advice: "",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ENTER KEY
  // ==========================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ==========================================
  // SUGGESTION
  // ==========================================

  const suggestion = (text) => {
    setMessage(text);
  };

  return (
    <>
      {/* ==========================================
          FLOATING BUTTON (with label above it)
      ========================================== */}

      {!isChatOpen && (
        <div className="ai-floating-wrapper">
          <span className="ai-floating-label">Ask Your Question</span>

          <button
            className="ai-floating-button"
            onClick={() => setIsChatOpen(true)}
            aria-label="Open AI Health Assistant"
          >
            🤖
          </button>
        </div>
      )}

      {/* ==========================================
          CHAT POPUP
      ========================================== */}

      {isChatOpen && (
        <div
          className="ai-chat-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsChatOpen(false);
            }
          }}
        >
          <div className="ai-chat-modal">
            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="ai-chat-header">
              <div className="ai-chat-header-left">
                <div className="ai-chat-header-icon">🤖</div>

                <div>
                  <h5>AI Health Assistant</h5>
                  <small>Ask general health and hospital-related questions</small>
                </div>
              </div>

              <button
                className="ai-chat-close"
                onClick={() => setIsChatOpen(false)}
                aria-label="Close AI Health Assistant"
              >
                ×
              </button>
            </div>

            {/* ==========================================
                CHAT BODY
            ========================================== */}

            <div className="ai-chat-body">
              {/* ==========================================
                  WELCOME
              ========================================== */}

              {messages.length === 0 && (
                <div className="text-center py-5">
                  <div className="mb-3" style={{ fontSize: "55px" }}>
                    🤖
                  </div>

                  <h3 className="fw-semibold text-dark">How can I help you?</h3>

                  <p className="text-muted mb-4">
                    Ask me about hospital services, departments, appointments
                    or general health information.
                  </p>

                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary px-4 py-2"
                      onClick={() =>
                        suggestion("What services does the hospital provide?")
                      }
                    >
                      🏥 Hospital Services
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-primary px-4 py-2"
                      onClick={() =>
                        suggestion("Which doctor should I consult for fever?")
                      }
                    >
                      👨‍⚕️ Find Doctor
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-primary px-4 py-2"
                      onClick={() => suggestion("How can I book an appointment?")}
                    >
                      📅 Book Appointment
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-primary px-4 py-2"
                      onClick={() =>
                        suggestion(
                          "I need information about medicines available in the hospital pharmacy."
                        )
                      }
                    >
                      💊 Find Medicine
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-primary px-4 py-2"
                      onClick={() =>
                        suggestion(
                          "What laboratory and diagnostic tests are available?"
                        )
                      }
                    >
                      🧪 Lab Tests
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-primary px-4 py-2"
                      onClick={() =>
                        suggestion("What should I do in a medical emergency?")
                      }
                    >
                      🚑 Emergency Help
                    </button>
                  </div>
                </div>
              )}

              {/* ==========================================
                  CHAT MESSAGES
              ========================================== */}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex mb-3 ${
                    msg.role === "user"
                      ? "justify-content-end"
                      : "justify-content-start"
                  }`}
                >
                  <div
                    className={
                      msg.role === "user"
                        ? "bg-primary text-white rounded-4 px-4 py-3"
                        : "bg-light border rounded-4 px-4 py-3"
                    }
                    style={{
                      maxWidth: msg.role === "assistant" ? "92%" : "80%",
                    }}
                  >
                    {/* USER */}

                    {msg.role === "user" ? (
                      <div className="text-white">{msg.content}</div>
                    ) : (
                      <div>
                        {/* AI RESPONSE */}

                        <div className="ai-response">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ children }) => (
                                <h4 className="fw-bold mb-3">{children}</h4>
                              ),

                              h2: ({ children }) => (
                                <h5 className="fw-bold mb-3">{children}</h5>
                              ),

                              h3: ({ children }) => (
                                <h6 className="fw-bold mb-2">{children}</h6>
                              ),

                              p: ({ children }) => (
                                <p className="mb-2">{children}</p>
                              ),

                              strong: ({ children }) => (
                                <strong className="fw-bold">{children}</strong>
                              ),

                              ul: ({ children }) => (
                                <ul className="mb-2 ps-4">{children}</ul>
                              ),

                              ol: ({ children }) => (
                                <ol className="mb-2 ps-4">{children}</ol>
                              ),

                              li: ({ children }) => (
                                <li className="mb-1">{children}</li>
                              ),

                              table: ({ children }) => (
                                <div className="table-responsive mb-3">
                                  <table className="table table-bordered table-sm align-middle mb-0">
                                    {children}
                                  </table>
                                </div>
                              ),

                              thead: ({ children }) => (
                                <thead className="table-primary">
                                  {children}
                                </thead>
                              ),

                              th: ({ children }) => (
                                <th className="fw-semibold">{children}</th>
                              ),

                              td: ({ children }) => <td>{children}</td>,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>

                        {/* ==========================================
                            FEVER FORM
                        ========================================== */}

                        {index === messages.length - 1 &&
                          msg.role === "assistant" &&
                          feverForm?.type === "fever" && (
                            <div className="card border-primary mt-3">
                              <div className="card-header bg-primary text-white">
                                <strong>🌡️ Fever Assessment</strong>
                              </div>

                              <div className="card-body">
                                <p className="text-muted small">
                                  Please provide these details so the
                                  hospital can guide you appropriately.
                                </p>

                                <form onSubmit={submitFeverAssessment}>
                                  <div className="row g-3">
                                    {/* AGE */}

                                    <div className="col-md-6">
                                      <label className="form-label fw-semibold">
                                        Age *
                                      </label>

                                      <input
                                        type="number"
                                        name="age"
                                        min="0"
                                        max="120"
                                        className="form-control"
                                        value={feverData.age}
                                        onChange={handleFeverChange}
                                        required
                                      />
                                    </div>

                                    {/* DURATION */}

                                    <div className="col-md-6">
                                      <label className="form-label fw-semibold">
                                        Fever for how many days? *
                                      </label>

                                      <input
                                        type="number"
                                        name="duration"
                                        min="0"
                                        step="0.5"
                                        className="form-control"
                                        value={feverData.duration}
                                        onChange={handleFeverChange}
                                        required
                                      />
                                    </div>

                                    {/* TEMPERATURE */}

                                    <div className="col-md-6">
                                      <label className="form-label fw-semibold">
                                        Current temperature (°F) *
                                      </label>

                                      <input
                                        type="number"
                                        name="temperature"
                                        min="90"
                                        max="115"
                                        step="0.1"
                                        className="form-control"
                                        placeholder="Example: 101.5"
                                        value={feverData.temperature}
                                        onChange={handleFeverChange}
                                        required
                                      />
                                    </div>

                                    {/* PREVIOUS MEDICINE */}

                                    <div className="col-md-6">
                                      <label className="form-label fw-semibold">
                                        Have you taken medicine already? *
                                      </label>

                                      <select
                                        name="previousMedicine"
                                        className="form-select"
                                        value={feverData.previousMedicine}
                                        onChange={handleFeverChange}
                                        required
                                      >
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                      </select>
                                    </div>

                                    {/* MEDICINE NAME */}

                                    <div className="col-12">
                                      <label className="form-label fw-semibold">
                                        If yes, which medicine?
                                      </label>

                                      <input
                                        type="text"
                                        name="medicineName"
                                        className="form-control"
                                        placeholder="Medicine name, if known"
                                        value={feverData.medicineName}
                                        onChange={handleFeverChange}
                                      />
                                    </div>

                                    {/* OTHER SYMPTOMS */}

                                    <div className="col-12">
                                      <label className="form-label fw-semibold">
                                        Other symptoms
                                      </label>

                                      <textarea
                                        name="symptoms"
                                        rows="2"
                                        className="form-control"
                                        placeholder="Headache, cough, body pain, vomiting, etc."
                                        value={feverData.symptoms}
                                        onChange={handleFeverChange}
                                      />
                                    </div>

                                    {/* ALLERGIES */}

                                    <div className="col-md-6">
                                      <label className="form-label fw-semibold">
                                        Medicine allergy
                                      </label>

                                      <input
                                        type="text"
                                        name="allergies"
                                        className="form-control"
                                        placeholder="Any known medicine allergy"
                                        value={feverData.allergies}
                                        onChange={handleFeverChange}
                                      />
                                    </div>

                                    {/* MEDICAL CONDITIONS */}

                                    <div className="col-md-6">
                                      <label className="form-label fw-semibold">
                                        Existing medical condition
                                      </label>

                                      <input
                                        type="text"
                                        name="medicalConditions"
                                        className="form-control"
                                        placeholder="Diabetes, BP, liver disease, etc."
                                        value={feverData.medicalConditions}
                                        onChange={handleFeverChange}
                                      />
                                    </div>
                                  </div>

                                  <div className="alert alert-info mt-3 mb-3 small">
                                    ⚕️ This assessment does not replace
                                    examination by a qualified doctor. The
                                    hospital doctor will advise the
                                    appropriate treatment.
                                  </div>

                                  <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                  >
                                    {loading ? (
                                      <>
                                        <span
                                          className="spinner-border spinner-border-sm me-2"
                                          role="status"
                                        />
                                        Processing...
                                      </>
                                    ) : (
                                      <>Submit Fever Assessment</>
                                    )}
                                  </button>
                                </form>
                              </div>
                            </div>
                          )}

                        {/* ==========================================
                            SPECIALIZATION
                        ========================================== */}

                        {msg.specialization &&
                          msg.doctors &&
                          msg.doctors.length > 0 && (
                            <div className="alert alert-primary py-2 mt-3 mb-3">
                              <strong>Recommended Department:</strong>{" "}
                              {msg.specialization}
                            </div>
                          )}

                        {/* ==========================================
                            FEVER RESULT DOCTOR
                        ========================================== */}

                        {msg.doctor && (
                          <div className="card border-primary shadow-sm mt-3">
                            <div className="card-header bg-primary text-white">
                              <strong>👨‍⚕️ Please Consult Our Doctor</strong>
                            </div>

                            <div className="card-body">
                              <div className="d-flex align-items-start">
                                {/* IMAGE */}

                                <div className="me-3">
                                  {msg.doctor.photo ? (
                                    <img
                                      src={getDoctorImage(msg.doctor.photo)}
                                      alt={msg.doctor.name || "Doctor"}
                                      style={{
                                        width: "90px",
                                        height: "90px",
                                        objectFit: "cover",
                                        borderRadius: "50%",
                                        border: "3px solid #0d6efd",
                                      }}
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";

                                        const fallback =
                                          e.currentTarget.parentElement.querySelector(
                                            ".doctor-result-fallback"
                                          );

                                        if (fallback) {
                                          fallback.style.display = "flex";
                                        }
                                      }}
                                    />
                                  ) : null}

                                  <div
                                    className="doctor-result-fallback bg-primary text-white align-items-center justify-content-center"
                                    style={{
                                      width: "90px",
                                      height: "90px",
                                      borderRadius: "50%",
                                      fontSize: "35px",
                                      display: msg.doctor.photo ? "none" : "flex",
                                    }}
                                  >
                                    👨‍⚕️
                                  </div>
                                </div>

                                {/* DETAILS */}

                                <div className="flex-grow-1">
                                  <h5 className="fw-bold mb-1">
                                    {msg.doctor.name}
                                  </h5>

                                  {msg.doctor.specialization && (
                                    <div className="text-primary fw-semibold">
                                      {msg.doctor.specialization}
                                    </div>
                                  )}

                                  {msg.doctor.department && (
                                    <div className="text-muted small mt-1">
                                      🏥 Department: {msg.doctor.department}
                                    </div>
                                  )}

                                  <div className="text-muted small mt-1">
                                    💼 Experience: {msg.doctor.experience || 0}{" "}
                                    years
                                  </div>

                                  {msg.doctor.availableTime && (
                                    <div className="text-muted small mt-1">
                                      🕐 Available: {msg.doctor.availableTime}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* DAYS */}

                              {msg.doctor.availableDays?.length > 0 && (
                                <div className="mt-3">
                                  <div className="small text-muted mb-1">
                                    Available Days:
                                  </div>

                                  {msg.doctor.availableDays.map((day) => (
                                    <span
                                      key={day}
                                      className="badge bg-light text-primary border me-1 mb-1"
                                    >
                                      {day}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* ADVICE */}

                              <div className="alert alert-success mt-3 mb-3">
                                <strong>📅 Appointment Advice:</strong>

                                <br />

                                {msg.advice ||
                                  "Please contact this doctor and book an appointment for proper examination and treatment."}
                              </div>

                              {/* BUTTONS */}

                              <div className="d-flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary"
                                  onClick={() =>
                                    viewDoctorProfile(msg.doctor._id)
                                  }
                                >
                                  View Doctor Profile
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => bookAppointment(msg.doctor._id)}
                                >
                                  📅 Book Appointment
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ==========================================
                            NORMAL DOCTOR LIST
                        ========================================== */}

                        {msg.doctors && msg.doctors.length > 0 && (
                          <div className="mt-3">
                            <h5 className="fw-bold text-primary mb-3">
                              👨‍⚕️ Suitable Doctors
                            </h5>

                            <div className="row g-3">
                              {msg.doctors.map((doctor) => (
                                <div className="col-12" key={doctor._id}>
                                  <div className="card border shadow-sm">
                                    <div className="card-body">
                                      <div className="d-flex align-items-start">
                                        {/* IMAGE */}

                                        <div className="me-3">
                                          {doctor.photo ? (
                                            <img
                                              src={getDoctorImage(doctor.photo)}
                                              alt={doctor.name || "Doctor"}
                                              style={{
                                                width: "75px",
                                                height: "75px",
                                                objectFit: "cover",
                                                borderRadius: "50%",
                                                border: "3px solid #0d6efd",
                                              }}
                                              onError={(e) => {
                                                e.currentTarget.style.display =
                                                  "none";

                                                const fallback =
                                                  e.currentTarget.parentElement.querySelector(
                                                    ".doctor-image-fallback"
                                                  );

                                                if (fallback) {
                                                  fallback.style.display =
                                                    "flex";
                                                }
                                              }}
                                            />
                                          ) : null}

                                          <div
                                            className="doctor-image-fallback bg-primary text-white align-items-center justify-content-center"
                                            style={{
                                              width: "75px",
                                              height: "75px",
                                              borderRadius: "50%",
                                              fontSize: "30px",
                                              display: doctor.photo
                                                ? "none"
                                                : "flex",
                                            }}
                                          >
                                            👨‍⚕️
                                          </div>
                                        </div>

                                        {/* DETAILS */}

                                        <div className="flex-grow-1">
                                          <h5 className="mb-1 fw-bold">
                                            {doctor.name}
                                          </h5>

                                          {doctor.specialization && (
                                            <div className="text-primary fw-semibold">
                                              {doctor.specialization}
                                            </div>
                                          )}

                                          {doctor.department && (
                                            <div className="text-muted small mt-1">
                                              🏥 Department: {doctor.department}
                                            </div>
                                          )}

                                          <div className="text-muted small mt-1">
                                            💼 Experience:{" "}
                                            {doctor.experience || 0} years
                                          </div>

                                          {doctor.availableTime && (
                                            <div className="text-muted small mt-1">
                                              🕐 Available:{" "}
                                              {doctor.availableTime}
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* DAYS */}

                                      {doctor.availableDays?.length > 0 && (
                                        <div className="mt-3">
                                          <div className="small text-muted mb-1">
                                            Available Days:
                                          </div>

                                          {doctor.availableDays.map((day) => (
                                            <span
                                              key={day}
                                              className="badge bg-light text-primary border me-1 mb-1"
                                            >
                                              {day}
                                            </span>
                                          ))}
                                        </div>
                                      )}

                                      {/* BIO */}

                                      {doctor.bio && (
                                        <div className="mt-3">
                                          <div className="small text-muted">
                                            About Doctor
                                          </div>

                                          <p className="small mb-0 mt-1">
                                            {doctor.bio}
                                          </p>
                                        </div>
                                      )}

                                      {/* BUTTONS */}

                                      <div className="d-flex flex-wrap gap-2 mt-3">
                                        <button
                                          type="button"
                                          className="btn btn-outline-primary btn-sm"
                                          onClick={() =>
                                            viewDoctorProfile(doctor._id)
                                          }
                                        >
                                          View Profile
                                        </button>

                                        <button
                                          type="button"
                                          className="btn btn-primary btn-sm"
                                          onClick={() =>
                                            bookAppointment(doctor._id)
                                          }
                                        >
                                          📅 Book Appointment
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ==========================================
                            NO DOCTOR FOUND
                        ========================================== */}

                        {msg.specialization &&
                          !msg.doctor &&
                          (!msg.doctors || msg.doctors.length === 0) && (
                            <div className="alert alert-warning mt-3 mb-0">
                              <strong>No matching doctor found.</strong>

                              <br />

                              We could not find a doctor matching{" "}
                              <strong>{msg.specialization}</strong> in our
                              current database.
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* ==========================================
                  LOADING
              ========================================== */}

              {loading && (
                <div className="d-flex justify-content-start mb-3">
                  <div className="bg-light border rounded-4 px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="spinner-border spinner-border-sm text-primary"
                        role="status"
                      />

                      <span className="text-muted small">
                        Finding suitable information...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ==========================================
                INPUT / FOOTER
            ========================================== */}

            <div className="ai-chat-footer">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your health... / अपने स्वास्थ्य से जुड़ा सवाल पूछें..."
                rows={1}
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={loading || !message.trim()}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    ...
                  </>
                ) : (
                  <>
                    Send<span className="ms-2">➤</span>
                  </>
                )}
              </button>
            </div>

            {/* ==========================================
                DISCLAIMER
            ========================================== */}

            <div className="ai-chat-disclaimer">
              ⚕️ AI provides general information and does not replace
              professional medical advice. For diagnosis and treatment,
              consult a qualified doctor.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIHealthAssistant;