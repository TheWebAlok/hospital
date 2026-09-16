import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  RefreshCw,
  Search,
  PackageX,
} from "lucide-react";

import { getMedicines } from "../../services/pharmacyApi";
import "./ExpiryAlerts.css";

export default function ExpiryAlerts() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadMedicines = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMedicines();
      const data = response?.data ?? response;

      let list = [];

      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data?.medicines)) {
        list = data.medicines;
      } else if (Array.isArray(data?.data)) {
        list = data.data;
      } else if (Array.isArray(data?.results)) {
        list = data.results;
      }

      setMedicines(list);
    } catch (err) {
      console.error("Expiry alerts error:", err);

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
    loadMedicines();
  }, []);

  const getExpiryDate = (medicine) => {
    return medicine.expiryDate || medicine.expiry || null;
  };

  const getDaysUntilExpiry = (dateValue) => {
    if (!dateValue) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(dateValue);
    expiry.setHours(0, 0, 0, 0);

    if (Number.isNaN(expiry.getTime())) {
      return null;
    }

    return Math.ceil(
      (expiry.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  const alerts = useMemo(() => {
    return medicines
      .map((medicine) => {
        const expiryDate = getExpiryDate(medicine);
        const days = getDaysUntilExpiry(expiryDate);

        return {
          ...medicine,
          expiryDate,
          days,
        };
      })
      .filter(
        (medicine) =>
          medicine.days !== null &&
          medicine.days <= 90
      )
      .sort((a, b) => a.days - b.days);
  }, [medicines]);

  const expiredMedicines = useMemo(() => {
    return alerts.filter((medicine) => medicine.days < 0);
  }, [alerts]);

  const expiringSoon = useMemo(() => {
    return alerts.filter(
      (medicine) =>
        medicine.days >= 0 &&
        medicine.days <= 30
    );
  }, [alerts]);

  const expiringLater = useMemo(() => {
    return alerts.filter(
      (medicine) =>
        medicine.days > 30 &&
        medicine.days <= 90
    );
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return alerts;

    return alerts.filter((medicine) => {
      const category =
        typeof medicine.category === "object"
          ? medicine.category?.name || ""
          : "";

      return (
        String(medicine.name || "")
          .toLowerCase()
          .includes(term) ||
        String(medicine.genericName || "")
          .toLowerCase()
          .includes(term) ||
        String(medicine.batchNumber || "")
          .toLowerCase()
          .includes(term) ||
        category.toLowerCase().includes(term)
      );
    });
  }, [alerts, search]);

  const getStatus = (days) => {
    if (days < 0) {
      return {
        label: "Expired",
        className: "expired",
      };
    }

    if (days <= 30) {
      return {
        label: "Expiring Soon",
        className: "urgent",
      };
    }

    return {
      label: "Upcoming",
      className: "upcoming",
    };
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStock = (medicine) => {
    return Number(
      medicine.stock ??
        medicine.quantity ??
        0
    );
  };

  return (
    <div className="expiry-page">

      {/* Header */}
      <div className="expiry-header">
        <div>
          <h1>Expiry Alerts</h1>
          <p>
            Monitor expired and soon-to-expire medicines.
          </p>
        </div>

        <button
          className="expiry-refresh-btn"
          onClick={loadMedicines}
          disabled={loading}
        >
          <RefreshCw
            size={18}
            className={
              loading
                ? "expiry-spin"
                : ""
            }
          />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="expiry-error">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="expiry-stats">

        <div className="expiry-stat-card expired-card">
          <div className="expiry-stat-icon">
            <PackageX size={22} />
          </div>

          <div>
            <span>Expired</span>
            <strong>
              {expiredMedicines.length}
            </strong>
          </div>
        </div>

        <div className="expiry-stat-card urgent-card">
          <div className="expiry-stat-icon">
            <AlertTriangle size={22} />
          </div>

          <div>
            <span>Within 30 Days</span>
            <strong>
              {expiringSoon.length}
            </strong>
          </div>
        </div>

        <div className="expiry-stat-card upcoming-card">
          <div className="expiry-stat-icon">
            <CalendarClock size={22} />
          </div>

          <div>
            <span>31–90 Days</span>
            <strong>
              {expiringLater.length}
            </strong>
          </div>
        </div>

        <div className="expiry-stat-card total-card">
          <div className="expiry-stat-icon">
            <CalendarClock size={22} />
          </div>

          <div>
            <span>Total Alerts</span>
            <strong>
              {alerts.length}
            </strong>
          </div>
        </div>

      </div>

      {/* Search */}
      <div className="expiry-toolbar">
        <div className="expiry-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search medicine, batch or category..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>
      </div>

      {/* Table */}
      <div className="expiry-table-card">

        {loading ? (
          <div className="expiry-loading">
            <RefreshCw
              size={28}
              className="expiry-spin"
            />
            <p>
              Loading expiry alerts...
            </p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="expiry-empty">
            <CalendarClock size={48} />

            <h3>
              {search
                ? "No medicines found"
                : "No expiry alerts"}
            </h3>

            <p>
              {search
                ? "Try a different search."
                : "No medicines are expiring within the next 90 days."}
            </p>
          </div>
        ) : (
          <div className="expiry-table-wrapper">

            <table className="expiry-table">

              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Batch</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Expiry Date</th>
                  <th>Days</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredAlerts.map(
                  (medicine) => {
                    const status =
                      getStatus(
                        medicine.days
                      );

                    const category =
                      typeof medicine.category ===
                      "object"
                        ? medicine.category?.name ||
                          "-"
                        : "-";

                    return (
                      <tr
                        key={
                          medicine._id
                        }
                        className={
                          medicine.days < 0
                            ? "expired-row"
                            : medicine.days <=
                              30
                            ? "urgent-row"
                            : ""
                        }
                      >
                        <td>
                          <div className="expiry-medicine">
                            <strong>
                              {medicine.name}
                            </strong>

                            {medicine.genericName && (
                              <small>
                                {
                                  medicine.genericName
                                }
                              </small>
                            )}
                          </div>
                        </td>

                        <td>
                          <span className="batch-number">
                            {medicine.batchNumber ||
                              "-"}
                          </span>
                        </td>

                        <td>
                          {category}
                        </td>

                        <td>
                          <strong>
                            {getStock(
                              medicine
                            )}
                          </strong>
                        </td>

                        <td>
                          {formatDate(
                            medicine.expiryDate
                          )}
                        </td>

                        <td>
                          <span
                            className={`days-badge ${status.className}`}
                          >
                            {medicine.days < 0
                              ? `${Math.abs(
                                  medicine.days
                                )} days ago`
                              : medicine.days ===
                                0
                              ? "Today"
                              : `${medicine.days} days`}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`expiry-status ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}