import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  FolderOpen,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/pharmacyApi";

import CategoryForm from "../../components/pharmacy/CategoryForm";
import "./Categories.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const extractArray = (response) => {
    const data = response?.data ?? response;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.categories)) return data.categories;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.results)) return data.results;

    return [];
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCategories();

      setCategories(extractArray(response));
    } catch (err) {
      console.error("Category loading error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return categories;

    return categories.filter((category) => {
      return (
        String(category.name || "")
          .toLowerCase()
          .includes(term) ||
        String(category.description || "")
          .toLowerCase()
          .includes(term)
      );
    });
  }, [categories, search]);

  const activeCategories = categories.filter(
    (category) => category.status !== "inactive"
  ).length;

  const inactiveCategories = categories.filter(
    (category) => category.status === "inactive"
  ).length;

  const handleAdd = () => {
    setEditingCategory(null);
    setShowForm(true);
    setError("");
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError("");

      if (editingCategory?._id) {
        await updateCategory(editingCategory._id, formData);
      } else {
        await createCategory(formData);
      }

      setShowForm(false);
      setEditingCategory(null);

      await loadCategories();
    } catch (err) {
      console.error("Category save error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save category"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteCategory(category._id);

      setCategories((prev) =>
        prev.filter((item) => item._id !== category._id)
      );
    } catch (err) {
      console.error("Category delete error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete category"
      );
    }
  };

  return (
    <div className="categories-page">

      {/* Header */}
      <div className="categories-header">
        <div>
          <h1>Medicine Categories</h1>
          <p>Manage categories used for pharmacy medicines.</p>
        </div>

        <div className="categories-header-actions">
          <button
            className="category-refresh-btn"
            onClick={loadCategories}
            disabled={loading}
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            className="category-primary-btn"
            onClick={handleAdd}
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="categories-error">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="categories-stats">

        <div className="category-stat-card">
          <div className="category-stat-icon">
            <FolderOpen size={22} />
          </div>

          <div>
            <span>Total Categories</span>
            <strong>{categories.length}</strong>
          </div>
        </div>

        <div className="category-stat-card">
          <div className="category-stat-icon">
            <CheckCircle size={22} />
          </div>

          <div>
            <span>Active</span>
            <strong>{activeCategories}</strong>
          </div>
        </div>

        <div className="category-stat-card">
          <div className="category-stat-icon">
            <XCircle size={22} />
          </div>

          <div>
            <span>Inactive</span>
            <strong>{inactiveCategories}</strong>
          </div>
        </div>

      </div>

      {/* Search */}
      <div className="categories-toolbar">
        <div className="categories-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="categories-table-card">

        {loading ? (
          <div className="categories-loading">
            <RefreshCw
              size={25}
              className="categories-loading-spin"
            />
            <span>Loading categories...</span>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="categories-empty">
            <FolderOpen size={45} />

            <h3>
              {search
                ? "No categories found"
                : "No categories available"}
            </h3>

            <p>
              {search
                ? "Try a different search."
                : "Add your first medicine category."}
            </p>

            {!search && (
              <button
                className="category-primary-btn"
                onClick={handleAdd}
              >
                <Plus size={18} />
                Add Category
              </button>
            )}
          </div>
        ) : (
          <div className="categories-table-wrapper">

            <table className="categories-table">

              <thead>
                <tr>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.map((category) => {

                  const isActive =
                    category.status !== "inactive";

                  return (
                    <tr key={category._id}>

                      <td>
                        <div className="category-name-cell">

                          <div className="category-icon-box">
                            <FolderOpen size={18} />
                          </div>

                          <strong>
                            {category.name || "-"}
                          </strong>

                        </div>
                      </td>

                      <td>
                        <div className="category-description">
                          {category.description || (
                            <span className="category-muted">
                              No description
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <span
                          className={
                            isActive
                              ? "category-status active"
                              : "category-status inactive"
                          }
                        >
                          {isActive ? (
                            <CheckCircle size={14} />
                          ) : (
                            <XCircle size={14} />
                          )}

                          {isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td>
                        {category.createdAt
                          ? new Date(
                              category.createdAt
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </td>

                      <td>
                        <div className="category-actions">

                          <button
                            className="category-action-btn category-edit-btn"
                            title="Edit category"
                            onClick={() =>
                              handleEdit(category)
                            }
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            className="category-action-btn category-delete-btn"
                            title="Delete category"
                            onClick={() =>
                              handleDelete(category)
                            }
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* Category Form */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
          loading={saving}
        />
      )}

    </div>
  );
}