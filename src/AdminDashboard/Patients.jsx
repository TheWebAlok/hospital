import { useEffect, useState } from "react";
import API from "../services/api";
import { Plus, Trash2, X, Pencil, Search, FileText, History } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "./Patients.css";
import PrescriptionModal from "../components/Prescriptionmodal";
import PrescriptionHistoryModal from "../components/Prescriptionhistorymodal";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [search, setSearch] = useState("");

  // report / prescription modal
  const [reportPatient, setReportPatient] = useState(null);

  // view history modal
  const [historyPatient, setHistoryPatient] = useState(null);

  const initialForm = {
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "",
    medicalHistory: "",
    emergencyContact: "",
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchPatients();
  }, []);

  // ================= FETCH PATIENTS =================

  const fetchPatients = async () => {
    try {
      setLoading(true);

      const response = await API.get("/patients");

      setPatients(response.data.patients);
    } catch (error) {
      toast.error("Failed to fetch patients");
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

  // ================= ADD PATIENT =================

  const handleAdd = () => {
    setEditingPatient(null);
    setFormData(initialForm);
    setShowForm(true);
  };

  // ================= EDIT PATIENT =================

  const handleEdit = (patient) => {
    setEditingPatient(patient);

    setFormData({
      name: patient.name || "",
      age: patient.age || "",
      gender: patient.gender || "Male",
      phone: patient.phone || "",
      email: patient.email || "",
      address: patient.address || "",
      bloodGroup: patient.bloodGroup || "",
      medicalHistory: patient.medicalHistory || "",
      emergencyContact: patient.emergencyContact || "",
    });

    setShowForm(true);
  };

  // ================= ADD / UPDATE PATIENT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        age: Number(formData.age),
      };

      // UPDATE PATIENT

      if (editingPatient) {
        await API.put(`/patients/${editingPatient._id}`, data);

        toast.success("Patient updated successfully!");
      }

      // ADD PATIENT
      else {
        await API.post("/patients", data);

        toast.success("Patient added successfully!");
      }

      setShowForm(false);
      setEditingPatient(null);
      setFormData(initialForm);

      fetchPatients();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${editingPatient ? "update" : "add"} patient`
      );
    }
  };

  // ================= DELETE PATIENT =================

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Patient?",
      text: "This patient will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/patients/${id}`);

      toast.success("Patient deleted successfully!");

      fetchPatients();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete patient"
      );
    }
  };

  // ================= CLOSE MODAL =================

  const handleClose = () => {
    setShowForm(false);
    setEditingPatient(null);
    setFormData(initialForm);
  };

  // ================= SEARCH PATIENTS =================

  const filteredPatients = patients.filter((patient) => {
    const searchText = search.toLowerCase();

    return (
      patient.name?.toLowerCase().includes(searchText) ||
      patient.phone?.toLowerCase().includes(searchText) ||
      patient.bloodGroup?.toLowerCase().includes(searchText) ||
      patient.gender?.toLowerCase().includes(searchText)
    );
  });

  // ================= LOADING =================

  if (loading) {
    return <h2>Loading Patients...</h2>;
  }

  // ================= UI =================

  return (
      <div className="patients-page">
      {/* PAGE HEADER */}

      <div className="page-header page-header-row">
        <div>
          <h1>Patients</h1>
          <p>Manage hospital patients</p>
        </div>

        <div className="page-actions">
          {/* SEARCH */}

          <div className="search-box">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* ADD BUTTON */}

          <button className="primary-btn" onClick={handleAdd}>
            <Plus size={18} />
            Add Patient
          </button>
        </div>
      </div>

      {/* PATIENTS TABLE */}

      <div className="table-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Blood Group</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-message">
                    No patients found
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient._id}>
                    <td>{patient.name}</td>

                    <td>{patient.age}</td>

                    <td>{patient.gender}</td>

                    <td>{patient.phone}</td>

                    <td>{patient.bloodGroup || "-"}</td>

                    <td className="action-buttons">
                      {/* REPORT */}

                      <button
                        className="report-btn"
                        onClick={() => setReportPatient(patient)}
                        title="Create Report"
                      >
                        <FileText size={17} />
                      </button>

                      {/* VIEW HISTORY */}

                      <button
                        className="history-btn"
                        onClick={() => setHistoryPatient(patient)}
                        title="View History"
                      >
                        <History size={17} />
                      </button>

                      {/* EDIT */}

                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(patient)}
                        title="Edit Patient"
                      >
                        <Pencil size={17} />
                      </button>

                      {/* DELETE */}

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(patient._id)}
                        title="Delete Patient"
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

      {/* ADD / EDIT MODAL */}
      {/* NOTE: class names renamed to patient-modal-overlay / patient-modal
          to avoid clashing with Bootstrap's default `.modal { display: none; }`
          rule, which was hiding this modal even when showForm was true. */}

      {showForm && (
        <div className="patient-modal-overlay">
          <div className="patient-modal">
            <div className="patient-modal-header">
              <h2>{editingPatient ? "Edit Patient" : "Add Patient"}</h2>

              <button className="close-btn" onClick={handleClose}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="doctor-form">
              <input
                type="text"
                name="name"
                placeholder="Patient Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
              />

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />

              <input
                type="text"
                name="bloodGroup"
                placeholder="Blood Group (Example: B+)"
                value={formData.bloodGroup}
                onChange={handleChange}
              />

              <input
                type="text"
                name="emergencyContact"
                placeholder="Emergency Contact"
                value={formData.emergencyContact}
                onChange={handleChange}
              />

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />

              <textarea
                name="medicalHistory"
                placeholder="Medical History"
                value={formData.medicalHistory}
                onChange={handleChange}
              />

              <button className="primary-btn" type="submit">
                {editingPatient ? "Update Patient" : "Add Patient"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REPORT / PRESCRIPTION MODAL */}

      {reportPatient && (
        <PrescriptionModal
          patient={reportPatient}
          onClose={() => setReportPatient(null)}
        />
      )}

      {/* PATIENT HISTORY MODAL */}

      {historyPatient && (
        <PrescriptionHistoryModal
          patient={historyPatient}
          onClose={() => setHistoryPatient(null)}
        />
      )}
    </div>
  );
}