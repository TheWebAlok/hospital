import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import "./SupplierForm.css";

export default function SupplierForm({
  supplier,
  onSubmit,
  onClose,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
    status: "active",
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || "",
        companyName: supplier.companyName || "",
        contactPerson: supplier.contactPerson || "",
        phone: supplier.phone || "",
        email: supplier.email || "",
        address: supplier.address || "",
        city: supplier.city || "",
        state: supplier.state || "",
        pincode: supplier.pincode || "",
        gstNumber: supplier.gstNumber || "",
        status: supplier.status || "active",
      });
    } else {
      setFormData({
        name: "",
        companyName: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        gstNumber: "",
        status: "active",
      });
    }
  }, [supplier]);

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
      companyName: formData.companyName.trim(),
      contactPerson: formData.contactPerson.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
      gstNumber: formData.gstNumber.trim(),
    });
  };

  return (
    <div className="supplier-modal-overlay">
      <div className="supplier-modal">

        <div className="supplier-modal-header">
          <div>
            <h2>
              {supplier ? "Edit Supplier" : "Add Supplier"}
            </h2>

            <p>
              {supplier
                ? "Update supplier information."
                : "Add a new pharmacy supplier."}
            </p>
          </div>

          <button
            type="button"
            className="supplier-close-btn"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="supplier-form-grid">

            <div className="supplier-form-group">
              <label>
                Supplier Name <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter supplier name"
                required
              />
            </div>

            <div className="supplier-form-group">
              <label>Company Name</label>

              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </div>

            <div className="supplier-form-group">
              <label>Contact Person</label>

              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Enter contact person"
              />
            </div>

            <div className="supplier-form-group">
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="supplier-form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>

            <div className="supplier-form-group">
              <label>GST Number</label>

              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="Enter GST number"
              />
            </div>

            <div className="supplier-form-group supplier-full-width">
              <label>Address</label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter supplier address"
                rows="3"
              />
            </div>

            <div className="supplier-form-group">
              <label>City</label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </div>

            <div className="supplier-form-group">
              <label>State</label>

              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
              />
            </div>

            <div className="supplier-form-group">
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

            <div className="supplier-form-group">
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

          <div className="supplier-form-actions">

            <button
              type="button"
              className="supplier-cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="supplier-save-btn"
              disabled={loading}
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save size={17} />
                  {supplier
                    ? "Update Supplier"
                    : "Save Supplier"}
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}