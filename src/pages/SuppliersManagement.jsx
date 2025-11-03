import React, { useState } from "react";
import { Truck, Phone, Mail, Plus, Edit3, Trash2 } from "lucide-react";

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Coffee Distributors Ltd", phone: "+234 802 345 6789", email: "contact@coffeehub.com" },
    { id: 2, name: "Sweet Cream Supply Co.", phone: "+234 810 222 3344", email: "sales@sweetcream.com" },
  ]);

  const [newSupplier, setNewSupplier] = useState({ name: "", phone: "", email: "" });

  const handleAddSupplier = (e) => {
    e.preventDefault();
    if (!newSupplier.name.trim()) return;
    setSuppliers([
      ...suppliers,
      { id: suppliers.length + 1, ...newSupplier },
    ]);
    setNewSupplier({ name: "", phone: "", email: "" });
  };

  const handleDelete = (id) => {
    setSuppliers(suppliers.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Truck className="w-6 h-6 text-green-600" /> Suppliers Management
      </h1>

      {/* Add New Supplier */}
      <form
        onSubmit={handleAddSupplier}
        className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4"
      >
        <input
          type="text"
          placeholder="Supplier Name"
          className="border border-gray-300 rounded-xl px-3 py-2 flex-1 outline-none"
          value={newSupplier.name}
          onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="border border-gray-300 rounded-xl px-3 py-2 flex-1 outline-none"
          value={newSupplier.phone}
          onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email Address"
          className="border border-gray-300 rounded-xl px-3 py-2 flex-1 outline-none"
          value={newSupplier.email}
          onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-green-700 transition"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      {/* Supplier List */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left p-3">Supplier Name</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Email</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className="border-t border-gray-100 hover:bg-gray-50"
              >
                <td className="p-3">{supplier.name}</td>
                <td className="p-3 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" /> {supplier.phone}
                </td>
                <td className="p-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" /> {supplier.email}
                </td>
                <td className="p-3 text-right">
                  <button className="text-blue-600 hover:text-blue-700 mr-3">
                    <Edit3 className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuppliersPage;
