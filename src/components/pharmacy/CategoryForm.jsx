import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import "./CategoryForm.css";

export default function CategoryForm({
  category,
  onSubmit,
  onClose,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        status: category.status || "active",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        status: "active",
      });
    }
  }, [category]);

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
      name: formData.name.trim(),
      description: formData.description.trim(),
      status: formData.status,
    });
  };

  return (
    <div className="category-modal-overlay">
      <div className="category-modal">

        <div className="category-modal-header">
          <div>
            <h2>
              {category ? "Edit Category" : "Add Category"}
            </h2>

            <p>
              {category
                ? "Update medicine category details."
                : "Create a new medicine category."}
            </p>
          </div>

          <button
            type="button"
            className="category-close-btn"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="category-form-group">
            <label>
              Category Name <span>*</span>
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Antibiotics"
              required
            />
          </div>

          <div className="category-form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter category description"
              rows="4"
            />
          </div>

          <div className="category-form-group">
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

          <div className="category-form-actions">

            <button
              type="button"
              className="category-cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="category-save-btn"
              disabled={loading}
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save size={17} />
                  {category
                    ? "Update Category"
                    : "Save Category"}
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}