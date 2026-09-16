import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  Package,
  AlertTriangle,
  CalendarClock,
} from "lucide-react";

import {
  getMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getCategories,
  getStores,
} from "../../services/pharmacyApi";

import MedicineForm from "../../components/pharmacy/MedicineForm";
import "./Medicines.css";

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  // Convert API response into array safely
  const extractArray = (response) => {
    const data = response?.data ?? response;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.medicines)) return data.medicines;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.results)) return data.results;

    return [];
  };

  // Load medicines, categories and stores
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [medicineRes, categoryRes, storeRes] = await Promise.all([
        getMedicines(),
        getCategories(),
        getStores(),
      ]);

      setMedicines(extractArray(medicineRes));
      setCategories(extractArray(categoryRes));
      setStores(extractArray(storeRes));
    } catch (err) {
      console.error("Medicine loading error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load medicines"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Search medicines
  const filteredMedicines = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return medicines;

    return medicines.filter((medicine) => {
      const name = medicine.name || "";
      const genericName = medicine.genericName || "";
      const manufacturer = medicine.manufacturer || "";
      const batchNumber = medicine.batchNumber || "";

      const category =
        typeof medicine.category === "object"
          ? medicine.category?.name || ""
          : medicine.category || "";

      return (
        name.toLowerCase().includes(term) ||
        genericName.toLowerCase().includes(term) ||
        manufacturer.toLowerCase().includes(term) ||
        batchNumber.toLowerCase().includes(term) ||
        category.toLowerCase().includes(term)
      );
    });
  }, [medicines, search]);

  // Low stock check
  const isLowStock = (medicine) => {
    const stock = Number(medicine.stock ?? medicine.quantity ?? 0);
    const threshold = Number(medicine.lowStockThreshold ?? 10);

    return stock <= threshold;
  };

  // Expiry check
  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) {
      return {
        label: "No Date",
        className: "expiry-normal",
      };
    }

    const today = new Date();
    const expiry = new Date(expiryDate);

    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (expiry - today) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      return {
        label: "Expired",
        className: "expiry-danger",
      };
    }

    if (diffDays <= 90) {
      return {
        label: `${diffDays} days`,
        className: "expiry-warning",
      };
    }

    return {
      label: "Good",
      className: "expiry-normal",
    };
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Open add form
  const handleAdd = () => {
    setEditingMedicine(null);
    setShowForm(true);
    setError("");
  };

  // Open edit form
  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setShowForm(true);
    setError("");
  };

  // Save medicine
  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError("");

      if (editingMedicine?._id) {
        await updateMedicine(editingMedicine._id, formData);
      } else {
        await createMedicine(formData);
      }

      setShowForm(false);
      setEditingMedicine(null);

      await loadData();
    } catch (err) {
      console.error("Medicine save error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save medicine"
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete medicine
  const handleDelete = async (medicine) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${medicine.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteMedicine(medicine._id);

      setMedicines((prev) =>
        prev.filter((item) => item._id !== medicine._id)
      );
    } catch (err) {
      console.error("Medicine delete error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete medicine"
      );
    }
  };

  const totalMedicines = medicines.length;

  const lowStockCount = medicines.filter(isLowStock).length;

  const expiringCount = medicines.filter((medicine) => {
    const status = getExpiryStatus(medicine.expiryDate);
    return (
      status.className === "expiry-warning" ||
      status.className === "expiry-danger"
    );
  }).length;

  return (
    <div className="medicines-page">

      {/* Header */}
      <div className="medicines-header">
        <div>
          <h1>Medicines</h1>
          <p>Manage pharmacy medicines, stock and expiry dates.</p>
        </div>

        <div className="medicines-header-actions">
          <button
            className="btn-refresh"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button className="btn-primary" onClick={handleAdd}>
            <Plus size={18} />
            Add Medicine
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="medicine-error">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="medicine-stats">

        <div className="medicine-stat-card">
          <div className="medicine-stat-icon">
            <Package size={22} />
          </div>

          <div>
            <span>Total Medicines</span>
            <strong>{totalMedicines}</strong>
          </div>
        </div>

        <div className="medicine-stat-card">
          <div className="medicine-stat-icon">
            <AlertTriangle size={22} />
          </div>

          <div>
            <span>Low Stock</span>
            <strong>{lowStockCount}</strong>
          </div>
        </div>

        <div className="medicine-stat-card">
          <div className="medicine-stat-icon">
            <CalendarClock size={22} />
          </div>

          <div>
            <span>Expiring Soon</span>
            <strong>{expiringCount}</strong>
          </div>
        </div>

      </div>

      {/* Search */}
      <div className="medicine-toolbar">
        <div className="medicine-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search medicine, generic name, manufacturer or batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="medicine-table-card">

        {loading ? (
          <div className="medicine-loading">
            <RefreshCw className="loading-spin" size={25} />
            <span>Loading medicines...</span>
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="medicine-empty">
            <Package size={45} />

            <h3>
              {search
                ? "No medicines found"
                : "No medicines available"}
            </h3>

            <p>
              {search
                ? "Try a different search."
                : "Add your first medicine to the pharmacy."}
            </p>

            {!search && (
              <button className="btn-primary" onClick={handleAdd}>
                <Plus size={18} />
                Add Medicine
              </button>
            )}
          </div>
        ) : (
          <div className="medicine-table-wrapper">

            <table className="medicine-table">

              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Category</th>
                  <th>Batch</th>
                  <th>Stock</th>
                  <th>Purchase</th>
                  <th>Selling</th>
                  <th>Expiry</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredMedicines.map((medicine) => {
                  const stock = Number(
                    medicine.stock ?? medicine.quantity ?? 0
                  );

                  const lowStock = isLowStock(medicine);

                  const expiryStatus = getExpiryStatus(
                    medicine.expiryDate
                  );

                  const categoryName =
                    typeof medicine.category === "object"
                      ? medicine.category?.name
                      : medicine.category;

                  return (
                    <tr key={medicine._id}>

                      <td>
                        <div className="medicine-name">
                          <strong>{medicine.name || "-"}</strong>

                          {medicine.genericName && (
                            <small>
                              {medicine.genericName}
                            </small>
                          )}

                          {medicine.manufacturer && (
                            <small>
                              {medicine.manufacturer}
                            </small>
                          )}
                        </div>
                      </td>

                      <td>
                        {categoryName || "-"}
                      </td>

                      <td>
                        {medicine.batchNumber || "-"}
                      </td>

                      <td>
                        <span
                          className={
                            lowStock
                              ? "stock-badge stock-low"
                              : "stock-badge stock-good"
                          }
                        >
                          {stock}

                          {lowStock && (
                            <AlertTriangle size={13} />
                          )}
                        </span>
                      </td>

                      <td>
                        ₹
                        {Number(
                          medicine.purchasePrice || 0
                        ).toFixed(2)}
                      </td>

                      <td>
                        ₹
                        {Number(
                          medicine.sellingPrice || 0
                        ).toFixed(2)}
                      </td>

                      <td>
                        <div className="expiry-cell">
                          <span>
                            {formatDate(medicine.expiryDate)}
                          </span>

                          <small
                            className={`expiry-badge ${expiryStatus.className}`}
                          >
                            {expiryStatus.label}
                          </small>
                        </div>
                      </td>

                      <td>
                        <div className="medicine-actions">

                          <button
                            className="action-btn edit-btn"
                            title="Edit medicine"
                            onClick={() =>
                              handleEdit(medicine)
                            }
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            className="action-btn delete-btn"
                            title="Delete medicine"
                            onClick={() =>
                              handleDelete(medicine)
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

      {/* Medicine Form Modal */}
      {showForm && (
        <MedicineForm
          medicine={editingMedicine}
          categories={categories}
          stores={stores}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingMedicine(null);
          }}
          loading={saving}
        />
      )}

    </div>
  );
}