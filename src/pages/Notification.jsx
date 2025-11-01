import React from "react";
import { Bell, Package, AlertTriangle, CheckCircle2, Info } from "lucide-react";

const NotificationsPage = () => {
  const notifications = [
    {
      id: 1,
      type: "low-stock",
      message: "Low stock alert: Cappuccino Beans (4 left)",
      icon: <Package className="text-red-500 w-5 h-5" />,
      time: "5 minutes ago",
    },
    {
      id: 2,
      type: "sale",
      message: "₦25,000 sale completed by Cashier #3",
      icon: <CheckCircle2 className="text-green-500 w-5 h-5" />,
      time: "15 minutes ago",
    },
    {
      id: 3,
      type: "info",
      message: "New customer joined loyalty program.",
      icon: <Info className="text-blue-500 w-5 h-5" />,
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "warning",
      message: "Network connection unstable.",
      icon: <AlertTriangle className="text-yellow-500 w-5 h-5" />,
      time: "2 hours ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Bell className="w-6 h-6 text-blue-600" /> Notifications
      </h1>

      <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100">
        {notifications.length > 0 ? (
          notifications.map((note) => (
            <div
              key={note.id}
              className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors"
            >
              <div>{note.icon}</div>
              <div className="flex-1">
                <p className="text-sm">{note.message}</p>
                <p className="text-xs text-gray-500 mt-1">{note.time}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 text-sm">
            No new notifications
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
