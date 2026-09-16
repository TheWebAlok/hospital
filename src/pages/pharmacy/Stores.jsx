import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  Store as StoreIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

import {
  getStores,
  createStore,
  updateStore,
  deleteStore,
} from "../../services/pharmacyApi";

import StoreForm from "../../components/pharmacy/StoreForm";
import "./Stores.css";

export default function Stores() {
  const [stores, setStores] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  const extractArray = (response) => {
    const data = response?.data ?? response;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.stores)) return data.stores;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.results)) return data.results;

    return [];
  };

  const loadStores = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getStores();

      setStores(extractArray(response));
    } catch (err) {
      console.error("Store loading error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load stores"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  const filteredStores = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return stores;

    return stores.filter((store) => {
      return (
        String(store.name || "")
          .toLowerCase()
          .includes(term) ||
        String(store.code || "")
          .toLowerCase()
          .includes(term) ||
        String(store.city || "")
          .toLowerCase()
          .includes(term) ||
        String(store.state || "")
          .toLowerCase()
          .includes(term) ||
        String(store.phone || "")
          .toLowerCase()
          .includes(term) ||
        String(store.managerName || "")
          .toLowerCase()
          .includes(term)
      );
    });
  }, [stores, search]);

  const activeStores = stores.filter(
    (store) => store.status !== "inactive"
  ).length;

  const inactiveStores = stores.filter(
    (store) => store.status === "inactive"
  ).length;

  const handleAdd = () => {
    setEditingStore(null);
    setShowForm(true);
    setError("");
  };

  const handleEdit = (store) => {
    setEditingStore(store);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError("");

      if (editingStore?._id) {
        await updateStore(editingStore._id, formData);
      } else {
        await createStore(formData);
      }

      setShowForm(false);
      setEditingStore(null);

      await loadStores();
    } catch (err) {
      console.error("Store save error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save store"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (store) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${store.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteStore(store._id);

      setStores((prev) =>
        prev.filter((item) => item._id !== store._id)
      );
    } catch (err) {
      console.error("Store delete error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete store"
      );
    }
  };

  return (
    <div className="stores-page">

      {/* Header */}
      <div className="stores-header">
        <div>
          <h1>Pharmacy Stores</h1>
          <p>Manage your pharmacy stores and branches.</p>
        </div>

        <div className="stores-header-actions">
          <button
            className="store-refresh-btn"
            onClick={loadStores}
            disabled={loading}
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            className="store-primary-btn"
            onClick={handleAdd}
          >
            <Plus size={18} />
            Add Store
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="stores-error">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="stores-stats">

        <div className="store-stat-card">
          <div className="store-stat-icon">
            <StoreIcon size={22} />
          </div>

          <div>
            <span>Total Stores</span>
            <strong>{stores.length}</strong>
          </div>
        </div>

        <div className="store-stat-card">
          <div className="store-stat-icon">
            <CheckCircle size={22} />
          </div>

          <div>
            <span>Active Stores</span>
            <strong>{activeStores}</strong>
          </div>
        </div>

        <div className="store-stat-card">
          <div className="store-stat-icon">
            <XCircle size={22} />
          </div>

          <div>
            <span>Inactive Stores</span>
            <strong>{inactiveStores}</strong>
          </div>
        </div>

      </div>

      {/* Search */}
      <div className="stores-toolbar">
        <div className="stores-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search store, code, city, phone or manager..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="stores-table-card">

        {loading ? (
          <div className="stores-loading">
            <RefreshCw
              size={25}
              className="stores-loading-spin"
            />
            <span>Loading stores...</span>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="stores-empty">
            <StoreIcon size={45} />

            <h3>
              {search
                ? "No stores found"
                : "No stores available"}
            </h3>

            <p>
              {search
                ? "Try a different search."
                : "Add your first pharmacy store."}
            </p>

            {!search && (
              <button
                className="store-primary-btn"
                onClick={handleAdd}
              >
                <Plus size={18} />
                Add Store
              </button>
            )}
          </div>
        ) : (
          <div className="stores-table-wrapper">

            <table className="stores-table">

              <thead>
                <tr>
                  <th>Store</th>
                  <th>Code</th>
                  <th>Location</th>
                  <th>Contact</th>
                  <th>Manager</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStores.map((store) => {

                  const isActive =
                    store.status !== "inactive";

                  return (
                    <tr key={store._id}>

                      <td>
                        <div className="store-name-cell">
                          <div className="store-icon-box">
                            <StoreIcon size={18} />
                          </div>

                          <div>
                            <strong>
                              {store.name || "-"}
                            </strong>

                            {store.email && (
                              <small>
                                {store.email}
                              </small>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="store-code">
                          {store.code || "-"}
                        </span>
                      </td>

                      <td>
                        <div className="store-location">
                          <span>
                            {store.city || "-"}
                          </span>

                          {store.state && (
                            <small>
                              {store.state}
                              {store.pincode
                                ? ` - ${store.pincode}`
                                : ""}
                            </small>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="store-contact">
                          {store.phone && (
                            <span>
                              {store.phone}
                            </span>
                          )}

                          {store.address && (
                            <small title={store.address}>
                              {store.address}
                            </small>
                          )}
                        </div>
                      </td>

                      <td>
                        {store.managerName || "-"}
                      </td>

                      <td>
                        <span
                          className={
                            isActive
                              ? "store-status active"
                              : "store-status inactive"
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
                        <div className="store-actions">

                          <button
                            className="store-action-btn store-edit-btn"
                            title="Edit store"
                            onClick={() =>
                              handleEdit(store)
                            }
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            className="store-action-btn store-delete-btn"
                            title="Delete store"
                            onClick={() =>
                              handleDelete(store)
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

      {/* Store Form */}
      {showForm && (
        <StoreForm
          store={editingStore}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingStore(null);
          }}
          loading={saving}
        />
      )}

    </div>
  );
}