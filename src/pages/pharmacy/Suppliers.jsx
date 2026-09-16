import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  Truck,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../services/pharmacyApi";

import SupplierForm from "../../components/pharmacy/SupplierForm";
import "./Suppliers.css";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const extractArray = (response) => {
    const data = response?.data ?? response;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.suppliers)) return data.suppliers;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.results)) return data.results;

    return [];
  };

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSuppliers();

      setSuppliers(extractArray(response));
    } catch (err) {
      console.error("Supplier loading error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load suppliers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return suppliers;

    return suppliers.filter((supplier) => {
      return (
        String(supplier.name || "")
          .toLowerCase()
          .includes(term) ||
        String(supplier.companyName || "")
          .toLowerCase()
          .includes(term) ||
        String(supplier.contactPerson || "")
          .toLowerCase()
          .includes(term) ||
        String(supplier.phone || "")
          .toLowerCase()
          .includes(term) ||
        String(supplier.email || "")
          .toLowerCase()
          .includes(term) ||
        String(supplier.city || "")
          .toLowerCase()
          .includes(term) ||
        String(supplier.gstNumber || "")
          .toLowerCase()
          .includes(term)
      );
    });
  }, [suppliers, search]);

  const activeSuppliers = suppliers.filter(
    (supplier) => supplier.status !== "inactive"
  ).length;

  const inactiveSuppliers = suppliers.filter(
    (supplier) => supplier.status === "inactive"
  ).length;

  const handleAdd = () => {
    setEditingSupplier(null);
    setShowForm(true);
    setError("");
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError("");

      if (editingSupplier?._id) {
        await updateSupplier(editingSupplier._id, formData);
      } else {
        await createSupplier(formData);
      }

      setShowForm(false);
      setEditingSupplier(null);

      await loadSuppliers();
    } catch (err) {
      console.error("Supplier save error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save supplier"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (supplier) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${supplier.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteSupplier(supplier._id);

      setSuppliers((prev) =>
        prev.filter((item) => item._id !== supplier._id)
      );
    } catch (err) {
      console.error("Supplier delete error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete supplier"
      );
    }
  };

  return (
    <div className="suppliers-page">

      {/* Header */}
      <div className="suppliers-header">
        <div>
          <h1>Suppliers</h1>
          <p>Manage pharmacy medicine suppliers and contacts.</p>
        </div>

        <div className="suppliers-header-actions">
          <button
            className="supplier-refresh-btn"
            onClick={loadSuppliers}
            disabled={loading}
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            className="supplier-primary-btn"
            onClick={handleAdd}
          >
            <Plus size={18} />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="suppliers-error">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="suppliers-stats">

        <div className="supplier-stat-card">
          <div className="supplier-stat-icon">
            <Truck size={22} />
          </div>

          <div>
            <span>Total Suppliers</span>
            <strong>{suppliers.length}</strong>
          </div>
        </div>

        <div className="supplier-stat-card">
          <div className="supplier-stat-icon">
            <CheckCircle size={22} />
          </div>

          <div>
            <span>Active Suppliers</span>
            <strong>{activeSuppliers}</strong>
          </div>
        </div>

        <div className="supplier-stat-card">
          <div className="supplier-stat-icon">
            <XCircle size={22} />
          </div>

          <div>
            <span>Inactive Suppliers</span>
            <strong>{inactiveSuppliers}</strong>
          </div>
        </div>

      </div>

      {/* Search */}
      <div className="suppliers-toolbar">
        <div className="suppliers-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search supplier, company, contact, phone or GST..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="suppliers-table-card">

        {loading ? (
          <div className="suppliers-loading">
            <RefreshCw
              size={25}
              className="suppliers-loading-spin"
            />
            <span>Loading suppliers...</span>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="suppliers-empty">
            <Truck size={45} />

            <h3>
              {search
                ? "No suppliers found"
                : "No suppliers available"}
            </h3>

            <p>
              {search
                ? "Try a different search."
                : "Add your first pharmacy supplier."}
            </p>

            {!search && (
              <button
                className="supplier-primary-btn"
                onClick={handleAdd}
              >
                <Plus size={18} />
                Add Supplier
              </button>
            )}
          </div>
        ) : (
          <div className="suppliers-table-wrapper">

            <table className="suppliers-table">

              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>GST Number</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredSuppliers.map((supplier) => {

                  const isActive =
                    supplier.status !== "inactive";

                  return (
                    <tr key={supplier._id}>

                      <td>
                        <div className="supplier-name-cell">

                          <div className="supplier-icon-box">
                            <Truck size={18} />
                          </div>

                          <div>
                            <strong>
                              {supplier.name || "-"}
                            </strong>

                            {supplier.email && (
                              <small>
                                {supplier.email}
                              </small>
                            )}
                          </div>

                        </div>
                      </td>

                      <td>
                        {supplier.companyName || "-"}
                      </td>

                      <td>
                        <div className="supplier-contact">
                          <span>
                            {supplier.contactPerson || "-"}
                          </span>

                          {supplier.phone && (
                            <small>
                              {supplier.phone}
                            </small>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="supplier-location">
                          <span>
                            {supplier.city || "-"}
                          </span>

                          {supplier.state && (
                            <small>
                              {supplier.state}
                              {supplier.pincode
                                ? ` - ${supplier.pincode}`
                                : ""}
                            </small>
                          )}
                        </div>
                      </td>

                      <td>
                        <span className="supplier-gst">
                          {supplier.gstNumber || "-"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            isActive
                              ? "supplier-status active"
                              : "supplier-status inactive"
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
                        <div className="supplier-actions">

                          <button
                            className="supplier-action-btn supplier-edit-btn"
                            title="Edit supplier"
                            onClick={() =>
                              handleEdit(supplier)
                            }
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            className="supplier-action-btn supplier-delete-btn"
                            title="Delete supplier"
                            onClick={() =>
                              handleDelete(supplier)
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

      {/* Supplier Form */}
      {showForm && (
        <SupplierForm
          supplier={editingSupplier}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingSupplier(null);
          }}
          loading={saving}
        />
      )}

    </div>
  );
}