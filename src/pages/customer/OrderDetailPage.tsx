import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, Package, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { Order, OrderStatus } from '../../types';
import { formatCurrency, getLocalizedField } from '../../lib/utils';
import { Spinner } from '../../components/ui';
import { clsx } from 'clsx';

const steps: { status: OrderStatus; label: string }[] = [
  { status: 'accepted', label: 'Accepted' },
  { status: 'preparing', label: 'Preparing' },
  { status: 'ready', label: 'Ready' },
  { status: 'completed', label: 'Completed' },
];

const statusOrder: OrderStatus[] = ['pending', 'accepted', 'preparing', 'ready', 'completed'];

export default function CustomerOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    api.get(`/orders/${id}`).then((r) => setOrder(r.data.data)).finally(() => setLoading(false));
  }, [id]);

  const submitReview = async () => {
    if (!order) return;
    setReviewing(true);
    try {
      await api.post('/reviews', {
        orderId: order._id,
        branchId: typeof order.branchId === 'object' ? order.branchId._id : order.branchId,
        rating,
        comment,
      });
      toast.success('Review submitted! Thank you 🌟');
      setShowReview(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewing(false);
    }
  };

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center"><Spinner /></div>;
  if (!order) return <div className="text-center py-16 text-gray-500">Order not found</div>;

  const branch = typeof order.branchId === 'object' ? order.branchId : null;
  const stepIndex = statusOrder.indexOf(order.status);
  const isCancelled = order.status === 'cancelled' || order.status === 'no_show';

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Link to="/account/orders" className="inline-flex items-center gap-2 text-simba-500 font-medium mb-6">
        <ArrowLeft size={18} /> My Orders
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
        <div className="bg-gradient-to-r from-simba-500 to-simba-700 p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Order Number</p>
              <p className="font-bold text-xl font-mono">{order.orderNumber}</p>
            </div>
            <span className={clsx(
              'px-3 py-1 rounded-full text-sm font-semibold',
              isCancelled ? 'bg-red-500' : order.status === 'completed' ? 'bg-green-500' : 'bg-white/20'
            )}>
              {order.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </span>
          </div>
        </div>

        {/* Progress tracker */}
        {!isCancelled && (
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              {steps.map((step, i) => {
                const stepPos = statusOrder.indexOf(step.status);
                const active = stepIndex >= stepPos;
                return (
                  <div key={step.status} className="flex flex-col items-center gap-1 flex-1">
                    <div className={clsx(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                      active ? 'bg-simba-500 text-white' : 'bg-gray-100 text-gray-400'
                    )}>
                      {active ? <CheckCircle size={16} /> : i + 1}
                    </div>
                    <span className={clsx('text-xs text-center', active ? 'text-simba-500 font-medium' : 'text-gray-400')}>
                      {step.label}
                    </span>
                    {i < steps.length - 1 && (
                      <div className={clsx('absolute mt-4', 'w-full')} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="px-6 py-4 flex items-center gap-2 text-red-600 border-b border-gray-100">
            <XCircle size={18} />
            <span className="font-medium">
              {order.status === 'no_show' ? 'You missed your pick-up slot' : 'This order was cancelled'}
            </span>
          </div>
        )}

        {/* Details */}
        <div className="p-6 space-y-3">
          {branch && (
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-simba-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Pick-up Branch</p>
                <p className="font-semibold text-gray-900">{branch.name}</p>
                <p className="text-sm text-gray-500">{branch.address}</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3">
            <Clock size={18} className="text-simba-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Pick-up Time</p>
              <p className="font-semibold text-gray-900">{new Date(order.pickupTime).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Package size={18} className="text-simba-500" /> Items</h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" onError={(e: any) => { e.target.src = 'https://via.placeholder.com/48'; }} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-sm text-gray-400">{item.quantity} × {formatCurrency(item.price)}</p>
              </div>
              <p className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Deposit</span><span>{formatCurrency(order.deposit ?? order.depositAmount ?? 0)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900">
            <span>Total Paid</span><span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {order.status === 'completed' && (
        <button
          onClick={() => setShowReview(true)}
          className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Star size={18} fill="currentColor" /> Leave a Review
        </button>
      )}

      {/* Review Modal */}
      {showReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold font-display mb-1">Rate Your Experience</h3>
            <p className="text-gray-500 text-sm mb-5">How was your pick-up at {branch?.name}?</p>

            <div className="flex gap-2 justify-center mb-5">
              {[1, 2, 3, 4, 5].map((r) => (
                <button key={r} onClick={() => setRating(r)}>
                  <Star size={36} className={r <= rating ? 'text-gold-500 fill-gold-500' : 'text-gray-200 fill-gray-200'} />
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience (optional)"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-simba-500 focus:border-transparent outline-none h-28"
            />

            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowReview(false)} className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={submitReview} disabled={reviewing} className="flex-1 py-3 rounded-xl bg-simba-500 hover:bg-simba-600 text-white font-semibold disabled:opacity-60 transition-colors">
                {reviewing ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
