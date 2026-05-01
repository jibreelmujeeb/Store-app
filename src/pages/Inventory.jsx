import { Plus, Edit3, Trash2, PackageSearch, PackagePlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { productsApi } from "../api/products";
import { Badge } from "../components/ui/badge";
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

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than zero"),
  stock: z.coerce.number().int("Stock must be a whole number").min(0, "Stock cannot be negative"),
});

const defaultValues = { name: "", category: "", price: "", stock: 0 };

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const queryClient = useQueryClient();
  const toast = useToast();

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: productsApi.list,
  });

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  useEffect(() => {
    if (showForm) {
      form.reset(editingProduct ? {
        name: editingProduct.name || "",
        category: editingProduct.category || "",
        price: Number(editingProduct.price || 0),
        stock: Number(editingProduct.stock || 0),
      } : defaultValues);
    }
  }, [editingProduct, form, showForm]);

  const filtered = useMemo(() =>
    (productsQuery.data || []).filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    ),
    [productsQuery.data, search]
  );

  const saveMutation = useMutation({
    mutationFn: (values) => editingProduct
      ? productsApi.update(editingProduct.id, values)
      : productsApi.create(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(editingProduct ? "Product updated" : "Product created");
      setShowForm(false);
      setEditingProduct(null);
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
      setDeletingProduct(null);
    },
    onError: (error) => toast.error(error.message),
  });

  const openCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  return (
    <Page>
      <PageHeader>
        <PageTitle
          description="Manage products, stock levels, and price changes."
          icon={PackageSearch}
          title="Inventory"
        />

        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </PageHeader>

      <div className="px-4 sm:px-6">
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
        />
      </div>

      <div className="px-4 pb-8 sm:px-6">
        {productsQuery.isError && (
          <ErrorBanner error={productsQuery.error} onRetry={productsQuery.refetch} />
        )}
        <Card>
          {productsQuery.isLoading ? (
            <LoadingState label="Loading products..." />
          ) : filtered.length === 0 ? (
            <EmptyState description="Create a product or adjust your search." title="No products found" />
          ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-slate-950">{p.name}</TableCell>
                  <TableCell>{p.category || "Uncategorized"}</TableCell>
                  <TableCell>₦{Number(p.price).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={Number(p.stock) <= 5 ? "destructive" : "secondary"}>{p.stock} in stock</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => openEdit(p)} size="sm" variant="ghost">
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => setDeletingProduct(p)}
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
              <PackagePlus className="h-5 w-5" />
              {editingProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
            <DialogDescription>Create a product record with price and stock quantity.</DialogDescription>
          </DialogHeader>

          <form className="space-y-3" onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}>
              <Input
                type="text"
                placeholder="Product name"
                {...form.register("name")}
              />
              {form.formState.errors.name && <p className="text-xs text-red-600">{form.formState.errors.name.message}</p>}
              <Input
                type="text"
                placeholder="Category"
                {...form.register("category")}
              />
              <Input
                type="number"
                placeholder="Price (₦)"
                step="0.01"
                {...form.register("price")}
              />
              {form.formState.errors.price && <p className="text-xs text-red-600">{form.formState.errors.price.message}</p>}
              <Input
                type="number"
                placeholder="Stock quantity"
                {...form.register("stock")}
              />
              {form.formState.errors.stock && <p className="text-xs text-red-600">{form.formState.errors.stock.message}</p>}

          <DialogFooter>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Cancel
              </Button>
              <Button disabled={saveMutation.isPending} type="submit">
                <Plus className="w-4 h-4" /> {saveMutation.isPending ? "Saving..." : "Save"}
              </Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deletingProduct)} onOpenChange={() => setDeletingProduct(null)}>
        <DialogContent onClose={() => setDeletingProduct(null)}>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              This will permanently delete {deletingProduct?.name}. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDeletingProduct(null)} variant="outline">Cancel</Button>
            <Button
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(deletingProduct.id)}
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  );
}
