import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  X,
  Printer,
  Search,
  FileText,
  User,
  Stethoscope,
  ClipboardList,
  FlaskConical,
  Pill,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { toast } from "react-toastify";

import API from "../services/api";
import { getMedicines } from "../services/pharmacyApi";

import PrescriptionPad from "./PrescriptionPad";

import "./PrescriptionModal.css";

export default function PrescriptionModal({
  patient,
  onClose,
  defaultDoctorName = "",
}) {
  // =========================================================
  // BASIC STATE
  // =========================================================

  const [step, setStep] = useState("form");

  const [saving, setSaving] = useState(false);

  const [loadingMedicines, setLoadingMedicines] = useState(true);

  const [savedPrescription, setSavedPrescription] = useState(null);

  // =========================================================
  // VISIT INFORMATION
  // =========================================================

  const [doctorName, setDoctorName] = useState(defaultDoctorName);

  const [visitDate, setVisitDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [vitals, setVitals] = useState("");
  // =========================================================
  // PATIENT INFORMATION
  // =========================================================

  const [patientForm, setPatientForm] = useState({
    name: patient?.name || "",
    age: patient?.age ?? "",
    gender: patient?.gender || "",
    phone: patient?.phone || "",
    email: patient?.email || "",
    address: patient?.address || "",
    bloodGroup: patient?.bloodGroup || "",
    medicalHistory: patient?.medicalHistory || "",
    emergencyContact: patient?.emergencyContact || "",
  });

  useEffect(() => {
    setPatientForm({
      name: patient?.name || "",
      age: patient?.age ?? "",
      gender: patient?.gender || "",
      phone: patient?.phone || "",
      email: patient?.email || "",
      address: patient?.address || "",
      bloodGroup: patient?.bloodGroup || "",
      medicalHistory: patient?.medicalHistory || "",
      emergencyContact: patient?.emergencyContact || "",
    });
  }, [patient?._id]);
  // =========================================================
  // COMPLAINTS
  // =========================================================

  const [complaints, setComplaints] = useState([""]);

  // =========================================================
  // INVESTIGATIONS
  // =========================================================

  const [investigations, setInvestigations] = useState([""]);

  // =========================================================
  // MEDICINES
  // =========================================================

  const createEmptyMedicine = () => ({
    medicineId: "",
    name: "",
    dosage: "",
    duration: "",
    instructions: "",
  });

  const [medicines, setMedicines] = useState([
    createEmptyMedicine(),
  ]);

  // =========================================================
  // ADVICE
  // =========================================================

  const [advice, setAdvice] = useState("");

  // =========================================================
  // PHARMACY MEDICINES
  // =========================================================

  const [availableMedicines, setAvailableMedicines] = useState([]);

  const [medicineSearch, setMedicineSearch] = useState({});

  const [openMedicineSearch, setOpenMedicineSearch] = useState(null);

  const medicineRefs = useRef({});

  // =========================================================
  // LOAD PHARMACY MEDICINES
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const loadMedicines = async () => {
      try {
        setLoadingMedicines(true);

        const response = await getMedicines();

        /*
          pharmacyApi.js returns response.data

          Expected:
          {
            success: true,
            count: 5,
            data: [...]
          }
        */

        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : Array.isArray(response?.medicines)
              ? response.medicines
              : [];

        if (!mounted) return;

        // Only active medicines with stock
        const usableMedicines = list.filter((medicine) => {
          const active = medicine?.isActive !== false;

          const stock = Number(
            medicine?.quantity ??
            medicine?.stock ??
            0
          );

          return active && stock > 0;
        });

        setAvailableMedicines(usableMedicines);
      } catch (error) {
        console.error(
          "Failed to load pharmacy medicines:",
          error
        );

        if (mounted) {
          setAvailableMedicines([]);

          toast.error(
            error?.response?.data?.message ||
            "Unable to load medicines from pharmacy"
          );
        }
      } finally {
        if (mounted) {
          setLoadingMedicines(false);
        }
      }
    };

    loadMedicines();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================================================
  // CLOSE MEDICINE DROPDOWN ON OUTSIDE CLICK
  // =========================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (openMedicineSearch === null) {
        return;
      }

      const currentRef =
        medicineRefs.current[openMedicineSearch];

      if (
        currentRef &&
        !currentRef.contains(event.target)
      ) {
        setOpenMedicineSearch(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [openMedicineSearch]);

  // =========================================================
  // COMMON LIST FUNCTIONS
  // =========================================================

  const updateListItem = (
    list,
    setList,
    index,
    value
  ) => {
    const copy = [...list];

    copy[index] = value;

    setList(copy);
  };

  const addListItem = (list, setList) => {
    setList([...list, ""]);
  };

  const removeListItem = (
    list,
    setList,
    index
  ) => {
    const updated = list.filter(
      (_, i) => i !== index
    );

    setList(
      updated.length > 0
        ? updated
        : [""]
    );
  };

  // =========================================================
  // MEDICINE FUNCTIONS
  // =========================================================
  // =========================================================
  // UPDATE PATIENT INFORMATION
  // =========================================================

  const updatePatientField = (
    field,
    value
  ) => {
    setPatientForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };
  const updateMedicine = (
    index,
    field,
    value
  ) => {
    setMedicines((previous) => {
      const copy = [...previous];

      copy[index] = {
        ...copy[index],
        [field]: value,
      };

      return copy;
    });
  };

  // =========================================================
  // ADD MEDICINE
  // =========================================================

  const addMedicine = () => {
    const newIndex = medicines.length;

    setMedicines((previous) => [
      ...previous,
      createEmptyMedicine(),
    ]);

    setMedicineSearch((previous) => ({
      ...previous,
      [newIndex]: "",
    }));

    setTimeout(() => {
      setOpenMedicineSearch(newIndex);
    }, 50);
  };

  // =========================================================
  // REMOVE MEDICINE
  // =========================================================

  const removeMedicine = (index) => {
    setMedicines((previous) => {
      const updated = previous.filter(
        (_, i) => i !== index
      );

      return updated.length > 0
        ? updated
        : [createEmptyMedicine()];
    });

    setMedicineSearch((previous) => {
      const copy = { ...previous };

      delete copy[index];

      return copy;
    });

    delete medicineRefs.current[index];

    setOpenMedicineSearch(null);
  };

  // =========================================================
  // CHECK EXPIRY
  // =========================================================

  const isMedicineExpired = (medicine) => {
    if (!medicine?.expiryDate) {
      return false;
    }

    const expiry = new Date(
      medicine.expiryDate
    );

    if (Number.isNaN(expiry.getTime())) {
      return false;
    }

    expiry.setHours(
      23,
      59,
      59,
      999
    );

    return expiry < new Date();
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleDateString(
      "en-IN"
    );
  };

  // =========================================================
  // FILTER MEDICINES
  // =========================================================

  const getFilteredMedicines = (index) => {
    const search =
      medicineSearch[index]
        ?.trim()
        .toLowerCase() || "";

    let filtered =
      availableMedicines.filter(
        (medicine) =>
          !isMedicineExpired(medicine)
      );

    // Search only when doctor types
    if (search) {
      filtered = filtered.filter(
        (medicine) => {
          const values = [
            medicine?.name,
            medicine?.brand,
            medicine?.composition,
            medicine?.batchNumber,
          ];

          return values
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(search)
            );
        }
      );
    }

    return filtered.slice(0, 12);
  };

  // =========================================================
  // SELECT MEDICINE
  // =========================================================

  const selectMedicine = (
    index,
    medicine
  ) => {
    if (!medicine?._id) {
      toast.error(
        "Invalid medicine selected"
      );
      return;
    }

    if (isMedicineExpired(medicine)) {
      toast.error(
        "Expired medicine cannot be prescribed"
      );
      return;
    }

    const stock = Number(
      medicine?.quantity ??
      medicine?.stock ??
      0
    );

    if (stock <= 0) {
      toast.error(
        "This medicine is out of stock"
      );
      return;
    }

    setMedicines((previous) => {
      const copy = [...previous];

      copy[index] = {
        ...copy[index],

        medicineId: medicine._id,

        name: medicine.name || "",

        // Do not overwrite doctor's values
        dosage: copy[index].dosage || "",

        duration:
          copy[index].duration || "",

        instructions:
          copy[index].instructions || "",
      };

      return copy;
    });

    setMedicineSearch((previous) => ({
      ...previous,
      [index]: medicine.name || "",
    }));

    setOpenMedicineSearch(null);
  };

  // =========================================================
  // SEARCH CHANGE
  // =========================================================

  const handleMedicineSearchChange = (
    index,
    value
  ) => {
    setMedicineSearch((previous) => ({
      ...previous,
      [index]: value,
    }));

    /*
      Important:
      If doctor changes the search text,
      old medicine ID must be removed.
    */

    setMedicines((previous) => {
      const copy = [...previous];

      copy[index] = {
        ...copy[index],
        medicineId: "",
        name: value,
      };

      return copy;
    });

    setOpenMedicineSearch(index);
  };

  // =========================================================
  // CLEAR MEDICINE
  // =========================================================

  const clearMedicineSelection = (
    index
  ) => {
    setMedicines((previous) => {
      const copy = [...previous];

      copy[index] = {
        ...copy[index],
        medicineId: "",
        name: "",
      };

      return copy;
    });

    setMedicineSearch((previous) => ({
      ...previous,
      [index]: "",
    }));

    setOpenMedicineSearch(index);
  };

  // =========================================================
  // HANDLE SUBMIT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // -------------------------------------------------------
    // PATIENT
    // -------------------------------------------------------

    if (!patient?._id) {
      toast.error(
        "Patient information is missing"
      );
      return;
    }

    // -------------------------------------------------------
    // DOCTOR
    // -------------------------------------------------------

    if (!doctorName.trim()) {
      toast.error(
        "Doctor name is required"
      );
      return;
    }

    // -------------------------------------------------------
    // MEDICINES
    // -------------------------------------------------------

    const enteredMedicines =
      medicines.filter(
        (medicine) =>
          medicine.name?.trim() ||
          medicine.dosage?.trim() ||
          medicine.duration?.trim() ||
          medicine.instructions?.trim()
      );

    /*
      Every entered medicine must come
      from pharmacy inventory.
    */

    for (
      let i = 0;
      i < enteredMedicines.length;
      i++
    ) {
      const medicine =
        enteredMedicines[i];

      if (!medicine.name?.trim()) {
        toast.error(
          `Please select medicine for row ${i + 1
          }`
        );

        return;
      }

      if (!medicine.medicineId) {
        toast.error(
          `"${medicine.name}" is not selected from pharmacy inventory. Please search and select it.`
        );

        return;
      }
    }

    // -------------------------------------------------------
    // SAVE
    // -------------------------------------------------------

    try {
      setSaving(true);

      // -------------------------------------------------------
      // UPDATE PATIENT RECORD
      // -------------------------------------------------------
      const patientUpdatePayload = {
        name: patientForm.name.trim(),
        age: Number(patientForm.age),
        gender: patientForm.gender.trim(),
        phone: patientForm.phone.trim(),
        email: patientForm.email.trim(),
        address: patientForm.address.trim(),
        bloodGroup: patientForm.bloodGroup.trim(),
        medicalHistory: patientForm.medicalHistory.trim(),
        emergencyContact: patientForm.emergencyContact.trim(),
      };

      if (!patientUpdatePayload.name) {
        toast.error("Patient name is required");
        return;
      }

      if (
        !Number.isFinite(patientUpdatePayload.age) ||
        patientUpdatePayload.age <= 0
      ) {
        toast.error("Valid patient age is required");
        return;
      }

      if (!patientUpdatePayload.gender) {
        toast.error("Patient gender is required");
        return;
      }

      if (!patientUpdatePayload.phone) {
        toast.error("Patient phone number is required");
        return;
      }

      await API.put(
        `/patients/${patient._id}`,
        patientUpdatePayload
      );

      // -------------------------------------------------------
      // CREATE PRESCRIPTION
      // -------------------------------------------------------
      const payload = {
        patient: patient._id,

        doctorName:
          doctorName.trim(),

        date: visitDate
          ? new Date(
            `${visitDate}T00:00:00`
          ).toISOString()
          : new Date().toISOString(),

        vitals:
          vitals.trim(),

        chiefComplaints:
          complaints
            .map((item) =>
              item.trim()
            )
            .filter(Boolean),

        investigations:
          investigations
            .map((item) =>
              item.trim()
            )
            .filter(Boolean),

        medicines:
          enteredMedicines.map(
            (medicine) => ({
              medicine:
                medicine.medicineId,

              name:
                medicine.name.trim(),

              dosage:
                medicine.dosage.trim(),

              duration:
                medicine.duration.trim(),

              instructions:
                medicine.instructions.trim(),
            })
          ),

        advice:
          advice.trim(),
      };

      console.log(
        "Prescription Payload:",
        payload
      );

      const response =
        await API.post(
          "/prescriptions",
          payload
        );

      const prescription =
        response?.data?.prescription ||
        response?.data?.data ||
        response?.data;

      if (!prescription) {
        throw new Error(
          "Prescription was not returned by server"
        );
      }

      setSavedPrescription(
        prescription
      );

      setStep("preview");

      toast.success(
        "Prescription saved successfully"
      );
    } catch (error) {
      console.error(
        "Prescription save error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save prescription"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // PRINT
  // =========================================================

  const handlePrint = () => {
    window.print();
  };

  // =========================================================
  // PATIENT VALUES
  // =========================================================

  const patientName =
    patientForm.name || "";

  const patientAge =
    patientForm.age ?? "";


    
  const patientGender =
    patientForm.gender || "";

  const patientAddress =
    patientForm.address || "N/A";

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="rx-modal-overlay">
      <div
        className={`rx-modal ${step === "preview"
            ? "rx-modal-wide"
            : ""
          }`}
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="rx-modal-header">
          <div className="rx-title-wrapper">
            <div className="rx-title-icon">
              <FileText size={22} />
            </div>

            <div>
              <h2>
                {step === "form"
                  ? `New Prescription – ${patientName}`
                  : "Prescription Preview"}
              </h2>

              {step === "form" && (
                <p>
                  Create a new prescription
                  for the patient
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            className="rx-modal-close"
            onClick={onClose}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* =====================================================
            FORM
        ===================================================== */}

        {step === "form" && (
          <form
            className="rx-modal-form"
            onSubmit={handleSubmit}
          >
            {/* =================================================
                PATIENT INFORMATION
            ================================================= */}

            {/* =================================================
    PATIENT INFORMATION
================================================= */}

            <div className="rx-section rx-patient-section">

              <div className="rx-section-title">
                <div className="rx-section-icon">
                  <User size={18} />
                </div>

                <span>
                  Patient Information
                </span>
              </div>

              <div className="rx-patient-grid">

                {/* NAME */}

                <div className="rx-input-group">
                  <label>
                    Patient Name *
                  </label>

                  <input
                    type="text"
                    value={patientForm.name}
                    onChange={(e) =>
                      updatePatientField(
                        "name",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                {/* AGE */}

                <div className="rx-input-group">
                  <label>
                    Age *
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={patientForm.age}
                    onChange={(e) =>
                      updatePatientField(
                        "age",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                {/* GENDER */}

                <div className="rx-input-group">
                  <label>
                    Gender *
                  </label>

                  <select
                    value={patientForm.gender}
                    onChange={(e) =>
                      updatePatientField(
                        "gender",
                        e.target.value
                      )
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

                {/* PHONE */}

                <div className="rx-input-group">
                  <label>
                    Phone *
                  </label>

                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={patientForm.phone}
                    onChange={(e) =>
                      updatePatientField(
                        "phone",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                {/* EMAIL */}

                <div className="rx-input-group">
                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="patient@gmail.com"
                    value={patientForm.email}
                    onChange={(e) =>
                      updatePatientField(
                        "email",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* BLOOD GROUP */}

                <div className="rx-input-group">
                  <label>
                    Blood Group
                  </label>

                  <select
                    value={patientForm.bloodGroup}
                    onChange={(e) =>
                      updatePatientField(
                        "bloodGroup",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select Blood Group
                    </option>

                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                {/* ADDRESS */}

                <div className="rx-input-group rx-full">
                  <label>
                    <MapPin size={13} />
                    Address
                  </label>

                  <input
                    type="text"
                    placeholder="Enter complete address"
                    value={patientForm.address}
                    onChange={(e) =>
                      updatePatientField(
                        "address",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* MEDICAL HISTORY */}

                <div className="rx-input-group">
                  <label>
                    Medical History
                  </label>

                  <textarea
                    className="rx-patient-small-textarea"
                    placeholder="Previous illness, surgery, allergy etc."
                    value={
                      patientForm.medicalHistory
                    }
                    onChange={(e) =>
                      updatePatientField(
                        "medicalHistory",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* EMERGENCY CONTACT */}

                <div className="rx-input-group">
                  <label>
                    Emergency Contact
                  </label>

                  <input
                    type="tel"
                    placeholder="Emergency contact number"
                    value={
                      patientForm.emergencyContact
                    }
                    onChange={(e) =>
                      updatePatientField(
                        "emergencyContact",
                        e.target.value
                      )
                    }
                  />
                </div>

              </div>
            </div>
            {/* =================================================
                DOCTOR / VISIT
            ================================================= */}

            <div className="rx-section">
              <div className="rx-section-title">
                <div className="rx-section-icon">
                  <Stethoscope
                    size={18}
                  />
                </div>

                <span>
                  Doctor & Visit Info
                </span>
              </div>

              <div className="rx-doctor-grid">
                <div className="rx-input-group">
                  <label>
                    Doctor Name *
                  </label>

                  <input
                    type="text"
                    placeholder="Dr. S.K. Dubey"
                    value={
                      doctorName
                    }
                    onChange={(e) =>
                      setDoctorName(
                        e.target.value
                      )
                    }
                    readOnly={
                      !!defaultDoctorName
                    }
                    required
                  />
                </div>

                <div className="rx-input-group">
                  <label>
                    <CalendarDays
                      size={13}
                    />
                    Date
                  </label>

                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) =>
                      setVisitDate(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="rx-input-group rx-full">
                  <label>
                    Vitals
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. BP 120/80, Temp 98.6, Pulse 72"
                    value={vitals}
                    onChange={(e) =>
                      setVitals(
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                CHIEF COMPLAINTS
            ================================================= */}

            <div className="rx-section">
              <div className="rx-section-title">
                <div className="rx-section-icon">
                  <ClipboardList
                    size={18}
                  />
                </div>

                <span>
                  Chief Complaints
                </span>
              </div>

              <div className="rx-list-container">
                {complaints.map(
                  (
                    complaint,
                    index
                  ) => (
                    <div
                      className="rx-list-row"
                      key={index}
                    >
                      <input
                        type="text"
                        placeholder={
                          index === 0
                            ? "e.g. Fever since 3 days"
                            : "e.g. Headache"
                        }
                        value={
                          complaint
                        }
                        onChange={(e) =>
                          updateListItem(
                            complaints,
                            setComplaints,
                            index,
                            e.target
                              .value
                          )
                        }
                      />

                      <button
                        type="button"
                        className="rx-remove-btn"
                        onClick={() =>
                          removeListItem(
                            complaints,
                            setComplaints,
                            index
                          )
                        }
                      >
                        <Trash2
                          size={15}
                        />
                      </button>
                    </div>
                  )
                )}
              </div>

              <button
                type="button"
                className="rx-add-btn"
                onClick={() =>
                  addListItem(
                    complaints,
                    setComplaints
                  )
                }
              >
                <Plus size={14} />
                Add Complaint
              </button>
            </div>

            {/* =================================================
                INVESTIGATIONS
            ================================================= */}

            <div className="rx-section">
              <div className="rx-section-title">
                <div className="rx-section-icon">
                  <FlaskConical
                    size={18}
                  />
                </div>

                <span>
                  Investigations
                </span>
              </div>

              <div className="rx-list-container">
                {investigations.map(
                  (
                    investigation,
                    index
                  ) => (
                    <div
                      className="rx-list-row"
                      key={index}
                    >
                      <input
                        type="text"
                        placeholder={
                          index === 0
                            ? "e.g. CBC, Blood Sugar"
                            : "e.g. X-Ray Chest"
                        }
                        value={
                          investigation
                        }
                        onChange={(e) =>
                          updateListItem(
                            investigations,
                            setInvestigations,
                            index,
                            e.target
                              .value
                          )
                        }
                      />

                      <button
                        type="button"
                        className="rx-remove-btn"
                        onClick={() =>
                          removeListItem(
                            investigations,
                            setInvestigations,
                            index
                          )
                        }
                      >
                        <Trash2
                          size={15}
                        />
                      </button>
                    </div>
                  )
                )}
              </div>

              <button
                type="button"
                className="rx-add-btn"
                onClick={() =>
                  addListItem(
                    investigations,
                    setInvestigations
                  )
                }
              >
                <Plus size={14} />
                Add Investigation
              </button>
            </div>

            {/* =================================================
                MEDICINES
            ================================================= */}

            <div className="rx-section rx-medicine-section">
              <div className="rx-medicine-heading">
                <div className="rx-section-title">
                  <div className="rx-section-icon">
                    <Pill size={18} />
                  </div>

                  <div>
                    <span>
                      Medicines (Rx)
                    </span>

                    <small>
                      Search and select medicines
                      from pharmacy inventory
                    </small>
                  </div>
                </div>

                <span className="rx-pharmacy-status">
                  {loadingMedicines
                    ? "Loading pharmacy..."
                    : `${availableMedicines.length} medicines available`}
                </span>
              </div>

              {/* TABLE HEADER */}

              <div className="rx-medicine-table-header">
                <span>#</span>
                <span>Medicine *</span>
                <span>Dosage</span>
                <span>Duration</span>
                <span>Instructions</span>
                <span>Action</span>
              </div>

              {/* MEDICINE ROWS */}

              <div className="rx-medicine-list">
                {medicines.map(
                  (
                    medicine,
                    index
                  ) => {
                    const filtered =
                      getFilteredMedicines(
                        index
                      );

                    return (
                      <div
                        className="rx-medicine-row"
                        key={index}
                      >
                        {/* NUMBER */}

                        <div className="rx-medicine-number">
                          {index + 1}
                        </div>

                        {/* SEARCH */}

                        <div
                          className="rx-medicine-search"
                          ref={(element) => {
                            medicineRefs.current[
                              index
                            ] = element;
                          }}
                        >
                          <div
                            className={`rx-search-box ${medicine.medicineId
                                ? "selected"
                                : ""
                              }`}
                          >
                            <Search
                              size={16}
                            />

                            <input
                              type="text"
                              placeholder={
                                loadingMedicines
                                  ? "Loading medicines..."
                                  : "Type medicine name..."
                              }
                              value={
                                medicineSearch[
                                index
                                ] ??
                                medicine.name ??
                                ""
                              }
                              disabled={
                                loadingMedicines
                              }
                              onFocus={() =>
                                setOpenMedicineSearch(
                                  index
                                )
                              }
                              onChange={(e) =>
                                handleMedicineSearchChange(
                                  index,
                                  e.target.value
                                )
                              }
                            />

                            {medicine.medicineId && (
                              <button
                                type="button"
                                className="rx-clear-medicine"
                                onClick={() =>
                                  clearMedicineSelection(
                                    index
                                  )
                                }
                                title="Change medicine"
                              >
                                <X
                                  size={14}
                                />
                              </button>
                            )}
                          </div>

                          {/* DROPDOWN */}

                          {openMedicineSearch ===
                            index &&
                            !medicine.medicineId && (
                              <div className="rx-medicine-dropdown">
                                {loadingMedicines ? (
                                  <div className="rx-dropdown-message">
                                    Loading medicines...
                                  </div>
                                ) : filtered.length ===
                                  0 ? (
                                  <div className="rx-dropdown-message">
                                    <strong>
                                      No medicine found
                                    </strong>

                                    <span>
                                      Try another
                                      medicine name
                                    </span>
                                  </div>
                                ) : (
                                  filtered.map(
                                    (
                                      item
                                    ) => {
                                      const stock =
                                        Number(
                                          item?.quantity ??
                                          item?.stock ??
                                          0
                                        );

                                      const lowStock =
                                        stock <=
                                        Number(
                                          item?.lowStockThreshold ??
                                          10
                                        );

                                      return (
                                        <button
                                          type="button"
                                          className="rx-medicine-option"
                                          key={
                                            item._id
                                          }
                                          onMouseDown={(
                                            e
                                          ) => {
                                            e.preventDefault();

                                            selectMedicine(
                                              index,
                                              item
                                            );
                                          }}
                                        >
                                          <div className="rx-option-left">
                                            <div className="rx-option-icon">
                                              <Pill
                                                size={
                                                  17
                                                }
                                              />
                                            </div>

                                            <div className="rx-option-info">
                                              <strong>
                                                {
                                                  item.name
                                                }
                                              </strong>

                                              {item.composition && (
                                                <small>
                                                  {
                                                    item.composition
                                                  }
                                                </small>
                                              )}

                                              <span>
                                                {item.brand &&
                                                  `Brand: ${item.brand}`}
                                                {item.brand &&
                                                  item.batchNumber &&
                                                  "  •  "}
                                                {item.batchNumber &&
                                                  `Batch: ${item.batchNumber}`}
                                              </span>
                                            </div>
                                          </div>

                                          <div className="rx-option-stock">
                                            <small>
                                              STOCK
                                            </small>

                                            <strong
                                              className={
                                                lowStock
                                                  ? "low"
                                                  : ""
                                              }
                                            >
                                              {
                                                stock
                                              }
                                            </strong>

                                            {item.expiryDate && (
                                              <span>
                                                Exp:{" "}
                                                {formatDate(
                                                  item.expiryDate
                                                )}
                                              </span>
                                            )}
                                          </div>
                                        </button>
                                      );
                                    }
                                  )
                                )}
                              </div>
                            )}
                        </div>

                        {/* DOSAGE */}

                        <input
                          className="rx-medicine-input"
                          type="text"
                          placeholder="e.g. 1-0-1"
                          value={
                            medicine.dosage
                          }
                          onChange={(e) =>
                            updateMedicine(
                              index,
                              "dosage",
                              e.target.value
                            )
                          }
                        />

                        {/* DURATION */}

                        <input
                          className="rx-medicine-input"
                          type="text"
                          placeholder="e.g. 5 days"
                          value={
                            medicine.duration
                          }
                          onChange={(e) =>
                            updateMedicine(
                              index,
                              "duration",
                              e.target.value
                            )
                          }
                        />

                        {/* INSTRUCTIONS */}

                        <input
                          className="rx-medicine-input"
                          type="text"
                          placeholder="e.g. After food"
                          value={
                            medicine.instructions
                          }
                          onChange={(e) =>
                            updateMedicine(
                              index,
                              "instructions",
                              e.target.value
                            )
                          }
                        />

                        {/* DELETE */}

                        <button
                          type="button"
                          className="rx-remove-btn rx-medicine-delete"
                          onClick={() =>
                            removeMedicine(
                              index
                            )
                          }
                          title="Remove medicine"
                        >
                          <Trash2
                            size={15}
                          />
                        </button>
                      </div>
                    );
                  }
                )}
              </div>

              {/* ADD MEDICINE */}

              <button
                type="button"
                className="rx-add-btn"
                onClick={addMedicine}
                disabled={
                  loadingMedicines
                }
              >
                <Plus size={14} />
                Add Medicine
              </button>
            </div>

            {/* =================================================
                ADVICE
            ================================================= */}

            <div className="rx-section rx-advice-section">
              <div className="rx-section-title">
                <div className="rx-section-icon">
                  <FileText size={18} />
                </div>

                <span>
                  Advice / Follow-up
                </span>
              </div>

              <textarea
                placeholder="e.g. Take rest, Drink plenty of water, Follow up after 5 days"
                value={advice}
                onChange={(e) =>
                  setAdvice(
                    e.target.value
                  )
                }
              />
            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="rx-form-actions">
              <button
                type="button"
                className="rx-cancel-btn"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                className="primary-btn rx-save-btn"
                type="submit"
                disabled={
                  saving ||
                  loadingMedicines
                }
              >
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <FileText
                      size={16}
                    />
                    Save & Preview
                    Prescription
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* =====================================================
            PREVIEW
        ===================================================== */}

        {step === "preview" && (
          <>
            <div className="rx-preview-actions">
              <button
                type="button"
                className="primary-btn"
                onClick={handlePrint}
              >
                <Printer size={16} />
                Print / Save as PDF
              </button>
            </div>

            <div className="rx-preview-scroll">
              <PrescriptionPad
                prescription={
                  savedPrescription
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}