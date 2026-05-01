import { Bell, Package, AlertTriangle, CheckCircle2, Info, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "../api/notifications";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Page, PageHeader, PageTitle } from "../components/ui/page";
import { EmptyState, ErrorBanner, LoadingState } from "../components/ui/state";
import { useToast } from "../components/ui/toast";

function NotificationIcon({ type }) {
  if (type === "low-stock") return <Package className="h-5 w-5 text-red-500" />;
  if (type === "warning") return <AlertTriangle className="h-5 w-5 text-amber-500" />;
  if (type === "sale") return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
  return <Info className="h-5 w-5 text-slate-500" />;
}

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const notificationsQuery = useQuery({ queryKey: ["notifications"], queryFn: notificationsApi.list });
  const checkStockMutation = useMutation({
    mutationFn: notificationsApi.checkLowStock,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Low-stock check completed");
    },
    onError: (error) => toast.error(error.message),
  });
  const deleteMutation = useMutation({
    mutationFn: notificationsApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted");
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Page>
      <PageHeader>
        <PageTitle description="Review system alerts and low-stock notices." icon={Bell} title="Notifications" />
        <Button onClick={() => checkStockMutation.mutate()} variant="outline">Check Low Stock</Button>
      </PageHeader>
      <div className="px-4 pb-8 sm:px-6">
        {notificationsQuery.isError && (
          <ErrorBanner error={notificationsQuery.error} onRetry={notificationsQuery.refetch} />
        )}
        <Card className="divide-y divide-slate-100">
          {notificationsQuery.isLoading ? <LoadingState /> : (notificationsQuery.data || []).length === 0 ? <EmptyState title="No notifications" /> : (notificationsQuery.data || []).map((note) => (
            <div key={note.id} className="flex items-start gap-3 p-4">
              <NotificationIcon type={note.type} />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-800">{note.message}</p>
                <p className="mt-1 text-xs text-slate-500">{new Date(note.created_at).toLocaleString()}</p>
              </div>
              <Button className="text-red-600" onClick={() => deleteMutation.mutate(note.id)} size="icon" variant="ghost">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </Card>
      </div>
    </Page>
  );
}
