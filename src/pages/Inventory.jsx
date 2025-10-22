import { Plus, Edit3, Trash2, PackageSearch, PackagePlus } from "lucide-react";
import { useState } from "react";

export default function InventoryPage() {
  const [products, setProducts] = useState([
    { id: 1, name: "Cappuccino", category: "Drinks", price: 1500, stock: 23 },
    { id: 2, name: "Latte", category: "Drinks", price: 1800, stock: 12 },
    { id: 3, name: "Espresso", category: "Drinks", price: 1200, stock: 8 },
    { id: 4, name: "Mocha", category: "Special", price: 2000, stock: 4 },
  ]);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;
    setProducts([
      ...products,
      { ...newProduct, id: Date.now(), price: Number(newProduct.price), stock: Number(newProduct.stock) },
    ]);
    setNewProduct({ name: "", category: "", price: "", stock: "" });
    setShowForm(false);
  };

  const deleteProduct = (id) =>
    setProducts(products.filter((p) => p.id !== id));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <PackageSearch className="w-6 h-6 text-blue-600" />
          Inventory
        </h1>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </header>

      {/* Search bar */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200 bg-gray-50">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm bg-white"
        />
      </div>

      {/* Table */}
      <div className="p-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-xs">
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-100 transition">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">₦{p.price.toLocaleString()}</td>
                <td
                  className={`px-4 py-3 ${
                    p.stock <= 5 ? "text-red-500 font-medium" : "text-gray-700"
                  }`}
                >
                  {p.stock}
                </td>
                <td className="px-4 py-3 text-right flex justify-end gap-3">
                  <button className="text-blue-600 hover:underline flex items-center gap-1">
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-red-500 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">No products found</p>
        )}
      </div>

      {/* Add Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white border border-gray-200 rounded-xl w-96 p-6 space-y-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <PackagePlus className="w-5 h-5 text-blue-600" />
              Add New Product
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Product name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
              />
              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
              />
              <input
                type="number"
                placeholder="Price (₦)"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
              />
              <input
                type="number"
                placeholder="Stock quantity"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-600 text-sm hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={addProduct}
                className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
