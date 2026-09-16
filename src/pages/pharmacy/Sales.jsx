import React, { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  ShoppingCart,
  IndianRupee,
  CreditCard,
  AlertTriangle,
  Printer,
} from "lucide-react";

import {
  getSales,
  createSale,
  updateSale,
  deleteSale,
  getMedicines,
  getStores,
} from "../../services/pharmacyApi";

import SaleForm from "../../components/pharmacy/SaleForm";

import "./Sales.css";

// =====================================================
// HOSPITAL INFORMATION
// =====================================================

const HOSPITAL_INFO = {
  name: "City Care Hospital",
  address: "Your Clinic Address, City, State",
  phone: "+91 00000 00000",
  logo: "",
};

// =====================================================
// SALES PAGE
// =====================================================

export default function Sales() {
  // ===================================================
  // DATA
  // ===================================================

  const [sales, setSales] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [stores, setStores] = useState([]);

  // ===================================================
  // STATES
  // ===================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingSale, setEditingSale] = useState(null);

  // Sale selected for printing
  const [printingSale, setPrintingSale] = useState(null);

  // ===================================================
  // EXTRACT ARRAY
  // ===================================================

  const extractArray = (response, key) => {
    const data = response?.data ?? response;

    if (Array.isArray(data)) return data;

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

  // ===================================================
  // LOAD DATA
  // ===================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        salesRes,
        medicinesRes,
        storesRes,
      ] = await Promise.all([
        getSales(),
        getMedicines(),
        getStores(),
      ]);

      setSales(
        extractArray(salesRes, "sales")
      );

      setMedicines(
        extractArray(
          medicinesRes,
          "medicines"
        )
      );

      setStores(
        extractArray(
          storesRes,
          "stores"
        )
      );
    } catch (err) {
      console.error(
        "Sales loading error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load sales"
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
  // FILTER SALES
  // ===================================================

  const filteredSales = useMemo(() => {
    const term = search
      .trim()
      .toLowerCase();

    if (!term) return sales;

    return sales.filter((sale) => {
      const customerName =
        typeof sale.customerName ===
        "object"
          ? sale.customerName?.name ||
            ""
          : sale.customerName || "";

      const customerPhone =
        sale.customerPhone || "";

      const invoiceNumber =
        sale.invoiceNumber || "";

      const storeName =
        typeof sale.store ===
        "object"
          ? sale.store?.name || ""
          : getStoreNameFromList(
              sale.store,
              stores
            );

      return (
        String(customerName)
          .toLowerCase()
          .includes(term) ||

        String(customerPhone)
          .toLowerCase()
          .includes(term) ||

        String(invoiceNumber)
          .toLowerCase()
          .includes(term) ||

        String(storeName)
          .toLowerCase()
          .includes(term)
      );
    });
  }, [sales, search, stores]);

  // ===================================================
  // TOTAL REVENUE
  // ===================================================

  const totalRevenue = useMemo(() => {
    return sales.reduce(
      (total, sale) => {
        return (
          total +
          Number(
            sale.totalAmount ??
              sale.total ??
              sale.grandTotal ??
              0
          )
        );
      },
      0
    );
  }, [sales]);

  // ===================================================
  // TOTAL ITEMS
  // ===================================================

  const totalItems = useMemo(() => {
    return sales.reduce(
      (total, sale) => {
        if (
          Array.isArray(sale.items)
        ) {
          return (
            total +
            sale.items.reduce(
              (sum, item) =>
                sum +
                Number(
                  item.quantity || 0
                ),
              0
            )
          );
        }

        return (
          total +
          Number(
            sale.totalQuantity || 0
          )
        );
      },
      0
    );
  }, [sales]);

  // ===================================================
  // TODAY SALES
  // ===================================================

  const todaySales = useMemo(() => {
    const today = new Date();

    return sales.filter((sale) => {
      const date = new Date(
        sale.createdAt ||
          sale.date ||
          sale.saleDate
      );

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return false;
      }

      return (
        date.getDate() ===
          today.getDate() &&
        date.getMonth() ===
          today.getMonth() &&
        date.getFullYear() ===
          today.getFullYear()
      );
    });
  }, [sales]);

  // ===================================================
  // TODAY REVENUE
  // ===================================================

  const todayRevenue = useMemo(() => {
    return todaySales.reduce(
      (total, sale) => {
        return (
          total +
          Number(
            sale.totalAmount ??
              sale.total ??
              sale.grandTotal ??
              0
          )
        );
      },
      0
    );
  }, [todaySales]);

  // ===================================================
  // ADD
  // ===================================================

  const handleAdd = () => {
    setEditingSale(null);
    setShowForm(true);
    setError("");
  };

  // ===================================================
  // EDIT
  // ===================================================

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setShowForm(true);
    setError("");
  };

  // ===================================================
  // SAVE
  // ===================================================

  const handleSubmit = async (
    formData
  ) => {
    try {
      setSaving(true);
      setError("");

      if (editingSale?._id) {
        await updateSale(
          editingSale._id,
          formData
        );
      } else {
        await createSale(formData);
      }

      setShowForm(false);
      setEditingSale(null);

      await loadData();
    } catch (err) {
      console.error(
        "Sale save error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save sale"
      );
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // DELETE
  // ===================================================

  const handleDelete = async (
    sale
  ) => {
    const invoice =
      sale.invoiceNumber ||
      "this sale";

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${invoice}?`
      );

    if (!confirmed) return;

    try {
      setError("");

      await deleteSale(sale._id);

      setSales((prev) =>
        prev.filter(
          (item) =>
            item._id !== sale._id
        )
      );
    } catch (err) {
      console.error(
        "Sale delete error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete sale"
      );
    }
  };

  // ===================================================
  // PRINT SALE
  // ===================================================

  const handlePrint = (sale) => {
    setPrintingSale(sale);

    setTimeout(() => {
      window.print();
    }, 150);
  };

  // ===================================================
  // DATE
  // ===================================================

  const formatDate = (
    dateValue
  ) => {
    if (!dateValue) return "-";

    const date =
      new Date(dateValue);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "-";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ===================================================
  // TIME
  // ===================================================

  const formatTime = (
    dateValue
  ) => {
    if (!dateValue) return "-";

    const date =
      new Date(dateValue);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "-";
    }

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ===================================================
  // CURRENCY
  // ===================================================

  const formatCurrency = (
    amount
  ) => {
    return Number(
      amount || 0
    ).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // ===================================================
  // CUSTOMER
  // ===================================================

  const getCustomerName = (
    sale
  ) => {
    if (
      typeof sale.customerName ===
      "object"
    ) {
      return (
        sale.customerName?.name ||
        "-"
      );
    }

    return (
      sale.customerName ||
      "Walk-in Customer"
    );
  };

  // ===================================================
  // STORE
  // ===================================================

  const getStoreName = (
    sale
  ) => {
    if (
      typeof sale.store ===
      "object"
    ) {
      return (
        sale.store?.name || "-"
      );
    }

    return getStoreNameFromList(
      sale.store,
      stores
    );
  };

  // ===================================================
  // PAYMENT CLASS
  // ===================================================

  const getPaymentClass = (
    method
  ) => {
    return `payment-badge ${
      method || "cash"
    }`;
  };

  // ===================================================
  // PAYMENT LABEL
  // ===================================================

  const getPaymentLabel = (
    method
  ) => {
    if (!method) return "Cash";

    const labels = {
      cash: "Cash",
      card: "Card",
      upi: "UPI",
      online: "Online",
      credit: "Credit",
    };

    return (
      labels[method] ||
      method
        .charAt(0)
        .toUpperCase() +
        method.slice(1)
    );
  };

  // ===================================================
  // MEDICINE NAME
  // ===================================================

  const getMedicineName = (
    item
  ) => {
    if (
      item?.medicine &&
      typeof item.medicine ===
        "object"
    ) {
      return (
        item.medicine.name ||
        "-"
      );
    }

    const medicine =
      medicines.find(
        (med) =>
          med._id ===
          item?.medicine
      );

    return (
      medicine?.name || "-"
    );
  };

  // ===================================================
  // MEDICINE BATCH
  // ===================================================

  const getMedicineBatch = (
    item
  ) => {
    if (
      item?.batchNumber
    ) {
      return item.batchNumber;
    }

    if (
      item?.medicine &&
      typeof item.medicine ===
        "object"
    ) {
      return (
        item.medicine
          ?.batchNumber || "-"
      );
    }

    const medicine =
      medicines.find(
        (med) =>
          med._id ===
          item?.medicine
      );

    return (
      medicine?.batchNumber ||
      "-"
    );
  };

  // ===================================================
  // MEDICINE GENERIC
  // ===================================================

  const getMedicineGeneric = (
    item
  ) => {
    if (
      item?.genericName
    ) {
      return item.genericName;
    }

    if (
      item?.medicine &&
      typeof item.medicine ===
        "object"
    ) {
      return (
        item.medicine
          ?.genericName ||
        item.medicine
          ?.composition ||
        ""
      );
    }

    const medicine =
      medicines.find(
        (med) =>
          med._id ===
          item?.medicine
      );

    return (
      medicine?.genericName ||
      medicine?.composition ||
      ""
    );
  };

  // ===================================================
  // ITEM BASE TOTAL
  // ===================================================

  const getItemBaseTotal = (
    item
  ) => {
    return (
      Number(
        item?.quantity || 0
      ) *
      Number(
        item?.price || 0
      )
    );
  };

  // ===================================================
  // ITEM DISCOUNT
  // ===================================================

  const getItemDiscountAmount = (
    item
  ) => {
    const base =
      getItemBaseTotal(item);

    return (
      (base *
        Number(
          item?.discount || 0
        )) /
      100
    );
  };

  // ===================================================
  // ITEM TOTAL
  // ===================================================

  const getItemTotal = (
    item
  ) => {
    return (
      getItemBaseTotal(item) -
      getItemDiscountAmount(
        item
      )
    );
  };

  // ===================================================
  // PRINTED SALE TOTALS
  // ===================================================

  const getPrintedSubtotal = (
    sale
  ) => {
    if (
      sale?.subtotal !==
      undefined &&
      sale?.subtotal !== null
    ) {
      return Number(
        sale.subtotal
      );
    }

    return (
      sale?.items?.reduce(
        (total, item) =>
          total +
          getItemBaseTotal(item),
        0
      ) || 0
    );
  };

  const getPrintedItemDiscount =
    (sale) => {
      if (
        sale?.itemDiscountTotal !==
          undefined &&
        sale?.itemDiscountTotal !==
          null
      ) {
        return Number(
          sale.itemDiscountTotal
        );
      }

      return (
        sale?.items?.reduce(
          (total, item) =>
            total +
            getItemDiscountAmount(
              item
            ),
          0
        ) || 0
      );
    };

  const getPrintedExtraDiscount =
    (sale) => {
      if (
        sale?.extraDiscount !==
          undefined &&
        sale?.extraDiscount !==
          null
      ) {
        return Number(
          sale.extraDiscount
        );
      }

      if (
        sale?.discount !==
          undefined
      ) {
        return Number(
          sale.discount
        );
      }

      return 0;
    };

  const getPrintedGrandTotal = (
    sale
  ) => {
    if (
      sale?.totalAmount !==
        undefined &&
      sale?.totalAmount !== null
    ) {
      return Number(
        sale.totalAmount
      );
    }

    if (
      sale?.grandTotal !==
        undefined
    ) {
      return Number(
        sale.grandTotal
      );
    }

    const subtotal =
      getPrintedSubtotal(
        sale
      );

    const itemDiscount =
      getPrintedItemDiscount(
        sale
      );

    const extraDiscount =
      getPrintedExtraDiscount(
        sale
      );

    return Math.max(
      subtotal -
        itemDiscount -
        extraDiscount,
      0
    );
  };

  // ===================================================
  // RETURN
  // ===================================================

  return (
    <div className="sales-page">

      {/* =================================================
          NORMAL SALES SCREEN
      ================================================= */}

      <div className="sales-screen">

        {/* HEADER */}

        <div className="sales-header">

          <div>
            <h1>Sales</h1>

            <p>
              Manage pharmacy sales
              and transactions.
            </p>
          </div>

          <div className="sales-header-actions">

            <button
              className="sales-refresh-btn"
              onClick={loadData}
              disabled={loading}
            >
              <RefreshCw size={18} />

              Refresh
            </button>

            <button
              className="sales-primary-btn"
              onClick={handleAdd}
            >
              <Plus size={18} />

              New Sale
            </button>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="sales-error">

            <AlertTriangle
              size={18}
            />

            <span>
              {error}
            </span>

          </div>
        )}

        {/* =================================================
            STATS
        ================================================= */}

        <div className="sales-stats">

          <div className="sale-stat-card">

            <div className="sale-stat-icon">
              <ShoppingCart
                size={22}
              />
            </div>

            <div>
              <span>
                Total Sales
              </span>

              <strong>
                {sales.length}
              </strong>
            </div>

          </div>

          <div className="sale-stat-card">

            <div className="sale-stat-icon">
              <IndianRupee
                size={22}
              />
            </div>

            <div>
              <span>
                Total Revenue
              </span>

              <strong>
                ₹
                {formatCurrency(
                  totalRevenue
                )}
              </strong>
            </div>

          </div>

          <div className="sale-stat-card">

            <div className="sale-stat-icon">
              <ShoppingCart
                size={22}
              />
            </div>

            <div>
              <span>
                Items Sold
              </span>

              <strong>
                {totalItems}
              </strong>
            </div>

          </div>

          <div className="sale-stat-card">

            <div className="sale-stat-icon">
              <IndianRupee
                size={22}
              />
            </div>

            <div>
              <span>
                Today's Revenue
              </span>

              <strong>
                ₹
                {formatCurrency(
                  todayRevenue
                )}
              </strong>
            </div>

          </div>

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="sales-toolbar">

          <div className="sales-search">

            <Search size={19} />

            <input
              type="text"
              placeholder="Search invoice, customer, phone or store..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="sales-table-card">

          {loading ? (

            <div className="sales-loading">

              <RefreshCw
                size={25}
                className="sales-loading-spin"
              />

              <span>
                Loading sales...
              </span>

            </div>

          ) : filteredSales.length ===
            0 ? (

            <div className="sales-empty">

              <ShoppingCart
                size={45}
              />

              <h3>
                {search
                  ? "No sales found"
                  : "No sales available"}
              </h3>

              <p>
                {search
                  ? "Try a different search."
                  : "Create your first pharmacy sale."}
              </p>

              {!search && (
                <button
                  className="sales-primary-btn"
                  onClick={handleAdd}
                >
                  <Plus size={18} />

                  New Sale
                </button>
              )}

            </div>

          ) : (

            <div className="sales-table-wrapper">

              <table className="sales-table">

                <thead>

                  <tr>
                    <th>
                      Invoice
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Store
                    </th>

                    <th>
                      Items
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Payment
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Actions
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {filteredSales.map(
                    (sale) => {

                      const amount =
                        Number(
                          sale.totalAmount ??
                            sale.total ??
                            sale.grandTotal ??
                            0
                        );

                      const itemCount =
                        Array.isArray(
                          sale.items
                        )
                          ? sale.items.reduce(
                              (
                                sum,
                                item
                              ) =>
                                sum +
                                Number(
                                  item.quantity ||
                                    0
                                ),
                              0
                            )
                          : Number(
                              sale.totalQuantity ||
                                0
                            );

                      return (
                        <tr
                          key={
                            sale._id
                          }
                        >

                          {/* INVOICE */}

                          <td>

                            <span className="invoice-number">
                              {sale.invoiceNumber ||
                                `SALE-${String(
                                  sale._id
                                ).slice(
                                  -6
                                )}`}
                            </span>

                          </td>

                          {/* CUSTOMER */}

                          <td>

                            <div className="sale-customer">

                              <strong>
                                {getCustomerName(
                                  sale
                                )}
                              </strong>

                              {sale.customerPhone && (
                                <small>
                                  {
                                    sale.customerPhone
                                  }
                                </small>
                              )}

                            </div>

                          </td>

                          {/* STORE */}

                          <td>
                            {getStoreName(
                              sale
                            )}
                          </td>

                          {/* ITEMS */}

                          <td>

                            <span className="items-count">
                              {
                                itemCount
                              }
                            </span>

                          </td>

                          {/* AMOUNT */}

                          <td>

                            <strong className="sale-amount">
                              ₹
                              {formatCurrency(
                                amount
                              )}
                            </strong>

                          </td>

                          {/* PAYMENT */}

                          <td>

                            <span
                              className={getPaymentClass(
                                sale.paymentMethod
                              )}
                            >

                              <CreditCard
                                size={13}
                              />

                              {getPaymentLabel(
                                sale.paymentMethod
                              )}

                            </span>

                          </td>

                          {/* DATE */}

                          <td>

                            {formatDate(
                              sale.createdAt ||
                                sale.date ||
                                sale.saleDate
                            )}

                          </td>

                          {/* ACTIONS */}

                          <td>

                            <div className="sales-actions">

                              {/* PRINT */}

                              <button
                                className="sales-action-btn sales-print-btn"
                                title="Print invoice"
                                onClick={() =>
                                  handlePrint(
                                    sale
                                  )
                                }
                              >
                                <Printer
                                  size={17}
                                />
                              </button>

                              {/* EDIT */}

                              <button
                                className="sales-action-btn sales-edit-btn"
                                title="Edit sale"
                                onClick={() =>
                                  handleEdit(
                                    sale
                                  )
                                }
                              >
                                <Edit
                                  size={17}
                                />
                              </button>

                              {/* DELETE */}

                              <button
                                className="sales-action-btn sales-delete-btn"
                                title="Delete sale"
                                onClick={() =>
                                  handleDelete(
                                    sale
                                  )
                                }
                              >
                                <Trash2
                                  size={17}
                                />
                              </button>

                            </div>

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

        {/* =================================================
            SALE FORM
        ================================================= */}

        {showForm && (
          <SaleForm
            sale={editingSale}
            medicines={medicines}
            stores={stores}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowForm(false);
              setEditingSale(null);
            }}
            loading={saving}
          />
        )}

      </div>

      {/* =====================================================
          PRINTABLE SALES INVOICE
      ===================================================== */}

      {printingSale && (

        <div className="sales-invoice-print">

          {/* HOSPITAL HEADER */}

          <div className="invoice-header">

            <div className="invoice-logo-area">

              {HOSPITAL_INFO.logo ? (

                <img
                  src={
                    HOSPITAL_INFO.logo
                  }
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
                {
                  HOSPITAL_INFO.name
                }
              </h1>

              <p>
                {
                  HOSPITAL_INFO.address
                }
              </p>

              <p>
                Mob:{" "}
                {
                  HOSPITAL_INFO.phone
                }
              </p>

            </div>

          </div>

          {/* TITLE */}

          <div className="invoice-title">
            PHARMACY INVOICE
          </div>

          {/* INVOICE META */}

          <div className="invoice-meta">

            <div>
              <strong>
                Invoice No:
              </strong>{" "}
              {printingSale.invoiceNumber ||
                `SALE-${String(
                  printingSale._id
                ).slice(-6)}`}
            </div>

            <div>
              <strong>
                Date:
              </strong>{" "}
              {formatDate(
                printingSale.createdAt ||
                  printingSale.date ||
                  printingSale.saleDate
              )}
            </div>

          </div>

          {/* CUSTOMER */}

          <div className="invoice-customer">

            <div>
              <strong>
                Customer Name:
              </strong>{" "}
              {getCustomerName(
                printingSale
              )}
            </div>

            <div>
              <strong>
                Phone:
              </strong>{" "}
              {printingSale.customerPhone ||
                "-"}
            </div>

            <div>
              <strong>
                Store:
              </strong>{" "}
              {getStoreName(
                printingSale
              )}
            </div>

            <div>
              <strong>
                Payment:
              </strong>{" "}
              {getPaymentLabel(
                printingSale.paymentMethod
              )}
            </div>

          </div>

          {/* ITEMS */}

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

              {Array.isArray(
                printingSale.items
              ) &&
                printingSale.items.map(
                  (item, index) => (

                    <tr
                      key={
                        item._id ||
                        index
                      }
                    >

                      <td>
                        {index + 1}
                      </td>

                      <td>

                        <strong>
                          {getMedicineName(
                            item
                          )}
                        </strong>

                        {getMedicineGeneric(
                          item
                        ) && (
                          <small className="invoice-generic">
                            {
                              getMedicineGeneric(
                                item
                              )
                            }
                          </small>
                        )}

                      </td>

                      <td>
                        {getMedicineBatch(
                          item
                        )}
                      </td>

                      <td>
                        ₹
                        {formatCurrency(
                          item.price
                        )}
                      </td>

                      <td>
                        {
                          item.quantity
                        }
                      </td>

                      <td>
                        {Number(
                          item.discount ||
                            0
                        )}
                        %
                      </td>

                      <td>
                        ₹
                        {formatCurrency(
                          getItemTotal(
                            item
                          )
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
                  getPrintedSubtotal(
                    printingSale
                  )
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
                  getPrintedItemDiscount(
                    printingSale
                  )
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
                  getPrintedExtraDiscount(
                    printingSale
                  )
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
                  getPrintedGrandTotal(
                    printingSale
                  )
                )}
              </strong>

            </div>

          </div>

          {/* NOTES */}

          {printingSale.notes && (

            <div className="invoice-notes">

              <strong>
                Notes:
              </strong>{" "}
              {
                printingSale.notes
              }

            </div>

          )}

          {/* FOOTER */}

          <div className="invoice-footer">

            <div>
              Thank you for visiting{" "}
              <strong>
                {
                  HOSPITAL_INFO.name
                }
              </strong>
            </div>

            <div>
              This is a computer generated invoice.
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

// =====================================================
// HELPER
// =====================================================

function getStoreNameFromList(
  storeId,
  stores
) {
  const store = stores.find(
    (item) =>
      item._id === storeId
  );

  return store?.name || "-";
}