import { api } from "../lib/api";

export const ordersApi = {
  list: async () => (await api.get("/orders")).orders || [],
  get: async (id) => (await api.get(`/orders/${id}`)).order,
  create: (payload) => api.post("/orders", payload),
  updateStatus: (id, payload) => api.put(`/orders/status/${id}`, payload),
  remove: (id) => api.delete(`/orders/${id}`),
};
