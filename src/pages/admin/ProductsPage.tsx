import { useEffect, useState } from 'react';
import { Search, Package } from 'lucide-react';
import api from '../../lib/api';
import { Product, Inventory } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Spinner } from '../../components/ui';

export default function AdminProductsPage() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/inventory/branch').then((r) => setInventory(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? inventory.filter((inv) => {
        const p = typeof inv.productId === 'object' ? inv.productId as Product : null;
        return p?.name.toLowerCase().includes(search.toLowerCase());
      })
    : inventory;

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold font-display text-gray-900">Products</h2>
        <p className="text-gray-500 mt-1">All products available at your branch</p>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-simba-500 focus:border-transparent outline-none" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((inv) => {
          const product = typeof inv.productId === 'object' ? inv.productId as Product : null;
          if (!product) return null;
          return (
            <div key={inv._id} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3">
              <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0" onError={(e: any) => { e.target.src = 'https://via.placeholder.com/48'; }} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate text-sm">{product.name}</p>
                <p className="text-xs text-gray-400">{product.unit} · Stock: <span className={inv.stock <= inv.lowStockThreshold ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>{inv.stock}</span></p>
              </div>
              <p className="text-sm font-bold text-gray-900 flex-shrink-0">{formatCurrency(product.price)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
