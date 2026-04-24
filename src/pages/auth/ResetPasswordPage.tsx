import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { Logo } from '../../components/layout/Logo';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password: form.password });
      setDone(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-simba-50 to-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        {done ? (
          <div className="text-center py-4">
            <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold font-display mb-2">Password Reset!</h2>
            <p className="text-gray-500">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold font-display text-gray-900 mb-1 text-center">Set New Password</h2>
            <p className="text-gray-500 text-center text-sm mb-6">Enter your new password below.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={18} /></div>
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="New password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-simba-500 focus:border-transparent outline-none"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={18} /></div>
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={form.confirm}
                  onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
                  required
                  className="w-full pl-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-simba-500 focus:border-transparent outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-simba-500 hover:bg-simba-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              <Link to="/login" className="text-simba-500 hover:text-simba-600 font-medium">Back to login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
