import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/layout/Logo';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

export const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success(t('common.success'));
      // Route based on role in localStorage
      const user = JSON.parse(localStorage.getItem('simba_user') || '{}');
      if (user.role === 'superadmin') navigate('/superadmin');
      else if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'staff') navigate('/staff');
      else navigate(redirect);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-simba-500 to-simba-700 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gold-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between w-full">
          <Link to="/" className="inline-flex items-center gap-2 text-white hover:opacity-80">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
              <span className="font-black">S</span>
            </div>
            <span className="font-display font-extrabold text-xl">SIMBA</span>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-bold mb-4">
              Welcome to Rwanda's #1 Supermarket
            </h2>
            <p className="text-red-100 text-lg max-w-md">
              Join 10,000+ customers who shop fresh groceries with Simba every day.
            </p>
          </div>
          <div className="text-sm text-red-100">© 2026 Simba Supermarket</div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col p-6 sm:p-12">
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <Logo />
          <LanguageSwitcher />
        </div>
        <div className="hidden lg:flex justify-end mb-8">
          <LanguageSwitcher />
        </div>

        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <h1 className="font-display text-3xl font-bold mb-2">{t('auth.login.title')}</h1>
            <p className="text-gray-500 mb-8">{t('auth.login.subtitle')}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={t('auth.login.email')}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={18} />}
                placeholder="you@example.com"
              />
              <Input
                label={t('auth.login.password')}
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={18} />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                placeholder="••••••••"
              />
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-simba-600 hover:underline">
                  {t('auth.login.forgot')}
                </Link>
              </div>
              <Button type="submit" isLoading={loading} className="w-full" size="lg">
                {t('auth.login.submit')}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-4 text-gray-400 text-xs">
              <div className="flex-1 h-px bg-gray-200" />
              OR
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              type="button"
              onClick={() => toast('Google sign-in available in production', { icon: '🔐' })}
              className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              {t('auth.login.google')}
            </button>

            <p className="mt-8 text-center text-sm text-gray-500">
              {t('auth.login.noAccount')}{' '}
              <Link to="/register" className="text-simba-600 font-semibold hover:underline">
                {t('auth.login.register')}
              </Link>
            </p>

            {/* Demo credentials hint */}
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
              <p className="font-semibold mb-1">Demo accounts:</p>
              <p>Customer: customer@simba.rw / Customer@2026</p>
              <p>Admin: admin.remera@simba.rw / Admin@2026</p>
              <p>Super Admin: superadmin@simba.rw / Simba@2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
