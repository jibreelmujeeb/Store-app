import { Search, ShoppingCart, Trash2, CreditCard, Printer, Plus } from "lucide-react";
import { useState } from "react";

export default function POSPage() {
  const [cart, setCart] = useState([]);

  const products = [
    { id: 1, name: "Cappuccino", price: 1500 },
    { id: 2, name: "Latte", price: 1800 },
    { id: 3, name: "Espresso", price: 1200 },
    { id: 4, name: "Mocha", price: 2000 },
    { id: 5, name: "Iced Coffee", price: 1700 },
  ];

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

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Left: Products */}
      <div className="flex-1 border-r border-gray-200">
        {/* Search bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-white">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full outline-none bg-transparent text-sm"
          />
        </div>

        {/* Product grid */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => addToCart(p)}
              className="flex flex-col items-center justify-center gap-2 border border-gray-200 bg-white rounded-xl p-4 hover:border-blue-500 transition"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full text-blue-600">
                <Plus className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium">{p.name}</p>
              <p className="text-xs text-gray-500">₦{p.price.toLocaleString()}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-full md:w-96 bg-white flex flex-col border-l border-gray-200">
        {/* Cart header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            Current Sale
          </h2>
          <button
            onClick={() => setCart([])}
            className="text-xs text-red-500 flex items-center gap-1 hover:underline"
          >
            <Trash2 className="w-4 h-4" /> Clear
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <p className="text-sm text-gray-400 text-center mt-10">No items added yet</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border border-gray-200 rounded-xl px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    ₦{item.price.toLocaleString()} × {item.qty}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    ₦{(item.price * item.qty).toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart footer */}
        <div className="border-t border-gray-200 p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-medium">₦{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (5%)</span>
            <span className="font-medium">₦{(total * 0.05).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>₦{(total * 1.05).toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <button className="flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-medium rounded-lg py-2 hover:bg-blue-700 transition">
              <CreditCard className="w-4 h-4" /> Pay
            </button>
            <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg py-2 hover:bg-gray-200 transition">
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
