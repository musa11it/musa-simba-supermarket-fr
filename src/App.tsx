import { Routes, Route, Navigate } from 'react-router-dom';
import { CustomerLayout } from './layouts/CustomerLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public pages (named exports from earlier sessions)
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { BranchesPage } from './pages/BranchesPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';

// New pages (default exports written this session)
import BranchDetailPage from './pages/BranchDetailPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

// Auth (named exports)
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Customer (default exports)
import AccountPage from './pages/customer/AccountPage';
import CustomerOrdersPage from './pages/customer/OrdersPage';
import CustomerOrderDetailPage from './pages/customer/OrderDetailPage';

// Admin dashboard (default exports)
import AdminDashboard from './pages/admin/DashboardHome';
import AdminOrders from './pages/admin/OrdersPage';
import AdminInventory from './pages/admin/InventoryPage';
import AdminStaff from './pages/admin/StaffPage';
import AdminProducts from './pages/admin/ProductsPage';

// Super Admin dashboard (default exports)
import SuperDashboard from './pages/superadmin/DashboardHome';
import PendingBranches from './pages/superadmin/PendingBranchesPage';
import SuperBranches from './pages/superadmin/BranchesPage';
import SuperUsers from './pages/superadmin/UsersPage';
import SuperProducts from './pages/superadmin/ProductsPage';
import SuperCategories from './pages/superadmin/CategoriesPage';

// Staff dashboard (default export)
import StaffDashboard from './pages/staff/StaffDashboard';

export default function App() {
  return (
    <Routes>
      {/* ── Customer-facing ─────────────────────────────── */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/branches" element={<BranchesPage />} />
        <Route path="/branches/:id" element={<BranchDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Protected customer routes */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute roles={['customer', 'admin', 'superadmin', 'staff']}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute roles={['customer']}>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/orders"
          element={
            <ProtectedRoute roles={['customer']}>
              <CustomerOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/orders/:id"
          element={
            <ProtectedRoute roles={['customer']}>
              <CustomerOrderDetailPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ── Auth (no layout) ────────────────────────────── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* ── Admin dashboard ─────────────────────────────── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin', 'superadmin']}>
            <DashboardLayout role="admin" />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="staff" element={<AdminStaff />} />
        <Route path="products" element={<AdminProducts />} />
      </Route>

      {/* ── Super Admin dashboard ───────────────────────── */}
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute roles={['superadmin']}>
            <DashboardLayout role="superadmin" />
          </ProtectedRoute>
        }
      >
        <Route index element={<SuperDashboard />} />
        <Route path="pending-branches" element={<PendingBranches />} />
        <Route path="branches" element={<SuperBranches />} />
        <Route path="users" element={<SuperUsers />} />
        <Route path="products" element={<SuperProducts />} />
        <Route path="categories" element={<SuperCategories />} />
      </Route>

      {/* ── Staff dashboard ─────────────────────────────── */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute roles={['staff', 'admin']}>
            <DashboardLayout role="staff" />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffDashboard />} />
      </Route>

      {/* ── Fallback ────────────────────────────────────── */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
