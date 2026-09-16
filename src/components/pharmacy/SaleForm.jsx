import React, { useEffect, useMemo, useState } from "react";
import { X, Save, Plus, Trash2 } from "lucide-react";
import "./SaleForm.css";

export default function SaleForm({
  sale,
  medicines = [],
  stores = [],
  onSubmit,
  onClose,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    invoiceNumber: "",
    store: "",
    paymentMethod: "cash",
    notes: "",
  });

  const [items, setItems] = useState([
    {
      medicine: "",
      quantity: 1,
      price: 0,
      discount: 0,
    },
  ]);

  useEffect(() => {
    if (sale) {
      setFormData({
        customerName: sale.customerName || "",
        customerPhone: sale.customerPhone || "",
        invoiceNumber: sale.invoiceNumber || "",
        store:
          typeof sale.store === "object"
            ? sale.store?._id || ""
            : sale.store || "",
        paymentMethod: sale.paymentMethod || "cash",
        notes: sale.notes || "",
      });

      const saleItems = Array.isArray(sale.items)
        ? sale.items
        : [];

      setItems(
        saleItems.length > 0
          ? saleItems.map((item) => ({
              medicine:
                typeof item.medicine === "object"
                  ? item.medicine?._id || ""
                  : item.medicine || "",
              quantity: Number(item.quantity || 1),
              price: Number(
                item.price ??
                  item.sellingPrice ??
                  0
              ),
              discount: Number(item.discount || 0),
            }))
          : [
              {
                medicine: "",
                quantity: 1,
                price: 0,
                discount: 0,
              },
            ]
      );
    } else {
      setFormData({
        customerName: "",
        customerPhone: "",
        invoiceNumber: "",
        store: "",
        paymentMethod: "cash",
        notes: "",
      });

      setItems([
        {
          medicine: "",
          quantity: 1,
          price: 0,
          discount: 0,
        },
      ]);
    }
  }, [sale]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMedicineChange = (index, medicineId) => {
    const selectedMedicine = medicines.find(
      (medicine) => medicine._id === medicineId
    );

    setItems((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        return {
          ...item,
          medicine: medicineId,
          price: Number(
            selectedMedicine?.sellingPrice || 0
          ),
        };
      })
    );
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        return {
          ...item,
          [field]: value,
        };
      })
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        medicine: "",
        quantity: 1,
        price: 0,
        discount: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;

    setItems((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const getItemTotal = (item) => {
    const quantity = Number(item.quantity || 0);
    const price = Number(item.price || 0);
    const discount = Number(item.discount || 0);

    const gross = quantity * price;
    const discountAmount =
      gross * (discount / 100);

    return Math.max(
      0,
      gross - discountAmount
    );
  };

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + getItemTotal(item),
      0
    );
  }, [items]);

  const totalQuantity = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  }, [items]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedItems = items
      .filter((item) => item.medicine)
      .map((item) => ({
        medicine: item.medicine,
        quantity: Number(item.quantity || 0),
        price: Number(item.price || 0),
        discount: Number(item.discount || 0),
      }));

    if (cleanedItems.length === 0) {
      alert("Please add at least one medicine.");
      return;
    }

    onSubmit({
      ...formData,
      customerName: formData.customerName.trim(),
      customerPhone: formData.customerPhone.trim(),
      invoiceNumber: formData.invoiceNumber.trim(),
      notes: formData.notes.trim(),
      items: cleanedItems,
      subtotal: Number(subtotal.toFixed(2)),
      totalQuantity,
      totalAmount: Number(subtotal.toFixed(2)),
    });
  };

  return (
    <div className="sale-modal-overlay">
      <div className="sale-modal">

        {/* Header */}
        <div className="sale-modal-header">
          <div>
            <h2>
              {sale ? "Edit Sale" : "Create Sale"}
            </h2>

            <p>
              {sale
                ? "Update pharmacy sale details."
                : "Create a new pharmacy sale."}
            </p>
          </div>

          <button
            type="button"
            className="sale-close-btn"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Customer Details */}
          <div className="sale-section">
            <h3>Customer Details</h3>

            <div className="sale-form-grid">

              <div className="sale-form-group">
                <label>Customer Name</label>

                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleFormChange}
                  placeholder="Enter customer name"
                />
              </div>

              <div className="sale-form-group">
                <label>Customer Phone</label>

                <input
                  type="text"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleFormChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="sale-form-group">
                <label>Invoice Number</label>

                <input
                  type="text"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleFormChange}
                  placeholder="e.g. INV-1001"
                />
              </div>

              <div className="sale-form-group">
                <label>Store</label>

                <select
                  name="store"
                  value={formData.store}
                  onChange={handleFormChange}
                >
                  <option value="">
                    Select store
                  </option>

                  {stores.map((store) => (
                    <option
                      key={store._id}
                      value={store._id}
                    >
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sale-form-group">
                <label>Payment Method</label>

                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleFormChange}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="online">Online</option>
                  <option value="credit">Credit</option>
                </select>
              </div>

            </div>
          </div>

          {/* Medicines */}
          <div className="sale-section">

            <div className="sale-items-header">
              <div>
                <h3>Medicines</h3>
                <p>Add medicines included in this sale.</p>
              </div>

              <button
                type="button"
                className="sale-add-item-btn"
                onClick={addItem}
              >
                <Plus size={17} />
                Add Medicine
              </button>
            </div>

            <div className="sale-items">

              {items.map((item, index) => (
                <div
                  className="sale-item-row"
                  key={index}
                >

                  <div className="sale-form-group sale-medicine-field">
                    <label>Medicine</label>

                    <select
                      value={item.medicine}
                      onChange={(e) =>
                        handleMedicineChange(
                          index,
                          e.target.value
                        )
                      }
                      required
                    >
                      <option value="">
                        Select medicine
                      </option>

                      {medicines.map((medicine) => (
                        <option
                          key={medicine._id}
                          value={medicine._id}
                        >
                          {medicine.name}
                          {medicine.batchNumber
                            ? ` - ${medicine.batchNumber}`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sale-form-group">
                    <label>Quantity</label>

                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div className="sale-form-group">
                    <label>Price</label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "price",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="sale-form-group">
                    <label>Discount %</label>

                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={item.discount}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "discount",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="sale-item-total">
                    <span>Total</span>
                    <strong>
                      ₹
                      {getItemTotal(item).toFixed(2)}
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="sale-remove-item-btn"
                    onClick={() =>
                      removeItem(index)
                    }
                    disabled={
                      items.length === 1
                    }
                    title="Remove medicine"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>
              ))}

            </div>
          </div>

          {/* Notes */}
          <div className="sale-section">

            <div className="sale-form-group">
              <label>Notes</label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                placeholder="Additional notes..."
                rows="3"
              />
            </div>

          </div>

          {/* Summary */}
          <div className="sale-summary">

            <div>
              <span>Total Items</span>
              <strong>{items.length}</strong>
            </div>

            <div>
              <span>Total Quantity</span>
              <strong>{totalQuantity}</strong>
            </div>

            <div className="sale-grand-total">
              <span>Total Amount</span>
              <strong>
                ₹{subtotal.toFixed(2)}
              </strong>
            </div>

          </div>

          {/* Actions */}
          <div className="sale-form-actions">

            <button
              type="button"
              className="sale-cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="sale-save-btn"
              disabled={loading}
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save size={17} />
                  {sale
                    ? "Update Sale"
                    : "Save Sale"}
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}