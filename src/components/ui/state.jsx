import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { Button } from "./button";

export function LoadingState({ label = "Loading..." }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-slate-500">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
}

export function EmptyState({ title = "No records found", description }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center px-4 text-center">
      <Inbox className="h-8 w-8 text-slate-300" />
      <p className="mt-3 text-sm font-medium text-slate-700">{title}</p>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", error, onRetry }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center px-4 text-center">
      <AlertCircle className="h-8 w-8 text-red-500" />
      <p className="mt-3 text-sm font-medium text-slate-900">{title}</p>
      <p className="mt-1 max-w-md text-sm text-slate-500">{error?.message || "Please try again."}</p>
      {onRetry && (
        <Button className="mt-4" onClick={onRetry} size="sm" variant="outline">
          Retry
        </Button>
      )}
    </div>
  );
}

export function ErrorBanner({ title = "Could not load live data", error, onRetry }) {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="mt-0.5 text-red-700">{error?.message || "Showing the page without live data."}</p>
        </div>
      </div>
      {onRetry && (
        <Button className="self-start sm:self-center" onClick={onRetry} size="sm" variant="outline">
          Retry
        </Button>
      )}
    </div>
  );
}
