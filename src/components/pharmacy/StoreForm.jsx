import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import "./StoreForm.css";

export default function StoreForm({
  store,
  onSubmit,
  onClose,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    managerName: "",
    status: "active",
  });

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name || "",
        code: store.code || "",
        address: store.address || "",
        city: store.city || "",
        state: store.state || "",
        pincode: store.pincode || "",
        phone: store.phone || "",
        email: store.email || "",
        managerName: store.managerName || "",
        status: store.status || "active",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        email: "",
        managerName: "",
        status: "active",
      });
    }
  }, [store]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      code: formData.code.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      managerName: formData.managerName.trim(),
    });
  };

  return (
    <div className="store-modal-overlay">
      <div className="store-modal">

        <div className="store-modal-header">
          <div>
            <h2>{store ? "Edit Store" : "Add Store"}</h2>
            <p>
              {store
                ? "Update pharmacy store information."
                : "Add a new pharmacy store."}
            </p>
          </div>

          <button
            type="button"
            className="store-close-btn"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="store-form-grid">

            <div className="store-form-group">
              <label>
                Store Name <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter store name"
                required
              />
            </div>

            <div className="store-form-group">
              <label>Store Code</label>

              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g. PH-001"
              />
            </div>

            <div className="store-form-group store-full-width">
              <label>Address</label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter store address"
                rows="3"
              />
            </div>

            <div className="store-form-group">
              <label>City</label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </div>

            <div className="store-form-group">
              <label>State</label>

              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
              />
            </div>

            <div className="store-form-group">
              <label>Pincode</label>

              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                maxLength="6"
              />
            </div>

            <div className="store-form-group">
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="store-form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>

            <div className="store-form-group">
              <label>Manager Name</label>

              <input
                type="text"
                name="managerName"
                value={formData.managerName}
                onChange={handleChange}
                placeholder="Enter manager name"
              />
            </div>

            <div className="store-form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

          </div>

          <div className="store-form-actions">

            <button
              type="button"
              className="store-cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="store-save-btn"
              disabled={loading}
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save size={17} />
                  {store ? "Update Store" : "Save Store"}
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}