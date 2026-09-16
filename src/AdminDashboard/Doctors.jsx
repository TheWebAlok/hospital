import { useEffect, useState } from "react";
import API from "../services/api";
import {
  Plus,
  Trash2,
  X,
  Pencil,
  Search,
  Eye,
  EyeOff,
  Camera,
  User,
} from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "./Doctors.css";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [search, setSearch] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // photo upload state
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const initialForm = {
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    specialization: "",
    experience: "",
    availableDays: "",
    availableTime: "",
    bio: "",
    linkedin: "",
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ================= FETCH DOCTORS =================

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const response = await API.get("/doctors");

      setDoctors(response.data.doctors);
    } catch (error) {
      toast.error("Failed to fetch doctors");
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

  // ================= HANDLE PHOTO SELECT =================

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const clearPhotoSelection = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  // ================= ADD DOCTOR =================

  const handleAdd = () => {
    setEditingDoctor(null);
    setFormData(initialForm);
    setShowPassword(false);
    clearPhotoSelection();
    setShowForm(true);
  };

  // ================= EDIT DOCTOR =================

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);

    setFormData({
      name: doctor.name || "",
      email: doctor.email || "",
      password: "", // left blank on purpose - only sent if admin sets a new one
      phone: doctor.phone || "",
      department: doctor.department || "",
      specialization: doctor.specialization || "",
      experience: doctor.experience || "",
      availableDays: Array.isArray(doctor.availableDays)
        ? doctor.availableDays.join(", ")
        : "",
      availableTime: doctor.availableTime || "",
      bio: doctor.bio || "",
      linkedin: doctor.linkedin || "",
    });

    setShowPassword(false);
    setPhotoFile(null);
    setPhotoPreview(doctor.photo ? buildPhotoUrl(doctor.photo) : null);
    setShowForm(true);
  };

  // ================= ADD / UPDATE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Don't send an empty password when editing - keeps the current one
      const passwordToSend =
        editingDoctor && !formData.password ? undefined : formData.password;

      const parsedDays = formData.availableDays
        .split(",")
        .map((day) => day.trim())
        .filter(Boolean);

      // Build multipart form data so the photo file rides along with
      // the rest of the fields in a single request.
      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("department", formData.department);
      payload.append("specialization", formData.specialization);
      payload.append("experience", Number(formData.experience) || 0);
      payload.append("availableDays", JSON.stringify(parsedDays));
      payload.append("availableTime", formData.availableTime);
      payload.append("bio", formData.bio);
      payload.append("linkedin", formData.linkedin);

      if (passwordToSend) {
        payload.append("password", passwordToSend);
      }

      if (photoFile) {
        payload.append("photo", photoFile);
      }

      // UPDATE DOCTOR
      if (editingDoctor) {
        await API.put(`/doctors/${editingDoctor._id}`, payload, {
          headers: { "Content-Type": undefined },
        });

        toast.success("Doctor updated successfully!");
      }
      // ADD DOCTOR
      else {
        await API.post("/doctors", payload, {
          headers: { "Content-Type": undefined },
        });

        toast.success("Doctor added successfully!");
      }

      setShowForm(false);
      setEditingDoctor(null);
      setFormData(initialForm);
      clearPhotoSelection();

      fetchDoctors();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${editingDoctor ? "update" : "add"} doctor`
      );
    }
  };

  // ================= DELETE DOCTOR =================

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Doctor?",
      text: "This doctor will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/doctors/${id}`);

      toast.success("Doctor deleted successfully!");

      fetchDoctors();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete doctor"
      );
    }
  };

  // ================= CLOSE MODAL =================

  const handleClose = () => {
    setShowForm(false);
    setEditingDoctor(null);
    setFormData(initialForm);
    clearPhotoSelection();
  };

  // ================= SEARCH DOCTORS =================

  const filteredDoctors = doctors.filter((doctor) => {
    const searchText = search.toLowerCase();

    return (
      doctor.name?.toLowerCase().includes(searchText) ||
      doctor.department?.toLowerCase().includes(searchText) ||
      doctor.specialization?.toLowerCase().includes(searchText)
    );
  });

  // Doctor photos are served statically off the API's origin, e.g.
  // API base "http://localhost:5000/api" -> files at "http://localhost:5000/uploads/..."
  const buildPhotoUrl = (photoPath) => {
    if (!photoPath) return null;

    const origin = API.defaults.baseURL.replace(/\/api\/?$/, "");

    return `${origin}${photoPath}`;
  };

  // ================= LOADING =================

  if (loading) {
    return <h2>Loading Doctors...</h2>;
  }

  // ================= UI =================

  return (
    <div>
      {/* PAGE HEADER */}

      <div className="page-header page-header-row">
        <div>
          <h1>Doctors</h1>
          <p>Manage hospital doctors</p>
        </div>

        <div className="page-actions">
          {/* SEARCH */}

          <div className="search-box">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search doctors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* ADD BUTTON */}

          <button className="primary-btn" onClick={handleAdd}>
            <Plus size={18} />
            Add Doctor
          </button>
        </div>
      </div>

      {/* DOCTORS TABLE */}

      <div className="table-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Department</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-message">
                    No doctors found
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doctor) => (
                  <tr key={doctor._id}>
                    <td>
                      <div className="doctor-thumb">
                        {doctor.photo ? (
                          <img
                            src={buildPhotoUrl(doctor.photo)}
                            alt={doctor.name}
                          />
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                    </td>

                    <td>{doctor.name}</td>

                    <td>{doctor.department}</td>

                    <td>{doctor.specialization}</td>

                    <td>{doctor.experience} Years</td>

                    <td>{doctor.phone}</td>

                    <td className="action-buttons">
                      {/* EDIT */}

                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(doctor)}
                        title="Edit Doctor"
                      >
                        <Pencil size={17} />
                      </button>

                      {/* DELETE */}

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(doctor._id)}
                        title="Delete Doctor"
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

      {showForm && (
        <div className="doctor-modal-overlay">
          <div className="doctor-modal">
            {/* HEADER */}

            <div className="doctor-modal-header">
              <h2>{editingDoctor ? "Edit Doctor" : "Add Doctor"}</h2>

              <button
                type="button"
                className="doctor-close-btn"
                onClick={handleClose}
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="doctor-form">
              {/* PHOTO UPLOAD */}

              <div className="photo-upload-field">
                <div className="photo-upload-preview">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Doctor preview" />
                  ) : (
                    <User size={30} />
                  )}
                </div>

                <label className="photo-upload-btn">
                  <Camera size={15} />
                  {photoPreview ? "Change Photo" : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    hidden
                  />
                </label>
              </div>

              <input
                type="text"
                name="name"
                placeholder="Doctor Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              {/* PASSWORD */}

              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={
                    editingDoctor
                      ? "New Password (leave blank to keep current)"
                      : "Password (used for doctor login)"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  required={!editingDoctor}
                  minLength={6}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="experience"
                placeholder="Experience (Years)"
                value={formData.experience}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="availableDays"
                placeholder="Available Days (Monday, Tuesday)"
                value={formData.availableDays}
                onChange={handleChange}
              />

              <input
                type="text"
                name="availableTime"
                placeholder="Available Time"
                value={formData.availableTime}
                onChange={handleChange}
              />

              <input
                type="url"
                name="linkedin"
                placeholder="LinkedIn Profile URL (optional)"
                value={formData.linkedin}
                onChange={handleChange}
              />

              <textarea
                name="bio"
                placeholder="Short bio shown on the public Doctors page"
                value={formData.bio}
                onChange={handleChange}
                style={{ gridColumn: "1 / -1" }}
              />

              <button className="primary-btn" type="submit">
                {editingDoctor ? "Update Doctor" : "Add Doctor"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}