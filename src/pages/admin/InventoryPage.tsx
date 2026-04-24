import { useEffect, useState } from 'react';
import { Package, AlertTriangle, Search, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { Inventory, Product } from '../../types';
import { Spinner } from '../../components/ui';
import { clsx } from 'clsx';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<Record<string, string>>({});

  const load = async () => {
    const res = await api.get('/inventory/branch');
    setInventory(res.data.data || []);
  };

  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const updateStock = async (inv: Inventory, delta?: number) => {
    const newStock = delta !== undefined
      ? (inv.stock + delta)
      : parseInt(editStock[inv._id] ?? String(inv.stock));

    if (isNaN(newStock) || newStock < 0) return;
    setUpdating(inv._id);
    try {
      await api.put('/inventory/stock', { inventoryId: inv._id, stock: newStock });
      toast.success('Stock updated');
      load();
    } catch {
      toast.error('Failed');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = search
    ? inventory.filter((inv) => {
        const p = typeof inv.productId === 'object' ? inv.productId : null;
        return p?.name.toLowerCase().includes(search.toLowerCase());
      })
    : inventory;

  const lowStock = filtered.filter((inv) => inv.stock <= inv.lowStockThreshold && !inv.isOutOfStock);
  const outOfStock = filtered.filter((inv) => inv.isOutOfStock || inv.stock === 0);

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-900">Inventory</h2>
          <p className="text-gray-500 mt-1">{inventory.length} products tracked</p>
        </div>
        <button onClick={() => load()} className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Alerts */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="space-y-2">
          {outOfStock.length > 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
              <AlertTriangle size={16} className="flex-shrink-0" />
              <span><strong>{outOfStock.length}</strong> products are out of stock</span>
            </div>
          )}
          {lowStock.length > 0 && (
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-yellow-700 text-sm">
              <AlertTriangle size={16} className="flex-shrink-0" />
              <span><strong>{lowStock.length}</strong> products are running low</span>
            </div>
          )}
        </div>
      )}

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-simba-500 focus:border-transparent outline-none" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Stock</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((inv) => {
              const product = typeof inv.productId === 'object' ? inv.productId as Product : null;
              const isLow = inv.stock <= inv.lowStockThreshold && inv.stock > 0;
              const isOut = inv.isOutOfStock || inv.stock === 0;
              return (
                <tr key={inv._id} className={clsx('hover:bg-gray-50/50', isOut && 'opacity-60')}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {product?.image && (
                        <img src={product.image} alt={product.name} className="w-8 h-8 rounded-lg object-cover bg-gray-100 flex-shrink-0 hidden sm:block" onError={(e: any) => { e.target.style.display = 'none'; }} />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{product?.name ?? 'Product'}</p>
                        <p className="text-xs text-gray-400">{product?.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium',
                      isOut ? 'bg-red-100 text-red-600' : isLow ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-700'
                    )}>
                      {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={editStock[inv._id] ?? inv.stock}
                      onChange={(e) => setEditStock((p) => ({ ...p, [inv._id]: e.target.value }))}
                      onBlur={() => updateStock(inv)}
                      min="0"
                      className={clsx('w-20 text-center border rounded-lg px-2 py-1 text-sm font-bold outline-none focus:ring-2 focus:ring-simba-500',
                        isOut ? 'border-red-200 text-red-600' : isLow ? 'border-yellow-200 text-yellow-600' : 'border-gray-200 text-gray-900'
                      )}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateStock(inv, -1)} disabled={updating === inv._id || inv.stock <= 0} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-600 transition-colors disabled:opacity-30">−</button>
                      <button onClick={() => updateStock(inv, 1)} disabled={updating === inv._id} className="w-7 h-7 rounded-lg bg-simba-100 hover:bg-simba-200 font-bold text-simba-600 transition-colors disabled:opacity-30">+</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
