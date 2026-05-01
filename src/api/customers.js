import { api } from "../lib/api";

export const customersApi = {
  list: async () => (await api.get("/customers")).customers || [],
  create: (payload) => api.post("/customers", payload),
  update: (id, payload) => api.put(`/customers/${id}`, payload),
  remove: (id) => api.delete(`/customers/${id}`),
};
