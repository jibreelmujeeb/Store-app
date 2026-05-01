import { useMemo, useState } from "react";
import { Calendar, Eye, Printer, Receipt, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "../api/orders";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Page, PageHeader, PageTitle } from "../components/ui/page";
import { EmptyState, ErrorBanner, ErrorState, LoadingState } from "../components/ui/state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

export default function ReceiptsHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const ordersQuery = useQuery({ queryKey: ["orders"], queryFn: ordersApi.list });
  const receiptQuery = useQuery({
    queryKey: ["orders", selectedId],
    queryFn: () => ordersApi.get(selectedId),
    enabled: Boolean(selectedId),
  });

  const receipts = useMemo(() => (ordersQuery.data || []).filter((order) => {
    const matchesSearch = `${order.invoice_id} ${order.customer_name || ""}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || String(order.created_at || "").slice(0, 10) === filterDate;
    return matchesSearch && matchesDate;
  }), [filterDate, ordersQuery.data, searchTerm]);

  return (
    <Page>
      <PageHeader>
        <PageTitle description="Review completed sales and receipt details." icon={Receipt} title="Receipts & Sales History" />
      </PageHeader>

      <div className="grid gap-3 px-4 sm:px-6 md:grid-cols-[1fr_14rem]">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input className="pl-9" onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search receipt ID or customer..." value={searchTerm} />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input className="pl-9" onChange={(event) => setFilterDate(event.target.value)} type="date" value={filterDate} />
        </div>
      </div>

      <div className="px-4 pb-8 sm:px-6">
        {ordersQuery.isError && (
          <ErrorBanner error={ordersQuery.error} onRetry={ordersQuery.refetch} />
        )}
        <Card>
          {ordersQuery.isLoading ? <LoadingState label="Loading receipts..." /> : receipts.length === 0 ? <EmptyState title="No receipts found" /> : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent"><TableHead>Receipt ID</TableHead><TableHead>Customer</TableHead><TableHead>Date</TableHead><TableHead>Payment</TableHead><TableHead className="text-right">Total</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-medium text-slate-950">{receipt.invoice_id}</TableCell>
                    <TableCell>{receipt.customer_name || "Walk-in customer"}</TableCell>
                    <TableCell>{new Date(receipt.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{receipt.payment_method}</TableCell>
                    <TableCell className="text-right font-medium">₦{Number(receipt.total).toLocaleString()}</TableCell>
                    <TableCell><div className="flex justify-end gap-2"><Button onClick={() => setSelectedId(receipt.id)} size="icon" variant="ghost"><Eye className="h-4 w-4" /></Button><Button size="icon" variant="ghost"><Printer className="h-4 w-4" /></Button></div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      <Dialog open={Boolean(selectedId)} onOpenChange={() => setSelectedId(null)}>
        <DialogContent onClose={() => setSelectedId(null)}>
          <DialogHeader>
            <DialogTitle>{receiptQuery.data?.invoice_id || "Receipt"}</DialogTitle>
            <DialogDescription>{receiptQuery.data?.customer_name || "Walk-in customer"}</DialogDescription>
          </DialogHeader>
          {receiptQuery.isLoading ? <LoadingState /> : receiptQuery.isError ? <ErrorState error={receiptQuery.error} /> : receiptQuery.data && (
            <div className="space-y-3 text-sm">
              {(receiptQuery.data.items || []).map((item) => (
                <div className="flex justify-between border-b border-slate-100 pb-2" key={item.id}>
                  <span>{item.product_name} x{item.quantity}</span>
                  <span>₦{Number(item.price).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-semibold"><span>Total</span><span>₦{Number(receiptQuery.data.total).toLocaleString()}</span></div>
            </div>
          )}
          <DialogFooter><Button variant="outline"><Printer className="h-4 w-4" />Print</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  );
}
