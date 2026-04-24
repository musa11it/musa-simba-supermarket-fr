import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Star, Phone } from 'lucide-react';
import { Branch } from '@/types';
import api from '@/lib/api';
import { Spinner } from '@/components/ui';
import { getLocalizedField } from '@/lib/utils';

export const BranchesPage = () => {
  const { t, i18n } = useTranslation();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/branches')
      .then((res) => setBranches(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold mb-3">{t('home.branches.title')}</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">{t('home.branches.subtitle')}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((branch) => (
            <div
              key={branch._id}
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-simba-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-simba-100 to-simba-200 text-simba-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 group-hover:text-simba-600 mb-2">
                    {getLocalizedField(branch, 'name', i18n.language)}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{branch.address}</p>
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>{branch.openingHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} />
                      <span>{branch.phone}</span>
                    </div>
                    {branch.averageRating > 0 && (
                      <div className="flex items-center gap-2">
                        <Star size={14} className="fill-gold-500 text-gold-500" />
                        <span>
                          {branch.averageRating.toFixed(1)} ({branch.totalReviews} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
