import { UserPlus, Users, Phone, Edit3, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { customersApi } from "../api/customers";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Page, PageHeader, PageTitle } from "../components/ui/page";
import { EmptyState, ErrorBanner, LoadingState } from "../components/ui/state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useToast } from "../components/ui/toast";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone number is required"),
});

const defaultValues = { name: "", email: "", phone: "" };

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const queryClient = useQueryClient();
  const toast = useToast();

  const customersQuery = useQuery({ queryKey: ["customers"], queryFn: customersApi.list });
  const form = useForm({ resolver: zodResolver(customerSchema), defaultValues });

  useEffect(() => {
    if (showForm) {
      form.reset(editingCustomer ? {
        name: editingCustomer.name || "",
        email: editingCustomer.email || "",
        phone: editingCustomer.phone || "",
      } : defaultValues);
    }
  }, [editingCustomer, form, showForm]);

  const filtered = useMemo(() => (customersQuery.data || []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  ), [customersQuery.data, search]);

  const saveMutation = useMutation({
    mutationFn: (values) => editingCustomer
      ? customersApi.update(editingCustomer.id, values)
      : customersApi.create(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success(editingCustomer ? "Customer updated" : "Customer created");
      setShowForm(false);
      setEditingCustomer(null);
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: customersApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer deleted");
      setDeletingCustomer(null);
    },
    onError: (error) => toast.error(error.message),
  });

  const openCreate = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  return (
    <Page>
      <PageHeader>
        <PageTitle
          description="Keep customer contacts and order counts organized."
          icon={Users}
          title="Customers"
        />
        <Button onClick={openCreate}>
          <UserPlus className="w-4 h-4" />
          Add Customer
        </Button>
      </PageHeader>

      <div className="px-4 sm:px-6">
        <Input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="px-4 pb-8 sm:px-6">
        {customersQuery.isError && (
          <ErrorBanner error={customersQuery.error} onRetry={customersQuery.refetch} />
        )}
        <Card>
          {customersQuery.isLoading ? (
            <LoadingState label="Loading customers..." />
          ) : filtered.length === 0 ? (
            <EmptyState description="Create a customer or adjust your search." title="No customers found" />
          ) : (
          <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium text-slate-950">{c.name}</TableCell>
                <TableCell className="text-slate-600">{c.email || "-"}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    {c.phone}
                  </span>
                </TableCell>
                <TableCell>{c.total_orders || c.totalOrders || 0}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => { setEditingCustomer(c); setShowForm(true); }} size="sm" variant="ghost">
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => setDeletingCustomer(c)}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
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

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent onClose={() => setShowForm(false)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add Customer
            </DialogTitle>
            <DialogDescription>Add a customer profile for faster checkout and order history.</DialogDescription>
          </DialogHeader>

          <form className="space-y-3" onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}>
              <Input
                type="text"
                placeholder="Full Name"
                {...form.register("name")}
              />
              {form.formState.errors.name && <p className="text-xs text-red-600">{form.formState.errors.name.message}</p>}
              <Input
                type="email"
                placeholder="Email (optional)"
                {...form.register("email")}
              />
              {form.formState.errors.email && <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>}
              <Input
                type="tel"
                placeholder="Phone Number"
                {...form.register("phone")}
              />
              {form.formState.errors.phone && <p className="text-xs text-red-600">{form.formState.errors.phone.message}</p>}

          <DialogFooter>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Cancel
              </Button>
              <Button disabled={saveMutation.isPending} type="submit">
                <UserPlus className="w-4 h-4" /> Save
              </Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deletingCustomer)} onOpenChange={() => setDeletingCustomer(null)}>
        <DialogContent onClose={() => setDeletingCustomer(null)}>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>Delete {deletingCustomer?.name}? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDeletingCustomer(null)} variant="outline">Cancel</Button>
            <Button disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(deletingCustomer.id)} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  );
}
