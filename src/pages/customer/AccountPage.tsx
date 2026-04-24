import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { User, Phone, Mail, Lock, ShoppingBag, Eye, EyeOff, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export default function AccountPage() {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const [tab, setTab] = useState<'profile' | 'password'>('profile');
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', form);
      updateUser(res.data.data);
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) return toast.error('Passwords do not match');
    setSaving(true);
    try {
      await api.put('/auth/change-password', { currentPassword: pwForm.current, newPassword: pwForm.newPw });
      toast.success('Password changed!');
      setPwForm({ current: '', newPw: '', confirm: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold font-display text-gray-900 mb-6">My Account</h1>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link to="/account/orders" className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-md transition-all hover:border-simba-200">
          <div className="w-10 h-10 bg-simba-50 rounded-lg flex items-center justify-center">
            <ShoppingBag size={20} className="text-simba-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">My Orders</p>
            <p className="text-xs text-gray-500">View order history</p>
          </div>
        </Link>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
            <User size={20} className="text-gray-400" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {(['profile', 'password'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
                tab === t ? 'text-simba-500 border-b-2 border-simba-500' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'profile' ? 'Edit Profile' : 'Change Password'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'profile' ? (
            <form onSubmit={handleProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-simba-500 focus:border-transparent outline-none"
                    placeholder="Your full name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={user?.email} disabled className="w-full pl-10 pr-4 py-3 border border-gray-100 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-simba-500 focus:border-transparent outline-none"
                    placeholder="+250 7XX XXX XXX"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-simba-500 hover:bg-simba-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePassword} className="space-y-4">
              {[
                { label: 'Current Password', key: 'current' as const },
                { label: 'New Password', key: 'newPw' as const },
                { label: 'Confirm New Password', key: 'confirm' as const },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={show ? 'text' : 'password'}
                      value={pwForm[field.key]}
                      onChange={(e) => setPwForm((p) => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-simba-500 focus:border-transparent outline-none"
                      required
                    />
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-simba-500 hover:bg-simba-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
              >
                {saving ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
