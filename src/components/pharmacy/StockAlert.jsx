import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Package,
  RefreshCw,
  Search,
} from "lucide-react";

import { getMedicines } from "../../services/pharmacyApi";

export default function StockAlert() {
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
      console.error("Stock alert error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load stock data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const lowStockMedicines = useMemo(() => {
    return medicines
      .map((medicine) => {
        const stock = Number(
          medicine.stock ??
            medicine.quantity ??
            0
        );

        const threshold = Number(
          medicine.lowStockThreshold ??
            medicine.reorderLevel ??
            10
        );

        return {
          ...medicine,
          currentStock: stock,
          threshold,
        };
      })
      .filter(
        (medicine) =>
          medicine.currentStock <=
          medicine.threshold
      )
      .sort(
        (a, b) =>
          a.currentStock - b.currentStock
      );
  }, [medicines]);

  const filteredMedicines = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return lowStockMedicines;

    return lowStockMedicines.filter(
      (medicine) => {
        const category =
          typeof medicine.category ===
          "object"
            ? medicine.category?.name || ""
            : "";

        return (
          String(medicine.name || "")
            .toLowerCase()
            .includes(term) ||
          String(
            medicine.genericName || ""
          )
            .toLowerCase()
            .includes(term) ||
          String(
            medicine.batchNumber || ""
          )
            .toLowerCase()
            .includes(term) ||
          category
            .toLowerCase()
            .includes(term)
        );
      }
    );
  }, [lowStockMedicines, search]);

  const outOfStock = lowStockMedicines.filter(
    (medicine) =>
      medicine.currentStock <= 0
  );

  const criticalStock =
    lowStockMedicines.filter(
      (medicine) =>
        medicine.currentStock > 0 &&
        medicine.currentStock <=
          Math.max(
            2,
            Math.ceil(
              medicine.threshold * 0.25
            )
          )
    );

  return (
    <div className="stock-alert">

      <div className="stock-alert-header">
        <div>
          <h2>
            <AlertTriangle size={21} />
            Stock Alerts
          </h2>

          <p>
            Medicines that need restocking.
          </p>
        </div>

        <button
          onClick={loadMedicines}
          disabled={loading}
          className="stock-refresh-btn"
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "stock-spin"
                : ""
            }
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="stock-error">
          <AlertTriangle size={17} />
          {error}
        </div>
      )}

      <div className="stock-alert-stats">

        <div className="stock-stat">
          <Package size={20} />

          <div>
            <span>Low Stock</span>
            <strong>
              {lowStockMedicines.length}
            </strong>
          </div>
        </div>

        <div className="stock-stat">
          <AlertTriangle size={20} />

          <div>
            <span>Critical</span>
            <strong>
              {criticalStock.length}
            </strong>
          </div>
        </div>

        <div className="stock-stat">
          <Package size={20} />

          <div>
            <span>Out of Stock</span>
            <strong>
              {outOfStock.length}
            </strong>
          </div>
        </div>

      </div>

      <div className="stock-search">
        <Search size={17} />

        <input
          type="text"
          placeholder="Search medicine or batch..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {loading ? (
        <div className="stock-loading">
          <RefreshCw
            size={26}
            className="stock-spin"
          />
          <span>
            Loading stock alerts...
          </span>
        </div>
      ) : filteredMedicines.length === 0 ? (
        <div className="stock-empty">
          <Package size={42} />

          <h3>
            {search
              ? "No medicines found"
              : "Stock is healthy"}
          </h3>

          <p>
            {search
              ? "Try another search."
              : "There are no medicines below their stock threshold."}
          </p>
        </div>
      ) : (
        <div className="stock-table-wrapper">

          <table className="stock-table">

            <thead>
              <tr>
                <th>Medicine</th>
                <th>Batch</th>
                <th>Current Stock</th>
                <th>Threshold</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredMedicines.map(
                (medicine) => {

                  let status = "Low";

                  if (
                    medicine.currentStock <=
                    0
                  ) {
                    status = "Out of Stock";
                  } else if (
                    medicine.currentStock <=
                    Math.max(
                      2,
                      Math.ceil(
                        medicine.threshold *
                          0.25
                      )
                    )
                  ) {
                    status = "Critical";
                  }

                  return (
                    <tr key={medicine._id}>

                      <td>
                        <div className="stock-medicine">
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
                        {medicine.batchNumber ||
                          "-"}
                      </td>

                      <td>
                        <strong>
                          {
                            medicine.currentStock
                          }
                        </strong>
                      </td>

                      <td>
                        {
                          medicine.threshold
                        }
                      </td>

                      <td>
                        <span
                          className={`stock-status ${
                            status ===
                            "Out of Stock"
                              ? "out"
                              : status ===
                                "Critical"
                              ? "critical"
                              : "low"
                          }`}
                        >
                          {status}
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
  );
}