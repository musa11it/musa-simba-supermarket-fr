import { useEffect, useState } from 'react';
import { Tags, Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { Category } from '../../types';
import { Spinner } from '../../components/ui';

export default function SuperCategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', nameRw: '', nameFr: '', slug: '', icon: '' });
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/categories').then((r) => setCats(r.data.data || []));
  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/categories/${editing._id}`, form);
        toast.success('Category updated!');
      } else {
        await api.post('/categories', form);
        toast.success('Category created!');
      }
      setShowAdd(false);
      setEditing(null);
      setForm({ name: '', nameRw: '', nameFr: '', slug: '', icon: '' });
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, nameRw: c.nameRw, nameFr: c.nameFr, slug: c.slug, icon: c.icon || '' });
    setShowAdd(true);
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Deleted');
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
          <h2 className="text-2xl font-bold font-display">Categories</h2>
          <p className="text-gray-500 mt-1">{cats.length} categories</p>
        </div>
        <button onClick={() => { setEditing(null); setShowAdd(true); }} className="inline-flex items-center gap-2 bg-simba-500 hover:bg-simba-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {cats.map((c) => (
          <div key={c._id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-simba-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Tags size={20} className="text-simba-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{c.name}</p>
              <p className="text-xs text-gray-400">{c.nameRw} · {c.nameFr}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg"><Edit2 size={14} /></button>
              <button onClick={() => remove(c._id)} className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold font-display mb-4">{editing ? 'Edit' : 'Add'} Category</h3>
            <form onSubmit={handleSave} className="space-y-3">
              {[
                { label: 'Name (EN)', key: 'name' },
                { label: 'Name (Kinyarwanda)', key: 'nameRw' },
                { label: 'Name (French)', key: 'nameFr' },
                { label: 'Slug (e.g. fresh-produce)', key: 'slug' },
                { label: 'Icon name (e.g. Apple)', key: 'icon' },
              ].map((f) => (
                <input
                  key={f.key}
                  value={form[f.key as keyof typeof form] as string}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.label}
                  required={f.key !== 'icon'}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-simba-500"
                />
              ))}
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowAdd(false); setEditing(null); }} className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-simba-500 text-white font-semibold disabled:opacity-60">
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
