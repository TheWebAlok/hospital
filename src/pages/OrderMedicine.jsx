import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Pill,
  MapPin,
  Phone,
  Mail,
  User,
  PackageCheck,
  RefreshCw,
} from "lucide-react";

import {
  getMedicines,
  createMedicineOrder,
} from "../services/pharmacyApi";

import "./OrderMedicine.css";

export default function OrderMedicine() {
  // =====================================================
  // BASIC STATE
  // =====================================================

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Used to keep the print window reference
  const printWindowRef = useRef(null);

  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] = useState({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "cash_on_delivery",
    notes: "",
  });

  // =====================================================
  // LOAD MEDICINES
  // =====================================================

  const loadMedicines = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMedicines();

      console.log("MEDICINES RESPONSE:", response);

      const data =
        Array.isArray(response)
          ? response
          : Array.isArray(response?.medicines)
          ? response.medicines
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.medicines)
          ? response.data.medicines
          : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

      setMedicines(data);
    } catch (err) {
      console.error(
        "ORDER MEDICINE LOAD ERROR:",
        err
      );

      setMedicines([]);

      setError(
        err?.response?.data?.message ||
          "Failed to load medicines"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadMedicines();

    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      setForm((prev) => ({
        ...prev,
        patientName: user?.name || "",
        patientEmail: user?.email || "",
        patientPhone: user?.phone || "",
      }));
    } catch (err) {
      console.error(
        "USER PREFILL ERROR:",
        err
      );
    }
  }, []);

  // =====================================================
  // FILTER MEDICINES
  // =====================================================

  const filteredMedicines = useMemo(() => {
    const term = search
      .trim()
      .toLowerCase();

    if (!term) {
      return medicines;
    }

    return medicines.filter((medicine) => {
      return (
        String(medicine?.name || "")
          .toLowerCase()
          .includes(term) ||
        String(medicine?.genericName || "")
          .toLowerCase()
          .includes(term) ||
        String(medicine?.manufacturer || "")
          .toLowerCase()
          .includes(term) ||
        String(medicine?.composition || "")
          .toLowerCase()
          .includes(term)
      );
    });
  }, [medicines, search]);

  // =====================================================
  // HELPERS
  // =====================================================

  const getStock = (medicine) => {
    return Number(
      medicine?.stock ??
        medicine?.quantity ??
        0
    );
  };

  const getPrice = (medicine) => {
    return Number(
      medicine?.sellingPrice ??
        medicine?.price ??
        0
    );
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = (medicine) => {
    setError("");
    setMessage("");

    if (!medicine?._id) {
      setError(
        "Invalid medicine selected"
      );
      return;
    }

    const stock = getStock(medicine);

    if (stock <= 0) {
      setError(
        `${medicine.name} is currently out of stock`
      );
      return;
    }

    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.medicine ===
          medicine._id
      );

      if (existing) {
        if (existing.quantity >= stock) {
          return prev;
        }

        return prev.map((item) =>
          item.medicine ===
          medicine._id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          medicine: medicine._id,
          name: medicine.name || "",
          genericName:
            medicine.genericName ||
            medicine.composition ||
            "",
          price: getPrice(medicine),
          quantity: 1,
          stock,
        },
      ];
    });
  };

  // =====================================================
  // UPDATE QUANTITY
  // =====================================================

  const updateQuantity = (
    medicineId,
    quantity
  ) => {
    const item = cart.find(
      (cartItem) =>
        cartItem.medicine ===
        medicineId
    );

    if (!item) return;

    let newQuantity = Number(quantity);

    if (Number.isNaN(newQuantity)) {
      newQuantity = 1;
    }

    newQuantity = Math.max(
      1,
      Math.min(newQuantity, item.stock)
    );

    setCart((prev) =>
      prev.map((cartItem) =>
        cartItem.medicine ===
        medicineId
          ? {
              ...cartItem,
              quantity: newQuantity,
            }
          : cartItem
      )
    );
  };

  // =====================================================
  // REMOVE FROM CART
  // =====================================================

  const removeFromCart = (
    medicineId
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          item.medicine !==
          medicineId
      )
    );
  };

  // =====================================================
  // TOTAL
  // =====================================================

  const totalAmount = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // OPEN PRINT WINDOW
  // =====================================================

  const openPrintWindow = () => {
    const printWindow = window.open(
      "",
      "_blank",
      "width=950,height=900,left=100,top=50"
    );

    if (!printWindow) {
      alert(
        "Print window blocked. Please allow popups for this website."
      );

      return null;
    }

    printWindowRef.current =
      printWindow;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Preparing Invoice...</title>
        </head>

        <body
          style="
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
          "
        >
          Preparing invoice...
        </body>
      </html>
    `);

    printWindow.document.close();

    return printWindow;
  };

  // =====================================================
  // GENERATE INVOICE HTML
  // =====================================================

  const buildInvoiceHTML = (
    invoice
  ) => {
    const date = new Date(
      invoice.date
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const medicineRows =
      invoice.medicines
        .map((item, index) => {
          const itemTotal =
            Number(item.price || 0) *
            Number(item.quantity || 0);

          return `
            <tr class="medicine-row">

              <td class="center">
                ${index + 1}
              </td>

              <td>
                <div class="medicine-name">
                  <strong>
                    ${escapeHTML(
                      item.name || "-"
                    )}
                  </strong>

                  ${
                    item.genericName
                      ? `
                        <small>
                          ${escapeHTML(
                            item.genericName
                          )}
                        </small>
                      `
                      : ""
                  }
                </div>
              </td>

              <td class="center">
                ${item.quantity}
              </td>

              <td class="money">
                ₹${Number(
                  item.price || 0
                ).toFixed(2)}
              </td>

              <td class="money">
                ₹${itemTotal.toFixed(2)}
              </td>

            </tr>
          `;
        })
        .join("");

    return `
<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8" />

<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<title>
  Pharmacy Invoice
</title>

<style>

@page {
  size: A4 portrait;
  margin: 0;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;

  width: 210mm;

  background: #ffffff;
}

body {
  font-family:
    Arial,
    Helvetica,
    sans-serif;

  color: #17233c;
}

.invoice-page {
  width: 210mm;

  min-height: 297mm;

  padding: 12mm;

  background: #ffffff;
}

/* =====================================================
   HEADER
===================================================== */

.invoice-header {
  display: flex;
  align-items: center;

  width: 100%;
}

.invoice-logo {
  width: 45px;
  height: 45px;

  flex-shrink: 0;

  margin-right: 14px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #243f8f;

  color: #ffffff;

  font-size: 17px;
  font-weight: 800;
}

.hospital-name {
  margin: 0 0 4px;

  color: #243f8f;

  font-size: 25px;

  line-height: 1.1;

  font-weight: 800;
}

.hospital-info {
  margin: 1px 0;

  color: #50617e;

  font-size: 8px;

  line-height: 1.3;
}

.invoice-blue-line {
  width: 100%;

  height: 3px;

  margin-top: 8px;

  background: #243f8f;
}

/* =====================================================
   TITLE
===================================================== */

.invoice-title {
  margin: 10px 0;

  text-align: center;

  color: #243f8f;

  font-size: 16px;

  font-weight: 800;
}

/* =====================================================
   META
===================================================== */

.invoice-meta {
  display: grid;

  grid-template-columns: 1fr 1fr;

  width: 100%;

  margin-bottom: 8px;

  padding: 7px 9px;

  border: 1px solid #c8d4e6;

  background: #edf3fa;

  font-size: 9px;

  break-inside: avoid;
  page-break-inside: avoid;
}

.invoice-meta-right {
  text-align: right;
}

/* =====================================================
   CUSTOMER
===================================================== */

.customer-box {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 8px;

  width: 100%;

  padding: 8px 9px;

  margin-bottom: 10px;

  border: 1px solid #c8d4e6;

  border-radius: 3px;

  font-size: 9px;

  line-height: 1.4;

  break-inside: avoid;
  page-break-inside: avoid;
}

.customer-box strong {
  color: #17233c;
}

/* =====================================================
   BILL AREA
===================================================== */

.invoice-content {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    180px;

  gap: 12px;

  align-items: start;
}

/* =====================================================
   MEDICINE TABLE
===================================================== */

.medicine-table {
  width: 100%;

  border-collapse: collapse;

  border: 1px solid #c8d4e6;

  font-size: 8px;
}

.medicine-table thead {
  display: table-header-group;
}

.medicine-table th {
  padding: 7px 6px;

  border-right: 1px solid #c8d4e6;

  background: #243f8f;

  color: #ffffff;

  text-align: left;

  font-size: 8px;

  font-weight: 700;
}

.medicine-table th:last-child {
  border-right: none;
}

.medicine-row {
  break-inside: avoid;
  page-break-inside: avoid;
}

.medicine-row td {
  padding: 7px 6px;

  border-top: 1px solid #d9e1ed;

  border-right: 1px solid #c8d4e6;

  color: #26364e;

  vertical-align: middle;

  font-size: 8px;
}

.medicine-row td:last-child {
  border-right: none;
}

.center {
  text-align: center !important;
}

.money {
  text-align: right !important;
  white-space: nowrap;
}

.medicine-name {
  display: flex;

  flex-direction: column;

  gap: 2px;
}

.medicine-name strong {
  font-size: 8px;
}

.medicine-name small {
  color: #6d7b91;

  font-size: 7px;
}

/* =====================================================
   SUMMARY
===================================================== */

.invoice-summary {
  padding-top: 62px;

  break-inside: avoid;
  page-break-inside: avoid;
}

.summary-row {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  padding: 5px 0;

  color: #64728a;

  font-size: 8px;
}

.summary-row strong {
  color: #17233c;

  font-weight: 700;

  white-space: nowrap;
}

.summary-divider {
  width: 100%;

  height: 1px;

  margin: 5px 0;

  background: #243f8f;
}

.grand-total {
  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 8px 0;

  color: #17233c;

  font-size: 10px;

  font-weight: 800;
}

.grand-total strong {
  color: #149447;

  font-size: 13px;

  white-space: nowrap;
}

.summary-bottom-line {
  width: 100%;

  height: 2px;

  background: #243f8f;
}

/* =====================================================
   FOOTER
===================================================== */

.invoice-footer {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  padding-top: 8px;

  margin-top: 25px;

  border-top: 1px solid #c8d4e6;

  color: #718097;

  font-size: 7px;

  break-inside: avoid;
  page-break-inside: avoid;
}

/* =====================================================
   PRINT
===================================================== */

@media print {

  html,
  body {
    width: 210mm;

    margin: 0;

    padding: 0;

    background: #ffffff;
  }

  .invoice-page {
    width: 210mm;

    min-height: 297mm;

    margin: 0;

    padding: 12mm;
  }

}

</style>

</head>

<body>

<div class="invoice-page">

  <!-- HEADER -->

  <div class="invoice-header">

    <div class="invoice-logo">
      CC
    </div>

    <div>

      <h1 class="hospital-name">
        City Care Hospital
      </h1>

      <p class="hospital-info">
        Your Clinic Address, City, State
      </p>

      <p class="hospital-info">
        Mob: +91 00000 00000
      </p>

    </div>

  </div>

  <div class="invoice-blue-line"></div>

  <!-- TITLE -->

  <h2 class="invoice-title">
    PHARMACY INVOICE
  </h2>

  <!-- META -->

  <div class="invoice-meta">

    <div>
      <strong>
        Invoice No:
      </strong>

      ${escapeHTML(
        invoice.invoiceNo
      )}
    </div>

    <div class="invoice-meta-right">

      <strong>
        Date:
      </strong>

      ${date}

    </div>

  </div>

  <!-- CUSTOMER -->

  <div class="customer-box">

    <div>
      <strong>
        Customer Name:
      </strong>

      ${escapeHTML(
        invoice.patientName
      )}
    </div>

    <div>
      <strong>
        Phone:
      </strong>

      ${escapeHTML(
        invoice.patientPhone
      )}
    </div>

    <div>
      <strong>
        Address:
      </strong>

      ${escapeHTML(
        invoice.address || "-"
      )}
    </div>

    <div>
      <strong>
        Payment:
      </strong>

      ${escapeHTML(
        invoice.paymentMethod
      )}
    </div>

  </div>

  <!-- CONTENT -->

  <div class="invoice-content">

    <!-- LEFT MEDICINE TABLE -->

    <div>

      <table class="medicine-table">

        <thead>

          <tr>

            <th
              style="
                width: 30px;
                text-align: center;
              "
            >
              #
            </th>

            <th>
              Medicine
            </th>

            <th
              style="
                width: 40px;
                text-align: center;
              "
            >
              Qty
            </th>

            <th
              style="
                width: 60px;
                text-align: right;
              "
            >
              Rate
            </th>

            <th
              style="
                width: 70px;
                text-align: right;
              "
            >
              Total
            </th>

          </tr>

        </thead>

        <tbody>

          ${medicineRows}

        </tbody>

      </table>

    </div>

    <!-- RIGHT BILL -->

    <div class="invoice-summary">

      <div class="summary-row">

        <span>
          Subtotal
        </span>

        <strong>
          ₹${Number(
            invoice.subtotal || 0
          ).toFixed(2)}
        </strong>

      </div>

      <div class="summary-row">

        <span>
          Item Discount
        </span>

        <strong>
          - ₹0.00
        </strong>

      </div>

      <div class="summary-row">

        <span>
          Extra Discount
        </span>

        <strong>
          - ₹${Number(
            invoice.discount || 0
          ).toFixed(2)}
        </strong>

      </div>

      <div class="summary-divider"></div>

      <div class="grand-total">

        <span>
          GRAND TOTAL
        </span>

        <strong>
          ₹${Number(
            invoice.grandTotal || 0
          ).toFixed(2)}
        </strong>

      </div>

      <div class="summary-bottom-line"></div>

    </div>

  </div>

  <!-- FOOTER -->

  <div class="invoice-footer">

    <span>
      Thank you for visiting City Care Hospital
    </span>

    <span>
      This is a computer generated invoice.
    </span>

  </div>

</div>

</body>

</html>
`;
  };

  // =====================================================
  // HTML ESCAPE
  // =====================================================

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // =====================================================
  // PRINT INVOICE
  // =====================================================

  const printMedicineInvoice = (
    invoice
  ) => {
    const printWindow =
      printWindowRef.current;

    if (
      !printWindow ||
      printWindow.closed
    ) {
      console.error(
        "Print window is not available."
      );
      return;
    }

    const html =
      buildInvoiceHTML(invoice);

    printWindow.document.open();

    printWindow.document.write(html);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
      try {
        printWindow.print();
      } catch (err) {
        console.error(
          "PRINT ERROR:",
          err
        );
      }
    }, 700);
  };

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder = async (
    e
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // ---------------------------------------------------
    // VALIDATE CART
    // ---------------------------------------------------

    if (cart.length === 0) {
      setError(
        "Please select at least one medicine"
      );
      return;
    }

    // ---------------------------------------------------
    // VALIDATE PATIENT
    // ---------------------------------------------------

    if (
      !form.patientName.trim() ||
      !form.patientPhone.trim() ||
      !form.address.trim()
    ) {
      setError(
        "Please fill patient name, phone and address"
      );
      return;
    }

    // ---------------------------------------------------
    // OPEN WINDOW BEFORE ASYNC REQUEST
    // This prevents popup blocker
    // ---------------------------------------------------

    const printWindow =
      openPrintWindow();

    if (!printWindow) {
      return;
    }

    try {
      setPlacingOrder(true);

      // =================================================
      // SAVE CART DATA
      // =================================================

      const orderedMedicines =
        cart.map((item) => ({
          medicine:
            item.medicine,

          medicineId:
            item.medicine,

          name:
            item.name,

          genericName:
            item.genericName || "",

          dosage: "",

          duration: "",

          instructions: "",

          quantity:
            item.quantity,

          price:
            Number(
              item.price || 0
            ),

          total:
            Number(
              item.price || 0
            ) *
            Number(
              item.quantity || 0
            ),
        }));

      // =================================================
      // BACKEND ORDER DATA
      // =================================================

      const orderData = {
        patientName:
          form.patientName.trim(),

        patientPhone:
          form.patientPhone.trim(),

        patientEmail:
          form.patientEmail.trim(),

        address:
          form.address.trim(),

        city:
          form.city.trim(),

        pincode:
          form.pincode.trim(),

        paymentMethod:
          form.paymentMethod,

        notes:
          form.notes.trim(),

        items:
          cart.map((item) => ({
            medicine:
              item.medicine,

            quantity:
              item.quantity,
          })),
      };

      console.log(
        "PLACING MEDICINE ORDER:",
        orderData
      );

      // =================================================
      // SAVE ORDER
      // =================================================

      const response =
        await createMedicineOrder(
          orderData
        );

      console.log(
        "MEDICINE ORDER CREATED:",
        response
      );

      // =================================================
      // SUCCESS
      // =================================================

      setMessage(
        response?.message ||
          "Medicine order placed successfully"
      );

      // =================================================
      // BILL CALCULATION
      // =================================================

      const subtotal =
        orderedMedicines.reduce(
          (sum, item) =>
            sum +
            Number(
              item.price || 0
            ) *
              Number(
                item.quantity || 0
              ),
          0
        );

      const discount = 0;

      const grandTotal =
        subtotal - discount;

      // =================================================
      // INVOICE DATA
      // =================================================

      const invoiceData = {
        invoiceNo:
          response?.order?._id
            ? `ORD-${String(
                response.order._id
              )
                .slice(-8)
                .toUpperCase()}`
            : `ORD-${Date.now()
                .toString()
                .slice(-8)}`,

        date:
          new Date(),

        patientName:
          form.patientName.trim(),

        patientPhone:
          form.patientPhone.trim(),

        patientEmail:
          form.patientEmail.trim(),

        address: [
          form.address.trim(),
          form.city.trim(),
          form.pincode.trim(),
        ]
          .filter(Boolean)
          .join(", "),

        paymentMethod:
          form.paymentMethod ===
          "cash_on_delivery"
            ? "Cash"
            : "Online",

        medicines:
          orderedMedicines,

        subtotal,

        discount,

        grandTotal,
      };

      console.log(
        "PRINT INVOICE DATA:",
        invoiceData
      );

      // =================================================
      // PRINT
      // =================================================

      printMedicineInvoice(
        invoiceData
      );

      // =================================================
      // CLEAR CART
      // =================================================

      setCart([]);

      // =================================================
      // CLEAR DELIVERY FIELDS
      // =================================================

      setForm((prev) => ({
        ...prev,

        address: "",
        city: "",
        pincode: "",
        notes: "",
      }));
    } catch (err) {
      console.error(
        "PLACE ORDER ERROR:",
        err
      );

      // Close print window because
      // order failed
      if (
        printWindow &&
        !printWindow.closed
      ) {
        printWindow.close();
      }

      setError(
        err?.response?.data
          ?.message ||
          err?.message ||
          "Failed to place medicine order"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="order-medicine-page">

        <div className="order-loading">

          <RefreshCw
            size={28}
            className="order-spin"
          />

          <p>
            Loading medicines...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="order-medicine-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="order-page-header">

        <div>

          <span className="order-small-title">
            PHARMACY
          </span>

          <h1>
            Order Medicines
          </h1>

          <p>
            Select medicines according to
            your requirement and place your
            order.
          </p>

        </div>

        <div className="order-header-icon">

          <Pill size={32} />

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="order-message order-error">
          {error}
        </div>
      )}

      {/* =================================================
          SUCCESS
      ================================================= */}

      {message && (
        <div className="order-message order-success">

          <PackageCheck size={20} />

          {message}

        </div>
      )}

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="order-layout">

        {/* =================================================
            MEDICINES
        ================================================= */}

        <div className="order-medicines-section">

          <div className="order-search-box">

            <Search size={20} />

            <input
              type="text"
              placeholder="Search medicine..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          <div className="medicine-order-grid">

            {filteredMedicines.map(
              (medicine) => {

                const stock =
                  getStock(
                    medicine
                  );

                const price =
                  getPrice(
                    medicine
                  );

                return (
                  <div
                    className="medicine-order-card"
                    key={
                      medicine._id
                    }
                  >

                    <div className="medicine-order-icon">

                      <Pill
                        size={26}
                      />

                    </div>

                    <div className="medicine-order-info">

                      <h3>
                        {medicine.name}
                      </h3>

                      {medicine.genericName && (
                        <p>
                          {
                            medicine.genericName
                          }
                        </p>
                      )}

                      <div className="medicine-price">

                        ₹
                        {price.toFixed(
                          2
                        )}

                      </div>

                      <span
                        className={
                          stock > 0
                            ? "stock-available"
                            : "stock-out"
                        }
                      >

                        {stock > 0
                          ? `${stock} available`
                          : "Out of stock"}

                      </span>

                    </div>

                    <button
                      type="button"
                      className="add-order-btn"
                      disabled={
                        stock <= 0
                      }
                      onClick={() =>
                        addToCart(
                          medicine
                        )
                      }
                    >

                      <Plus
                        size={17}
                      />

                      Add

                    </button>

                  </div>
                );
              }
            )}

          </div>

          {filteredMedicines.length ===
            0 && (
            <div className="order-empty">

              <Pill size={45} />

              <h3>
                No medicines found
              </h3>

              <p>
                Try another medicine name.
              </p>

            </div>
          )}

        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="order-right">

          {/* =================================================
              CART
          ================================================= */}

          <div className="order-card">

            <div className="order-card-title">

              <div>

                <h2>

                  <ShoppingCart
                    size={20}
                  />

                  Your Order

                </h2>

                <span>
                  {cart.length} medicine(s)
                </span>

              </div>

            </div>

            {cart.length === 0 ? (

              <div className="cart-empty">

                <ShoppingCart
                  size={38}
                />

                <p>
                  No medicines selected
                </p>

              </div>

            ) : (

              <div className="cart-items">

                {cart.map((item) => (

                  <div
                    className="cart-item"
                    key={
                      item.medicine
                    }
                  >

                    <div>

                      <strong>
                        {item.name}
                      </strong>

                      <small>
                        ₹
                        {Number(
                          item.price || 0
                        ).toFixed(2)}
                      </small>

                    </div>

                    <div className="cart-actions">

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.medicine,
                            item.quantity -
                              1
                          )
                        }
                        disabled={
                          item.quantity <=
                          1
                        }
                      >

                        <Minus
                          size={14}
                        />

                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.medicine,
                            item.quantity +
                              1
                          )
                        }
                        disabled={
                          item.quantity >=
                          item.stock
                        }
                      >

                        <Plus
                          size={14}
                        />

                      </button>

                      <button
                        type="button"
                        className="cart-remove"
                        onClick={() =>
                          removeFromCart(
                            item.medicine
                          )
                        }
                      >

                        <Trash2
                          size={15}
                        />

                      </button>

                    </div>

                  </div>
                ))}

                <div className="order-total">

                  <span>
                    Total Amount
                  </span>

                  <strong>
                    ₹
                    {totalAmount.toFixed(
                      2
                    )}
                  </strong>

                </div>

              </div>
            )}

          </div>

          {/* =================================================
              DELIVERY DETAILS
          ================================================= */}

          <form
            className="order-card"
            onSubmit={
              handlePlaceOrder
            }
          >

            <div className="order-card-title">

              <h2>

                <User
                  size={20}
                />

                Delivery Details

              </h2>

            </div>

            <div className="order-form-grid">

              <div className="order-field">

                <label>
                  Patient Name *
                </label>

                <input
                  name="patientName"
                  value={
                    form.patientName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Patient name"
                  required
                />

              </div>

              <div className="order-field">

                <label>
                  Phone *
                </label>

                <div className="order-input-icon">

                  <Phone
                    size={17}
                  />

                  <input
                    type="tel"
                    name="patientPhone"
                    value={
                      form.patientPhone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Phone number"
                    required
                  />

                </div>

              </div>

              <div className="order-field full">

                <label>
                  Email
                </label>

                <div className="order-input-icon">

                  <Mail
                    size={17}
                  />

                  <input
                    type="email"
                    name="patientEmail"
                    value={
                      form.patientEmail
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Email address"
                  />

                </div>

              </div>

              <div className="order-field full">

                <label>
                  Delivery Address *
                </label>

                <div className="order-input-icon">

                  <MapPin
                    size={17}
                  />

                  <textarea
                    name="address"
                    value={
                      form.address
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter complete delivery address"
                    rows="3"
                    required
                  />

                </div>

              </div>

              <div className="order-field">

                <label>
                  City
                </label>

                <input
                  name="city"
                  value={
                    form.city
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="City"
                />

              </div>

              <div className="order-field">

                <label>
                  Pincode
                </label>

                <input
                  name="pincode"
                  value={
                    form.pincode
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Pincode"
                />

              </div>

              <div className="order-field full">

                <label>
                  Payment Method
                </label>

                <select
                  name="paymentMethod"
                  value={
                    form.paymentMethod
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="cash_on_delivery">
                    Cash on Delivery
                  </option>

                  <option value="online">
                    Online Payment
                  </option>

                </select>

              </div>

              <div className="order-field full">

                <label>
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={
                    form.notes
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Any special instructions..."
                  rows="3"
                />

              </div>

            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={
                placingOrder ||
                cart.length === 0
              }
            >

              {placingOrder ? (
                <>
                  <RefreshCw
                    size={18}
                    className="order-spin"
                  />

                  Placing Order...
                </>
              ) : (
                <>
                  <PackageCheck
                    size={18}
                  />

                  Place Medicine Order
                </>
              )}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}