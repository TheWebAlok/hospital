import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  Plus,
  Trash2,
  Printer,
  IndianRupee,
  ShoppingCart,
  CreditCard,
  RefreshCw,
} from "lucide-react";

import {
  getMedicines,
  getStores,
  createSale,
} from "../../services/pharmacyApi";

import "./Billing.css";

// =====================================================
// HOSPITAL INFORMATION
// =====================================================
// YAHAN APNE CLIENT / HOSPITAL KI DETAILS DALNA
// =====================================================

const HOSPITAL_INFO = {
  name: "ABC Multispeciality Hospital",
  address: "Sector 22, Chandigarh, Punjab",
  phone: "+91 98765 43210",
  logo: "",
};

// =====================================================
// BILLING PAGE
// =====================================================

export default function Billing() {
  // ===================================================
  // DATA
  // ===================================================

  const [medicines, setMedicines] = useState([]);
  const [stores, setStores] = useState([]);

  // ===================================================
  // BILL ITEMS
  // ===================================================

  const [items, setItems] = useState([]);

  const [selectedMedicine, setSelectedMedicine] =
    useState("");

  const [quantity, setQuantity] = useState(1);

  // ===================================================
  // CUSTOMER
  // ===================================================

  const [customerName, setCustomerName] = useState("");

  const [customerPhone, setCustomerPhone] =
    useState("");

  const [store, setStore] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("cash");

  // ===================================================
  // BILL
  // ===================================================

  const [discount, setDiscount] = useState(0);

  const [notes, setNotes] = useState("");

  const [invoiceNumber, setInvoiceNumber] =
    useState("");

  // ===================================================
  // UI STATES
  // ===================================================

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [medicineSearch, setMedicineSearch] =
    useState("");

  // ===================================================
  // LOAD MEDICINES + STORES
  // ===================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [medicineRes, storeRes] =
        await Promise.all([
          getMedicines(),
          getStores(),
        ]);

      const getArray = (response, key) => {
        const data = response?.data ?? response;

        if (Array.isArray(data)) {
          return data;
        }

        if (Array.isArray(data?.[key])) {
          return data[key];
        }

        if (Array.isArray(data?.data)) {
          return data.data;
        }

        if (Array.isArray(data?.results)) {
          return data.results;
        }

        return [];
      };

      setMedicines(
        getArray(medicineRes, "medicines")
      );

      setStores(
        getArray(storeRes, "stores")
      );
    } catch (err) {
      console.error("Billing load error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load billing data"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    loadData();
  }, []);

  // ===================================================
  // FILTER MEDICINES
  // ===================================================

  const filteredMedicines = useMemo(() => {
    const search = medicineSearch
      .trim()
      .toLowerCase();

    if (!search) {
      return medicines;
    }

    return medicines.filter((medicine) => {
      return (
        String(medicine.name || "")
          .toLowerCase()
          .includes(search) ||

        String(medicine.genericName || "")
          .toLowerCase()
          .includes(search) ||

        String(medicine.batchNumber || "")
          .toLowerCase()
          .includes(search)
      );
    });
  }, [medicines, medicineSearch]);

  // ===================================================
  // ADD MEDICINE
  // ===================================================

  const addItem = () => {
    setError("");
    setSuccess("");

    if (!selectedMedicine) {
      setError("Please select a medicine.");
      return;
    }

    const medicine = medicines.find(
      (item) => item._id === selectedMedicine
    );

    if (!medicine) {
      setError("Medicine not found.");
      return;
    }

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty <= 0) {
      setError("Enter a valid quantity.");
      return;
    }

    const availableStock = Number(
      medicine.stock ??
        medicine.quantity ??
        0
    );

    if (qty > availableStock) {
      setError(
        `Only ${availableStock} units available in stock.`
      );
      return;
    }

    const price = Number(
      medicine.sellingPrice ??
        medicine.price ??
        0
    );

    if (price < 0 || !Number.isFinite(price)) {
      setError("Invalid medicine price.");
      return;
    }

    setItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.medicine === selectedMedicine
      );

      if (existing) {
        const newQuantity =
          existing.quantity + qty;

        if (newQuantity > availableStock) {
          setError(
            `Only ${availableStock} units available in stock.`
          );

          return prev;
        }

        return prev.map((item) =>
          item.medicine === selectedMedicine
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          medicine: selectedMedicine,

          name: medicine.name,

          genericName:
            medicine.genericName ||
            medicine.composition ||
            "",

          batchNumber:
            medicine.batchNumber || "-",

          quantity: qty,

          price,

          discount: 0,
        },
      ];
    });

    setSelectedMedicine("");
    setQuantity(1);
    setMedicineSearch("");
  };

  // ===================================================
  // REMOVE MEDICINE
  // ===================================================

  const removeItem = (medicineId) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          item.medicine !== medicineId
      )
    );
  };

  // ===================================================
  // UPDATE QUANTITY
  // ===================================================

  const updateItemQuantity = (
    medicineId,
    value
  ) => {
    const qty = Number(value);

    if (!Number.isInteger(qty) || qty < 1) {
      return;
    }

    const medicine = medicines.find(
      (item) => item._id === medicineId
    );

    const stock = Number(
      medicine?.stock ??
        medicine?.quantity ??
        0
    );

    if (qty > stock) {
      setError(
        `Only ${stock} units available in stock.`
      );

      return;
    }

    setError("");

    setItems((prev) =>
      prev.map((item) =>
        item.medicine === medicineId
          ? {
              ...item,
              quantity: qty,
            }
          : item
      )
    );
  };

  // ===================================================
  // UPDATE ITEM DISCOUNT
  // ===================================================

  const updateItemDiscount = (
    medicineId,
    value
  ) => {
    let discountValue = Number(value);

    if (!Number.isFinite(discountValue)) {
      discountValue = 0;
    }

    if (discountValue < 0) {
      discountValue = 0;
    }

    if (discountValue > 100) {
      discountValue = 100;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.medicine === medicineId
          ? {
              ...item,
              discount: discountValue,
            }
          : item
      )
    );
  };

  // ===================================================
  // ITEM TOTAL
  // ===================================================

  const getItemBaseTotal = (item) => {
    return (
      Number(item.quantity || 0) *
      Number(item.price || 0)
    );
  };

  const getItemDiscountAmount = (item) => {
    const base = getItemBaseTotal(item);

    return (
      (base *
        Number(item.discount || 0)) /
      100
    );
  };

  const getItemTotal = (item) => {
    return (
      getItemBaseTotal(item) -
      getItemDiscountAmount(item)
    );
  };

  // ===================================================
  // SUBTOTAL
  // ===================================================

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + getItemTotal(item),
      0
    );
  }, [items]);

  // ===================================================
  // ITEM DISCOUNT TOTAL
  // ===================================================

  const itemDiscountTotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        getItemDiscountAmount(item),
      0
    );
  }, [items]);

  // ===================================================
  // GRAND TOTAL
  // ===================================================

  const grandTotal = Math.max(
    subtotal - Number(discount || 0),
    0
  );

  // ===================================================
  // TOTAL QUANTITY
  // ===================================================

  const totalQuantity = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  }, [items]);

  // ===================================================
  // INVOICE NUMBER
  // ===================================================

  const generateInvoiceNumber = () => {
    const now = new Date();

    const date =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0");

    const time =
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");

    return `INV-${date}-${time}`;
  };

  // ===================================================
  // SELECTED STORE NAME
  // ===================================================

  const selectedStoreName =
    stores.find(
      (item) => item._id === store
    )?.name || "-";

  // ===================================================
  // RESET BILL
  // ===================================================

  const resetBilling = () => {
    setItems([]);

    setCustomerName("");

    setCustomerPhone("");

    setStore("");

    setSelectedMedicine("");

    setQuantity(1);

    setPaymentMethod("cash");

    setDiscount(0);

    setNotes("");

    setInvoiceNumber("");

    setMedicineSearch("");

    setSuccess("");

    setError("");
  };

  // ===================================================
  // SAVE SALE
  // ===================================================

  const handleSaveSale = async () => {
    setError("");
    setSuccess("");

    if (items.length === 0) {
      setError(
        "Please add at least one medicine."
      );

      return;
    }

    if (!store) {
      setError("Please select a store.");
      return;
    }

    try {
      setSaving(true);

      const generatedInvoice =
        invoiceNumber ||
        generateInvoiceNumber();

      setInvoiceNumber(generatedInvoice);

      const saleData = {
        invoiceNumber: generatedInvoice,

        customerName:
          customerName.trim() ||
          "Walk-in Customer",

        customerPhone:
          customerPhone.trim(),

        store,

        paymentMethod,

        notes: notes.trim(),

        items: items.map((item) => ({
          medicine: item.medicine,

          quantity: Number(
            item.quantity
          ),

          price: Number(
            item.price
          ),

          discount: Number(
            item.discount || 0
          ),
        })),

        subtotal: Number(
          subtotal.toFixed(2)
        ),

        itemDiscountTotal: Number(
          itemDiscountTotal.toFixed(2)
        ),

        extraDiscount: Number(
          discount || 0
        ),

        totalQuantity,

        totalAmount: Number(
          grandTotal.toFixed(2)
        ),
      };

      await createSale(saleData);

      setSuccess(
        "Sale completed successfully."
      );

      setItems([]);

      setCustomerName("");

      setCustomerPhone("");

      setSelectedMedicine("");

      setQuantity(1);

      setDiscount(0);

      setNotes("");

      setInvoiceNumber("");

      await loadData();
    } catch (err) {
      console.error(
        "Billing sale error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create sale."
      );
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // PRINT BILL
  // ===================================================

  const printBill = () => {
    if (items.length === 0) {
      setError(
        "Please add at least one medicine before printing."
      );

      return;
    }

    setError("");

    const number =
      invoiceNumber ||
      generateInvoiceNumber();

    setInvoiceNumber(number);

    // Give React time to update invoice number
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // ===================================================
  // FORMAT CURRENCY
  // ===================================================

  const formatCurrency = (amount) => {
    return Number(
      amount || 0
    ).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // ===================================================
  // PAYMENT LABEL
  // ===================================================

  const getPaymentLabel = () => {
    const labels = {
      cash: "Cash",
      card: "Card",
      upi: "UPI",
      online: "Online",
      credit: "Credit",
    };

    return (
      labels[paymentMethod] ||
      paymentMethod
    );
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="billing-page">
        <div className="billing-loading">
          <RefreshCw
            size={28}
            className="billing-spin"
          />

          <p>
            Loading billing...
          </p>
        </div>
      </div>
    );
  }

  // ===================================================
  // RETURN
  // ===================================================

  return (
    <div className="billing-page">

      {/* =================================================
          NORMAL BILLING SCREEN
      ================================================= */}

      <div className="billing-screen">

        {/* HEADER */}

        <div className="billing-header">

          <div>
            <h1>
              Pharmacy Billing
            </h1>

            <p>
              Create a new medicine sale
              and generate invoice.
            </p>
          </div>

          <button
            className="billing-print-btn"
            onClick={printBill}
            disabled={items.length === 0}
          >
            <Printer size={18} />

            Print Bill
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="billing-message billing-error">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="billing-message billing-success">
            {success}
          </div>
        )}

        {/* MAIN LAYOUT */}

        <div className="billing-layout">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="billing-left">

            {/* CUSTOMER DETAILS */}

            <div className="billing-card">

              <div className="billing-card-header">
                <h2>
                  Customer Details
                </h2>
              </div>

              <div className="billing-form-grid">

                <div className="billing-field">
                  <label>
                    Customer Name
                  </label>

                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) =>
                      setCustomerName(
                        e.target.value
                      )
                    }
                    placeholder="Walk-in Customer"
                  />
                </div>

                <div className="billing-field">
                  <label>
                    Phone Number
                  </label>

                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) =>
                      setCustomerPhone(
                        e.target.value
                      )
                    }
                    placeholder="Customer phone"
                  />
                </div>

                <div className="billing-field">
                  <label>
                    Store *
                  </label>

                  <select
                    value={store}
                    onChange={(e) =>
                      setStore(e.target.value)
                    }
                  >
                    <option value="">
                      Select Store
                    </option>

                    {stores.map((item) => (
                      <option
                        key={item._id}
                        value={item._id}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="billing-field">
                  <label>
                    Payment Method
                  </label>

                  <select
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  >
                    <option value="cash">
                      Cash
                    </option>

                    <option value="card">
                      Card
                    </option>

                    <option value="upi">
                      UPI
                    </option>

                    <option value="online">
                      Online
                    </option>

                    <option value="credit">
                      Credit
                    </option>
                  </select>
                </div>

              </div>
            </div>

            {/* =================================================
                ADD MEDICINE
            ================================================= */}

            <div className="billing-card">

              <div className="billing-card-header">
                <h2>
                  Add Medicine
                </h2>
              </div>

              <div className="add-medicine-row">

                <div className="billing-field medicine-search-field">

                  <label>
                    Search Medicine
                  </label>

                  <div className="medicine-search-box">

                    <Search size={18} />

                    <input
                      type="text"
                      value={medicineSearch}
                      onChange={(e) =>
                        setMedicineSearch(
                          e.target.value
                        )
                      }
                      placeholder="Search medicine..."
                    />

                  </div>
                </div>

                <div className="billing-field">

                  <label>
                    Medicine
                  </label>

                  <select
                    value={selectedMedicine}
                    onChange={(e) =>
                      setSelectedMedicine(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select Medicine
                    </option>

                    {filteredMedicines.map(
                      (medicine) => (
                        <option
                          key={medicine._id}
                          value={medicine._id}
                        >
                          {medicine.name} — Stock:{" "}
                          {medicine.stock ??
                            medicine.quantity ??
                            0}
                        </option>
                      )
                    )}
                  </select>

                </div>

                <div className="billing-field quantity-field">

                  <label>
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        e.target.value
                      )
                    }
                  />

                </div>

                <button
                  className="add-medicine-btn"
                  onClick={addItem}
                >
                  <Plus size={18} />

                  Add
                </button>

              </div>
            </div>

            {/* =================================================
                BILLING ITEMS
            ================================================= */}

            <div className="billing-card">

              <div className="billing-card-header">

                <h2>
                  <ShoppingCart size={19} />

                  Billing Items
                </h2>

                <span className="items-total">
                  {totalQuantity} items
                </span>

              </div>

              {items.length === 0 ? (

                <div className="empty-billing">

                  <ShoppingCart size={42} />

                  <h3>
                    No medicines added
                  </h3>

                  <p>
                    Select a medicine above
                    to add it to the bill.
                  </p>

                </div>

              ) : (

                <div className="billing-items-table-wrapper">

                  <table className="billing-items-table">

                    <thead>

                      <tr>
                        <th>
                          Medicine
                        </th>

                        <th>
                          Batch
                        </th>

                        <th>
                          Rate
                        </th>

                        <th>
                          Qty
                        </th>

                        <th>
                          Discount %
                        </th>

                        <th>
                          Total
                        </th>

                        <th></th>
                      </tr>

                    </thead>

                    <tbody>

                      {items.map((item) => (

                        <tr
                          key={item.medicine}
                        >

                          <td>
                            <strong>
                              {item.name}
                            </strong>

                            {item.genericName && (
                              <small className="item-generic">
                                {item.genericName}
                              </small>
                            )}
                          </td>

                          <td>
                            {item.batchNumber}
                          </td>

                          <td>
                            ₹
                            {formatCurrency(
                              item.price
                            )}
                          </td>

                          <td>
                            <input
                              className="item-number-input"
                              type="number"
                              min="1"
                              value={
                                item.quantity
                              }
                              onChange={(e) =>
                                updateItemQuantity(
                                  item.medicine,
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          <td>
                            <input
                              className="item-number-input"
                              type="number"
                              min="0"
                              max="100"
                              value={
                                item.discount
                              }
                              onChange={(e) =>
                                updateItemDiscount(
                                  item.medicine,
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          <td>
                            <strong>
                              ₹
                              {formatCurrency(
                                getItemTotal(
                                  item
                                )
                              )}
                            </strong>
                          </td>

                          <td>
                            <button
                              className="remove-item-btn"
                              onClick={() =>
                                removeItem(
                                  item.medicine
                                )
                              }
                              title="Remove"
                            >
                              <Trash2
                                size={17}
                              />
                            </button>
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

            {/* =================================================
                NOTES
            ================================================= */}

            <div className="billing-card">

              <div className="billing-card-header">

                <h2>
                  Notes
                </h2>

              </div>

              <textarea
                className="billing-notes"
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                placeholder="Add any notes..."
                rows="4"
              />

            </div>

          </div>

          {/* =================================================
              RIGHT SUMMARY
          ================================================= */}

          <div className="billing-right">

            <div className="billing-summary-card">

              <div className="summary-header">

                <div>
                  <h2>
                    Bill Summary
                  </h2>

                  <span>
                    New Pharmacy Invoice
                  </span>
                </div>

                <IndianRupee size={24} />

              </div>

              <div className="summary-row">
                <span>
                  Items
                </span>

                <strong>
                  {totalQuantity}
                </strong>
              </div>

              <div className="summary-row">
                <span>
                  Subtotal
                </span>

                <strong>
                  ₹
                  {formatCurrency(
                    subtotal
                  )}
                </strong>
              </div>

              <div className="summary-row">
                <span>
                  Item Discount
                </span>

                <strong>
                  ₹
                  {formatCurrency(
                    itemDiscountTotal
                  )}
                </strong>
              </div>

              <div className="summary-row discount-row">

                <span>
                  Extra Discount
                </span>

                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) =>
                    setDiscount(
                      Math.max(
                        0,
                        Number(
                          e.target.value
                        )
                      )
                    )
                  }
                />

              </div>

              <div className="summary-divider"></div>

              <div className="grand-total-row">

                <span>
                  Grand Total
                </span>

                <strong>
                  ₹
                  {formatCurrency(
                    grandTotal
                  )}
                </strong>

              </div>

              <div className="payment-info">

                <CreditCard size={17} />

                <span>
                  Payment:{" "}
                  <strong>
                    {getPaymentLabel()}
                  </strong>
                </span>

              </div>

              <button
                className="complete-sale-btn"
                onClick={
                  handleSaveSale
                }
                disabled={
                  saving ||
                  items.length === 0
                }
              >
                {saving ? (
                  <>
                    <RefreshCw
                      size={18}
                      className="billing-spin"
                    />

                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard
                      size={18}
                    />

                    Complete Sale
                  </>
                )}
              </button>

              <button
                className="clear-bill-btn"
                onClick={
                  resetBilling
                }
                disabled={saving}
              >
                Clear Bill
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          PRINTABLE A4 PHARMACY INVOICE
          ONLY THIS WILL PRINT
      ===================================================== */}

      <div className="pharmacy-invoice-print">

        {/* HOSPITAL HEADER */}

        <div className="invoice-header">

          <div className="invoice-logo-area">

            {HOSPITAL_INFO.logo ? (

              <img
                src={HOSPITAL_INFO.logo}
                alt="Hospital Logo"
                className="invoice-logo"
              />

            ) : (

              <div className="invoice-logo-placeholder">
                CC
              </div>

            )}

          </div>

          <div className="invoice-hospital-info">

            <h1>
              {HOSPITAL_INFO.name}
            </h1>

            <p>
              {HOSPITAL_INFO.address}
            </p>

            <p>
              Mob: {HOSPITAL_INFO.phone}
            </p>

          </div>

        </div>

        {/* INVOICE TITLE */}

        <div className="invoice-title">
          PHARMACY INVOICE
        </div>

        {/* INVOICE INFORMATION */}

        <div className="invoice-meta">

          <div>
            <strong>
              Invoice No:
            </strong>{" "}
            {invoiceNumber ||
              generateInvoiceNumber()}
          </div>

          <div>
            <strong>
              Date:
            </strong>{" "}
            {new Date().toLocaleDateString(
              "en-IN"
            )}
          </div>

        </div>

        {/* CUSTOMER INFORMATION */}

        <div className="invoice-customer">

          <div>
            <strong>
              Customer Name:
            </strong>{" "}
            {customerName ||
              "Walk-in Customer"}
          </div>

          <div>
            <strong>
              Phone:
            </strong>{" "}
            {customerPhone || "-"}
          </div>

          <div>
            <strong>
              Store:
            </strong>{" "}
            {selectedStoreName}
          </div>

          <div>
            <strong>
              Payment:
            </strong>{" "}
            {getPaymentLabel()}
          </div>

        </div>

        {/* MEDICINE TABLE */}

        <table className="invoice-items-table">

          <thead>

            <tr>

              <th>
                #
              </th>

              <th>
                Medicine
              </th>

              <th>
                Batch No.
              </th>

              <th>
                Rate
              </th>

              <th>
                Qty
              </th>

              <th>
                Discount
              </th>

              <th>
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {items.map(
              (item, index) => (

                <tr
                  key={item.medicine}
                >

                  <td>
                    {index + 1}
                  </td>

                  <td>

                    <strong>
                      {item.name}
                    </strong>

                    {item.genericName && (
                      <small className="invoice-generic">
                        {item.genericName}
                      </small>
                    )}

                  </td>

                  <td>
                    {item.batchNumber ||
                      "-"}
                  </td>

                  <td>
                    ₹
                    {formatCurrency(
                      item.price
                    )}
                  </td>

                  <td>
                    {item.quantity}
                  </td>

                  <td>
                    {item.discount || 0}%
                  </td>

                  <td>
                    ₹
                    {formatCurrency(
                      getItemTotal(item)
                    )}
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

        {/* TOTALS */}

        <div className="invoice-total-section">

          <div className="invoice-total-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₹
              {formatCurrency(
                subtotal
              )}
            </strong>

          </div>

          <div className="invoice-total-row">

            <span>
              Item Discount
            </span>

            <strong>
              - ₹
              {formatCurrency(
                itemDiscountTotal
              )}
            </strong>

          </div>

          <div className="invoice-total-row">

            <span>
              Extra Discount
            </span>

            <strong>
              - ₹
              {formatCurrency(
                discount
              )}
            </strong>

          </div>

          <div className="invoice-grand-total">

            <span>
              GRAND TOTAL
            </span>

            <strong>
              ₹
              {formatCurrency(
                grandTotal
              )}
            </strong>

          </div>

        </div>

        {/* NOTES */}

        {notes && (

          <div className="invoice-notes">

            <strong>
              Notes:
            </strong>{" "}
            {notes}

          </div>

        )}

        {/* FOOTER */}

        <div className="invoice-footer">

          <div>
            Thank you for visiting{" "}
            <strong>
              {HOSPITAL_INFO.name}
            </strong>
          </div>

          <div>
            This is a computer generated invoice.
          </div>

        </div>

      </div>

    </div>
  );
}