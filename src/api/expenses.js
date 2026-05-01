import { api } from "../lib/api";

export const expensesApi = {
  list: async () => (await api.get("/expenses")).expenses || [],
  create: (payload) => api.post("/expenses", payload),
  update: (id, payload) => api.put(`/expenses/${id}`, payload),
  remove: (id) => api.delete(`/expenses/${id}`),
};
