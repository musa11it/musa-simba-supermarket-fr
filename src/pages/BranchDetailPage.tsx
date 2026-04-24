import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Clock, Star, ArrowLeft, Package } from 'lucide-react';
import api from '../lib/api';
import { Branch, Review } from '../types';
import { getLocalizedField, formatCurrency } from '../lib/utils';
import { Spinner } from '../components/ui';

export default function BranchDetailPage() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [bRes, rRes] = await Promise.all([
          api.get(`/branches/${id}`),
          api.get(`/reviews/branch/${id}`),
        ]);
        setBranch(bRes.data.data);
        setReviews(rRes.data.data || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  if (!branch) return <div className="min-h-screen flex items-center justify-center text-gray-500">Branch not found</div>;

  const name = getLocalizedField(branch, 'name', i18n.language);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/branches" className="inline-flex items-center gap-2 text-simba-500 hover:text-simba-600 mb-6 font-medium">
        <ArrowLeft size={18} /> All Branches
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-simba-500 to-simba-700 p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Package size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">{name}</h1>
              {(branch.averageRating || branch.rating) ? (
                <div className="flex items-center gap-1 mt-1">
                  <Star size={16} fill="currentColor" className="text-gold-400" />
                  <span className="font-semibold">{(branch.averageRating || branch.rating || 0).toFixed(1)}</span>
                  <span className="text-white/70 text-sm">({branch.totalReviews || branch.reviewCount || 0} reviews)</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="p-6 grid gap-4">
          <div className="flex items-start gap-3">
            <MapPin size={20} className="text-simba-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 font-medium">Address</p>
              <p className="text-gray-900">{branch.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={20} className="text-simba-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 font-medium">Phone</p>
              <p className="text-gray-900">{branch.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={20} className="text-simba-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 font-medium">Opening Hours</p>
              <p className="text-gray-900">{branch.openingHours}</p>
            </div>
          </div>
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold font-display mb-4">Customer Reviews</h2>
          <div className="space-y-4">
            {reviews.slice(0, 5).map((r) => (
              <div key={r._id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < r.rating ? 'text-gold-500 fill-gold-500' : 'text-gray-200 fill-gray-200'} />
                  ))}
                  <span className="text-sm text-gray-400 ml-auto">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                {r.comment && <p className="text-gray-700 text-sm">{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
