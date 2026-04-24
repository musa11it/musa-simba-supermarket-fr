import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui';
import { formatCurrency, getLocalizedField } from '@/lib/utils';

export const CartPage = () => {
  const { t, i18n } = useTranslation();
  const { items, subtotal, updateQuantity, removeItem, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const DEPOSIT = 500;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          icon={<ShoppingBag size={64} />}
          title={t('cart.empty')}
          description={t('cart.emptyDescription')}
          action={
            <Link to="/products">
              <Button>{t('cart.continueShopping')}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold mb-2">{t('cart.title')}</h1>
      <p className="text-gray-500 mb-8">{itemCount} {itemCount === 1 ? t('cart.item') : t('cart.items')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl bg-gray-50"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {getLocalizedField(item, 'name', i18n.language)}
                </h3>
                <p className="text-sm text-gray-500">{formatCurrency(item.price)} / {item.unit}</p>
                <div className="flex items-center gap-1 mt-2 bg-gray-50 rounded-lg p-0.5 w-fit">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center hover:bg-white rounded transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center hover:bg-white rounded transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-simba-600">{formatCurrency(item.price * item.quantity)}</p>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="mt-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label={t('cart.remove')}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-20 h-fit bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-lg mb-4">{t('checkout.summary')}</h2>
          <div className="space-y-3 pb-4 border-b border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('cart.subtotal')}</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('cart.deposit')}</span>
              <span className="font-semibold text-simba-600">{formatCurrency(DEPOSIT)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center py-4">
            <span className="font-semibold">{t('cart.total')}</span>
            <span className="font-bold text-xl text-simba-600">{formatCurrency(subtotal)}</span>
          </div>
          <p className="text-xs text-gray-500 mb-4">{t('checkout.depositInfo')}</p>
          <Button onClick={handleCheckout} className="w-full" size="lg">
            {t('cart.checkout')}
            <ArrowRight size={18} />
          </Button>
          <Link to="/products" className="block text-center text-sm text-gray-500 hover:text-simba-600 mt-3">
            {t('cart.continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
};
