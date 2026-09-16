import { useEffect, useState } from "react";
import API from "../services/api";
import {
  Pencil,
  Mail,
  Phone,
  Briefcase,
  Camera,
  X,
  Clock3,
  CalendarDays,
  
  Building2,
  Stethoscope,
} from "lucide-react";
import { toast } from "react-toastify";
import "./DoctorProfile.css";

const FILE_BASE = "https://hostbackend-surl.onrender.com";

const WEEK_DAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

export default function DoctorProfile() {

  const [doctor, setDoctor] = useState(null);

  const [showEdit, setShowEdit] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [photoFile, setPhotoFile] =
    useState(null);

  const [photoPreview, setPhotoPreview] =
    useState("");

  const [profileForm, setProfileForm] =
    useState({
      name: "",
      email: "",
      phone: "",
      department: "",
      specialization: "",
      experience: "",
      availableDays: [],
      availableTime: "",
      bio: "",
      linkedin: "",
      password: "",
    });


  // ================= FETCH PROFILE =================

  useEffect(() => {
    fetchProfile();
  }, []);


  const fetchProfile = async () => {

    try {

      const res =
        await API.get("/doctors/me");

      setDoctor(res.data.doctor);

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load your profile"
      );

    }

  };


  // ================= OPEN EDIT =================

  const openEdit = () => {

    if (!doctor) return;

    setProfileForm({

      name: doctor.name || "",

      email: doctor.email || "",

      phone: doctor.phone || "",

      department:
        doctor.department || "",

      specialization:
        doctor.specialization || "",

      experience:
        doctor.experience ?? "",

      availableDays:
        doctor.availableDays || [],

      availableTime:
        doctor.availableTime || "",

      bio:
        doctor.bio || "",

      linkedin:
        doctor.linkedin || "",

      password: "",
    });


    setPhotoFile(null);


    setPhotoPreview(
      doctor.photo
        ? `${FILE_BASE}${doctor.photo}`
        : ""
    );


    setShowEdit(true);

  };


  // ================= FORM CHANGE =================

  const handleProfileChange = (e) => {

    setProfileForm((prev) => ({
      ...prev,

      [e.target.name]:
        e.target.value,
    }));

  };


  // ================= DAYS =================

  const toggleDay = (day) => {

    setProfileForm((prev) => ({

      ...prev,

      availableDays:
        prev.availableDays.includes(day)

          ? prev.availableDays.filter(
              (d) => d !== day
            )

          : [
              ...prev.availableDays,
              day,
            ],
    }));

  };


  // ================= PHOTO =================

  const handlePhotoChange = (e) => {

    const file =
      e.target.files?.[0];

    if (!file) return;

    setPhotoFile(file);

    setPhotoPreview(
      URL.createObjectURL(file)
    );

  };


  // ================= SAVE =================

  const handleProfileSave =
    async (e) => {

      e.preventDefault();


      if (
        !profileForm.name.trim() ||
        !profileForm.email.trim()
      ) {

        toast.error(
          "Name and email are required"
        );

        return;
      }


      try {

        setSaving(true);


        const fd =
          new FormData();


        fd.append(
          "name",
          profileForm.name
        );

        fd.append(
          "email",
          profileForm.email
        );

        fd.append(
          "phone",
          profileForm.phone
        );

        fd.append(
          "department",
          profileForm.department
        );

        fd.append(
          "specialization",
          profileForm.specialization
        );

        fd.append(
          "experience",
          profileForm.experience
        );

        fd.append(
          "availableDays",
          JSON.stringify(
            profileForm.availableDays
          )
        );

        fd.append(
          "availableTime",
          profileForm.availableTime
        );

        fd.append(
          "bio",
          profileForm.bio
        );

        fd.append(
          "linkedin",
          profileForm.linkedin
        );


        if (
          profileForm.password.trim()
        ) {

          fd.append(
            "password",
            profileForm.password
          );

        }


        if (photoFile) {

          fd.append(
            "photo",
            photoFile
          );

        }


        const res =
          await API.put(
            "/doctors/me",
            fd,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );


        const updatedDoctor =
          res.data.doctor;


        setDoctor(updatedDoctor);


        // Update local storage

        const stored =
          JSON.parse(
            localStorage.getItem(
              "user"
            ) || "{}"
          );


        localStorage.setItem(
          "user",
          JSON.stringify({
            ...stored,

            name:
              updatedDoctor.name,

            email:
              updatedDoctor.email,
          })
        );


        toast.success(
          "Profile updated successfully!"
        );


        setShowEdit(false);

      } catch (error) {

        console.error(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Failed to update profile"
        );

      } finally {

        setSaving(false);

      }

    };


  // ================= LOADING =================

  if (!doctor) {

    return (
      <div className="doc-profile-loading">
        Loading profile...
      </div>
    );

  }


  return (
    <div className="doctor-profile-page">


      {/* ================= HEADER ================= */}

      <div className="doctor-profile-page-header">

        <div>

          <h1>My Profile</h1>

          <p>
            Manage your professional
            information and availability.
          </p>

        </div>


        <button
          className="profile-main-edit-btn"
          onClick={openEdit}
        >

          <Pencil size={17} />

          Edit Profile

        </button>

      </div>


      {/* ================= PROFILE HERO ================= */}

      <div className="doctor-profile-hero">

        <div className="doctor-profile-big-photo">

          {doctor.photo ? (

            <img
              src={`${FILE_BASE}${doctor.photo}`}
              alt={doctor.name}
            />

          ) : (

            <span>
              {doctor.name
                ?.charAt(0)
                .toUpperCase()}
            </span>

          )}

        </div>


        <div className="doctor-profile-hero-info">

          <h2>
            Dr. {doctor.name}
          </h2>


          <p className="doctor-specialization">

            {doctor.specialization ||
              "Doctor"}

          </p>


          <div className="doctor-contact-row">

            <span>

              <Mail size={16} />

              {doctor.email}

            </span>


            <span>

              <Phone size={16} />

              {doctor.phone ||
                "Phone not added"}

            </span>

          </div>

        </div>

      </div>


      {/* ================= INFORMATION ================= */}

      <div className="doctor-profile-section">

        <h2>Professional Information</h2>

        <div className="doctor-info-grid">


          <div className="doctor-info-box">

            <div className="doctor-info-icon">
              <Stethoscope size={20} />
            </div>

            <div>

              <span>
                Specialization
              </span>

              <strong>
                {doctor.specialization ||
                  "Not added"}
              </strong>

            </div>

          </div>


          <div className="doctor-info-box">

            <div className="doctor-info-icon">
              <Building2 size={20} />
            </div>

            <div>

              <span>
                Department
              </span>

              <strong>
                {doctor.department ||
                  "Not added"}
              </strong>

            </div>

          </div>


          <div className="doctor-info-box">

            <div className="doctor-info-icon">
              <Briefcase size={20} />
            </div>

            <div>

              <span>
                Experience
              </span>

              <strong>
                {doctor.experience || 0}
                {" "}Years
              </strong>

            </div>

          </div>


          <div className="doctor-info-box">

            <div className="doctor-info-icon">
              <Clock3 size={20} />
            </div>

            <div>

              <span>
                Available Time
              </span>

              <strong>
                {doctor.availableTime ||
                  "Not added"}
              </strong>

            </div>

          </div>


        </div>

      </div>


      {/* ================= AVAILABILITY ================= */}

      <div className="doctor-profile-section">

        <h2>Availability</h2>

        <div className="availability-box">


          <div>

            <span className="availability-label">
              <CalendarDays size={17} />

              Available Days
            </span>


            <div className="profile-days">

              {WEEK_DAYS.map((day) => (

                <span
                  key={day}
                  className={
                    doctor.availableDays?.includes(
                      day
                    )
                      ? "profile-day active"
                      : "profile-day"
                  }
                >
                  {day}
                </span>

              ))}

            </div>

          </div>


          <div className="profile-time-box">

            <span>
              <Clock3 size={17} />

              Timing
            </span>

            <strong>
              {doctor.availableTime ||
                "Not added"}
            </strong>

          </div>


        </div>

      </div>


      {/* ================= BIO ================= */}

      <div className="doctor-profile-section">

        <h2>About Doctor</h2>

        <div className="doctor-bio-box">

          {doctor.bio ? (
            <p>{doctor.bio}</p>
          ) : (
            <p className="empty-profile-text">
              No biography added yet.
            </p>
          )}

        </div>

      </div>


      {/* ================= LINKEDIN ================= */}

      {doctor.linkedin && (

        <div className="doctor-profile-section">

          <h2>Professional Links</h2>

          <a
            href={doctor.linkedin}
            target="_blank"
            rel="noreferrer"
            className="doctor-linkedin"
          >

           <Briefcase size={19} />

            View LinkedIn Profile

          </a>

        </div>

      )}


      {/* ================= EDIT MODAL ================= */}

      {showEdit && (

        <div className="doc-edit-overlay">

          <div className="doc-edit-modal">


            <div className="doc-edit-header">

              <h2>
                Edit Profile
              </h2>

              <button
                className="doc-close-btn"
                onClick={() =>
                  setShowEdit(false)
                }
              >

                <X size={20} />

              </button>

            </div>


            <form
              className="doc-edit-form"
              onSubmit={
                handleProfileSave
              }
            >


              {/* PHOTO */}

              <div className="doc-photo-upload">

                <div className="doc-photo-preview">

                  {photoPreview ? (

                    <img
                      src={photoPreview}
                      alt="Preview"
                    />

                  ) : (

                    <span>
                      {profileForm.name
                        ?.charAt(0)
                        .toUpperCase() ||
                        "?"}
                    </span>

                  )}

                </div>


                <label className="doc-photo-label">

                  <Camera size={15} />

                  Change Photo

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handlePhotoChange
                    }
                    hidden
                  />

                </label>

              </div>


              {/* FORM GRID */}

              <div className="doc-edit-grid">


                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={
                    profileForm.name
                  }
                  onChange={
                    handleProfileChange
                  }
                  required
                />


                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={
                    profileForm.email
                  }
                  onChange={
                    handleProfileChange
                  }
                  required
                />


                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={
                    profileForm.phone
                  }
                  onChange={
                    handleProfileChange
                  }
                />


                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={
                    profileForm.department
                  }
                  onChange={
                    handleProfileChange
                  }
                />


                <input
                  type="text"
                  name="specialization"
                  placeholder="Specialization"
                  value={
                    profileForm.specialization
                  }
                  onChange={
                    handleProfileChange
                  }
                />


                <input
                  type="number"
                  name="experience"
                  placeholder="Years of Experience"
                  value={
                    profileForm.experience
                  }
                  onChange={
                    handleProfileChange
                  }
                  min="0"
                />


                <input
                  type="text"
                  name="availableTime"
                  placeholder="Available Time (e.g. 10 AM - 4 PM)"
                  value={
                    profileForm.availableTime
                  }
                  onChange={
                    handleProfileChange
                  }
                />


                <input
                  type="url"
                  name="linkedin"
                  placeholder="LinkedIn URL"
                  value={
                    profileForm.linkedin
                  }
                  onChange={
                    handleProfileChange
                  }
                />


                <input
                  type="password"
                  name="password"
                  placeholder="New Password"
                  value={
                    profileForm.password
                  }
                  onChange={
                    handleProfileChange
                  }
                />

              </div>


              {/* DAYS */}

              <div className="doc-days-picker">

                <label>
                  Available Days
                </label>


                <div className="doc-days-row">

                  {WEEK_DAYS.map(
                    (day) => (

                      <button
                        type="button"
                        key={day}
                        className={`doc-day-chip ${
                          profileForm.availableDays.includes(
                            day
                          )
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          toggleDay(day)
                        }
                      >
                        {day}
                      </button>

                    )
                  )}

                </div>

              </div>


              {/* BIO */}

              <textarea
                name="bio"
                placeholder="Short bio"
                value={
                  profileForm.bio
                }
                onChange={
                  handleProfileChange
                }
              />


              {/* SAVE */}

              <button
                className="doc-save-btn"
                type="submit"
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : "Save Changes"}

              </button>


            </form>

          </div>

        </div>

      )}

    </div>
  );
}