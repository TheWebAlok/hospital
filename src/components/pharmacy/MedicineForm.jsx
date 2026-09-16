import "./MedicineForm.css";
import React, { useEffect, useState } from "react";
import {
  X,
  Save,
  Pill,
  Loader2,
} from "lucide-react";

export default function MedicineForm({
  medicine,
  categories = [],
  stores = [],
  onSubmit,
  onClose,
  loading = false,
}) {
  const [form, setForm] = useState({
    name: "",
    genericName: "",
    category: "",
    manufacturer: "",
    batchNumber: "",
    purchasePrice: "",
    sellingPrice: "",
    stock: "",
    lowStockThreshold: "10",
    expiryDate: "",
    store: "",
    description: "",
  });

  useEffect(() => {
    if (medicine) {
      setForm({
        name: medicine.name || "",
        genericName: medicine.genericName || "",
        category:
          medicine.category?._id ||
          medicine.category ||
          "",
        manufacturer:
          medicine.manufacturer || "",
        batchNumber:
          medicine.batchNumber || "",
        purchasePrice:
          medicine.purchasePrice ?? "",
        sellingPrice:
          medicine.sellingPrice ?? "",
        stock:
          medicine.stock ??
          medicine.quantity ??
          "",
        lowStockThreshold:
          medicine.lowStockThreshold ?? "10",
        expiryDate: medicine.expiryDate
          ? new Date(medicine.expiryDate)
              .toISOString()
              .split("T")[0]
          : "",
        store:
          medicine.store?._id ||
          medicine.store ||
          "",
        description:
          medicine.description || "",
      });
    }
  }, [medicine]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      purchasePrice: Number(form.purchasePrice),
      sellingPrice: Number(form.sellingPrice),
      stock: Number(form.stock),
      lowStockThreshold: Number(
        form.lowStockThreshold
      ),
    });
  };

  return (
    <div className="medicine-modal-overlay">
      <div className="medicine-modal">
        {/* HEADER */}

        <div className="medicine-modal-header">
          <div className="medicine-modal-title">
            <div className="medicine-modal-icon">
              <Pill size={20} />
            </div>

            <div>
              <h2>
                {medicine
                  ? "Edit Medicine"
                  : "Add Medicine"}
              </h2>

              <p>
                {medicine
                  ? "Update medicine details"
                  : "Add a new medicine to inventory"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="medicine-close-btn"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}

        <form
          className="medicine-form"
          onSubmit={handleSubmit}
        >
          <div className="medicine-form-grid">
            {/* NAME */}

            <div className="medicine-field">
              <label>
                Medicine Name *
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter medicine name"
                required
              />
            </div>

            {/* GENERIC NAME */}

            <div className="medicine-field">
              <label>
                Generic Name
              </label>

              <input
                type="text"
                name="genericName"
                value={form.genericName}
                onChange={handleChange}
                placeholder="Enter generic name"
              />
            </div>

            {/* CATEGORY */}

            <div className="medicine-field">
              <label>
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={
                      category._id ||
                      category.id
                    }
                    value={
                      category._id ||
                      category.id
                    }
                  >
                    {category.name ||
                      category.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* MANUFACTURER */}

            <div className="medicine-field">
              <label>
                Manufacturer
              </label>

              <input
                type="text"
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleChange}
                placeholder="Manufacturer name"
              />
            </div>

            {/* BATCH */}

            <div className="medicine-field">
              <label>
                Batch Number
              </label>

              <input
                type="text"
                name="batchNumber"
                value={form.batchNumber}
                onChange={handleChange}
                placeholder="Batch number"
              />
            </div>

            {/* STORE */}

            <div className="medicine-field">
              <label>
                Store
              </label>

              <select
                name="store"
                value={form.store}
                onChange={handleChange}
              >
                <option value="">
                  Select store
                </option>

                {stores.map((store) => (
                  <option
                    key={
                      store._id ||
                      store.id
                    }
                    value={
                      store._id ||
                      store.id
                    }
                  >
                    {store.name ||
                      store.storeName}
                  </option>
                ))}
              </select>
            </div>

            {/* PURCHASE PRICE */}

            <div className="medicine-field">
              <label>
                Purchase Price
              </label>

              <div className="medicine-input-prefix">
                <span>₹</span>

                <input
                  type="number"
                  name="purchasePrice"
                  value={
                    form.purchasePrice
                  }
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* SELLING PRICE */}

            <div className="medicine-field">
              <label>
                Selling Price *
              </label>

              <div className="medicine-input-prefix">
                <span>₹</span>

                <input
                  type="number"
                  name="sellingPrice"
                  value={
                    form.sellingPrice
                  }
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* STOCK */}

            <div className="medicine-field">
              <label>
                Stock *
              </label>

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>

            {/* LOW STOCK */}

            <div className="medicine-field">
              <label>
                Low Stock Alert
              </label>

              <input
                type="number"
                name="lowStockThreshold"
                value={
                  form.lowStockThreshold
                }
                onChange={handleChange}
                placeholder="10"
                min="0"
              />
            </div>

            {/* EXPIRY */}

            <div className="medicine-field">
              <label>
                Expiry Date *
              </label>

              <input
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* DESCRIPTION */}

            <div className="medicine-field medicine-field-full">
              <label>
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Medicine description..."
                rows="3"
              />
            </div>
          </div>

          {/* FOOTER */}

          <div className="medicine-form-footer">
            <button
              type="button"
              className="medicine-cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="medicine-save-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="medicine-spin"
                  />

                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />

                  {medicine
                    ? "Update Medicine"
                    : "Save Medicine"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
