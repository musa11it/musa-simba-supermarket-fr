import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShoppingCart, Plus, Minus, Check, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product } from '@/types';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Badge, Spinner } from '@/components/ui';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency, getLocalizedField } from '@/lib/utils';
import { ProductCard } from '@/components/products/ProductCard';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        if (res.data?.categoryId) {
          const catId = typeof res.data.categoryId === 'object' ? res.data.categoryId._id : res.data.categoryId;
          api
            .get('/products', { category: catId, limit: 8 })
            .then((r) => setRelated((r.data || []).filter((p: Product) => p._id !== id)));
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size={40} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold mb-3">Product not found</h1>
        <Link to="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  const name = getLocalizedField(product, 'name', i18n.language);
  const description = getLocalizedField(product, 'description', i18n.language);

  const handleAdd = () => {
    addItem(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-simba-600 mb-6 text-sm"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 aspect-square">
          <img
            src={product.image}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=600&background=fef2f2&color=dc2626`;
            }}
          />
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {product.isFeatured && <Badge variant="warning">Featured</Badge>}
            {product.brand && <Badge>{product.brand}</Badge>}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">{name}</h1>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-3xl font-extrabold text-simba-600">
              {formatCurrency(product.price)}
            </span>
            <span className="text-gray-500 text-sm">/ {product.unit}</span>
          </div>

          {product.stock !== undefined && (
            <div className="mb-6">
              {product.stock > 0 ? (
                <Badge variant="success">In Stock ({product.stock} left)</Badge>
              ) : (
                <Badge variant="danger">Out of Stock</Badge>
              )}
            </div>
          )}

          <p className="text-gray-600 leading-relaxed mb-8">{description}</p>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Quantity & add */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <Button onClick={handleAdd} size="lg" className="flex-1" leftIcon={<ShoppingCart size={18} />}>
              {t('products.addToCart')} · {formatCurrency(product.price * quantity)}
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-3 mt-8 pt-8 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl mb-1">🚀</div>
              <p className="text-xs text-gray-500">45-min pickup</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🏪</div>
              <p className="text-xs text-gray-500">11 branches</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">💳</div>
              <p className="text-xs text-gray-500">MoMo payment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold mb-6">{t('products.relatedProducts')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
