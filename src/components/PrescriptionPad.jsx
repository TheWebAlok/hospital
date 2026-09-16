import { forwardRef } from "react";
import "./PrescriptionPad.css";

// =====================================================
// CLINIC / HOSPITAL INFORMATION
// =====================================================

const CLINIC_INFO = {
  name: "City Care Hospital",
  address: "Your Clinic Address, City, State",
  phone: "+91 00000 00000",

  // Example:
  // logoUrl: "/logo.png"
  logoUrl: "",

  doctors: [
    {
      name: "Dr. Full Name",
      qualification: "M.B.B.S / M.D",
    },
    {
      name: "Dr. Full Name",
      qualification: "M.B.B.S / PGDFM",
    },
    {
      name: "Dr. Full Name",
      qualification: "M.B.B.S / CCMT",
    },
  ],
};

// =====================================================
// PRESCRIPTION PAD
// =====================================================

const PrescriptionPad = forwardRef(
  ({ prescription }, ref) => {
    if (!prescription) return null;

    const {
      patientName,
      patientAge,
      patientGender,
      patientAddress,
      doctorName,
      date,
      vitals,
      chiefComplaints = [],
      investigations = [],
      medicines = [],
      advice,
    } = prescription;

    const formattedDate = date
      ? new Date(date).toLocaleDateString("en-IN")
      : new Date().toLocaleDateString("en-IN");

    return (
      <div className="rx-print-page">
        <div
          className="rx-pad"
          ref={ref}
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <header className="rx-header">

            <div className="rx-header-top">

              {CLINIC_INFO.logoUrl ? (
                <img
                  className="rx-logo-img"
                  src={CLINIC_INFO.logoUrl}
                  alt={`${CLINIC_INFO.name} logo`}
                />
              ) : (
                <div className="rx-logo">
                  DSM
                </div>
              )}

              <div className="rx-clinic-info">

                <h1>
                  {CLINIC_INFO.name}
                </h1>

                <p>
                  {CLINIC_INFO.address}
                </p>

                <p>
                  Mob: {CLINIC_INFO.phone}
                </p>

              </div>
            </div>

            <div className="rx-doctors-bar">

              {CLINIC_INFO.doctors.map(
                (doc, index) => (
                  <div
                    className="rx-doctor"
                    key={index}
                  >
                    <strong>
                      {doc.name}
                    </strong>

                    <span>
                      {doc.qualification}
                    </span>
                  </div>
                )
              )}

            </div>
          </header>

          {/* =================================================
              PATIENT INFORMATION
          ================================================= */}

          <section className="rx-patient-box">

            <h3>
              Patient's Description
            </h3>

            <div className="rx-patient-grid">

              <div>
                <strong>
                  Patient Name:
                </strong>{" "}
                {patientName || "—"}
              </div>

              <div>
                <strong>
                  Age:
                </strong>{" "}
                {patientAge || "—"}
              </div>

              <div>
                <strong>
                  Sex:
                </strong>{" "}
                {patientGender || "—"}
              </div>

              <div className="rx-date">
                <strong>
                  Date:
                </strong>{" "}
                {formattedDate}
              </div>

            </div>

            {patientAddress && (
              <div className="rx-patient-line">
                <strong>
                  Address:
                </strong>{" "}
                {patientAddress}
              </div>
            )}

            {vitals && (
              <div className="rx-patient-line">
                <strong>
                  Vitals:
                </strong>{" "}
                {vitals}
              </div>
            )}

          </section>

          {/* =================================================
              MAIN BODY
          ================================================= */}

          <main className="rx-body">

            {/* LEFT */}
            <div className="rx-left">

              {/* Chief Complaint */}
              <section className="rx-box rx-complaint-box">

                <div className="rx-box-title">
                  Chief Complain
                </div>

                {chiefComplaints.length === 0 ? (
                  <div className="rx-empty">
                    —
                  </div>
                ) : (
                  <ul>
                    {chiefComplaints.map(
                      (complaint, index) => (
                        <li key={index}>
                          {complaint}
                        </li>
                      )
                    )}
                  </ul>
                )}

              </section>

              {/* Investigation */}
              <section className="rx-box rx-investigation-box">

                <div className="rx-box-title">
                  Investigation
                </div>

                {investigations.length === 0 ? (
                  <div className="rx-empty">
                    —
                  </div>
                ) : (
                  <ul>
                    {investigations.map(
                      (investigation, index) => (
                        <li key={index}>
                          {investigation}
                        </li>
                      )
                    )}
                  </ul>
                )}

              </section>

            </div>

            {/* RIGHT */}
            <div className="rx-right">

              <div className="rx-symbol">
                ℞
              </div>

              <ol className="rx-prescription-list">

                {medicines.length === 0 ? (
                  <li className="rx-empty">
                    —
                  </li>
                ) : (
                  medicines.map(
                    (medicine, index) => (
                      <li
                        key={
                          medicine.medicine ||
                          medicine.medicineId ||
                          index
                        }
                      >

                        <div className="rx-med-name">
                          {medicine.name}
                        </div>

                        {(medicine.dosage ||
                          medicine.duration ||
                          medicine.instructions) && (
                          <div className="rx-med-detail">

                            {medicine.dosage && (
                              <span>
                                {medicine.dosage}
                              </span>
                            )}

                            {medicine.duration && (
                              <span>
                                {medicine.duration}
                              </span>
                            )}

                            {medicine.instructions && (
                              <span>
                                {medicine.instructions}
                              </span>
                            )}

                          </div>
                        )}

                      </li>
                    )
                  )
                )}

              </ol>

              {advice && (
                <div className="rx-advice">

                  <strong>
                    Advice:
                  </strong>{" "}

                  {advice}

                </div>
              )}

            </div>

          </main>

          {/* =================================================
              FOOTER
          ================================================= */}

          <footer className="rx-footer">

            <span>
              Not for medico-legal purpose
            </span>

            <span className="rx-footer-doctor">
              {doctorName}
            </span>

          </footer>

        </div>
      </div>
    );
  }
);

PrescriptionPad.displayName =
  "PrescriptionPad";

export default PrescriptionPad;