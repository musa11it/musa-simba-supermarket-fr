import { useEffect, useState } from 'react';
import { Building2, MapPin, Phone, CheckCircle, AlertCircle, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { Branch } from '../../types';
import { Spinner } from '../../components/ui';
import { clsx } from 'clsx';

export default function SuperBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filtered, setFiltered] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', phone: '', openingHours: '7:00 AM - 10:00 PM' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await api.get('/branches?all=true');
    const all: Branch[] = res.data.data || [];
    setBranches(all);
    setFiltered(all);
  };

  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(branches.filter((b) => b.name.toLowerCase().includes(q) || b.address.toLowerCase().includes(q)));
  }, [search, branches]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/branches', form);
      toast.success('Branch created!');
      setShowAdd(false);
      setForm({ name: '', address: '', phone: '', openingHours: '7:00 AM - 10:00 PM' });
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (branch: Branch) => {
    try {
      await api.put(`/branches/${branch._id}`, { isActive: !branch.isActive });
      toast.success(branch.isActive ? 'Branch deactivated' : 'Branch activated');
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
          <h2 className="text-2xl font-bold font-display text-gray-900">All Branches</h2>
          <p className="text-gray-500 mt-1">{branches.length} branches total</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 bg-simba-500 hover:bg-simba-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={18} /> Add Branch
        </button>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search branches..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-simba-500 focus:border-transparent outline-none"
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((b) => (
          <div key={b._id} className={clsx('bg-white rounded-xl border p-4 flex items-center gap-4', b.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60')}>
            <div className="w-10 h-10 bg-simba-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 size={22} className="text-simba-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-bold text-gray-900 truncate">{b.name}</p>
                {b.pendingApproval && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">Pending</span>
                )}
                {!b.isActive && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Inactive</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={11} />{b.address}</span>
                <span className="flex items-center gap-1 text-xs text-gray-400"><Phone size={11} />{b.phone}</span>
              </div>
            </div>
            <button
              onClick={() => toggleActive(b)}
              className={clsx('text-sm font-medium px-3 py-1.5 rounded-lg transition-colors',
                b.isActive
                  ? 'text-red-500 hover:bg-red-50 border border-red-200'
                  : 'text-green-600 hover:bg-green-50 border border-green-200'
              )}
            >
              {b.isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        ))}
      </div>

      {/* Add Branch Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold font-display mb-4">Add New Branch</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              {[
                { label: 'Branch Name', key: 'name', placeholder: 'e.g. Simba Supermarket Nyarugenge' },
                { label: 'Address', key: 'address', placeholder: 'e.g. KN 5 Ave, Kigali' },
                { label: 'Phone', key: 'phone', placeholder: '+250 788 XXX XXX' },
                { label: 'Opening Hours', key: 'openingHours', placeholder: '7:00 AM - 10:00 PM' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-simba-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
              ))}
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-simba-500 hover:bg-simba-600 text-white font-semibold disabled:opacity-60">
                  {saving ? 'Creating...' : 'Create Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
