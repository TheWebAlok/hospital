import React, { useEffect, useState } from "react";

import {
  getStores,
  getMedicines,
  getCategories,
  getSuppliers,
  getSales,
  getMedicineOrders,
} from "../../services/pharmacyApi";

import "./PharmacyDashboard.css";

import {
  Pill,
  Store,
  Layers,
  Truck,
  ShoppingCart,
  AlertTriangle,
  Clock,
  RefreshCw,
  TrendingUp,
  Package,
  CheckCircle,
} from "lucide-react";

export default function PharmacyDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stores, setStores] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [sales, setSales] = useState([]);

  // MEDICINE ORDERS
  const [medicineOrders, setMedicineOrders] = useState([]);

  // =====================================================
  // LOAD DASHBOARD DATA
  // =====================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        storesResponse,
        medicinesResponse,
        categoriesResponse,
        suppliersResponse,
        salesResponse,
        ordersResponse,
      ] = await Promise.all([
        getStores(),
        getMedicines(),
        getCategories(),
        getSuppliers(),
        getSales(),
        getMedicineOrders(),
      ]);

      // =====================================================
      // STORES
      // =====================================================

      const storesData = Array.isArray(storesResponse)
        ? storesResponse
        : storesResponse?.stores ||
          storesResponse?.data ||
          [];

      setStores(
        Array.isArray(storesData)
          ? storesData
          : []
      );

      // =====================================================
      // MEDICINES
      // =====================================================

      const medicinesData = Array.isArray(
        medicinesResponse
      )
        ? medicinesResponse
        : medicinesResponse?.medicines ||
          medicinesResponse?.data ||
          [];

      setMedicines(
        Array.isArray(medicinesData)
          ? medicinesData
          : []
      );

      // =====================================================
      // CATEGORIES
      // =====================================================

      const categoriesData = Array.isArray(
        categoriesResponse
      )
        ? categoriesResponse
        : categoriesResponse?.categories ||
          categoriesResponse?.data ||
          [];

      setCategories(
        Array.isArray(categoriesData)
          ? categoriesData
          : []
      );

      // =====================================================
      // SUPPLIERS
      // =====================================================

      const suppliersData = Array.isArray(
        suppliersResponse
      )
        ? suppliersResponse
        : suppliersResponse?.suppliers ||
          suppliersResponse?.data ||
          [];

      setSuppliers(
        Array.isArray(suppliersData)
          ? suppliersData
          : []
      );

      // =====================================================
      // SALES
      // =====================================================

      const salesData = Array.isArray(
        salesResponse
      )
        ? salesResponse
        : salesResponse?.sales ||
          salesResponse?.data ||
          [];

      setSales(
        Array.isArray(salesData)
          ? salesData
          : []
      );

      // =====================================================
      // MEDICINE ORDERS
      // =====================================================

      /*
        Backend response:

        {
          success: true,
          count: 1,
          orders: [...]
        }

        pharmacyApi.js already returns response.data.
        Therefore we use ordersResponse.orders.
      */

      const ordersData = Array.isArray(
        ordersResponse
      )
        ? ordersResponse
        : ordersResponse?.orders ||
          ordersResponse?.data ||
          [];

      setMedicineOrders(
        Array.isArray(ordersData)
          ? ordersData
          : []
      );

      console.log(
        "PHARMACY DASHBOARD ORDERS:",
        ordersData
      );
    } catch (err) {
      console.error(
        "PHARMACY DASHBOARD ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load pharmacy dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  // =====================================================
  // LOW STOCK
  // =====================================================

  const lowStockMedicines = medicines.filter(
    (medicine) => {
      const stock = Number(
        medicine.stock ??
          medicine.quantity ??
          0
      );

      const threshold = Number(
        medicine.lowStockThreshold ?? 10
      );

      return stock <= threshold;
    }
  );

  // =====================================================
  // EXPIRING MEDICINES
  // =====================================================

  const today = new Date();

  const expiringMedicines = medicines.filter(
    (medicine) => {
      if (!medicine.expiryDate) {
        return false;
      }

      const expiryDate = new Date(
        medicine.expiryDate
      );

      const difference =
        expiryDate.getTime() -
        today.getTime();

      const days =
        difference /
        (1000 * 60 * 60 * 24);

      return (
        days >= 0 &&
        days <= 90
      );
    }
  );

  // =====================================================
  // TODAY'S SALES
  // =====================================================

  const todaySales = sales.filter((sale) => {
    if (!sale.createdAt && !sale.date) {
      return false;
    }

    const saleDate = new Date(
      sale.createdAt || sale.date
    );

    return (
      saleDate.toDateString() ===
      today.toDateString()
    );
  });

  // =====================================================
  // TODAY'S SALES AMOUNT
  // =====================================================

  const totalSalesAmount =
    todaySales.reduce(
      (total, sale) => {
        return (
          total +
          Number(
            sale.totalAmount ??
              sale.total ??
              sale.amount ??
              0
          )
        );
      },
      0
    );

  // =====================================================
  // MEDICINE ORDER COUNTS
  // =====================================================

  const totalMedicineOrders =
    medicineOrders.length;

  const pendingMedicineOrders =
    medicineOrders.filter(
      (order) =>
        order.status === "pending"
    ).length;

  const acceptedMedicineOrders =
    medicineOrders.filter(
      (order) =>
        order.status === "accepted"
    ).length;

  const packedMedicineOrders =
    medicineOrders.filter(
      (order) =>
        order.status === "packed"
    ).length;

  const deliveredMedicineOrders =
    medicineOrders.filter(
      (order) =>
        order.status === "delivered"
    ).length;

  // =====================================================
  // MEDICINE ORDERS TOTAL AMOUNT
  // =====================================================

  const medicineOrdersAmount =
    medicineOrders.reduce(
      (total, order) => {
        return (
          total +
          Number(
            order.totalAmount || 0
          )
        );
      },
      0
    );

  // =====================================================
  // STAT CARD
  // =====================================================

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
  }) => (
    <div className="pharmacy-stat-card">

      <div className="pharmacy-stat-icon">
        <Icon size={26} />
      </div>

      <div className="pharmacy-stat-content">

        <span>
          {title}
        </span>

        <strong>
          {loading ? "..." : value}
        </strong>

        {description && (
          <small>
            {description}
          </small>
        )}

      </div>

    </div>
  );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="pharmacy-dashboard">

        <div className="pharmacy-loading">

          <RefreshCw
            size={30}
            className="pharmacy-spin"
          />

          <p>
            Loading Pharmacy Dashboard...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="pharmacy-dashboard">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="pharmacy-header">

        <div>

          <h1>
            Pharmacy Dashboard
          </h1>

          <p>
            Manage medicines, inventory,
            suppliers, sales and patient
            medicine orders.
          </p>

        </div>

        <button
          type="button"
          className="pharmacy-refresh-btn"
          onClick={loadDashboard}
        >
          <RefreshCw size={18} />
          Refresh
        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="pharmacy-error">

          <AlertTriangle size={20} />

          <span>
            {error}
          </span>

        </div>
      )}

      {/* =================================================
          MAIN STATS
      ================================================= */}

      <div className="pharmacy-stats-grid">

        {/* TOTAL MEDICINES */}

        <StatCard
          title="Total Medicines"
          value={medicines.length}
          icon={Pill}
          description="Medicine inventory"
        />

        {/* STORES */}

        <StatCard
          title="Stores"
          value={stores.length}
          icon={Store}
          description="Registered stores"
        />

        {/* CATEGORIES */}

        <StatCard
          title="Categories"
          value={categories.length}
          icon={Layers}
          description="Medicine categories"
        />

        {/* SUPPLIERS */}

        <StatCard
          title="Suppliers"
          value={suppliers.length}
          icon={Truck}
          description="Active suppliers"
        />

        {/* TODAY SALES */}

        <StatCard
          title="Today's Sales"
          value={todaySales.length}
          icon={ShoppingCart}
          description="Sales today"
        />

        {/* TODAY REVENUE */}

        <StatCard
          title="Today's Revenue"
          value={`₹${totalSalesAmount.toLocaleString(
            "en-IN"
          )}`}
          icon={TrendingUp}
          description="Today's total"
        />

        {/* MEDICINE ORDERS */}

        <StatCard
          title="Medicine Orders"
          value={totalMedicineOrders}
          icon={Package}
          description="Patient orders"
        />

        {/* PENDING ORDERS */}

        <StatCard
          title="Pending Orders"
          value={pendingMedicineOrders}
          icon={Clock}
          description="Need attention"
        />

      </div>

      {/* =================================================
          ORDER SUMMARY
      ================================================= */}

      <div className="pharmacy-alert-grid">

        {/* ORDER STATUS */}

        <div className="pharmacy-panel">

          <div className="pharmacy-panel-header">

            <div>

              <h2>
                <Package size={20} />
                Medicine Orders
              </h2>

              <p>
                Current patient order status.
              </p>

            </div>

            <span className="pharmacy-alert-count">
              {totalMedicineOrders}
            </span>

          </div>

          {totalMedicineOrders === 0 ? (

            <div className="pharmacy-empty">

              <Package size={35} />

              <p>
                No medicine orders available.
              </p>

            </div>

          ) : (

            <div className="pharmacy-alert-list">

              <div className="pharmacy-alert-item">

                <div>

                  <strong>
                    Pending Orders
                  </strong>

                  <small>
                    Orders waiting for acceptance
                  </small>

                </div>

                <strong>
                  {pendingMedicineOrders}
                </strong>

              </div>

              <div className="pharmacy-alert-item">

                <div>

                  <strong>
                    Accepted Orders
                  </strong>

                  <small>
                    Orders accepted by pharmacy
                  </small>

                </div>

                <strong>
                  {acceptedMedicineOrders}
                </strong>

              </div>

              <div className="pharmacy-alert-item">

                <div>

                  <strong>
                    Packed Orders
                  </strong>

                  <small>
                    Orders ready for delivery
                  </small>

                </div>

                <strong>
                  {packedMedicineOrders}
                </strong>

              </div>

              <div className="pharmacy-alert-item">

                <div>

                  <strong>
                    Delivered Orders
                  </strong>

                  <small>
                    Successfully delivered
                  </small>

                </div>

                <CheckCircle size={20} />

              </div>

            </div>

          )}

        </div>

        {/* ORDER REVENUE */}

        <div className="pharmacy-panel">

          <div className="pharmacy-panel-header">

            <div>

              <h2>
                <TrendingUp size={20} />
                Order Summary
              </h2>

              <p>
                Medicine order information.
              </p>

            </div>

          </div>

          <div className="pharmacy-alert-list">

            <div className="pharmacy-alert-item">

              <div>
                <strong>
                  Total Orders
                </strong>

                <small>
                  All patient medicine orders
                </small>
              </div>

              <strong>
                {totalMedicineOrders}
              </strong>

            </div>

            <div className="pharmacy-alert-item">

              <div>
                <strong>
                  Pending
                </strong>

                <small>
                  Awaiting pharmacy action
                </small>
              </div>

              <strong>
                {pendingMedicineOrders}
              </strong>

            </div>

            <div className="pharmacy-alert-item">

              <div>
                <strong>
                  Delivered
                </strong>

                <small>
                  Completed orders
                </small>
              </div>

              <strong>
                {deliveredMedicineOrders}
              </strong>

            </div>

            <div className="pharmacy-alert-item">

              <div>
                <strong>
                  Order Value
                </strong>

                <small>
                  Total medicine order amount
                </small>
              </div>

              <strong>
                ₹
                {medicineOrdersAmount.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          LOW STOCK + EXPIRY
      ================================================= */}

      <div className="pharmacy-alert-grid">

        {/* LOW STOCK */}

        <div className="pharmacy-panel">

          <div className="pharmacy-panel-header">

            <div>

              <h2>
                <AlertTriangle size={20} />
                Low Stock
              </h2>

              <p>
                Medicines that need
                restocking.
              </p>

            </div>

            <span className="pharmacy-alert-count">
              {lowStockMedicines.length}
            </span>

          </div>

          {lowStockMedicines.length === 0 ? (

            <div className="pharmacy-empty">

              <Pill size={35} />

              <p>
                All medicines have
                sufficient stock.
              </p>

            </div>

          ) : (

            <div className="pharmacy-alert-list">

              {lowStockMedicines
                .slice(0, 6)
                .map((medicine) => (

                  <div
                    className="pharmacy-alert-item"
                    key={
                      medicine._id ||
                      medicine.id
                    }
                  >

                    <div>

                      <strong>
                        {medicine.name ||
                          medicine.medicineName ||
                          "Medicine"}
                      </strong>

                      <small>
                        Stock:{" "}
                        {medicine.stock ??
                          medicine.quantity ??
                          0}
                      </small>

                    </div>

                    <AlertTriangle
                      size={18}
                    />

                  </div>

                ))}

            </div>

          )}

        </div>

        {/* EXPIRY */}

        <div className="pharmacy-panel">

          <div className="pharmacy-panel-header">

            <div>

              <h2>
                <Clock size={20} />
                Expiring Soon
              </h2>

              <p>
                Medicines expiring within
                90 days.
              </p>

            </div>

            <span className="pharmacy-expiry-count">
              {expiringMedicines.length}
            </span>

          </div>

          {expiringMedicines.length === 0 ? (

            <div className="pharmacy-empty">

              <Clock size={35} />

              <p>
                No medicines expiring
                soon.
              </p>

            </div>

          ) : (

            <div className="pharmacy-alert-list">

              {expiringMedicines
                .slice(0, 6)
                .map((medicine) => (

                  <div
                    className="pharmacy-alert-item"
                    key={
                      medicine._id ||
                      medicine.id
                    }
                  >

                    <div>

                      <strong>
                        {medicine.name ||
                          medicine.medicineName ||
                          "Medicine"}
                      </strong>

                      <small>
                        Expiry:{" "}
                        {new Date(
                          medicine.expiryDate
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </small>

                    </div>

                    <Clock size={18} />

                  </div>

                ))}

            </div>

          )}

        </div>

      </div>

      {/* =================================================
          RECENT SALES
      ================================================= */}

      <div className="pharmacy-panel pharmacy-recent-sales">

        <div className="pharmacy-panel-header">

          <div>

            <h2>
              <ShoppingCart size={20} />
              Recent Sales
            </h2>

            <p>
              Latest pharmacy transactions.
            </p>

          </div>

        </div>

        {sales.length === 0 ? (

          <div className="pharmacy-empty">

            <ShoppingCart size={35} />

            <p>
              No sales available.
            </p>

          </div>

        ) : (

          <div className="pharmacy-table-wrapper">

            <table className="pharmacy-table">

              <thead>

                <tr>
                  <th>Invoice</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Amount</th>
                </tr>

              </thead>

              <tbody>

                {sales
                  .slice(0, 8)
                  .map((sale) => (

                    <tr
                      key={
                        sale._id ||
                        sale.id
                      }
                    >

                      <td>
                        {sale.invoiceNumber ||
                          sale.invoiceNo ||
                          sale._id?.slice(-6) ||
                          "-"}
                      </td>

                      <td>
                        {sale.createdAt ||
                        sale.date
                          ? new Date(
                              sale.createdAt ||
                                sale.date
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}
                      </td>

                      <td>
                        {sale.customerName ||
                          sale.patientName ||
                          "Walk-in Customer"}
                      </td>

                      <td>
                        ₹
                        {Number(
                          sale.totalAmount ??
                            sale.total ??
                            sale.amount ??
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                    </tr>

                  ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}