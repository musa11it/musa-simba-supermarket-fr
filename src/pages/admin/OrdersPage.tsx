import { useEffect, useState } from 'react';
import { Clock, User, ChevronDown, CheckCircle, XCircle, Package, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { Order, OrderStatus, User as IUser } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Spinner } from '../../components/ui';
import { clsx } from 'clsx';

const statusConfig: Record<OrderStatus, { label: string; color: string; nextAction?: { status: OrderStatus; label: string; color: string } }> = {
  pending: { label: 'Pending Payment', color: 'bg-gray-100 text-gray-600', nextAction: { status: 'accepted', label: '✓ Accept', color: 'bg-blue-500 hover:bg-blue-600 text-white' } },
  accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-700', nextAction: { status: 'preparing', label: '🍳 Start Preparing', color: 'bg-orange-500 hover:bg-orange-600 text-white' } },
  preparing: { label: 'Preparing', color: 'bg-orange-100 text-orange-700', nextAction: { status: 'ready', label: '✅ Mark Ready', color: 'bg-green-500 hover:bg-green-600 text-white' } },
  ready: { label: 'Ready for Pick-up', color: 'bg-green-100 text-green-700', nextAction: { status: 'completed', label: '🎉 Complete', color: 'bg-simba-500 hover:bg-simba-600 text-white' } },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-600' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-600' },
  no_show: { label: 'No-Show', color: 'bg-red-100 text-red-500' },
};

const filterTabs: { status: string; label: string }[] = [
  { status: '', label: 'All' },
  { status: 'pending', label: 'Pending' },
  { status: 'accepted', label: 'Accepted' },
  { status: 'preparing', label: 'Preparing' },
  { status: 'ready', label: 'Ready' },
  { status: 'completed', label: 'Done' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [staff, setStaff] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [tab, setTab] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = async () => {
    const [oRes, sRes] = await Promise.all([
      api.get('/orders/branch'),
      api.get('/users/branch-staff').catch(() => ({ data: { data: [] } })),
    ]);
    setOrders(oRes.data.data || []);
    setStaff(sRes.data.data || []);
  };

  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const updateStatus = async (order: Order, status: OrderStatus) => {
    setActing(order._id);
    try {
      await api.put(`/orders/${order._id}/status`, { status });
      toast.success(`Order ${status.replace('_', ' ')}`);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setActing(null);
    }
  };

  const assignStaff = async (orderId: string, staffId: string) => {
    try {
      await api.post(`/orders/${orderId}/assign`, { staffId });
      toast.success('Staff assigned');
      load();
    } catch {
      toast.error('Failed to assign');
    }
  };

  const markNoShow = async (order: Order) => {
    if (!window.confirm('Mark this customer as no-show? This increases their deposit on future orders.')) return;
    updateStatus(order, 'no_show');
  };

  const filtered = tab ? orders.filter((o) => o.status === tab) : orders;

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-900">Orders</h2>
          <p className="text-gray-500 mt-1">{orders.length} total orders</p>
        </div>
        <button onClick={() => load()} className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {filterTabs.map((t) => {
          const count = t.status ? orders.filter((o) => o.status === t.status).length : orders.length;
          return (
            <button
              key={t.status}
              onClick={() => setTab(t.status)}
              className={clsx(
                'px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5',
                tab === t.status ? 'bg-simba-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              {t.label}
              {count > 0 && (
                <span className={clsx('text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold', tab === t.status ? 'bg-white/20' : 'bg-gray-100')}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Package size={48} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No orders in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const sc = statusConfig[order.status] ?? statusConfig.pending;
            const customer = typeof order.customerId === 'object' ? order.customerId : null;
            const assignedStaff = typeof order.assignedStaffId === 'object' ? order.assignedStaffId : null;
            const expanded = expandedId === order._id;

            return (
              <div key={order._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {/* Order header */}
                <div
                  className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => setExpandedId(expanded ? null : order._id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 font-mono text-sm">{order.orderNumber}</span>
                      <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', sc.color)}>
                        {sc.label}
                      </span>
                      {!order.paymentConfirmed && !(order as any).paymentStatus?.includes('paid') && (
                        <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full font-medium">Unpaid</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><User size={13} />{customer?.name ?? 'Customer'}</span>
                      <span className="flex items-center gap-1"><Clock size={13} />{new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="font-semibold text-gray-700">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                  <ChevronDown size={18} className={clsx('text-gray-400 transition-transform flex-shrink-0', expanded && 'rotate-180')} />
                </div>

                {/* Expanded content */}
                {expanded && (
                  <div className="border-t border-gray-100 p-4 space-y-4">
                    {/* Items */}
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover bg-gray-100" onError={(e: any) => { e.target.src = 'https://via.placeholder.com/32'; }} />
                          <span className="flex-1 text-gray-700">{item.quantity}× {item.name}</span>
                          <span className="text-gray-500 font-medium">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {(order.note || order.customerNote) && (
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                        📝 <span className="italic">{order.note || order.customerNote}</span>
                      </div>
                    )}

                    {/* Assign staff */}
                    {staff.length > 0 && !['completed', 'cancelled', 'no_show'].includes(order.status) && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 flex-shrink-0">Assign to:</span>
                        <select
                          value={assignedStaff?._id ?? ''}
                          onChange={(e) => e.target.value && assignStaff(order._id, e.target.value)}
                          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-simba-500"
                        >
                          <option value="">Unassigned</option>
                          {staff.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap">
                      {sc.nextAction && (
                        <button
                          onClick={() => updateStatus(order, sc.nextAction!.status)}
                          disabled={acting === order._id}
                          className={clsx('px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60', sc.nextAction.color)}
                        >
                          {acting === order._id ? 'Updating...' : sc.nextAction.label}
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => markNoShow(order)}
                          disabled={acting === order._id}
                          className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                        >
                          <XCircle size={14} className="inline mr-1" />No-Show
                        </button>
                      )}
                      {['pending', 'accepted'].includes(order.status) && (
                        <button
                          onClick={() => updateStatus(order, 'cancelled')}
                          disabled={acting === order._id}
                          className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 border border-gray-200 transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
