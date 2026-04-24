import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  ArrowRight, Clock, Leaf, Wallet, MapPin, Star, ShoppingBag, Zap,
  TrendingUp, Shield, CheckCircle, Phone,
} from 'lucide-react';
import { Category, Product, Branch } from '@/types';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/products/ProductCard';
import { getLocalizedField, formatCurrency } from '@/lib/utils';

export const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data || [])).catch(() => {});
    api.get('/products/featured').then((res) => setFeatured(res.data || [])).catch(() => {});
    api.get('/branches').then((res) => setBranches(res.data || [])).catch(() => {});
  }, []);

  return (
    <div className="bg-gray-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-simba-600 via-simba-500 to-simba-700 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gold-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-xs font-semibold mb-6">
                <Zap size={14} className="text-gold-400" />
                {t('brand.tagline')}
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                {t('home.hero.title')}
              </h1>
              <p className="text-lg text-red-100 mb-8 max-w-xl">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products">
                  <Button size="lg" className="bg-white text-simba-600 hover:bg-gray-100 shadow-lg">
                    <ShoppingBag size={18} />
                    {t('home.hero.cta')}
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/branches">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="text-white hover:bg-white/20 border-2 border-white/30"
                  >
                    <MapPin size={18} />
                    {t('home.hero.secondary')}
                  </Button>
                </Link>
              </div>

              {/* Quick trust signals */}
              <div className="flex flex-wrap gap-6 mt-10 pt-6 border-t border-white/20">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={18} className="text-gold-400" />
                  <span>11 {t('nav.branches')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={18} className="text-gold-400" />
                  <span>MoMo Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={18} className="text-gold-400" />
                  <span>45-min Pick-up</span>
                </div>
              </div>
            </div>

            {/* Hero image/illustration */}
            <div className="hidden lg:block relative">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-full h-full bg-gold-500/30 rounded-3xl" />
                <div className="absolute -bottom-6 -right-6 w-full h-full bg-white/20 rounded-3xl" />
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"
                    alt="Fresh groceries"
                    className="w-full h-[480px] object-cover"
                  />
                </div>
                {/* Floating cards */}
                <div className="absolute top-6 -left-6 bg-white text-gray-900 rounded-2xl shadow-xl p-4 animate-bounce-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Clock size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Your order</p>
                      <p className="font-bold text-sm">Ready in 45 min</p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-6 -right-6 bg-white text-gray-900 rounded-2xl shadow-xl p-4 animate-bounce-in" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-simba-100 rounded-xl flex items-center justify-center">
                      <Star size={20} className="text-simba-500 fill-simba-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">4.8 / 5.0</p>
                      <p className="text-xs text-gray-500">10,000+ reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, key: 'fast', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: Leaf, key: 'fresh', color: 'text-green-600', bg: 'bg-green-50' },
              { icon: Wallet, key: 'payment', color: 'text-purple-600', bg: 'bg-purple-50' },
              { icon: MapPin, key: 'branches', color: 'text-simba-600', bg: 'bg-simba-50' },
            ].map(({ icon: Icon, key, color, bg }) => (
              <div key={key} className="flex flex-col items-center text-center p-4 hover:-translate-y-1 transition-transform">
                <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mb-3`}>
                  <Icon size={26} className={color} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t(`home.valueProps.${key}.title`)}
                </h3>
                <p className="text-sm text-gray-500">
                  {t(`home.valueProps.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold mb-2">{t('home.categories.title')}</h2>
              <p className="text-gray-500">{t('home.categories.subtitle')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(0, 10).map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="group bg-white rounded-2xl p-5 text-center border border-gray-100 hover:border-simba-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-simba-50 to-simba-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform text-2xl">
                  {cat.icon === 'Apple' && '🍎'}
                  {cat.icon === 'Milk' && '🥛'}
                  {cat.icon === 'Croissant' && '🥐'}
                  {cat.icon === 'Beef' && '🥩'}
                  {cat.icon === 'Wheat' && '🌾'}
                  {cat.icon === 'Coffee' && '☕'}
                  {cat.icon === 'Cookie' && '🍪'}
                  {cat.icon === 'Home' && '🏠'}
                  {cat.icon === 'Sparkles' && '✨'}
                  {cat.icon === 'Baby' && '👶'}
                </div>
                <h3 className="font-semibold text-sm text-gray-900 group-hover:text-simba-600">
                  {getLocalizedField(cat, 'name', i18n.language)}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl font-bold mb-2">{t('home.featured.title')}</h2>
                <p className="text-gray-500">{t('home.featured.subtitle')}</p>
              </div>
              <Link to="/products" className="hidden sm:flex items-center gap-2 text-simba-600 font-semibold hover:gap-3 transition-all text-sm">
                {t('home.featured.viewAll')}
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TRUST SECTION */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
              {t('home.trust.title')}
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {['1', '2', '3', '4'].map((n) => (
              <div key={n} className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm">
                <div className="text-4xl sm:text-5xl font-extrabold text-gold-400 mb-2 font-display">
                  {t(`home.trust.stat${n}`)}
                </div>
                <p className="text-gray-300 text-sm">{t(`home.trust.stat${n}Label`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRANCHES */}
      {branches.length > 0 && (
        <section className="py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl font-bold mb-2">{t('home.branches.title')}</h2>
                <p className="text-gray-500">{t('home.branches.subtitle')}</p>
              </div>
              <Link to="/branches" className="hidden sm:flex items-center gap-2 text-simba-600 font-semibold hover:gap-3 transition-all text-sm">
                {t('home.branches.viewAll')}
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {branches.slice(0, 6).map((branch) => (
                <Link
                  key={branch._id}
                  to={`/branches/${branch._id}`}
                  className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-simba-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 bg-simba-100 text-simba-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-simba-600 truncate">
                        {getLocalizedField(branch, 'name', i18n.language)}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{branch.address}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {branch.openingHours}
                        </span>
                        {branch.averageRating > 0 && (
                          <span className="flex items-center gap-1">
                            <Star size={12} className="fill-gold-500 text-gold-500" />
                            {branch.averageRating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="py-16 bg-gradient-to-br from-simba-500 to-simba-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-red-100 mb-8 text-lg">{t('home.cta.subtitle')}</p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-simba-600 hover:bg-gray-100 shadow-lg">
              {t('home.cta.button')}
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
