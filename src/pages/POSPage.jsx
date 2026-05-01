import { Minus, Search, ShoppingCart, Trash2, CreditCard, Printer, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "../api/orders";
import { productsApi } from "../api/products";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { EmptyState, ErrorBanner, LoadingState } from "../components/ui/state";
import { useToast } from "../components/ui/toast";

export default function POSPage() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const toast = useToast();
  const productsQuery = useQuery({ queryKey: ["products"], queryFn: productsApi.list });
  const products = useMemo(() => (productsQuery.data || []).filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  ), [productsQuery.data, search]);

  const addToCart = (product) => {
    setCart((prev) => {
          const exists = prev.find((item) => item.id === product.id);
          if (exists) {
            return prev.map((item) =>
              item.id === product.id ? { ...item, qty: item.qty + 1 } : item
            );
          }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeItem = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
  const updateQty = (id, change) => setCart((prev) =>
    prev.map((item) => item.id === id ? { ...item, qty: Math.max(1, item.qty + change) } : item)
  );

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
  const checkoutMutation = useMutation({
    mutationFn: () => ordersApi.create({
      items: cart.map((item) => ({ product_id: item.id, quantity: item.qty })),
      payment_method: "Cash",
      status: "Paid",
    }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Sale completed");
      setCart([]);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="grid min-h-screen grid-cols-1 bg-slate-50 text-slate-900 xl:grid-cols-[1fr_24rem]">
      <section className="min-w-0 border-r border-slate-200">
        <div className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-950">Point of Sale</h1>
            <p className="mt-1 text-sm text-slate-500">Add products, confirm totals, and complete checkout.</p>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
            type="text"
            placeholder="Search products..."
              className="pl-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
          />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-6 lg:grid-cols-4">
          {productsQuery.isLoading && <div className="col-span-full"><LoadingState label="Loading products..." /></div>}
          {productsQuery.isError && <div className="col-span-full"><ErrorBanner error={productsQuery.error} onRetry={productsQuery.refetch} /></div>}
          {!productsQuery.isLoading && products.length === 0 && (
            <div className="col-span-full"><EmptyState title="No products available" /></div>
          )}
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => addToCart(p)}
              disabled={Number(p.stock) <= 0}
              className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                <Plus className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-slate-950">{p.name}</p>
              <p className="text-xs text-slate-500">₦{Number(p.price).toLocaleString()}</p>
            </button>
          ))}
        </div>
      </section>

      <aside className="flex min-h-[34rem] flex-col bg-white xl:sticky xl:top-0 xl:h-screen">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <ShoppingCart className="w-5 h-5 text-slate-600" />
            Current Sale
          </h2>
          <Button
            onClick={() => setCart([])}
            className="text-red-600 hover:text-red-700"
            size="sm"
            variant="ghost"
          >
            <Trash2 className="w-4 h-4" /> Clear
          </Button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <p className="mt-10 text-center text-sm text-slate-400">No items added yet</p>
          ) : (
            cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    ₦{Number(item.price).toLocaleString()} × {item.qty}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => updateQty(item.id, -1)} size="icon" variant="outline">
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-5 text-center text-sm">{item.qty}</span>
                  <Button onClick={() => updateQty(item.id, 1)} size="icon" variant="outline">
                    <Plus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-semibold">
                    ₦{(Number(item.price) * item.qty).toLocaleString()}
                  </span>
                  <Button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-red-600"
                    size="icon"
                    variant="ghost"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-3 border-t border-slate-200 p-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-medium">₦{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (5%)</span>
            <span className="font-medium">₦{(total * 0.05).toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold">
            <span>Total</span>
            <span>₦{(total * 1.05).toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <Button disabled={cart.length === 0 || checkoutMutation.isPending} onClick={() => checkoutMutation.mutate()}>
              <CreditCard className="w-4 h-4" /> Pay
            </Button>
            <Button variant="outline">
              <Printer className="w-4 h-4" /> Print
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
