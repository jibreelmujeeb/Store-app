import { Search, Filter, Receipt, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "../api/orders";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Page, PageHeader, PageTitle } from "../components/ui/page";
import { EmptyState, ErrorBanner, LoadingState } from "../components/ui/state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const ordersQuery = useQuery({ queryKey: ["orders"], queryFn: ordersApi.list });
  const orders = useMemo(() => (ordersQuery.data || []).filter((order) => {
    const haystack = `${order.invoice_id || ""} ${order.customer_name || ""} ${order.status || ""}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  }), [ordersQuery.data, search]);

  const getStatusVariant = (status) => {
    switch (status) {
      case "Paid": return "success";
      case "Pending": return "warning";
      case "Cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Pending": return <Clock className="w-4 h-4 text-yellow-600" />;
      case "Cancelled": return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <Page>
      <PageHeader>
        <PageTitle
          description="Search, filter, and review recent transactions."
          icon={Receipt}
          title="Orders"
        />
        <Button variant="outline">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </PageHeader>

      <div className="px-4 sm:px-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by invoice ID, customer, or date..."
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className="px-4 pb-8 sm:px-6">
        {ordersQuery.isError && (
          <ErrorBanner error={ordersQuery.error} onRetry={ordersQuery.refetch} />
        )}
        <Card>
          {ordersQuery.isLoading ? (
            <LoadingState label="Loading orders..." />
          ) : orders.length === 0 ? (
            <EmptyState title="No orders found" />
          ) : (
          <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Invoice ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-slate-950">{order.invoice_id}</TableCell>
                <TableCell>{order.customer_name || "Walk-in customer"}</TableCell>
                <TableCell className="font-semibold">₦{Number(order.total).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(order.status)}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-600">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4" /> View
                  </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
          )}
        </Card>
      </div>
    </Page>
  );
}
