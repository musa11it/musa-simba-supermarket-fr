import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, User as UserIcon, Menu, X, LogOut, LayoutDashboard, Package, Search } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { cn, getInitials } from '@/lib/utils';

export const Header = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const dashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'superadmin') return '/superadmin';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'staff') return '/staff';
    return '/account';
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
      isActive ? 'text-simba-500 bg-simba-50' : 'text-gray-700 hover:text-simba-500 hover:bg-gray-50'
    );

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>{t('nav.home')}</NavLink>
            <NavLink to="/products" className={navLinkClass}>{t('nav.products')}</NavLink>
            <NavLink to="/branches" className={navLinkClass}>{t('nav.branches')}</NavLink>
            <NavLink to="/about" className={navLinkClass}>{t('nav.about')}</NavLink>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search (desktop) */}
            <button
              onClick={() => navigate('/products')}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors min-w-[200px]"
            >
              <Search size={16} />
              <span>{t('nav.search')}</span>
            </button>

            <LanguageSwitcher />

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={t('nav.cart')}
            >
              <ShoppingCart size={22} className="text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-simba-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce-in">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-simba-400 to-simba-600 text-white flex items-center justify-center text-sm font-semibold">
                      {getInitials(user.name)}
                    </div>
                  )}
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to={dashboardLink()}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        <LayoutDashboard size={16} />
                        {t('nav.dashboard')}
                      </Link>
                      <Link
                        to="/account/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        <Package size={16} />
                        {t('nav.orders')}
                      </Link>
                      <Link
                        to="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        <UserIcon size={16} />
                        {t('nav.profile')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        {t('nav.logout')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-simba-500 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-simba-500 hover:bg-simba-600 text-white rounded-lg transition-colors"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-fade-in">
            <nav className="flex flex-col gap-1">
              <NavLink to="/" end className={navLinkClass} onClick={() => setMobileOpen(false)}>
                {t('nav.home')}
              </NavLink>
              <NavLink to="/products" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                {t('nav.products')}
              </NavLink>
              <NavLink to="/branches" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                {t('nav.branches')}
              </NavLink>
              <NavLink to="/about" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                {t('nav.about')}
              </NavLink>
              {!isAuthenticated && (
                <>
                  <NavLink to="/login" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                    {t('nav.login')}
                  </NavLink>
                  <NavLink to="/register" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                    {t('nav.register')}
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
