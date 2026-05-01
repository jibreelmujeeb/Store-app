/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { Button } from "./button";
import { cn } from "../../lib/utils";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback((toast) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, type: "success", ...toast }]);
    window.setTimeout(() => remove(id), 3500);
  }, [remove]);

  const value = useMemo(() => ({
    success: (message) => show({ message, type: "success" }),
    error: (message) => show({ message, type: "error" }),
  }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        {toasts.map((toast) => {
          const Icon = toast.type === "error" ? XCircle : CheckCircle2;
          return (
            <div
              key={toast.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border bg-white p-3 text-sm shadow-lg",
                toast.type === "error" ? "border-red-200 text-red-800" : "border-emerald-200 text-emerald-800"
              )}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="flex-1">{toast.message}</p>
              <Button className="h-6 w-6" onClick={() => remove(toast.id)} size="icon" variant="ghost">
                <X className="h-3 w-3" />
              </Button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used within ToastProvider");
  return value;
}
