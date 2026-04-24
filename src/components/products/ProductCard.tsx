import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency, getLocalizedField, cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard = ({ product, compact = false }: ProductCardProps) => {
  const { t, i18n } = useTranslation();
  const { addItem, isInCart, items, updateQuantity } = useCart();

  const cartItem = items.find((i) => i.productId === product._id);
  const name = getLocalizedField(product, 'name', i18n.language);
  const isOut = product.stock !== undefined && product.stock <= 0;

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-simba-200 hover:shadow-lg transition-all duration-300 flex flex-col">
      <Link to={`/products/${product._id}`} className="relative block aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=fef2f2&color=dc2626`;
          }}
        />
        {product.isFeatured && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-gold-500 text-white text-[10px] font-bold rounded uppercase tracking-wide">
            Featured
          </span>
        )}
        {isOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="px-3 py-1 bg-white text-red-600 text-xs font-bold rounded">
              {t('products.outOfStock')}
            </span>
          </div>
        )}
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <Link to={`/products/${product._id}`} className="block">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-simba-500 transition-colors">
            {name}
          </h3>
        </Link>
        {!compact && product.brand && (
          <p className="text-xs text-gray-500 mt-0.5">{product.brand}</p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-simba-600 font-bold">{formatCurrency(product.price)}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">
              {t('products.unit')} {product.unit}
            </p>
          </div>

          {cartItem ? (
            <div className="flex items-center gap-1 bg-simba-50 rounded-lg p-0.5">
              <button
                onClick={() => updateQuantity(product._id, cartItem.quantity - 1)}
                className="w-7 h-7 flex items-center justify-center text-simba-600 hover:bg-white rounded transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-semibold text-simba-700 w-6 text-center">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateQuantity(product._id, cartItem.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center text-simba-600 hover:bg-white rounded transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addItem(product)}
              disabled={isOut}
              className={cn(
                'w-9 h-9 flex items-center justify-center bg-simba-500 hover:bg-simba-600 text-white rounded-lg transition-all',
                isOut && 'opacity-50 cursor-not-allowed'
              )}
              aria-label={t('products.addToCart')}
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
