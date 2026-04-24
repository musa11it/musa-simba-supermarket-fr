import { useEffect, useState } from 'react';
import { Clock, User, Package, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { Order, OrderStatus } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Spinner } from '../../components/ui';
import { clsx } from 'clsx';
import { useAuth } from '../../contexts/AuthContext';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = () =>
    api.get('/orders/staff').then((r) => setOrders(r.data.data || [])).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const updateStatus = async (order: Order, status: OrderStatus) => {
    setActing(order._id);
    try {
      await api.put(`/orders/${order._id}/status`, { status });
      toast.success(`Marked as ${status}`);
      load();
    } catch {
      toast.error('Failed');
    } finally {
      setActing(null);
    }
  };

  const active = orders.filter((o) => !['completed', 'cancelled', 'no_show'].includes(o.status));
  const done = orders.filter((o) => ['completed', 'no_show'].includes(o.status)).slice(0, 5);

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-900">My Orders</h2>
          <p className="text-gray-500 mt-1">Welcome, {user?.name}! You have {active.length} active order{active.length !== 1 ? 's' : ''}.</p>
        </div>
        <button onClick={() => load()} className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Active orders */}
      {active.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <CheckCircle size={48} className="text-green-400 mx-auto mb-3" />
          <p className="font-semibold text-gray-600">No active orders right now</p>
          <p className="text-gray-400 text-sm mt-1">Check back soon for new assignments</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Active ({active.length})</h3>
          {active.map((order) => {
            const customer = typeof order.customerId === 'object' ? order.customerId : null;
            const isPrep = order.status === 'accepted' || order.status === 'preparing';
            const isReady = order.status === 'ready';

            return (
              <div key={order._id} className={clsx('bg-white rounded-2xl border shadow-sm overflow-hidden', isReady ? 'border-green-300' : 'border-gray-100')}>
                {isReady && (
                  <div className="bg-green-500 text-white text-sm font-semibold px-4 py-2 flex items-center gap-2">
                    <CheckCircle size={15} /> Ready for pick-up — waiting for customer
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900 font-mono">{order.orderNumber}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><User size={13} />{customer?.name ?? 'Customer'}</span>
                        <span className="flex items-center gap-1"><Clock size={13} />{new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <span className={clsx('text-xs px-2.5 py-1 rounded-full font-semibold capitalize',
                      isReady ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    )}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Package size={14} className="text-gray-300 flex-shrink-0" />
                        <span className="text-gray-700 flex-1">{item.quantity}× {item.name}</span>
                      </div>
                    ))}
                  </div>

                  {(order.note || order.customerNote) && (
                    <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-2 mb-3 italic">📝 {order.note || order.customerNote}</p>
                  )}

                  <div className="flex gap-2">
                    {isPrep && (
                      <button
                        onClick={() => updateStatus(order, 'ready')}
                        disabled={acting === order._id}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60"
                      >
                        {acting === order._id ? 'Updating...' : '✅ Mark as Ready'}
                      </button>
                    )}
                    {isReady && (
                      <button
                        onClick={() => updateStatus(order, 'completed')}
                        disabled={acting === order._id}
                        className="flex-1 bg-simba-500 hover:bg-simba-600 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60"
                      >
                        {acting === order._id ? 'Completing...' : '🎉 Complete Order'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Completed orders */}
      {done.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-3">Recently Completed</h3>
          <div className="space-y-2">
            {done.map((order) => (
              <div key={order._id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3 opacity-70">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                <span className="font-mono text-sm font-bold text-gray-700">{order.orderNumber}</span>
                <span className="text-sm text-gray-400 flex-1">{order.items.length} items</span>
                <span className="text-sm font-semibold text-gray-600">{formatCurrency(order.total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
