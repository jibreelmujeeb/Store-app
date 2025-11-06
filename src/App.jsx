import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";  // 👈 import navbar

import Home from "./pages/Home";
import POSPage from "./pages/POSPage";
import InventoryPage from "./pages/Inventory";
import CustomersPage from "./pages/Customer";
import OrdersPage from "./pages/Orders";
import ReportsPage from "./pages/Reports";
import ExpensesStaffPage from "./pages/ExpenseAndStaff";
import SettingsPage from "./pages/Settings";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ForgotPasswordPage from "./pages/ForgetPassword";
import NotificationsPage from "./pages/Notification";
import SuppliersPage from "./pages/SuppliersManagement";
import BackupExportPage from "./pages/Backup & Data Export Page";
import ReceiptSalesHistoryPages from "./pages/Receipts & Sales History Page";
import UserManagementPage from "./pages/User Management Page";

export default function App() {
  const [carts, setCarts] = useState([]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar visible only when not on auth pages */}
      <Navbar />

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/pos" element={<POSPage/>}/>
          <Route path="/inventory" element={<InventoryPage/>}/>
          <Route path="/customers" element={<CustomersPage/>}/>
          <Route path="/orders" element={<OrdersPage/>}/>
          <Route path="/reports" element={<ReportsPage/>}/>
          <Route path="/staff" element={<ExpensesStaffPage/>}/>
          <Route path="/settings" element={<SettingsPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
          <Route path="/notifications" element={<NotificationsPage/>}/>
          <Route path="/suppliers" element={<SuppliersPage/>}/>
          <Route path="/backup" element={<BackupExportPage/>}/>
          <Route path="/Receipt" element={<ReceiptSalesHistoryPages/>} />
          <Route path="/User-management" element={<UserManagementPage/>}/>
        </Routes>
      </div>
    </div>
  );
}
