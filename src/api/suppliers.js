import { api } from "../lib/api";

export const suppliersApi = {
  list: async () => (await api.get("/suppliers")).suppliers || [],
  create: (payload) => api.post("/suppliers", payload),
  update: (id, payload) => api.put(`/suppliers/${id}`, payload),
  remove: (id) => api.delete(`/suppliers/${id}`),
};
