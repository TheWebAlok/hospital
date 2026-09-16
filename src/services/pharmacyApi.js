import API from "./api";

// =====================================================
// STORES
// =====================================================

export const getStores = async () => {
  const response = await API.get("/stores");
  return response.data;
};

export const getStoreById = async (id) => {
  const response = await API.get(`/stores/${id}`);
  return response.data;
};

export const createStore = async (storeData) => {
  const response = await API.post("/stores", storeData);
  return response.data;
};

export const updateStore = async (id, storeData) => {
  const response = await API.put(`/stores/${id}`, storeData);
  return response.data;
};

export const deleteStore = async (id) => {
  const response = await API.delete(`/stores/${id}`);
  return response.data;
};

// =====================================================
// MEDICINES
// =====================================================

export const getMedicines = async (params = {}) => {
  const response = await API.get("/medicines", {
    params,
  });

  return response.data;
};

export const getMedicineById = async (id) => {
  const response = await API.get(`/medicines/${id}`);
  return response.data;
};

export const createMedicine = async (medicineData) => {
  const response = await API.post("/medicines", medicineData);
  return response.data;
};

export const updateMedicine = async (id, medicineData) => {
  const response = await API.put(
    `/medicines/${id}`,
    medicineData
  );

  return response.data;
};

export const deleteMedicine = async (id) => {
  const response = await API.delete(`/medicines/${id}`);
  return response.data;
};

// =====================================================
// CATEGORIES
// =====================================================

export const getCategories = async () => {
  const response = await API.get("/categories");
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await API.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await API.post(
    "/categories",
    categoryData
  );

  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await API.put(
    `/categories/${id}`,
    categoryData
  );

  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await API.delete(
    `/categories/${id}`
  );

  return response.data;
};

// =====================================================
// SUPPLIERS
// =====================================================

export const getSuppliers = async () => {
  const response = await API.get("/suppliers");
  return response.data;
};

export const getSupplierById = async (id) => {
  const response = await API.get(`/suppliers/${id}`);
  return response.data;
};

export const createSupplier = async (supplierData) => {
  const response = await API.post(
    "/suppliers",
    supplierData
  );

  return response.data;
};

export const updateSupplier = async (id, supplierData) => {
  const response = await API.put(
    `/suppliers/${id}`,
    supplierData
  );

  return response.data;
};

export const deleteSupplier = async (id) => {
  const response = await API.delete(
    `/suppliers/${id}`
  );

  return response.data;
};

// =====================================================
// SALES
// =====================================================

export const getSales = async (params = {}) => {
  const response = await API.get("/sales", {
    params,
  });

  return response.data;
};

export const getSaleById = async (id) => {
  const response = await API.get(`/sales/${id}`);
  return response.data;
};

export const createSale = async (saleData) => {
  const response = await API.post("/sales", saleData);
  return response.data;
};

export const updateSale = async (id, saleData) => {
  const response = await API.put(
    `/sales/${id}`,
    saleData
  );

  return response.data;
};

export const deleteSale = async (id) => {
  const response = await API.delete(`/sales/${id}`);
  return response.data;
};

// =====================================================
// LOW STOCK
// =====================================================

export const getLowStockMedicines = async () => {
  const response = await getMedicines();

  const medicines = Array.isArray(response)
    ? response
    : response.medicines ||
      response.data ||
      [];

  return medicines.filter((medicine) => {
    const stock = Number(
      medicine.stock ??
      medicine.quantity ??
      0
    );

    const threshold = Number(
      medicine.lowStockThreshold ??
      10
    );

    return stock <= threshold;
  });
};

// =====================================================
// EXPIRY ALERTS
// =====================================================

export const getExpiryMedicines = async (days = 90) => {
  const response = await getMedicines();

  const medicines = Array.isArray(response)
    ? response
    : response.medicines ||
      response.data ||
      [];

  const today = new Date();

  const futureDate = new Date();

  futureDate.setDate(
    futureDate.getDate() + Number(days)
  );

  return medicines.filter((medicine) => {
    if (!medicine.expiryDate) {
      return false;
    }

    const expiryDate = new Date(
      medicine.expiryDate
    );

    return (
      expiryDate >= today &&
      expiryDate <= futureDate
    );
  });
};

// =====================================================
// DASHBOARD DATA
// =====================================================

export const getPharmacyDashboardData = async () => {
  const [
    stores,
    medicines,
    categories,
    suppliers,
    sales,
  ] = await Promise.all([
    getStores(),
    getMedicines(),
    getCategories(),
    getSuppliers(),
    getSales(),
  ]);

  return {
    stores,
    medicines,
    categories,
    suppliers,
    sales,
  };
};

// =====================================================
// MEDICINE ORDERS
// =====================================================

export const createMedicineOrder = async (orderData) => {
  const response = await API.post(
    "/medicine-orders",
    orderData
  );

  return response.data;
};

export const getMedicineOrders = async (params = {}) => {
  const response = await API.get(
    "/medicine-orders",
    {
      params,
    }
  );

  return response.data;
};

export const getMedicineOrderById = async (id) => {
  const response = await API.get(
    `/medicine-orders/${id}`
  );

  return response.data;
};

export const updateMedicineOrderStatus = async (
  id,
  status
) => {
  const response = await API.put(
    `/medicine-orders/${id}/status`,
    {
      status,
    }
  );

  return response.data;
};

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  // STORES
  getStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,

  // MEDICINES
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,

  // CATEGORIES
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,

  // SUPPLIERS
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,

  // SALES
  getSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,

  // LOW STOCK
  getLowStockMedicines,

  // EXPIRY
  getExpiryMedicines,

  // DASHBOARD
  getPharmacyDashboardData,

  // MEDICINE ORDERS
  createMedicineOrder,
  getMedicineOrders,
  getMedicineOrderById,
  updateMedicineOrderStatus,
};