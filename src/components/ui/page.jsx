import { cn } from "../../lib/utils";

export function Page({ className, ...props }) {
  return <div className={cn("space-y-6", className)} {...props} />;
}

export function PageHeader({ className, ...props }) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 border-b border-slate-200 bg-white px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6",
        className
      )}
      {...props}
    />
  );
}

export function PageTitle({ icon: Icon, title, description, className }) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex items-center gap-2">
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-slate-700">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <h1 className="truncate text-xl font-semibold text-slate-950">{title}</h1>
      </div>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  );
}
