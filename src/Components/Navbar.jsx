import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, BarChart2, Settings, Users, Package, DollarSign, LogOut } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  // Fix typo here 👇 (you used /forget-password instead of /forgot-password)
  const hideNavbar = ["/login", "/register", "/forgot-password"].includes(location.pathname);
  if (hideNavbar) return null;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-4">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <DollarSign className="text-blue-600 w-6 h-6" />
        <span className="font-semibold text-lg">My POS</span>
      </div>

      {/* Nav Links */}
      <div className="flex flex-col gap-3 text-gray-700 text-sm flex-1">
        <Link to="/" className="flex items-center gap-2 hover:text-blue-600">
          <Home className="w-4 h-4" /> Home
        </Link>

        <Link to="/pos" className="flex items-center gap-2 hover:text-blue-600">
          <ShoppingCart className="w-4 h-4" /> POS
        </Link>

        <Link to="/inventory" className="flex items-center gap-2 hover:text-blue-600">
          <Package className="w-4 h-4" /> Inventory
        </Link>

        <Link to="/customers" className="flex items-center gap-2 hover:text-blue-600">
          <Users className="w-4 h-4" /> Customers
        </Link>

        <Link to="/orders" className="flex items-center gap-2 hover:text-blue-600">
          <BarChart2 className="w-4 h-4" /> Orders
        </Link>

        <Link to="/reports" className="flex items-center gap-2 hover:text-blue-600">
          <BarChart2 className="w-4 h-4" /> Reports
        </Link>

        <Link to="/staff" className="flex items-center gap-2 hover:text-blue-600">
          <Users className="w-4 h-4" /> Staff
        </Link>

        <Link to="/settings" className="flex items-center gap-2 hover:text-blue-600">
          <Settings className="w-4 h-4" /> Settings
        </Link>

        <Link to="/notifications" className="flex items-center gap-2 hover:text-blue-600">
          <Package className="w-4 h-4" /> Notifications
        </Link>

        <Link to="/suppliers" className="flex items-center gap-2 hover:text-blue-600">
          <Package className="w-4 h-4" /> Suppliers
        </Link>

        <Link to="/backup" className="flex items-center gap-2 hover:text-blue-600">
          <BarChart2 className="w-4 h-4" /> Backup & Export
        </Link>

        <Link to="/Receipt" className="flex items-center gap-2 hover:text-blue-600">
          <DollarSign className="w-4 h-4" /> Receipts
        </Link>

        <Link to="/User-management" className="flex items-center gap-2 hover:text-blue-600">
          <Users className="w-4 h-4" /> Users
        </Link>

        <Link to="/profile" className="flex items-center gap-2 hover:text-blue-600">
          <Settings className="w-4 h-4" /> Profile
        </Link>
      </div>

      {/* Logout at bottom */}
      <button className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm mt-auto">
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>
  );
};

export default Navbar;
