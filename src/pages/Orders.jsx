import { Search, Filter, Receipt, Eye, CheckCircle, XCircle, Clock } from "lucide-react";

export default function OrdersPage() {
  const orders = [
    { id: "#INV-2345", customer: "John Doe", total: "₦18,500", status: "Paid", date: "Oct 22, 2025" },
    { id: "#INV-2346", customer: "Sarah Adams", total: "₦7,200", status: "Pending", date: "Oct 21, 2025" },
    { id: "#INV-2347", customer: "Tunde Alabi", total: "₦15,900", status: "Cancelled", date: "Oct 20, 2025" },
    { id: "#INV-2348", customer: "Mary Okoro", total: "₦25,000", status: "Paid", date: "Oct 19, 2025" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid": return "text-green-600";
      case "Pending": return "text-yellow-600";
      case "Cancelled": return "text-red-600";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Pending": return <Clock className="w-4 h-4 text-yellow-600" />;
      case "Cancelled": return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Receipt className="w-6 h-6 text-blue-600" />
          Orders / Transactions
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </header>

      {/* Search Bar */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200 bg-white">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by invoice ID, customer, or date..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-6">
        <table className="w-full border-collapse bg-white border border-gray-200 rounded-xl overflow-hidden">
          <thead>
            <tr className="text-left text-sm text-gray-600 border-b border-gray-200 bg-gray-100">
              <th className="p-3">Invoice ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={i} className="text-sm border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="p-3 font-medium text-gray-800">{order.id}</td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3 font-semibold">{order.total}</td>
                <td className={`p-3 flex items-center gap-2 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </td>
                <td className="p-3 text-gray-600">{order.date}</td>
                <td className="p-3 text-right">
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                    <Eye className="w-4 h-4" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
