import { api } from "../lib/api";

export const settingsApi = {
  get: async () => (await api.get("/settings")).settings,
  update: (payload) => api.put("/settings", payload),
};
