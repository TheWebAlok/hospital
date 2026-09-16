import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Package,
  Search,
  RefreshCw,
  User,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  Printer,
  ChevronDown,
  ShoppingBag,
} from "lucide-react";

import {
  getMedicineOrders,
  updateMedicineOrderStatus,
} from "../../services/pharmacyApi";

import "./MedicineOrders.css";

export default function MedicineOrders() {
  // =====================================================
  // STATE
  // =====================================================

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [updatingId, setUpdatingId] =
    useState(null);

  const [error, setError] = useState("");

  // Which accordion is open
  const [openOrderId, setOpenOrderId] =
    useState(null);

  // Print window reference
  const printWindowRef = useRef(null);

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getMedicineOrders();

      console.log(
        "MEDICINE ORDERS RESPONSE:",
        response
      );

      /*
        pharmacyApi.js returns response.data.

        Backend:

        {
          success: true,
          count: 1,
          orders: [...]
        }

        Therefore:

        response.orders
      */

      const data =
        response?.orders || [];

      setOrders(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "LOAD MEDICINE ORDERS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load medicine orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadOrders();
  }, []);

  // =====================================================
  // STATUS LABEL
  // =====================================================

  const getStatusLabel = (
    status
  ) => {
    const labels = {
      pending: "Pending",
      accepted: "Accepted",
      packed: "Packed",
      out_for_delivery:
        "Out for Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };

    return (
      labels[status] ||
      status ||
      "Pending"
    );
  };

  // =====================================================
  // FILTER ORDERS
  // =====================================================

  const filteredOrders = useMemo(() => {
    const term =
      search
        .trim()
        .toLowerCase();

    return orders.filter(
      (order) => {
        const matchesStatus =
          statusFilter === "all" ||
          order.status ===
            statusFilter;

        const matchesSearch =
          !term ||
          String(
            order.patientName || ""
          )
            .toLowerCase()
            .includes(term) ||
          String(
            order.patientPhone || ""
          )
            .toLowerCase()
            .includes(term) ||
          order.items?.some(
            (item) =>
              String(
                item.name || ""
              )
                .toLowerCase()
                .includes(term)
          );

        return (
          matchesStatus &&
          matchesSearch
        );
      }
    );
  }, [
    orders,
    search,
    statusFilter,
  ]);

  // =====================================================
  // CHANGE STATUS
  // =====================================================

  const changeStatus = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingId(orderId);
      setError("");

      const response =
        await updateMedicineOrderStatus(
          orderId,
          status
        );

      console.log(
        "STATUS UPDATE RESPONSE:",
        response
      );

      const updatedOrder =
        response?.order;

      if (updatedOrder) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId
              ? updatedOrder
              : order
          )
        );
      } else {
        await loadOrders();
      }
    } catch (err) {
      console.error(
        "UPDATE STATUS ERROR:",
        err
      );

      setError(
        err?.response?.data
          ?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // STATS
  // =====================================================

  const pendingCount =
    orders.filter(
      (order) =>
        order.status === "pending"
    ).length;

  const acceptedCount =
    orders.filter(
      (order) =>
        order.status === "accepted"
    ).length;

  const packedCount =
    orders.filter(
      (order) =>
        order.status === "packed"
    ).length;

  const deliveredCount =
    orders.filter(
      (order) =>
        order.status === "delivered"
    ).length;

  // =====================================================
  // OPEN / CLOSE ACCORDION
  // =====================================================

  const toggleOrder = (
    orderId
  ) => {
    setOpenOrderId((current) =>
      current === orderId
        ? null
        : orderId
    );
  };

  // =====================================================
  // ESCAPE HTML
  // =====================================================

  const escapeHTML = (value) => {
    return String(value ?? "")
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );
  };

  // =====================================================
  // BUILD INVOICE HTML
  // =====================================================

  const buildInvoiceHTML = (
    order
  ) => {
    const invoiceNo =
      `ORD-${String(
        order._id || ""
      )
        .slice(-8)
        .toUpperCase()}`;

    const invoiceDate =
      order.createdAt
        ? new Date(
            order.createdAt
          ).toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          )
        : new Date().toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          );

    const paymentMethod =
      order.paymentMethod ===
      "cash_on_delivery"
        ? "Cash"
        : order.paymentMethod ===
          "online"
        ? "Online"
        : order.paymentMethod ||
          "Cash";

    const items =
      Array.isArray(order.items)
        ? order.items
        : [];

    const subtotal =
      items.reduce(
        (sum, item) => {
          const itemTotal =
            item.total != null
              ? Number(
                  item.total
                )
              : Number(
                  item.price || 0
                ) *
                Number(
                  item.quantity || 0
                );

          return (
            sum +
            itemTotal
          );
        },
        0
      );

    const totalAmount =
      Number(
        order.totalAmount
      );

    const grandTotal =
      Number.isFinite(
        totalAmount
      )
        ? totalAmount
        : subtotal;

    const medicineRows =
      items
        .map(
          (
            item,
            index
          ) => {
            const itemPrice =
              Number(
                item.price || 0
              );

            const itemQty =
              Number(
                item.quantity || 0
              );

            const itemTotal =
              item.total != null
                ? Number(
                    item.total
                  )
                : itemPrice *
                  itemQty;

            return `
              <tr class="medicine-row">

                <td class="center">
                  ${index + 1}
                </td>

                <td>
                  <div class="medicine-name">

                    <strong>
                      ${escapeHTML(
                        item.name ||
                          "-"
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
                  ${itemQty}
                </td>

                <td class="money">
                  ₹${itemPrice.toFixed(2)}
                </td>

                <td class="money">
                  ₹${itemTotal.toFixed(2)}
                </td>

              </tr>
            `;
          }
        )
        .join("");

    const address = [
      order.address,
      order.city,
      order.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    return `
<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

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
  width: 210mm;
  margin: 0;
  padding: 0;
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

.invoice-line {
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

  grid-template-columns:
    1fr 1fr;

  padding: 7px 9px;

  margin-bottom: 8px;

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

  grid-template-columns:
    1fr 1fr;

  gap: 8px;

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
   MAIN
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

  font-size: 8px;

  font-weight: 700;

  text-align: left;
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

  <div class="invoice-line"></div>

  <!-- TITLE -->

  <h2 class="invoice-title">
    PHARMACY INVOICE
  </h2>

  <!-- INVOICE META -->

  <div class="invoice-meta">

    <div>

      <strong>
        Invoice No:
      </strong>

      ${escapeHTML(
        invoiceNo
      )}

    </div>

    <div class="invoice-meta-right">

      <strong>
        Date:
      </strong>

      ${invoiceDate}

    </div>

  </div>

  <!-- CUSTOMER -->

  <div class="customer-box">

    <div>

      <strong>
        Customer Name:
      </strong>

      ${escapeHTML(
        order.patientName ||
          "-"
      )}

    </div>

    <div>

      <strong>
        Phone:
      </strong>

      ${escapeHTML(
        order.patientPhone ||
          "-"
      )}

    </div>

    <div>

      <strong>
        Address:
      </strong>

      ${escapeHTML(
        address || "-"
      )}

    </div>

    <div>

      <strong>
        Payment:
      </strong>

      ${escapeHTML(
        paymentMethod
      )}

    </div>

  </div>

  <!-- BILL -->

  <div class="invoice-content">

    <!-- LEFT -->

    <div>

      <table class="medicine-table">

        <thead>

          <tr>

            <th
              style="
                width:30px;
                text-align:center;
              "
            >
              #
            </th>

            <th>
              Medicine
            </th>

            <th
              style="
                width:40px;
                text-align:center;
              "
            >
              Qty
            </th>

            <th
              style="
                width:60px;
                text-align:right;
              "
            >
              Rate
            </th>

            <th
              style="
                width:70px;
                text-align:right;
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

    <!-- RIGHT -->

    <div class="invoice-summary">

      <div class="summary-row">

        <span>
          Subtotal
        </span>

        <strong>
          ₹${subtotal.toFixed(2)}
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
          - ₹0.00
        </strong>

      </div>

      <div class="summary-divider"></div>

      <div class="grand-total">

        <span>
          GRAND TOTAL
        </span>

        <strong>
          ₹${grandTotal.toFixed(2)}
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
  // PRINT ORDER
  // =====================================================

  const printOrderInvoice = (
    order
  ) => {
    if (!order) {
      return;
    }

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=950,height=900,left=100,top=50"
      );

    if (!printWindow) {
      alert(
        "Print window blocked. Please allow popups for this website."
      );

      return;
    }

    printWindowRef.current =
      printWindow;

    const html =
      buildInvoiceHTML(order);

    printWindow.document.open();

    printWindow.document.write(
      html
    );

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
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="medicine-orders-page">

        <div className="orders-loading">

          <RefreshCw
            size={28}
            className="orders-spin"
          />

          <p>
            Loading medicine orders...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="medicine-orders-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="orders-header">

        <div>

          <span>
            PHARMACY MANAGEMENT
          </span>

          <h1>
            Medicine Orders
          </h1>

          <p>
            Manage medicine orders placed
            by patients.
          </p>

        </div>

        <button
          type="button"
          className="orders-refresh-btn"
          onClick={loadOrders}
        >

          <RefreshCw size={17} />

          Refresh

        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="orders-error">

          <XCircle size={18} />

          <span>
            {error}
          </span>

        </div>
      )}

      {/* =================================================
          STATS
      ================================================= */}

      <div className="orders-stats">

        <div className="orders-stat">

          <Package size={22} />

          <div>

            <span>
              Pending
            </span>

            <strong>
              {pendingCount}
            </strong>

          </div>

        </div>

        <div className="orders-stat">

          <Clock size={22} />

          <div>

            <span>
              Accepted
            </span>

            <strong>
              {acceptedCount}
            </strong>

          </div>

        </div>

        <div className="orders-stat">

          <Package size={22} />

          <div>

            <span>
              Packed
            </span>

            <strong>
              {packedCount}
            </strong>

          </div>

        </div>

        <div className="orders-stat">

          <CheckCircle size={22} />

          <div>

            <span>
              Delivered
            </span>

            <strong>
              {deliveredCount}
            </strong>

          </div>

        </div>

      </div>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="orders-toolbar">

        <div className="orders-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search patient, phone or medicine..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >

          <option value="all">
            All Orders
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="accepted">
            Accepted
          </option>

          <option value="packed">
            Packed
          </option>

          <option value="out_for_delivery">
            Out for Delivery
          </option>

          <option value="delivered">
            Delivered
          </option>

          <option value="cancelled">
            Cancelled
          </option>

        </select>

      </div>

      {/* =================================================
          ORDERS
      ================================================= */}

      <div className="orders-list">

        {filteredOrders.length === 0 ? (

          <div className="orders-empty">

            <ShoppingBag
              size={48}
            />

            <h3>
              No medicine orders
            </h3>

            <p>
              Patient orders will appear
              here.
            </p>

          </div>

        ) : (

          <div
            className="orders-accordion"
          >

            {filteredOrders.map(
              (order) => {

                const isOpen =
                  openOrderId ===
                  order._id;

                const orderItems =
                  Array.isArray(
                    order.items
                  )
                    ? order.items
                    : [];

                return (
                  <div
                    className={`order-accordion-item ${
                      isOpen
                        ? "is-open"
                        : ""
                    }`}
                    key={order._id}
                  >

                    {/* =================================================
                        ACCORDION HEADER
                    ================================================= */}

                    <button
                      type="button"
                      className="order-accordion-button"
                      onClick={() =>
                        toggleOrder(
                          order._id
                        )
                      }
                      aria-expanded={
                        isOpen
                      }
                    >

                      <div className="accordion-left">

                        <div className="accordion-order-icon">

                          <Package
                            size={22}
                          />

                        </div>

                        <div>

                          <span className="order-number">
                            ORDER #
                            {order._id
                              ?.slice(-8)
                              .toUpperCase()}
                          </span>

                          <h2>
                            {order.patientName ||
                              "Unknown Patient"}
                          </h2>

                          <div className="accordion-phone">

                            <Phone
                              size={13}
                            />

                            {
                              order.patientPhone ||
                              "-"
                            }

                          </div>

                        </div>

                      </div>

                      <div className="accordion-right">

                        <div className="accordion-total">

                          <span>
                            Total
                          </span>

                          <strong>
                            ₹
                            {Number(
                              order.totalAmount ||
                                0
                            ).toFixed(2)}
                          </strong>

                        </div>

                        <span
                          className={`order-status status-${order.status}`}
                        >
                          {getStatusLabel(
                            order.status
                          )}
                        </span>

                        <ChevronDown
                          size={20}
                          className="accordion-chevron"
                        />

                      </div>

                    </button>

                    {/* =================================================
                        ACCORDION BODY
                    ================================================= */}

                    {isOpen && (

                      <div className="order-accordion-body">

                        {/* PATIENT DETAILS */}

                        <div className="accordion-details-grid">

                          <div className="detail-box">

                            <div className="detail-icon">
                              <User
                                size={17}
                              />
                            </div>

                            <div>

                              <span>
                                Patient
                              </span>

                              <strong>
                                {
                                  order.patientName ||
                                  "-"
                                }
                              </strong>

                            </div>

                          </div>

                          <div className="detail-box">

                            <div className="detail-icon">
                              <Phone
                                size={17}
                              />
                            </div>

                            <div>

                              <span>
                                Phone
                              </span>

                              <strong>
                                {
                                  order.patientPhone ||
                                  "-"
                                }
                              </strong>

                            </div>

                          </div>

                          <div className="detail-box">

                            <div className="detail-icon">
                              <Mail
                                size={17}
                              />
                            </div>

                            <div>

                              <span>
                                Email
                              </span>

                              <strong>
                                {
                                  order.patientEmail ||
                                  "-"
                                }
                              </strong>

                            </div>

                          </div>

                          <div className="detail-box">

                            <div className="detail-icon">
                              <Clock
                                size={17}
                              />
                            </div>

                            <div>

                              <span>
                                Order Date
                              </span>

                              <strong>

                                {order.createdAt
                                  ? new Date(
                                      order.createdAt
                                    ).toLocaleString(
                                      "en-IN"
                                    )
                                  : "-"
                                }

                              </strong>

                            </div>

                          </div>

                        </div>

                        {/* ADDRESS */}

                        <div className="accordion-address">

                          <MapPin
                            size={19}
                          />

                          <div>

                            <span>
                              Delivery Address
                            </span>

                            <strong>

                              {order.address ||
                                "-"}

                              {order.city &&
                                `, ${order.city}`}

                              {order.pincode &&
                                ` - ${order.pincode}`}

                            </strong>

                          </div>

                        </div>

                        {/* MEDICINES */}

                        <div className="accordion-medicines">

                          <div className="accordion-section-title">

                            <div>

                              <ShoppingBag
                                size={18}
                              />

                              <h3>
                                Ordered Medicines
                              </h3>

                            </div>

                            <span>
                              {
                                orderItems.length
                              }{" "}
                              item(s)
                            </span>

                          </div>

                          <div className="accordion-medicine-header">

                            <span>
                              #
                            </span>

                            <span>
                              Medicine
                            </span>

                            <span>
                              Qty
                            </span>

                            <span>
                              Rate
                            </span>

                            <span>
                              Total
                            </span>

                          </div>

                          {orderItems.map(
                            (
                              item,
                              index
                            ) => {

                              const itemTotal =
                                item.total != null
                                  ? Number(
                                      item.total
                                    )
                                  : Number(
                                      item.price ||
                                        0
                                    ) *
                                    Number(
                                      item.quantity ||
                                        0
                                    );

                              return (
                                <div
                                  className="accordion-medicine-row"
                                  key={`${order._id}-${index}`}
                                >

                                  <span>
                                    {index + 1}
                                  </span>

                                  <div className="accordion-medicine-name">

                                    <strong>
                                      {
                                        item.name
                                      }
                                    </strong>

                                    {item.genericName && (
                                      <small>
                                        {
                                          item.genericName
                                        }
                                      </small>
                                    )}

                                  </div>

                                  <span>
                                    {
                                      item.quantity
                                    }
                                  </span>

                                  <span>
                                    ₹
                                    {Number(
                                      item.price ||
                                        0
                                    ).toFixed(
                                      2
                                    )}
                                  </span>

                                  <strong>
                                    ₹
                                    {itemTotal.toFixed(
                                      2
                                    )}
                                  </strong>

                                </div>
                              );
                            }
                          )}

                          {/* TOTAL */}

                          <div className="accordion-total-row">

                            <span>
                              Grand Total
                            </span>

                            <strong>
                              ₹
                              {Number(
                                order.totalAmount ||
                                  0
                              ).toFixed(2)}
                            </strong>

                          </div>

                        </div>

                        {/* NOTES */}

                        {order.notes && (
                          <div className="accordion-notes">

                            <strong>
                              Notes
                            </strong>

                            <p>
                              {order.notes}
                            </p>

                          </div>
                        )}

                        {/* BOTTOM ACTIONS */}

                        <div className="accordion-bottom">

                          <div className="accordion-status-control">

                            <label>
                              Order Status
                            </label>

                            <select
                              value={
                                order.status ||
                                "pending"
                              }
                              disabled={
                                updatingId ===
                                order._id
                              }
                              onChange={(
                                e
                              ) =>
                                changeStatus(
                                  order._id,
                                  e.target.value
                                )
                              }
                            >

                              <option value="pending">
                                Pending
                              </option>

                              <option value="accepted">
                                Accepted
                              </option>

                              <option value="packed">
                                Packed
                              </option>

                              <option value="out_for_delivery">
                                Out for Delivery
                              </option>

                              <option value="delivered">
                                Delivered
                              </option>

                              <option value="cancelled">
                                Cancelled
                              </option>

                            </select>

                          </div>

                          {/* PRINT */}

                          <button
                            type="button"
                            className="print-invoice-btn"
                            onClick={() =>
                              printOrderInvoice(
                                order
                              )
                            }
                          >

                            <Printer
                              size={18}
                            />

                            Print Invoice

                          </button>

                        </div>

                      </div>

                    )}

                  </div>
                );
              }
            )}

          </div>

        )}

      </div>

    </div>
  );
}