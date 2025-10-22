import { BarChart3, Package, Users, ShoppingBag, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Dashboard
        </h1>
        <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          New Sale
        </button>
      </header>

      {/* Stats Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        {[
          { icon: <ShoppingBag className="w-6 h-6 text-blue-600" />, label: "Today's Sales", value: "₦82,450" },
          { icon: <Package className="w-6 h-6 text-green-600" />, label: "Products in Stock", value: "1,284" },
          { icon: <Users className="w-6 h-6 text-yellow-600" />, label: "Customers", value: "342" },
          { icon: <BarChart3 className="w-6 h-6 text-purple-600" />, label: "Monthly Revenue", value: "₦1.2M" },
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

      {/* Charts + Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 pb-10">
        {/* Chart Placeholder */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-medium mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Sales Overview
          </h2>
          <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400 text-sm rounded-lg">
            (Chart will go here)
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-medium mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Recent Activity
          </h2>
          <ul className="space-y-4 text-sm">
            <li className="flex justify-between">
              <span>Sale completed - <strong>#INV-234</strong></span>
              <span className="text-gray-500">2m ago</span>
            </li>
            <li className="flex justify-between">
              <span>Stock updated - <strong>Coffee Beans</strong></span>
              <span className="text-gray-500">10m ago</span>
            </li>
            <li className="flex justify-between">
              <span>New customer added</span>
              <span className="text-gray-500">1h ago</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
