import { api } from "../lib/api";

export const staffApi = {
  list: async () => (await api.get("/staff")).staff || [],
  create: (payload) => api.post("/staff", payload),
  update: (id, payload) => api.put(`/staff/${id}`, payload),
  remove: (id) => api.delete(`/staff/${id}`),
};
