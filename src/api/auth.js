import { api } from "../lib/api";

export const authApi = {
  login: (payload) => api.post("/auth/login", payload, { auth: false }),
  register: (payload) => api.post("/auth/register", payload, { auth: false }),
};
