import { Users, Plus, Trash2, Edit, DollarSign, ClipboardList } from "lucide-react";

export default function ExpensesStaffPage() {
  const expenses = [
    { id: 1, name: "Coffee Beans", category: "Supplies", amount: "₦45,000", date: "Oct 22, 2025" },
    { id: 2, name: "Electricity Bill", category: "Utilities", amount: "₦18,200", date: "Oct 21, 2025" },
    { id: 3, name: "Delivery Van Fuel", category: "Transport", amount: "₦9,800", date: "Oct 20, 2025" },
  ];

  const staff = [
    { id: 1, name: "Aisha Bello", role: "Cashier", salary: "₦65,000", status: "Active" },
    { id: 2, name: "Samuel Ade", role: "Barista", salary: "₦80,000", status: "Active" },
    { id: 3, name: "Tomiwa Lawal", role: "Cleaner", salary: "₦35,000", status: "Inactive" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-blue-600" />
          Expenses & Staff Management
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </header>

      {/* Expenses Table */}
      <section className="p-6">
        <h2 className="text-base font-medium mb-3 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Expense Records
        </h2>

        <table className="w-full border-collapse bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
          <thead className="bg-gray-100 text-sm text-gray-600 border-b border-gray-200">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id} className="text-sm border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="p-3">{exp.name}</td>
                <td className="p-3">{exp.category}</td>
                <td className="p-3 font-semibold text-gray-800">{exp.amount}</td>
                <td className="p-3 text-gray-600">{exp.date}</td>
                <td className="p-3 text-right flex justify-end gap-2">
                  <button className="text-blue-600 hover:text-blue-700">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Staff Management */}
        <h2 className="text-base font-medium mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          Staff Members
        </h2>

        <table className="w-full border-collapse bg-white border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-sm text-gray-600 border-b border-gray-200">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Salary</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id} className="text-sm border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="p-3">{member.name}</td>
                <td className="p-3">{member.role}</td>
                <td className="p-3 font-semibold text-gray-800">{member.salary}</td>
                <td
                  className={`p-3 font-medium ${
                    member.status === "Active" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {member.status}
                </td>
                <td className="p-3 text-right flex justify-end gap-2">
                  <button className="text-blue-600 hover:text-blue-700">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
