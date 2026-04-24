import { useEffect, useState } from 'react';
import { Search, Package, Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { Product, Category } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Spinner } from '../../components/ui';

export default function SuperProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', unit: 'kg', categoryId: '', image: '', isFeatured: false });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const params = new URLSearchParams({ limit: '50' });
    if (search) params.set('search', search);
    if (catFilter) params.set('category', catFilter);
    const [pRes, cRes] = await Promise.all([
      api.get(`/products?${params}`),
      api.get('/categories'),
    ]);
    setProducts(pRes.data.data || []);
    setCategories(cRes.data.data || []);
  };

  useEffect(() => { load().finally(() => setLoading(false)); }, []);
  useEffect(() => { load(); }, [search, catFilter]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price) };
      if (editing) {
        await api.put(`/products/${editing._id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created!');
      }
      setEditing(null);
      setShowAdd(false);
      setForm({ name: '', price: '', unit: 'kg', categoryId: '', image: '', isFeatured: false });
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    const catId = typeof p.categoryId === 'object' ? p.categoryId._id : p.categoryId;
    setForm({ name: p.name, price: String(p.price), unit: p.unit, categoryId: catId, image: p.image, isFeatured: p.isFeatured });
    setShowAdd(true);
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
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
          <h2 className="text-2xl font-bold font-display text-gray-900">Product Catalog</h2>
          <p className="text-gray-500 mt-1">{products.length} products</p>
        </div>
        <button onClick={() => { setEditing(null); setShowAdd(true); }} className="inline-flex items-center gap-2 bg-simba-500 hover:bg-simba-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-simba-500 focus:border-transparent outline-none" />
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-simba-500 text-sm outline-none">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      <div className="grid gap-3">
        {products.map((p) => {
          const cat = typeof p.categoryId === 'object' ? p.categoryId : null;
          return (
            <div key={p._id} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3">
              <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0" onError={(e: any) => { e.target.src = 'https://via.placeholder.com/48'; }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 truncate">{p.name}</p>
                  {p.isFeatured && <span className="text-xs bg-gold-100 text-gold-600 px-1.5 py-0.5 rounded font-medium">Featured</span>}
                </div>
                <p className="text-sm text-gray-400">{cat?.name ?? ''} · {p.unit}</p>
              </div>
              <p className="font-bold text-gray-900 flex-shrink-0">{formatCurrency(p.price)}</p>
              <div className="flex gap-1">
                <button onClick={() => openEdit(p)} className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"><Edit2 size={15} /></button>
                <button onClick={() => remove(p._id)} className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold font-display mb-4">{editing ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Product name" required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-simba-500" />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="Price (RWF)" type="number" required className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-simba-500" />
                <input value={form.unit} onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))} placeholder="Unit (kg, piece...)" required className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-simba-500" />
              </div>
              <select value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-simba-500">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} placeholder="Image URL" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-simba-500" />
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} className="accent-simba-500" />
                Featured on home page
              </label>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setShowAdd(false); setEditing(null); }} className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-simba-500 hover:bg-simba-600 text-white font-semibold disabled:opacity-60">
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
