import { useEffect, useState } from 'react';
import { Users, Plus, UserX } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { User } from '../../types';
import { Spinner } from '../../components/ui';

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/users/branch-staff').then((r) => setStaff(r.data.data || []));
  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/users', { ...form, role: 'staff' });
      toast.success('Staff member added!');
      setShowAdd(false);
      setForm({ name: '', email: '', password: '', phone: '' });
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async (u: User) => {
    try {
      await api.put(`/users/${u._id}/toggle-status`);
      toast.success(u.isActive ? 'Deactivated' : 'Activated');
      load();
    } catch {
      toast.error('Failed');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-900">Staff</h2>
          <p className="text-gray-500 mt-1">{staff.length} staff members</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 bg-simba-500 hover:bg-simba-600 text-white font-semibold px-4 py-2.5 rounded-xl">
          <Plus size={18} /> Add Staff
        </button>
      </div>

      {staff.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Users size={48} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No staff members yet</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {staff.map((u) => (
            <div key={u._id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-simba-100 flex items-center justify-center text-simba-600 font-bold flex-shrink-0">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{u.name}</p>
                <p className="text-sm text-gray-400">{u.email}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {u.isActive ? 'Active' : 'Inactive'}
              </span>
              <button onClick={() => deactivate(u)} className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg transition-colors" title="Deactivate">
                <UserX size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold font-display mb-4">Add Staff Member</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              {[
                { label: 'Full Name', key: 'name', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Password', key: 'password', type: 'password' },
                { label: 'Phone', key: 'phone', type: 'text' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    required={f.key !== 'phone'}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-simba-500"
                  />
                </div>
              ))}
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-simba-500 hover:bg-simba-600 text-white font-semibold disabled:opacity-60">
                  {saving ? 'Adding...' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
