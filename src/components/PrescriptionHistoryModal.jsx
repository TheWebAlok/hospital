import { useEffect, useRef, useState } from "react";

import API from "../services/api";
import { getMedicines } from "../services/pharmacyApi";

import {
  X,
  Printer,
  Trash2,
  FileText,
  ArrowLeft,
  Pencil,
  Plus,
  Search,
  Pill,
  CalendarDays,
  User,
  Stethoscope,
  ClipboardList,
  FlaskConical,
  Save,
} from "lucide-react";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import PrescriptionPad from "./PrescriptionPad";
import "./PrescriptionHistoryModal.css";

// =====================================================
// EMPTY MEDICINE
// =====================================================

const createEmptyMedicine = () => ({
  medicineId: "",
  name: "",
  dosage: "",
  duration: "",
  instructions: "",
});

// =====================================================
// EMPTY LIST
// =====================================================

const cleanList = (list) => {
  if (!Array.isArray(list) || list.length === 0) {
    return [""];
  }

  return list.map((item) => String(item ?? ""));
};

// =====================================================
// MEDICINE DATA NORMALIZER
// =====================================================

const normalizeMedicineList = (response) => {
  const payload = response?.data ?? response;

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.medicines)) {
    return payload.medicines;
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  return [];
};

// =====================================================
// COMPONENT
// =====================================================

export default function PrescriptionHistoryModal({
  patient,
  onClose,
}) {
  // ===================================================
  // HISTORY
  // ===================================================

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // list | view | edit
  const [mode, setMode] = useState("list");

  const [selected, setSelected] = useState(null);

  const [saving, setSaving] = useState(false);

  const printRef = useRef(null);

  // ===================================================
  // PHARMACY MEDICINES
  // ===================================================

  const [availableMedicines, setAvailableMedicines] = useState([]);

  const [medicinesLoading, setMedicinesLoading] = useState(false);

  const [medicineSearch, setMedicineSearch] = useState({});

  const [openMedicineSearch, setOpenMedicineSearch] = useState(null);

  // ===================================================
  // EDIT STATE
  // ===================================================

  const [doctorName, setDoctorName] = useState("");

  const [date, setDate] = useState("");

  const [vitals, setVitals] = useState("");

  const [complaints, setComplaints] = useState([""]);

  const [investigations, setInvestigations] = useState([""]);

  const [medicines, setMedicines] = useState([
    createEmptyMedicine(),
  ]);

  const [advice, setAdvice] = useState("");

  // ===================================================
  // FETCH HISTORY
  // ===================================================

  useEffect(() => {
    if (!patient?._id) return;

    fetchHistory();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient?._id]);

  // ===================================================
  // LOAD PHARMACY MEDICINES
  // ===================================================

  useEffect(() => {
    loadPharmacyMedicines();
  }, []);

  const loadPharmacyMedicines = async () => {
    try {
      setMedicinesLoading(true);

      const response = await getMedicines();

      const list = normalizeMedicineList(response);

      // Only active medicines
      const activeMedicines = list.filter(
        (medicine) => medicine?.isActive !== false
      );

      setAvailableMedicines(activeMedicines);
    } catch (error) {
      console.error(
        "LOAD PHARMACY MEDICINES ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to load pharmacy medicines"
      );
    } finally {
      setMedicinesLoading(false);
    }
  };

  // ===================================================
  // FETCH HISTORY
  // ===================================================

  const fetchHistory = async () => {
    if (!patient?._id) {
      return;
    }

    try {
      setLoading(true);

      const response = await API.get(
        `/prescriptions/patient/${patient._id}`
      );

      const data = response?.data;

      const list = Array.isArray(data?.prescriptions)
        ? data.prescriptions
        : Array.isArray(data?.data)
        ? data.data
        : [];

      list.sort(
        (a, b) =>
          new Date(
            b.date || b.createdAt
          ) -
          new Date(
            a.date || a.createdAt
          )
      );

      setPrescriptions(list);
    } catch (error) {
      console.error(
        "FETCH PRESCRIPTION HISTORY ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch prescription history"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // VIEW PRESCRIPTION
  // ===================================================

  const handleView = async (id) => {
    if (!id) return;

    try {
      setLoading(true);

      const response = await API.get(
        `/prescriptions/${id}`
      );

      const prescription =
        response?.data?.prescription ||
        response?.data?.data;

      if (!prescription) {
        toast.error(
          "Prescription data not found"
        );
        return;
      }

      setSelected(prescription);

      setMode("view");
    } catch (error) {
      console.error(
        "VIEW PRESCRIPTION ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to load prescription"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // FORMAT DATE FOR INPUT
  // ===================================================

  const formatDateForInput = (value) => {
    if (!value) {
      return "";
    }

    const d = new Date(value);

    if (Number.isNaN(d.getTime())) {
      return "";
    }

    const year = d.getFullYear();

    const month = String(
      d.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      d.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ===================================================
  // OPEN EDIT
  // ===================================================

  const handleOpenEdit = () => {
    if (!selected) {
      return;
    }

    setDoctorName(
      selected.doctorName || ""
    );

    setDate(
      formatDateForInput(
        selected.date || selected.createdAt
      )
    );

    setVitals(
      selected.vitals || ""
    );

    setComplaints(
      cleanList(
        selected.chiefComplaints
      )
    );

    setInvestigations(
      cleanList(
        selected.investigations
      )
    );

    const savedMedicines =
      Array.isArray(selected.medicines)
        ? selected.medicines
        : [];

    setMedicines(
      savedMedicines.length
        ? savedMedicines.map(
            (medicine) => ({
              medicineId:
                medicine?.medicine?._id ||
                medicine?.medicine ||
                "",

              name:
                medicine?.name ||
                medicine?.medicine?.name ||
                "",

              dosage:
                medicine?.dosage || "",

              duration:
                medicine?.duration || "",

              instructions:
                medicine?.instructions || "",
            })
          )
        : [createEmptyMedicine()]
    );

    // Set search values for already selected medicines
    const searchValues = {};

    savedMedicines.forEach(
      (medicine, index) => {
        searchValues[index] =
          medicine?.name ||
          medicine?.medicine?.name ||
          "";
      }
    );

    setMedicineSearch(searchValues);

    setOpenMedicineSearch(null);

    setAdvice(
      selected.advice || ""
    );

    setMode("edit");
  };

  // ===================================================
  // LIST HELPERS
  // ===================================================

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

  const addListItem = (
    list,
    setList
  ) => {
    setList([
      ...list,
      "",
    ]);
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
      updated.length
        ? updated
        : [""]
    );
  };

  // ===================================================
  // MEDICINE UPDATE
  // ===================================================

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

  // ===================================================
  // MEDICINE SEARCH
  // ===================================================

  const getFilteredMedicines = (
    index
  ) => {
    const search =
      medicineSearch[index]
        ?.trim()
        .toLowerCase() || "";

    let filtered = availableMedicines.filter(
      (medicine) => {
        const name =
          String(
            medicine?.name || ""
          ).toLowerCase();

        const brand =
          String(
            medicine?.brand ||
              medicine?.manufacturer ||
              ""
          ).toLowerCase();

        const composition =
          String(
            medicine?.composition ||
              medicine?.genericName ||
              ""
          ).toLowerCase();

        const batch =
          String(
            medicine?.batchNumber || ""
          ).toLowerCase();

        if (!search) {
          return true;
        }

        return (
          name.includes(search) ||
          brand.includes(search) ||
          composition.includes(search) ||
          batch.includes(search)
        );
      }
    );

    // Don't show expired medicines
    filtered = filtered.filter(
      (medicine) => {
        if (!medicine?.expiryDate) {
          return true;
        }

        const expiry = new Date(
          medicine.expiryDate
        );

        if (Number.isNaN(expiry.getTime())) {
          return true;
        }

        return expiry >= new Date();
      }
    );

    return filtered.slice(0, 10);
  };

  // ===================================================
  // SELECT MEDICINE
  // ===================================================

  const selectMedicine = (
    index,
    medicine
  ) => {
    if (!medicine?._id) {
      return;
    }

    setMedicines((previous) => {
      const copy = [...previous];

      copy[index] = {
        ...copy[index],

        medicineId:
          medicine._id,

        name:
          medicine.name || "",

        dosage:
          copy[index]?.dosage || "",

        duration:
          copy[index]?.duration || "",

        instructions:
          copy[index]?.instructions || "",
      };

      return copy;
    });

    setMedicineSearch(
      (previous) => ({
        ...previous,
        [index]:
          medicine.name || "",
      })
    );

    setOpenMedicineSearch(null);
  };

  // ===================================================
  // MEDICINE SEARCH CHANGE
  // ===================================================

  const handleMedicineSearchChange = (
    index,
    value
  ) => {
    setMedicineSearch(
      (previous) => ({
        ...previous,
        [index]: value,
      })
    );

    // Typing again removes old selected medicine ID
    setMedicines((previous) => {
      const copy = [...previous];

      copy[index] = {
        ...copy[index],
        name: value,
        medicineId: "",
      };

      return copy;
    });

    setOpenMedicineSearch(index);
  };

  // ===================================================
  // ADD MEDICINE
  // ===================================================

  const addMedicine = () => {
    setMedicines(
      (previous) => [
        ...previous,
        createEmptyMedicine(),
      ]
    );

    setMedicineSearch(
      (previous) => ({
        ...previous,
        [medicines.length]: "",
      })
    );
  };

  // ===================================================
  // REMOVE MEDICINE
  // ===================================================

  const removeMedicine = (
    index
  ) => {
    setMedicines(
      (previous) => {
        const updated =
          previous.filter(
            (_, i) =>
              i !== index
          );

        return updated.length
          ? updated
          : [
              createEmptyMedicine(),
            ];
      }
    );

    setMedicineSearch(
      (previous) => {
        const copy = {
          ...previous,
        };

        delete copy[index];

        return copy;
      }
    );

    setOpenMedicineSearch(null);
  };

  // ===================================================
  // VALIDATE MEDICINES
  // ===================================================

  const validateMedicines = () => {
    for (
      let index = 0;
      index < medicines.length;
      index++
    ) {
      const medicine =
        medicines[index];

      const name =
        medicine?.name?.trim() || "";

      if (!name) {
        continue;
      }

      if (!medicine?.medicineId) {
        toast.error(
          `Please select medicine from pharmacy inventory in row ${
            index + 1
          }.`
        );

        return false;
      }
    }

    return true;
  };

  // ===================================================
  // SAVE EDIT
  // ===================================================

  const handleSaveEdit = async (
    event
  ) => {
    event.preventDefault();

    if (!selected?._id) {
      toast.error(
        "Prescription not selected"
      );
      return;
    }

    if (!doctorName.trim()) {
      toast.error(
        "Doctor name is required"
      );
      return;
    }

    if (!validateMedicines()) {
      return;
    }

    try {
      setSaving(true);

      const cleanedMedicines =
        medicines
          .filter(
            (medicine) =>
              medicine?.name?.trim()
          )
          .map(
            (medicine) => ({
              medicine:
                medicine.medicineId,

              name:
                medicine.name.trim(),

              dosage:
                medicine.dosage?.trim() ||
                "",

              duration:
                medicine.duration?.trim() ||
                "",

              instructions:
                medicine.instructions?.trim() ||
                "",
            })
          );

      const payload = {
        doctorName:
          doctorName.trim(),

        date:
          date || undefined,

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
          cleanedMedicines,

        advice:
          advice.trim(),
      };

      const response =
        await API.put(
          `/prescriptions/${selected._id}`,
          payload
        );

      const updated =
        response?.data?.prescription ||
        response?.data?.data;

      if (!updated) {
        throw new Error(
          "Updated prescription was not returned"
        );
      }

      setSelected(updated);

      toast.success(
        "Prescription updated successfully"
      );

      await fetchHistory();

      setMode("view");
    } catch (error) {
      console.error(
        "UPDATE PRESCRIPTION ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update prescription"
      );
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // DELETE
  // ===================================================

  const handleDelete = async (
    id
  ) => {
    const result =
      await Swal.fire({
        title:
          "Delete Prescription?",

        text:
          "This prescription will be permanently deleted!",

        icon: "warning",

        showCancelButton:
          true,

        confirmButtonText:
          "Yes, Delete",

        cancelButtonText:
          "Cancel",
      });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await API.delete(
        `/prescriptions/${id}`
      );

      toast.success(
        "Prescription deleted successfully"
      );

      if (
        selected?._id === id
      ) {
        setSelected(null);
        setMode("list");
      }

      await fetchHistory();
    } catch (error) {
      console.error(
        "DELETE PRESCRIPTION ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete prescription"
      );
    }
  };

  // ===================================================
  // PRINT
  // ===================================================

  const handlePrint = () => {
    const printContents =
      printRef.current?.outerHTML;

    if (!printContents) {
      toast.error(
        "Prescription preview not available"
      );
      return;
    }

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=900,height=1000"
      );

    if (!printWindow) {
      toast.error(
        "Please allow popup to print prescription"
      );
      return;
    }

    const linkTags =
      Array.from(
        document.querySelectorAll(
          'link[rel="stylesheet"]'
        )
      )
        .map(
          (link) =>
            `<link rel="stylesheet" href="${link.href}">`
        )
        .join("\n");

    const styleTags =
      Array.from(
        document.querySelectorAll(
          "style"
        )
      )
        .map(
          (style) =>
            style.outerHTML
        )
        .join("\n");

    printWindow.document.write(`
      <html>
        <head>
          <title>Prescription</title>

          ${linkTags}

          ${styleTags}

          <style>
            html,
            body {
              margin: 0;
              padding: 0;
              background: white;
            }
          </style>
        </head>

        <body>
          ${printContents}
        </body>
      </html>
    `);

    printWindow.document.close();

    const styleLinks =
      printWindow.document.querySelectorAll(
        'link[rel="stylesheet"]'
      );

    let loaded = 0;

    const total =
      styleLinks.length;

    let printed = false;

    const triggerPrint = () => {
      if (printed) return;

      printed = true;

      printWindow.focus();

      setTimeout(() => {
        printWindow.print();

        setTimeout(() => {
          printWindow.close();
        }, 300);
      }, 100);
    };

    if (total === 0) {
      setTimeout(
        triggerPrint,
        200
      );
    } else {
      styleLinks.forEach(
        (link) => {
          link.addEventListener(
            "load",
            () => {
              loaded += 1;

              if (
                loaded === total
              ) {
                triggerPrint();
              }
            }
          );

          link.addEventListener(
            "error",
            () => {
              loaded += 1;

              if (
                loaded === total
              ) {
                triggerPrint();
              }
            }
          );
        }
      );

      setTimeout(
        triggerPrint,
        1500
      );
    }
  };

  // ===================================================
  // BACK TO HISTORY
  // ===================================================

  const backToHistory =
    async () => {
      setSelected(null);
      setMode("list");
      setOpenMedicineSearch(null);

      await fetchHistory();
    };

  // ===================================================
  // MEDICINE DISPLAY HELPERS
  // ===================================================

  const getMedicineBrand = (
    medicine
  ) => {
    return (
      medicine?.brand ||
      medicine?.manufacturer ||
      ""
    );
  };

  const getMedicineComposition = (
    medicine
  ) => {
    return (
      medicine?.composition ||
      medicine?.genericName ||
      ""
    );
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <div
      className="rx-history-overlay"
      onMouseDown={() =>
        setOpenMedicineSearch(null)
      }
    >
      <div
        className="rx-history-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="rx-history-header">

          {mode === "view" ||
          mode === "edit" ? (
            <div className="rx-history-title-left">

              <button
                type="button"
                className="rx-history-back"
                onClick={
                  backToHistory
                }
              >
                <ArrowLeft
                  size={18}
                />

                Back to history
              </button>

              <div className="rx-mode-title">
                <h2>
                  {mode === "edit"
                    ? "Edit Prescription"
                    : "Prescription Details"}
                </h2>

                <p>
                  {patient?.name}
                </p>
              </div>

            </div>
          ) : (
            <div>
              <h2>
                Prescription History
              </h2>

              <p>
                {patient?.name}
              </p>
            </div>
          )}

          <div className="rx-history-header-actions">

            {mode === "view" && (
              <button
                type="button"
                className="rx-edit-toggle-btn"
                onClick={
                  handleOpenEdit
                }
              >
                <Pencil
                  size={16}
                />

                Edit
              </button>
            )}

            <button
              type="button"
              className="close-btn"
              onClick={
                onClose
              }
            >
              <X size={20} />
            </button>

          </div>
        </div>

        {/* =================================================
            BODY
        ================================================= */}

        <div className="rx-history-body">

          {/* =================================================
              VIEW MODE
          ================================================= */}

          {mode === "view" &&
            selected && (
              <div className="rx-history-view">

                <PrescriptionPad
                  ref={printRef}
                  prescription={
                    selected
                  }
                />

                <div className="rx-history-view-actions">

                  <button
                    type="button"
                    className="rx-history-back-bottom"
                    onClick={
                      backToHistory
                    }
                  >
                    <ArrowLeft
                      size={16}
                    />

                    Back to History
                  </button>

                  <button
                    type="button"
                    className="primary-btn rx-print-btn"
                    onClick={
                      handlePrint
                    }
                  >
                    <Printer
                      size={16}
                    />

                    Print
                  </button>

                </div>
              </div>
            )}

          {/* =================================================
              EDIT MODE
          ================================================= */}

          {mode === "edit" && (
            <form
              className="rx-edit-form"
              onSubmit={
                handleSaveEdit
              }
            >

              {/* =========================================
                  PATIENT INFORMATION
              ========================================= */}

              <div className="rx-edit-grid">

                <div className="rx-edit-card">

                  <div className="rx-edit-card-title">
                    <User size={18} />

                    <span>
                      Patient Information
                    </span>
                  </div>

                  <div className="rx-field-grid three">

                    <div className="rx-field">
                      <label>
                        Patient Name
                      </label>

                      <input
                        type="text"
                        value={
                          patient?.name ||
                          selected?.patientName ||
                          ""
                        }
                        readOnly
                      />
                    </div>

                    <div className="rx-field">
                      <label>
                        Age
                      </label>

                      <input
                        type="text"
                        value={
                          patient?.age ??
                          selected?.patientAge ??
                          ""
                        }
                        readOnly
                      />
                    </div>

                    <div className="rx-field">
                      <label>
                        Gender
                      </label>

                      <input
                        type="text"
                        value={
                          patient?.gender ||
                          selected?.patientGender ||
                          ""
                        }
                        readOnly
                      />
                    </div>

                  </div>

                  <div className="rx-field">

                    <label>
                      Address
                    </label>

                    <input
                      type="text"
                      value={
                        patient?.address ||
                        selected?.patientAddress ||
                        "N/A"
                      }
                      readOnly
                    />

                  </div>

                </div>

                {/* =======================================
                    DOCTOR INFO
                ======================================= */}

                <div className="rx-edit-card">

                  <div className="rx-edit-card-title">
                    <Stethoscope
                      size={18}
                    />

                    <span>
                      Doctor & Visit Info
                    </span>
                  </div>

                  <div className="rx-field-grid">

                    <div className="rx-field">
                      <label>
                        Doctor Name *
                      </label>

                      <input
                        type="text"
                        value={
                          doctorName
                        }
                        onChange={(e) =>
                          setDoctorName(
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="rx-field">
                      <label>
                        Date
                      </label>

                      <div className="rx-input-icon">

                        <CalendarDays
                          size={16}
                        />

                        <input
                          type="date"
                          value={date}
                          onChange={(e) =>
                            setDate(
                              e.target.value
                            )
                          }
                        />

                      </div>
                    </div>

                  </div>

                  <div className="rx-field">

                    <label>
                      Vitals
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. BP 120/80, Temp 98.6, Pulse 72"
                      value={
                        vitals
                      }
                      onChange={(e) =>
                        setVitals(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

              </div>

              {/* =========================================
                  CHIEF COMPLAINTS
              ========================================= */}

              <div className="rx-form-section">

                <div className="rx-section-heading">

                  <div>
                    <ClipboardList
                      size={18}
                    />

                    <div>
                      <strong>
                        Chief Complaints
                      </strong>

                      <small>
                        Patient's complaints / symptoms
                      </small>
                    </div>
                  </div>

                </div>

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
                        value={
                          complaint
                        }
                        placeholder="e.g. Fever since 3 days"
                        onChange={(e) =>
                          updateListItem(
                            complaints,
                            setComplaints,
                            index,
                            e.target.value
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
                  <Plus
                    size={14}
                  />

                  Add Complaint
                </button>

              </div>

              {/* =========================================
                  INVESTIGATIONS
              ========================================= */}

              <div className="rx-form-section">

                <div className="rx-section-heading">

                  <div>
                    <FlaskConical
                      size={18}
                    />

                    <div>
                      <strong>
                        Investigations
                      </strong>

                      <small>
                        Tests / investigations
                      </small>
                    </div>
                  </div>

                </div>

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
                        value={
                          investigation
                        }
                        placeholder="e.g. CBC, Blood Sugar, X-Ray Chest"
                        onChange={(e) =>
                          updateListItem(
                            investigations,
                            setInvestigations,
                            index,
                            e.target.value
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
                  <Plus
                    size={14}
                  />

                  Add Investigation
                </button>

              </div>

              {/* =========================================
                  MEDICINES RX
              ========================================= */}

              <div className="rx-form-section rx-medicines-section">

                <div className="rx-section-heading">

                  <div>
                    <Pill
                      size={18}
                    />

                    <div>
                      <strong>
                        Medicines (Rx)
                      </strong>

                      <small>
                        Search and select medicines from pharmacy inventory
                      </small>
                    </div>
                  </div>

                  <span className="rx-medicine-count">

                    {medicinesLoading
                      ? "Loading..."
                      : `${availableMedicines.length} medicines available`}

                  </span>

                </div>

                <div className="rx-medicine-table">

                  <div className="rx-medicine-table-head">

                    <span>
                      #
                    </span>

                    <span>
                      Medicine *
                    </span>

                    <span>
                      Dosage
                    </span>

                    <span>
                      Duration
                    </span>

                    <span>
                      Instructions
                    </span>

                    <span>
                      Action
                    </span>

                  </div>

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
                          className="rx-medicine-table-row"
                          key={index}
                        >

                          {/* NUMBER */}

                          <div className="rx-medicine-number">
                            {index + 1}
                          </div>

                          {/* MEDICINE SEARCH */}

                          <div className="rx-medicine-search">

                            <div className="rx-search-input-wrap">

                              <Search
                                size={17}
                              />

                              <input
                                type="text"
                                placeholder="Type medicine name..."
                                value={
                                  medicineSearch[
                                    index
                                  ] ??
                                  medicine.name ??
                                  ""
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
                                autoComplete="off"
                              />

                              {medicine.name && (
                                <button
                                  type="button"
                                  className="rx-search-clear"
                                  onMouseDown={(
                                    e
                                  ) =>
                                    e.preventDefault()
                                  }
                                  onClick={() => {

                                    setMedicineSearch(
                                      (
                                        previous
                                      ) => ({
                                        ...previous,
                                        [index]:
                                          "",
                                      })
                                    );

                                    updateMedicine(
                                      index,
                                      "name",
                                      ""
                                    );

                                    updateMedicine(
                                      index,
                                      "medicineId",
                                      ""
                                    );

                                    setOpenMedicineSearch(
                                      index
                                    );
                                  }}
                                >
                                  <X
                                    size={15}
                                  />
                                </button>
                              )}

                            </div>

                            {/* SEARCH DROPDOWN */}

                            {openMedicineSearch ===
                              index && (
                              <div
                                className="rx-medicine-dropdown"
                                onMouseDown={(
                                  e
                                ) =>
                                  e.stopPropagation()
                                }
                              >

                                {medicinesLoading ? (
                                  <div className="rx-medicine-dropdown-message">
                                    Loading pharmacy medicines...
                                  </div>
                                ) : filtered.length ===
                                  0 ? (
                                  <div className="rx-medicine-dropdown-message">

                                    <Pill
                                      size={18}
                                    />

                                    <span>
                                      No medicine found
                                    </span>

                                  </div>
                                ) : (
                                  filtered.map(
                                    (
                                      pharmacyMedicine
                                    ) => (
                                      <button
                                        type="button"
                                        className="rx-medicine-option"
                                        key={
                                          pharmacyMedicine._id
                                        }
                                        onMouseDown={(
                                          e
                                        ) => {
                                          e.preventDefault();

                                          selectMedicine(
                                            index,
                                            pharmacyMedicine
                                          );
                                        }}
                                      >

                                        <div className="rx-medicine-option-main">

                                          <div className="rx-medicine-option-title">

                                            <Pill
                                              size={17}
                                            />

                                            <strong>
                                              {
                                                pharmacyMedicine.name
                                              }
                                            </strong>

                                          </div>

                                          <div className="rx-medicine-option-details">

                                            {getMedicineBrand(
                                              pharmacyMedicine
                                            ) && (
                                              <span>
                                                {
                                                  getMedicineBrand(
                                                    pharmacyMedicine
                                                  )
                                                }
                                              </span>
                                            )}

                                            {getMedicineComposition(
                                              pharmacyMedicine
                                            ) && (
                                              <span>
                                                {
                                                  getMedicineComposition(
                                                    pharmacyMedicine
                                                  )
                                                }
                                              </span>
                                            )}

                                            {pharmacyMedicine.batchNumber && (
                                              <span>
                                                Batch:{" "}
                                                {
                                                  pharmacyMedicine.batchNumber
                                                }
                                              </span>
                                            )}

                                          </div>

                                        </div>

                                        <span className="rx-stock-badge">

                                          Stock:{" "}
                                          {pharmacyMedicine.quantity ??
                                            pharmacyMedicine.stock ??
                                            0}

                                        </span>

                                      </button>
                                    )
                                  )
                                )}

                              </div>
                            )}

                          </div>

                          {/* DOSAGE */}

                          <input
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
                            className="rx-remove-btn"
                            onClick={() =>
                              removeMedicine(
                                index
                              )
                            }
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

                <button
                  type="button"
                  className="rx-add-btn"
                  onClick={
                    addMedicine
                  }
                >
                  <Plus
                    size={14}
                  />

                  Add Medicine
                </button>

              </div>

              {/* =========================================
                  ADVICE
              ========================================= */}

              <div className="rx-form-section">

                <div className="rx-section-heading">

                  <div>
                    <FileText
                      size={18}
                    />

                    <div>
                      <strong>
                        Advice / Follow-up
                      </strong>

                      <small>
                        Instructions for patient
                      </small>
                    </div>
                  </div>

                </div>

                <textarea
                  placeholder="e.g. Take rest, Drink plenty of water, Follow up after 5 days"
                  value={
                    advice
                  }
                  onChange={(e) =>
                    setAdvice(
                      e.target.value
                    )
                  }
                />

              </div>

              {/* =========================================
                  ACTIONS
              ========================================= */}

              <div className="rx-edit-actions">

                <button
                  type="button"
                  className="rx-cancel-btn"
                  onClick={() =>
                    setMode("view")
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={
                    saving
                  }
                >
                  <Save
                    size={17}
                  />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>
          )}

          {/* =================================================
              LIST MODE
          ================================================= */}

          {mode === "list" &&
            (loading ? (
              <div className="rx-history-loading">
                Loading prescription history...
              </div>
            ) : prescriptions.length ===
              0 ? (
              <div className="rx-history-empty">

                <FileText
                  size={42}
                />

                <h3>
                  No prescription history
                </h3>

                <p>
                  Saved prescriptions for this
                  patient will appear here.
                </p>

              </div>
            ) : (
              <div className="rx-history-list">

                {prescriptions.map(
                  (prescription) => {

                    const medicineCount =
                      prescription
                        .medicines
                        ?.length || 0;

                    const prescriptionDate =
                      prescription.date ||
                      prescription.createdAt;

                    return (
                      <div
                        key={
                          prescription._id
                        }
                        className="rx-history-item"
                        onClick={() =>
                          handleView(
                            prescription._id
                          )
                        }
                      >

                        <div className="rx-history-item-info">

                          <div className="rx-history-file-icon">
                            <FileText
                              size={20}
                            />
                          </div>

                          <div>

                            <strong>
                              {new Date(
                                prescriptionDate
                              ).toLocaleDateString(
                                "en-IN"
                              )}
                            </strong>

                            <span>
                              Doctor:{" "}
                              {prescription.doctorName ||
                                "N/A"}
                            </span>

                            <small>
                              {medicineCount} Medicine
                              {medicineCount !==
                              1
                                ? "s"
                                : ""}
                            </small>

                          </div>

                        </div>

                        <div className="rx-history-item-actions">

                          <button
                            type="button"
                            className="edit-btn"
                            onClick={(event) => {
                              event.stopPropagation();

                              handleView(
                                prescription._id
                              );
                            }}
                            title="View Prescription"
                          >
                            <FileText
                              size={16}
                            />
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={(event) => {
                              event.stopPropagation();

                              handleDelete(
                                prescription._id
                              );
                            }}
                            title="Delete Prescription"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            ))}

        </div>
      </div>
    </div>
  );
}