import { cn } from "../../lib/utils";

const variants = {
  default: "border-transparent bg-slate-950 text-white",
  secondary: "border-transparent bg-slate-100 text-slate-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  destructive: "border-red-200 bg-red-50 text-red-700",
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
