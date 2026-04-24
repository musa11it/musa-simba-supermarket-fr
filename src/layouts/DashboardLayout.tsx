import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, ShoppingBag, Package, Users, Store, LogOut,
  Menu, X, ChevronRight, Bell, Building2, Tags, ClipboardList,
  AlertCircle, Home,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/layout/Logo';
import { clsx } from 'clsx';

interface DashboardLayoutProps {
  role: 'admin' | 'superadmin' | 'staff';
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const adminNav: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
  { label: 'Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
  { label: 'Inventory', icon: <Package size={20} />, path: '/admin/inventory' },
  { label: 'Staff', icon: <Users size={20} />, path: '/admin/staff' },
  { label: 'Products', icon: <ClipboardList size={20} />, path: '/admin/products' },
];

const superAdminNav: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/superadmin' },
  { label: 'Pending Branches', icon: <AlertCircle size={20} />, path: '/superadmin/pending-branches' },
  { label: 'Branches', icon: <Building2 size={20} />, path: '/superadmin/branches' },
  { label: 'Users', icon: <Users size={20} />, path: '/superadmin/users' },
  { label: 'Products', icon: <Package size={20} />, path: '/superadmin/products' },
  { label: 'Categories', icon: <Tags size={20} />, path: '/superadmin/categories' },
];

const staffNav: NavItem[] = [
  { label: 'My Orders', icon: <ShoppingBag size={20} />, path: '/staff' },
];

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = role === 'superadmin' ? superAdminNav : role === 'admin' ? adminNav : staffNav;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleLabel = role === 'superadmin' ? 'Super Admin' : role === 'admin' ? 'Branch Admin' : 'Staff';
  const roleColor = role === 'superadmin' ? 'bg-purple-600' : role === 'admin' ? 'bg-simba-500' : 'bg-emerald-600';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-gray-800">
        <Logo size="sm" className="text-white" />
        <div className={clsx('mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold text-white', roleColor)}>
          <Store size={12} />
          {roleLabel}
        </div>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-simba-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-gray-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-simba-500 text-white shadow-sm'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-gray-800 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
        >
          <Home size={20} />
          Go to Store
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-900/30 hover:text-red-400 transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-gray-900 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-gray-900 z-10">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold text-gray-900 font-display">
              {navItems.find((n) => n.path === location.pathname)?.label ?? 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-simba-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-simba-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
