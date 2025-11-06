import React, { useState } from "react";
import { Users, UserPlus, Edit3, Trash2, ShieldCheck } from "lucide-react";

const StaffManagementPage = () => {
  const [staffList, setStaffList] = useState([
    { id: 1, name: "Aisha Bello", email: "aisha@cafeklang.com", role: "Cashier", status: "Active" },
    { id: 2, name: "John Doe", email: "john@cafeklang.com", role: "Manager", status: "Active" },
    { id: 3, name: "Jane Smith", email: "jane@cafeklang.com", role: "Admin", status: "Suspended" },
  ]);

  const [newStaff, setNewStaff] = useState({ name: "", email: "", role: "Cashier" });

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaff.name.trim() || !newStaff.email.trim()) return;
    setStaffList([
      ...staffList,
      { id: staffList.length + 1, ...newStaff, status: "Active" },
    ]);
    setNewStaff({ name: "", email: "", role: "Cashier" });
  };

  const toggleStatus = (id) => {
    setStaffList(
      staffList.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "Active" ? "Suspended" : "Active" }
          : s
      )
    );
  };

  const handleDelete = (id) => {
    setStaffList(staffList.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-indigo-600" /> Staff / User Management
      </h1>

      {/* Add Staff Form */}
      <form
        onSubmit={handleAddStaff}
        className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4"
      >
        <input
          type="text"
          placeholder="Full Name"
          className="border border-gray-300 rounded-xl px-3 py-2 flex-1 outline-none"
          value={newStaff.name}
          onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email Address"
          className="border border-gray-300 rounded-xl px-3 py-2 flex-1 outline-none"
          value={newStaff.email}
          onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
        />
        <select
          className="border border-gray-300 rounded-xl px-3 py-2 outline-none"
          value={newStaff.role}
          onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
        >
          <option value="Cashier">Cashier</option>
          <option value="Manager">Manager</option>
          <option value="Admin">Admin</option>
        </select>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          <UserPlus className="w-4 h-4" /> Add Staff
        </button>
      </form>

      {/* Staff Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="p-3">{staff.name}</td>
                <td className="p-3">{staff.email}</td>
                <td className="p-3">{staff.role}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      staff.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {staff.status}
                  </span>
                </td>
                <td className="p-3 text-right flex justify-end gap-3">
                  <button
                    onClick={() => toggleStatus(staff.id)}
                    className="text-blue-600 hover:text-blue-700"
                    title="Toggle status"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                  <button
                    className="text-indigo-600 hover:text-indigo-700"
                    title="Edit staff"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(staff.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Delete staff"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {staffList.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No staff found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffManagementPage;
