import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Filter, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Category, Product } from '@/types';
import api from '@/lib/api';
import { ProductCard } from '@/components/products/ProductCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner, EmptyState } from '@/components/ui';
import { getLocalizedField, cn } from '@/lib/utils';

export const ProductsPage = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [aiSearching, setAiSearching] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: any = { limit: 48 };
    if (selectedCategory) params.category = selectedCategory;
    if (search && !aiSearching) params.search = search;

    api
      .get('/products', params)
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, search, aiSearching]);

  const handleAISearch = async () => {
    if (!search.trim()) return;
    setAiSearching(true);
    setAiMessage(null);
    try {
      const res = await api.post('/ai/search', { query: search, language: i18n.language });
      setProducts(res.data.products || []);
      setAiMessage(res.data.message);
    } catch {
      setAiMessage(null);
    } finally {
      setAiSearching(false);
    }
  };

  const selectCategory = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId) params.set('category', categoryId);
    else params.delete('category');
    setSearchParams(params);
    setShowFilters(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">{t('products.title')}</h1>
        <p className="text-gray-500">{t('home.hero.subtitle')}</p>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAISearch();
          }}
          className="flex gap-2"
        >
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder={t('products.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={18} />}
              rightIcon={
                search && (
                  <button type="button" onClick={() => setSearch('')} className="hover:text-gray-600">
                    <X size={16} />
                  </button>
                )
              }
            />
          </div>
          <Button type="submit" isLoading={aiSearching} leftIcon={<Sparkles size={16} />}>
            AI Search
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<SlidersHorizontal size={16} />}
            className="lg:hidden"
          >
            Filter
          </Button>
        </form>

        {/* AI response */}
        {aiMessage && (
          <div className="mt-3 p-4 bg-simba-50 border border-simba-200 rounded-xl">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-simba-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-simba-900">{aiMessage}</p>
              </div>
              <button onClick={() => setAiMessage(null)} className="text-simba-500 hover:text-simba-700">
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Filters sidebar */}
        <aside
          className={cn(
            'bg-white rounded-2xl p-5 border border-gray-100 h-fit',
            'lg:sticky lg:top-20',
            !showFilters && 'hidden lg:block'
          )}
        >
          <div className="flex items-center justify-between mb-4 lg:mb-3">
            <h2 className="font-semibold flex items-center gap-2">
              <Filter size={18} />
              {t('products.filter')}
            </h2>
            <button className="lg:hidden" onClick={() => setShowFilters(false)}>
              <X size={18} />
            </button>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {t('products.category')}
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => selectCategory('')}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  !selectedCategory
                    ? 'bg-simba-50 text-simba-700 font-semibold'
                    : 'hover:bg-gray-50 text-gray-700'
                )}
              >
                {t('products.allCategories')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => selectCategory(cat._id)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                    selectedCategory === cat._id
                      ? 'bg-simba-50 text-simba-700 font-semibold'
                      : 'hover:bg-gray-50 text-gray-700'
                  )}
                >
                  {getLocalizedField(cat, 'name', i18n.language)}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <div>
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size={40} />
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={<Search size={48} />}
              title={t('products.noResults')}
              description="Try different keywords or explore our categories"
            />
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">{products.length} products</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
