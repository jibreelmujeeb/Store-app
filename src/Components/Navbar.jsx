import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, BarChart2, Settings, Users, Package, DollarSign, LogOut } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  // Hide navbar on auth pages
  const hideNavbar = ["/login", "/register", "/forget-password"].includes(location.pathname);
  if (hideNavbar) return null;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      {/* Logo / Title */}
      <div className="flex items-center gap-2">
        <DollarSign className="text-blue-600 w-6 h-6" />
        <span className="font-semibold text-lg text-gray-800">POS System</span>
      </div>

      {/* Nav Links */}
      <div className="flex items-center gap-6 text-gray-700 text-sm">
        <Link to="/" className="flex items-center gap-1 hover:text-blue-600">
          <Home className="w-4 h-4" /> Home
        </Link>
        <Link to="/pos" className="flex items-center gap-1 hover:text-blue-600">
          <ShoppingCart className="w-4 h-4" /> POS
        </Link>
        <Link to="/inventory" className="flex items-center gap-1 hover:text-blue-600">
          <Package className="w-4 h-4" /> Inventory
        </Link>
        <Link to="/customers" className="flex items-center gap-1 hover:text-blue-600">
          <Users className="w-4 h-4" /> Customers
        </Link>
        <Link to="/orders" className="flex items-center gap-1 hover:text-blue-600">
          <BarChart2 className="w-4 h-4" /> Orders
        </Link>
        <Link to="/reports" className="flex items-center gap-1 hover:text-blue-600">
          <BarChart2 className="w-4 h-4" /> Reports
        </Link>
        <Link to="/staff" className="flex items-center gap-1 hover:text-blue-600">
          <Users className="w-4 h-4" /> Staff
        </Link>
        <Link to="/settings" className="flex items-center gap-1 hover:text-blue-600">
          <Settings className="w-4 h-4" /> Settings
        </Link>
        <Link to="/notifications" className="flex items-center gap-1 hover:text-blue-600">
          <Package className="w-4 h-4" /> Notifications
        </Link>
        <Link to="/suppliers" className="flex items-center gap-1 hover:text-blue-600">
          <Package className="w-4 h-4" /> Suppliers</Link>
      </div>

      {/* Logout / Profile */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
