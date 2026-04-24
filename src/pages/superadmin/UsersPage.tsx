import { useEffect, useState } from 'react';
import { Search, UserX, UserCheck, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { User, UserRole } from '../../types';
import { Spinner } from '../../components/ui';
import { clsx } from 'clsx';

const roleColors: Record<UserRole, string> = {
  superadmin: 'bg-purple-100 text-purple-700',
  admin: 'bg-blue-100 text-blue-700',
  staff: 'bg-green-100 text-green-700',
  customer: 'bg-gray-100 text-gray-600',
};

export default function SuperUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [acting, setActing] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin', phone: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);
      const res = await api.get(`/users?${params}`);
      setUsers(res.data.data || []);
    } catch {}
  };

  useEffect(() => { load().finally(() => setLoading(false)); }, []);
  useEffect(() => { load(); }, [search, roleFilter]);

  const toggleStatus = async (user: User) => {
    setActing(user._id);
    try {
      await api.put(`/users/${user._id}/toggle-status`);
      toast.success(user.isActive ? 'User deactivated' : 'User activated');
      load();
    } catch {
      toast.error('Failed');
    } finally {
      setActing(null);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/users', form);
      toast.success('User created!');
      setShowAdd(false);
      setForm({ name: '', email: '', password: '', role: 'admin', phone: '' });
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-900">Users</h2>
          <p className="text-gray-500 mt-1">{users.length} users shown</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 bg-simba-500 hover:bg-simba-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={18} /> Add User
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-simba-500 focus:border-transparent outline-none"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-simba-500 focus:border-transparent outline-none text-sm"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-simba-100 flex items-center justify-center text-simba-600 font-bold text-sm flex-shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium capitalize', roleColors[u.role])}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleStatus(u)}
                    disabled={acting === u._id || u.role === 'superadmin'}
                    className={clsx(
                      'p-1.5 rounded-lg transition-colors disabled:opacity-30',
                      u.isActive ? 'hover:bg-red-50 text-red-400' : 'hover:bg-green-50 text-green-500'
                    )}
                    title={u.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {u.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="py-12 text-center text-gray-400">No users found</div>
        )}
      </div>

      {/* Add User Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold font-display mb-4">Create User</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              {[
                { label: 'Name', key: 'name', type: 'text' },
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-simba-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-simba-500 focus:border-transparent outline-none text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-simba-500 hover:bg-simba-600 text-white font-semibold disabled:opacity-60">
                  {saving ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
