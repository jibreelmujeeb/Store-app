import { useEffect, useState } from "react";
import { ClipboardList, DollarSign, Edit, Plus, Trash2, Users } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { expensesApi } from "../api/expenses";
import { staffApi } from "../api/staff";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Page, PageHeader, PageTitle } from "../components/ui/page";
import { EmptyState, ErrorBanner, LoadingState } from "../components/ui/state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useToast } from "../components/ui/toast";

const expenseSchema = z.object({
  name: z.string().min(1, "Expense name is required"),
  category: z.string().optional(),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  date: z.string().min(1, "Date is required"),
});

const staffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  role: z.string().min(1, "Role is required"),
  salary: z.coerce.number().min(0, "Salary cannot be negative").optional(),
  status: z.string().optional(),
});

export default function ExpensesStaffPage() {
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const queryClient = useQueryClient();
  const toast = useToast();
  const expensesQuery = useQuery({ queryKey: ["expenses"], queryFn: expensesApi.list });
  const staffQuery = useQuery({ queryKey: ["staff"], queryFn: staffApi.list });
  const expenseForm = useForm({ resolver: zodResolver(expenseSchema), defaultValues: { name: "", category: "", amount: "", date: "" } });
  const staffForm = useForm({ resolver: zodResolver(staffSchema), defaultValues: { name: "", email: "", role: "Cashier", salary: 0, status: "Active" } });

  useEffect(() => {
    if (expenseOpen) expenseForm.reset(editingExpense ? {
      name: editingExpense.name || "",
      category: editingExpense.category || "",
      amount: Number(editingExpense.amount || 0),
      date: String(editingExpense.date || "").slice(0, 10),
    } : { name: "", category: "", amount: "", date: new Date().toISOString().slice(0, 10) });
  }, [editingExpense, expenseForm, expenseOpen]);

  useEffect(() => {
    if (staffOpen) staffForm.reset(editingStaff ? {
      name: editingStaff.name || "",
      email: editingStaff.email || "",
      role: editingStaff.role || "Cashier",
      salary: Number(editingStaff.salary || 0),
      status: editingStaff.status || "Active",
    } : { name: "", email: "", role: "Cashier", salary: 0, status: "Active" });
  }, [editingStaff, staffForm, staffOpen]);

  const saveExpense = useMutation({
    mutationFn: (values) => editingExpense ? expensesApi.update(editingExpense.id, values) : expensesApi.create(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success(editingExpense ? "Expense updated" : "Expense created");
      setExpenseOpen(false);
      setEditingExpense(null);
    },
    onError: (error) => toast.error(error.message),
  });

  const saveStaff = useMutation({
    mutationFn: (values) => editingStaff ? staffApi.update(editingStaff.id, values) : staffApi.create(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success(editingStaff ? "Staff member updated" : "Staff member created");
      setStaffOpen(false);
      setEditingStaff(null);
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ type, id }) => type === "expense" ? expensesApi.remove(id) : staffApi.remove(id),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: [variables.type === "expense" ? "expenses" : "staff"] });
      toast.success("Record deleted");
      setDeleteTarget(null);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Page>
      <PageHeader>
        <PageTitle description="Track operating expenses and staff records." icon={ClipboardList} title="Expenses & Staff" />
        <div className="flex gap-2">
          <Button onClick={() => { setEditingExpense(null); setExpenseOpen(true); }}><Plus className="h-4 w-4" />Expense</Button>
          <Button onClick={() => { setEditingStaff(null); setStaffOpen(true); }} variant="outline"><Plus className="h-4 w-4" />Staff</Button>
        </div>
      </PageHeader>

      <section className="grid grid-cols-1 gap-6 px-4 pb-8 sm:px-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" />Expenses</CardTitle></CardHeader>
          {expensesQuery.isError && <div className="px-5"><ErrorBanner error={expensesQuery.error} onRetry={expensesQuery.refetch} /></div>}
          {expensesQuery.isLoading ? <LoadingState /> : (expensesQuery.data || []).length === 0 ? <EmptyState title="No expenses found" /> : (
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>{(expensesQuery.data || []).map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell><p className="font-medium text-slate-950">{expense.name}</p><p className="text-xs text-slate-500">{expense.category || "Uncategorized"}</p></TableCell>
                  <TableCell>₦{Number(expense.amount).toLocaleString()}</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell><div className="flex justify-end gap-2"><Button onClick={() => { setEditingExpense(expense); setExpenseOpen(true); }} size="icon" variant="ghost"><Edit className="h-4 w-4" /></Button><Button className="text-red-600" onClick={() => setDeleteTarget({ type: "expense", record: expense })} size="icon" variant="ghost"><Trash2 className="h-4 w-4" /></Button></div></TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
          )}
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Staff</CardTitle></CardHeader>
          {staffQuery.isError && <div className="px-5"><ErrorBanner error={staffQuery.error} onRetry={staffQuery.refetch} /></div>}
          {staffQuery.isLoading ? <LoadingState /> : (staffQuery.data || []).length === 0 ? <EmptyState title="No staff found" /> : (
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Salary</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>{(staffQuery.data || []).map((member) => (
                <TableRow key={member.id}>
                  <TableCell><p className="font-medium text-slate-950">{member.name}</p><p className="text-xs text-slate-500">{member.email}</p></TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>₦{Number(member.salary || 0).toLocaleString()}</TableCell>
                  <TableCell><Badge variant={member.status === "Active" ? "success" : "secondary"}>{member.status || "Active"}</Badge></TableCell>
                  <TableCell><div className="flex justify-end gap-2"><Button onClick={() => { setEditingStaff(member); setStaffOpen(true); }} size="icon" variant="ghost"><Edit className="h-4 w-4" /></Button><Button className="text-red-600" onClick={() => setDeleteTarget({ type: "staff", record: member })} size="icon" variant="ghost"><Trash2 className="h-4 w-4" /></Button></div></TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
          )}
        </Card>
      </section>

      <Dialog open={expenseOpen} onOpenChange={setExpenseOpen}>
        <DialogContent onClose={() => setExpenseOpen(false)}>
          <DialogHeader><DialogTitle>{editingExpense ? "Edit Expense" : "Add Expense"}</DialogTitle><DialogDescription>Record business operating costs.</DialogDescription></DialogHeader>
          <form className="space-y-3" onSubmit={expenseForm.handleSubmit((values) => saveExpense.mutate(values))}>
            <Input placeholder="Expense name" {...expenseForm.register("name")} />
            <Input placeholder="Category" {...expenseForm.register("category")} />
            <Input placeholder="Amount" type="number" {...expenseForm.register("amount")} />
            <Input type="date" {...expenseForm.register("date")} />
            {Object.values(expenseForm.formState.errors)[0] && <p className="text-xs text-red-600">{Object.values(expenseForm.formState.errors)[0].message}</p>}
            <DialogFooter><Button onClick={() => setExpenseOpen(false)} variant="outline">Cancel</Button><Button disabled={saveExpense.isPending} type="submit">Save</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={staffOpen} onOpenChange={setStaffOpen}>
        <DialogContent onClose={() => setStaffOpen(false)}>
          <DialogHeader><DialogTitle>{editingStaff ? "Edit Staff" : "Add Staff"}</DialogTitle><DialogDescription>Staff name and email are required.</DialogDescription></DialogHeader>
          <form className="space-y-3" onSubmit={staffForm.handleSubmit((values) => saveStaff.mutate(values))}>
            <Input placeholder="Full name" {...staffForm.register("name")} />
            <Input placeholder="Email" type="email" {...staffForm.register("email")} />
            <Input placeholder="Role" {...staffForm.register("role")} />
            <Input placeholder="Salary" type="number" {...staffForm.register("salary")} />
            {Object.values(staffForm.formState.errors)[0] && <p className="text-xs text-red-600">{Object.values(staffForm.formState.errors)[0].message}</p>}
            <DialogFooter><Button onClick={() => setStaffOpen(false)} variant="outline">Cancel</Button><Button disabled={saveStaff.isPending} type="submit">Save</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent onClose={() => setDeleteTarget(null)}>
          <DialogHeader><DialogTitle>Delete Record</DialogTitle><DialogDescription>Delete {deleteTarget?.record?.name}? This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter><Button onClick={() => setDeleteTarget(null)} variant="outline">Cancel</Button><Button disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate({ type: deleteTarget.type, id: deleteTarget.record.id })} variant="destructive">Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  );
}
