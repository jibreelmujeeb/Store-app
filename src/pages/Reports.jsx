import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { BarChart3, TrendingUp, DollarSign, Package, Users } from "lucide-react";

export default function ReportsPage() {
  const revenueData = [
    { month: "Jan", revenue: 82000 },
    { month: "Feb", revenue: 95000 },
    { month: "Mar", revenue: 87000 },
    { month: "Apr", revenue: 102000 },
    { month: "May", revenue: 118000 },
    { month: "Jun", revenue: 97000 },
  ];

  const topProducts = [
    { name: "Latte", sales: 450 },
    { name: "Espresso", sales: 390 },
    { name: "Cappuccino", sales: 310 },
    { name: "Croissant", sales: 270 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          Reports / Analytics
        </h1>
        <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Export Report
        </button>
      </header>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        {[
          { icon: <DollarSign className="w-6 h-6 text-green-600" />, label: "Total Revenue", value: "₦520,000" },
          { icon: <TrendingUp className="w-6 h-6 text-blue-600" />, label: "Monthly Growth", value: "+8.4%" },
          { icon: <Package className="w-6 h-6 text-yellow-600" />, label: "Top Selling Product", value: "Latte" },
          { icon: <Users className="w-6 h-6 text-purple-600" />, label: "New Customers", value: "127" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-400 transition"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
              {item.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-lg font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 pb-10">
        {/* Revenue Trend */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-medium mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Monthly Revenue
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-medium mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Top Products
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
