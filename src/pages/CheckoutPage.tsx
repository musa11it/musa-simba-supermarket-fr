import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { MapPin, Clock, CreditCard, Check, ArrowRight, Phone } from 'lucide-react';
import { Branch } from '@/types';
import api from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui';
import { formatCurrency, getLocalizedField, cn } from '@/lib/utils';

export const CheckoutPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [pickupTime, setPickupTime] = useState<string>('');
  const [note, setNote] = useState('');
  const [momoNumber, setMomoNumber] = useState('');
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const DEPOSIT = 500;

  useEffect(() => {
    if (items.length === 0 && step === 'details') {
      navigate('/cart');
      return;
    }
    api.get('/branches').then((res) => setBranches(res.data || []));
  }, []);

  const timeSlots = generateTimeSlots();

  const handleSubmitOrder = async () => {
    if (!selectedBranch) {
      toast.error('Please select a pick-up branch');
      return;
    }
    if (!pickupTime) {
      toast.error('Please select a pick-up time');
      return;
    }
    setStep('payment');
  };

  const handlePayment = async () => {
    if (!momoNumber || momoNumber.length < 10) {
      toast.error('Please enter a valid MoMo number');
      return;
    }
    setIsProcessing(true);
    try {
      const orderRes = await api.post('/orders', {
        branchId: selectedBranch,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        pickupTime,
        customerNote: note,
      });

      if (!orderRes.success) throw new Error(orderRes.message);
      const order = orderRes.data;

      // Simulate MoMo delay
      await new Promise((r) => setTimeout(r, 2000));

      await api.post(`/orders/${order._id}/confirm-payment`);
      setOrderNumber(order.orderNumber);
      clearCart();
      setStep('success');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
          <Check size={40} className="text-green-600" strokeWidth={3} />
        </div>
        <h1 className="font-display text-3xl font-bold mb-2">{t('payment.success')}</h1>
        <p className="text-gray-500 mb-2">{t('payment.successMessage')}</p>
        <p className="font-mono text-sm text-gray-700 mb-8">Order: {orderNumber}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate('/account/orders')} size="lg">
            {t('payment.viewOrder')}
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate('/products')}>
            {t('payment.continueShopping')}
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-2">{t('payment.title')}</h1>
        <p className="text-gray-500 mb-8">{t('payment.momoPrompt')}</p>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
          <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
              <span className="font-bold text-white">Mo</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Mobile Money (MoMo)</p>
              <p className="text-xs text-gray-500">Deposit: {formatCurrency(DEPOSIT)}</p>
            </div>
          </div>

          <Input
            label={t('payment.momoNumber')}
            type="tel"
            placeholder="+250 7XX XXX XXX"
            value={momoNumber}
            onChange={(e) => setMomoNumber(e.target.value)}
            leftIcon={<Phone size={18} />}
          />

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
            <span className="text-gray-600">{t('payment.depositAmount')}</span>
            <span className="font-bold text-xl text-simba-600">{formatCurrency(DEPOSIT)}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setStep('details')} className="flex-1">
            {t('common.back')}
          </Button>
          <Button onClick={handlePayment} isLoading={isProcessing} className="flex-1" size="lg">
            {t('payment.confirm')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold mb-8">{t('checkout.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-6">
          {/* Branch selection */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-simba-500" />
              {t('checkout.selectBranch')}
            </h2>
            {branches.length === 0 ? (
              <Spinner size={24} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {branches.map((b) => (
                  <button
                    key={b._id}
                    onClick={() => setSelectedBranch(b._id)}
                    className={cn(
                      'text-left p-4 rounded-xl border-2 transition-all',
                      selectedBranch === b._id
                        ? 'border-simba-500 bg-simba-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center',
                          selectedBranch === b._id ? 'border-simba-500 bg-simba-500' : 'border-gray-300'
                        )}
                      >
                        {selectedBranch === b._id && <Check size={12} className="text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {getLocalizedField(b, 'name', i18n.language)}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{b.address}</p>
                        <p className="text-xs text-gray-400 mt-1">{b.openingHours}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pickup time */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Clock size={20} className="text-simba-500" />
              {t('checkout.selectTime')}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.value}
                  onClick={() => setPickupTime(slot.value)}
                  className={cn(
                    'px-3 py-2.5 rounded-lg border text-sm font-medium transition-all',
                    pickupTime === slot.value
                      ? 'border-simba-500 bg-simba-50 text-simba-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  )}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-3">{t('checkout.note')}</h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('checkout.notePlaceholder')}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-simba-500 resize-none text-sm"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-20 h-fit space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-4">{t('checkout.summary')}</h2>
            <div className="space-y-2 pb-4 border-b border-gray-100 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm gap-2">
                  <span className="truncate flex-1">
                    {getLocalizedField(item, 'name', i18n.language)}
                    <span className="text-gray-400 ml-1">×{item.quantity}</span>
                  </span>
                  <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 py-4 border-b border-gray-100 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('cart.subtotal')}</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('cart.deposit')}</span>
                <span className="font-semibold text-simba-600">{formatCurrency(DEPOSIT)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="font-semibold">{t('cart.total')}</span>
              <span className="font-bold text-xl text-simba-600">{formatCurrency(subtotal)}</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">{t('checkout.depositInfo')}</p>
            <Button
              onClick={handleSubmitOrder}
              disabled={!selectedBranch || !pickupTime}
              className="w-full"
              size="lg"
            >
              {t('checkout.placeOrder')}
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

function generateTimeSlots() {
  const slots = [];
  const now = new Date();
  const start = new Date(now.getTime() + 45 * 60 * 1000); // +45 min
  for (let i = 0; i < 8; i++) {
    const t = new Date(start.getTime() + i * 30 * 60 * 1000);
    slots.push({
      value: t.toISOString(),
      label: t.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    });
  }
  return slots;
}
