import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Clock } from 'lucide-react';
import api from '../../lib/api';
import { Order, OrderStatus } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Spinner } from '../../components/ui';
import { clsx } from 'clsx';

const statusStyles: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pending Payment', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  accepted: { label: 'Accepted', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  preparing: { label: 'Preparing', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  ready: { label: 'Ready for Pick-up', className: 'bg-green-50 text-green-700 border-green-200' },
  completed: { label: 'Completed', className: 'bg-gray-50 text-gray-700 border-gray-200' },
  cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-700 border-red-200' },
  no_show: { label: 'No-Show', className: 'bg-red-50 text-red-600 border-red-200' },
};

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders').then((r) => {
      setOrders(r.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center"><Spinner /></div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold font-display text-gray-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag size={56} className="text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-600 mb-2">No orders yet</h2>
          <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
          <Link to="/products" className="bg-simba-500 hover:bg-simba-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const s = statusStyles[order.status] ?? statusStyles.pending;
            const branch = typeof order.branchId === 'object' ? order.branchId : null;
            return (
              <Link
                key={order._id}
                to={`/account/orders/${order._id}`}
                className="block bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all hover:border-simba-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 font-mono text-sm">{order.orderNumber}</span>
                      <span className={clsx('text-xs px-2 py-0.5 rounded-full border font-medium', s.className)}>
                        {s.label}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm truncate">
                      {branch?.name ?? 'Branch'} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                      <Clock size={12} />
                      {new Date(order.pickupTime).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900">{formatCurrency(order.total)}</p>
                    <ChevronRight size={18} className="text-gray-300 mt-1 ml-auto" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
