import { Link, useLocation } from "react-router-dom";
import {
  Archive,
  BarChart3,
  Bell,
  DatabaseBackup,
  Home,
  LogOut,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  Store,
  Truck,
  UserCircle,
  Users,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { useAuth } from "../auth/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const hideNavbar = ["/login", "/register", "/forgot-password"].includes(location.pathname);
  if (hideNavbar) return null;

  const navItems = [
    { to: "/", label: "Dashboard", Icon: Home },
    { to: "/pos", label: "POS", Icon: ShoppingCart },
    { to: "/inventory", label: "Inventory", Icon: Package },
    { to: "/customers", label: "Customers", Icon: Users },
    { to: "/orders", label: "Orders", Icon: Receipt },
    { to: "/reports", label: "Reports", Icon: BarChart3 },
    { to: "/staff", label: "Staff & Expenses", Icon: Archive },
    { to: "/settings", label: "Settings", Icon: Settings },
    { to: "/notifications", label: "Notifications", Icon: Bell },
    { to: "/suppliers", label: "Suppliers", Icon: Truck },
    { to: "/backup", label: "Backup", Icon: DatabaseBackup },
    { to: "/Receipt", label: "Receipts", Icon: Receipt },
    { to: "/User-management", label: "Users", Icon: Users },
    { to: "/profile", label: "Profile", Icon: UserCircle },
  ];

  return (
    <aside className="border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-72 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 px-4 py-4 lg:px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
          <Store className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950">My POS</p>
          <p className="text-xs text-slate-500">Retail operations</p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 text-sm lg:flex-1 lg:flex-col lg:overflow-y-auto lg:pb-4">
        {navItems.map((item) => {
          const { to, label } = item;
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950",
                active && "bg-slate-950 text-white hover:bg-slate-900 hover:text-white"
              )}
            >
              <item.Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden border-t border-slate-200 p-4 lg:block">
        <Button className="w-full justify-start text-red-600 hover:text-red-700" onClick={logout} variant="ghost">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Navbar;
