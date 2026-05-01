import { api } from "../lib/api";

export const notificationsApi = {
  list: async () => (await api.get("/notifications")).notifications || [],
  create: (payload) => api.post("/notifications", payload),
  markRead: (id) => api.put(`/notifications/read/${id}`, {}),
  remove: (id) => api.delete(`/notifications/${id}`),
  checkLowStock: () => api.post("/notifications/check-low-stock", {}),
};
