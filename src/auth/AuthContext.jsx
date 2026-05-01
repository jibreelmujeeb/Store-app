/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth";
import { getToken, onUnauthorized, setToken } from "../lib/api";

const USER_KEY = "pos_auth_user";
const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [token, setAuthToken] = useState(() => getToken());
  const [user, setUser] = useState(() => readStoredUser());

  const clearSession = useCallback(() => {
    setToken(null);
    localStorage.removeItem(USER_KEY);
    setAuthToken(null);
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    onUnauthorized(clearSession);
  }, [clearSession]);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setToken(data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setAuthToken(data.token);
      setUser(data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
  });

  const value = useMemo(() => ({
    isAuthenticated: Boolean(token),
    token,
    user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: clearSession,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  }), [clearSession, loginMutation.isPending, loginMutation.mutateAsync, registerMutation.isPending, registerMutation.mutateAsync, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
