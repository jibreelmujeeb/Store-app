import { BarChart3, Package, Users, ShoppingBag, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "../api/orders";
import { reportsApi } from "../api/reports";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Page, PageHeader, PageTitle } from "../components/ui/page";
import { ErrorBanner, LoadingState } from "../components/ui/state";

export default function Dashboard() {
  const dashboardQuery = useQuery({ queryKey: ["reports", "dashboard"], queryFn: reportsApi.dashboard });
  const ordersQuery = useQuery({ queryKey: ["orders"], queryFn: ordersApi.list });
  const dashboard = dashboardQuery.data || {};
  const stats = [
    { icon: ShoppingBag, label: "Today's Sales", value: `₦${Number(dashboard.today_sales || 0).toLocaleString()}`, note: "Paid sales today" },
    { icon: Package, label: "Products in Stock", value: Number(dashboard.total_stock || 0).toLocaleString(), note: "Total units available" },
    { icon: Users, label: "Customers", value: Number(dashboard.total_customers || 0).toLocaleString(), note: "Customer records" },
    { icon: BarChart3, label: "Monthly Revenue", value: `₦${Number(dashboard.monthly_revenue || 0).toLocaleString()}`, note: "Paid sales this month" },
  ];

  return (
    <Page>
      <PageHeader>
        <PageTitle
          description="Track sales, inventory, and activity from one place."
          icon={TrendingUp}
          title="Dashboard"
        />
        <Button>
          New Sale
        </Button>
      </PageHeader>

      <section className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 xl:grid-cols-4">
        {dashboardQuery.isLoading && <div className="col-span-full"><LoadingState label="Loading dashboard..." /></div>}
        {dashboardQuery.isError && <div className="col-span-full"><ErrorBanner error={dashboardQuery.error} onRetry={dashboardQuery.refetch} /></div>}
        {!dashboardQuery.isLoading && stats.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="text-2xl font-semibold text-slate-950">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.note}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 px-4 pb-8 sm:px-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-slate-600" />
              Sales Overview
            </CardTitle>
            <CardDescription>Revenue trend and order volume for the current week.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid h-64 grid-cols-7 items-end gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
              {[46, 62, 54, 79, 68, 92, 73].map((height, index) => (
                <div key={index} className="flex h-full items-end">
                  <div className="w-full rounded-t-md bg-slate-900" style={{ height: `${height}%` }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest operational updates.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 text-sm">
              {(ordersQuery.data || []).slice(0, 5).map((order) => (
                <li key={order.id} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-800">Sale {order.status}</p>
                    <p className="text-slate-500">{order.invoice_id}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString()}</span>
                </li>
              ))}
              {!ordersQuery.isLoading && (ordersQuery.data || []).length === 0 && (
                <li className="text-sm text-slate-500">No recent activity yet.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </section>
    </Page>
  );
}
