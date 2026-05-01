import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { BarChart3, TrendingUp, DollarSign, Package, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "../api/reports";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Page, PageHeader, PageTitle } from "../components/ui/page";
import { ErrorBanner, LoadingState } from "../components/ui/state";

export default function ReportsPage() {
  const dashboardQuery = useQuery({ queryKey: ["reports", "dashboard"], queryFn: reportsApi.dashboard });
  const salesQuery = useQuery({ queryKey: ["reports", "sales-chart"], queryFn: reportsApi.salesChart });
  const topProductsQuery = useQuery({ queryKey: ["reports", "top-products"], queryFn: reportsApi.topProducts });
  const dashboard = dashboardQuery.data || {};
  const revenueData = salesQuery.data || [];
  const topProducts = topProductsQuery.data || [];

  const stats = [
    { icon: DollarSign, label: "Today's Sales", value: `₦${Number(dashboard.today_sales || 0).toLocaleString()}` },
    { icon: TrendingUp, label: "Monthly Revenue", value: `₦${Number(dashboard.monthly_revenue || 0).toLocaleString()}` },
    { icon: Package, label: "Products In Stock", value: Number(dashboard.total_stock || 0).toLocaleString() },
    { icon: Users, label: "Customers", value: Number(dashboard.total_customers || 0).toLocaleString() },
  ];

  return (
    <Page>
      <PageHeader>
        <PageTitle
          description="Review revenue, product movement, and customer growth."
          icon={BarChart3}
          title="Reports"
        />
        <Button>Export Report</Button>
      </PageHeader>

      <section className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 xl:grid-cols-4">
        {dashboardQuery.isLoading && <div className="col-span-full"><LoadingState label="Loading report summary..." /></div>}
        {dashboardQuery.isError && <div className="col-span-full"><ErrorBanner error={dashboardQuery.error} onRetry={dashboardQuery.refetch} /></div>}
        {!dashboardQuery.isLoading && stats.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="text-xl font-semibold text-slate-950">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 px-4 pb-8 sm:px-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-slate-600" />
              Monthly Revenue
            </CardTitle>
            <CardDescription>Six-month revenue trend.</CardDescription>
          </CardHeader>
          <CardContent>
          {salesQuery.isError && <ErrorBanner error={salesQuery.error} onRetry={salesQuery.refetch} />}
          {salesQuery.isLoading ? <LoadingState /> : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#0f172a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-slate-600" />
              Top Products
            </CardTitle>
            <CardDescription>Units sold by product.</CardDescription>
          </CardHeader>
          <CardContent>
          {topProductsQuery.isError && <ErrorBanner error={topProductsQuery.error} onRetry={topProductsQuery.refetch} />}
          {topProductsQuery.isLoading ? <LoadingState /> : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          )}
          </CardContent>
        </Card>
      </section>
    </Page>
  );
}
