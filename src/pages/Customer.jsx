import { UserPlus, Users, Phone, Mail, Edit3, Trash2 } from "lucide-react";
import { useState } from "react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([
    { id: 1, name: "Amina Bello", email: "amina@example.com", phone: "08123456789", totalOrders: 12 },
    { id: 2, name: "John Doe", email: "john@example.com", phone: "09012345678", totalOrders: 5 },
    { id: 3, name: "Grace Okon", email: "grace@example.com", phone: "08099911122", totalOrders: 8 },
  ]);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" });

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const addCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) return;
    setCustomers([
      ...customers,
      { ...newCustomer, id: Date.now(), totalOrders: 0 },
    ]);
    setNewCustomer({ name: "", email: "", phone: "" });
    setShowForm(false);
  };

  const deleteCustomer = (id) =>
    setCustomers(customers.filter((c) => c.id !== id));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Customers
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <UserPlus className="w-4 h-4" />
          Add Customer
        </button>
      </header>

      {/* Search Bar */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200 bg-gray-50">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm bg-white"
        />
      </div>

      {/* Table */}
      <div className="p-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-xs">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Orders</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-gray-200 hover:bg-gray-100 transition">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-600">{c.email || "—"}</td>
                <td className="px-4 py-3 flex items-center gap-1 text-gray-700">
                  <Phone className="w-4 h-4 text-blue-600" /> {c.phone}
                </td>
                <td className="px-4 py-3 text-gray-700">{c.totalOrders}</td>
                <td className="px-4 py-3 text-right flex justify-end gap-3">
                  <button className="text-blue-600 hover:underline flex items-center gap-1">
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCustomer(c.id)}
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
          <p className="text-sm text-gray-400 text-center py-6">No customers found</p>
        )}
      </div>

      {/* Add Customer Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white border border-gray-200 rounded-xl w-96 p-6 space-y-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Add New Customer
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
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
                onClick={addCustomer}
                className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-blue-700 transition"
              >
                <UserPlus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
