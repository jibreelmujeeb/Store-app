import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="fixed inset-0" onClick={() => onOpenChange?.(false)} />
      {children}
    </div>
  );
}

export function DialogContent({ className, children, onClose, ...props }) {
  return (
    <div
      className={cn(
        "relative z-10 w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 text-slate-950 shadow-xl",
        className
      )}
      {...props}
    >
      {onClose && (
        <Button
          aria-label="Close dialog"
          className="absolute right-3 top-3"
          onClick={onClose}
          size="icon"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      {children}
    </div>
  );
}

export function DialogHeader({ className, ...props }) {
  return <div className={cn("mb-5 flex flex-col gap-1.5 pr-8", className)} {...props} />;
}

export function DialogTitle({ className, ...props }) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}

export function DialogDescription({ className, ...props }) {
  return <p className={cn("text-sm text-slate-500", className)} {...props} />;
}

export function DialogFooter({ className, ...props }) {
  return <div className={cn("mt-5 flex justify-end gap-2", className)} {...props} />;
}
