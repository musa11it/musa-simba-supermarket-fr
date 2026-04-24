import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/layout/Logo';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

export const RegisterPage = () => {
  const { t, i18n } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        language: i18n.language,
      });
      toast.success('Welcome to Simba!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-simba-500 to-simba-700 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gold-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between w-full">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
              <span className="font-black">S</span>
            </div>
            <span className="font-display font-extrabold text-xl">SIMBA</span>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-bold mb-4">Shop smarter with Simba</h2>
            <ul className="space-y-3 text-red-100">
              <li className="flex items-center gap-2">✨ AI-powered product search</li>
              <li className="flex items-center gap-2">🏪 11 branches across Rwanda</li>
              <li className="flex items-center gap-2">💳 Easy MoMo payments</li>
              <li className="flex items-center gap-2">🌍 English, Kinyarwanda & French</li>
            </ul>
          </div>
          <div className="text-sm text-red-100">© 2026 Simba Supermarket</div>
        </div>
      </div>

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
            <h1 className="font-display text-3xl font-bold mb-2">{t('auth.register.title')}</h1>
            <p className="text-gray-500 mb-8">{t('auth.register.subtitle')}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={t('auth.register.name')}
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                leftIcon={<User size={18} />}
              />
              <Input
                label={t('auth.register.email')}
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                leftIcon={<Mail size={18} />}
              />
              <Input
                label={t('auth.register.phone')}
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                leftIcon={<Phone size={18} />}
                placeholder="+250 7XX XXX XXX"
              />
              <Input
                label={t('auth.register.password')}
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={form.password}
                onChange={handleChange}
                leftIcon={<Lock size={18} />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
              <Input
                label={t('auth.register.confirmPassword')}
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={form.confirmPassword}
                onChange={handleChange}
                leftIcon={<Lock size={18} />}
              />
              <Button type="submit" isLoading={loading} className="w-full" size="lg">
                {t('auth.register.submit')}
              </Button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">{t('auth.register.terms')}</p>
            <p className="mt-6 text-center text-sm text-gray-500">
              {t('auth.register.hasAccount')}{' '}
              <Link to="/login" className="text-simba-600 font-semibold hover:underline">
                {t('auth.register.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
