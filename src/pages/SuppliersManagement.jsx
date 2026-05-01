import { useEffect, useState } from "react";
import { Mail, Phone, Plus, Trash2, Truck, Edit3 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { suppliersApi } from "../api/suppliers";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Page, PageHeader, PageTitle } from "../components/ui/page";
import { EmptyState, ErrorBanner, LoadingState } from "../components/ui/state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useToast } from "../components/ui/toast";

const schema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  phone: z.string().optional(),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
});

const defaults = { name: "", phone: "", email: "" };

export default function SuppliersPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const queryClient = useQueryClient();
  const toast = useToast();
  const suppliersQuery = useQuery({ queryKey: ["suppliers"], queryFn: suppliersApi.list });
  const form = useForm({ resolver: zodResolver(schema), defaultValues: defaults });

  useEffect(() => {
    if (open) form.reset(editing ? {
      name: editing.name || "",
      phone: editing.phone || "",
      email: editing.email || "",
    } : defaults);
  }, [editing, form, open]);

  const saveMutation = useMutation({
    mutationFn: (values) => editing ? suppliersApi.update(editing.id, values) : suppliersApi.create(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success(editing ? "Supplier updated" : "Supplier created");
      setOpen(false);
      setEditing(null);
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: suppliersApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier deleted");
      setDeleting(null);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Page>
      <PageHeader>
        <PageTitle description="Manage supplier contacts for purchasing and restocking." icon={Truck} title="Suppliers" />
        <Button onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Supplier
        </Button>
      </PageHeader>

      <div className="px-4 pb-8 sm:px-6">
        {suppliersQuery.isError && (
          <ErrorBanner error={suppliersQuery.error} onRetry={suppliersQuery.refetch} />
        )}
        <Card>
          {suppliersQuery.isLoading ? <LoadingState label="Loading suppliers..." /> : (suppliersQuery.data || []).length === 0 ? <EmptyState title="No suppliers found" /> : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Supplier</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(suppliersQuery.data || []).map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium text-slate-950">{supplier.name}</TableCell>
                    <TableCell><span className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" />{supplier.phone || "-"}</span></TableCell>
                    <TableCell><span className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" />{supplier.email || "-"}</span></TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button onClick={() => { setEditing(supplier); setOpen(true); }} size="sm" variant="ghost"><Edit3 className="h-4 w-4" />Edit</Button>
                        <Button className="text-red-600 hover:text-red-700" onClick={() => setDeleting(supplier)} size="sm" variant="ghost"><Trash2 className="h-4 w-4" />Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClose={() => setOpen(false)}>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
            <DialogDescription>Supplier name is required. Phone and email are optional.</DialogDescription>
          </DialogHeader>
          <form className="space-y-3" onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}>
            <Input placeholder="Supplier name" {...form.register("name")} />
            {form.formState.errors.name && <p className="text-xs text-red-600">{form.formState.errors.name.message}</p>}
            <Input placeholder="Phone number" {...form.register("phone")} />
            <Input placeholder="Email address" type="email" {...form.register("email")} />
            {form.formState.errors.email && <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>}
            <DialogFooter>
              <Button onClick={() => setOpen(false)} variant="outline">Cancel</Button>
              <Button disabled={saveMutation.isPending} type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleting)} onOpenChange={() => setDeleting(null)}>
        <DialogContent onClose={() => setDeleting(null)}>
          <DialogHeader>
            <DialogTitle>Delete Supplier</DialogTitle>
            <DialogDescription>Delete {deleting?.name}? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDeleting(null)} variant="outline">Cancel</Button>
            <Button disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(deleting.id)} variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  );
}
