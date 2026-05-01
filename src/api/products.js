import { api } from "../lib/api";

export const productsApi = {
  list: async () => (await api.get("/products")).products || [],
  get: async (id) => (await api.get(`/products/${id}`)).product,
  create: (payload) => api.post("/products", payload),
  update: (id, payload) => api.put(`/products/${id}`, payload),
  remove: (id) => api.delete(`/products/${id}`),
};
