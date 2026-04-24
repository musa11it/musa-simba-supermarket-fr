import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/layout/Logo';

export const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success(t('auth.forgot.sent'));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo className="mx-auto mb-6" size="lg" />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h1 className="font-display text-2xl font-bold mb-2">{t('auth.forgot.sent')}</h1>
              <p className="text-gray-500 mb-6">We've sent a password reset link to {email}</p>
              <Link to="/login">
                <Button variant="secondary" leftIcon={<ArrowLeft size={16} />}>
                  {t('auth.forgot.backToLogin')}
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold mb-2">{t('auth.forgot.title')}</h1>
              <p className="text-gray-500 mb-6">{t('auth.forgot.subtitle')}</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label={t('auth.forgot.email')}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail size={18} />}
                />
                <Button type="submit" isLoading={loading} className="w-full">
                  {t('auth.forgot.submit')}
                </Button>
              </form>
              <Link
                to="/login"
                className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-simba-600"
              >
                <ArrowLeft size={16} />
                {t('auth.forgot.backToLogin')}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
