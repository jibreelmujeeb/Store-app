const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "pos_auth_token";

let unauthorizedHandler = null;

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function onUnauthorized(handler) {
  unauthorizedHandler = handler;
}

function buildUrl(path, params) {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

export async function apiRequest(path, options = {}) {
  const { method = "GET", body, params, auth = true } = options;
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (auth && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path, params), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401) {
      setToken(null);
      unauthorizedHandler?.();
    }

    throw new ApiError(data?.error || data?.message || "Request failed", response.status, data);
  }

  return data;
}

export const api = {
  get: (path, options) => apiRequest(path, { ...options, method: "GET" }),
  post: (path, body, options) => apiRequest(path, { ...options, method: "POST", body }),
  put: (path, body, options) => apiRequest(path, { ...options, method: "PUT", body }),
  delete: (path, options) => apiRequest(path, { ...options, method: "DELETE" }),
};
