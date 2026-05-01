import { api } from "../lib/api";

export const reportsApi = {
  dashboard: () => api.get("/reports/dashboard"),
  salesChart: async () => (await api.get("/reports/sales-chart")).sales_data || [],
  topProducts: async () => (await api.get("/reports/top-products")).top_products || [],
};
