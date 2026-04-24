import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, ShoppingBag, Package, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react';
import api from '../../lib/api';
import { Spinner } from '../../components/ui';
import { formatCurrency } from '../../lib/utils';

interface Stats {
  branches: number;
  pendingBranches: number;
  users: number;
  products: number;
}

export default function SuperDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orderStats, setOrderStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/branches').catch(() => ({ data: { data: [] } })),
      api.get('/branches/pending').catch(() => ({ data: { data: [] } })),
      api.get('/users?limit=1').catch(() => ({ data: { pagination: { total: 0 } } })),
      api.get('/products?limit=1').catch(() => ({ data: { pagination: { total: 0 } } })),
      api.get('/orders/stats').catch(() => ({ data: { data: null } })),
    ]).then(([branches, pending, users, products, orders]) => {
      setStats({
        branches: (branches.data.data || []).length,
        pendingBranches: (pending.data.data || []).length,
        users: users.data.pagination?.total ?? 0,
        products: products.data.pagination?.total ?? 0,
      });
      setOrderStats(orders.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  const cards = [
    { label: 'Total Branches', value: stats?.branches ?? 0, icon: <Building2 size={22} />, color: 'bg-blue-500', link: '/superadmin/branches' },
    { label: 'Pending Approval', value: stats?.pendingBranches ?? 0, icon: <AlertCircle size={22} />, color: 'bg-orange-500', link: '/superadmin/pending-branches' },
    { label: 'Registered Users', value: stats?.users ?? 0, icon: <Users size={22} />, color: 'bg-purple-500', link: '/superadmin/users' },
    { label: 'Total Products', value: stats?.products ?? 0, icon: <Package size={22} />, color: 'bg-simba-500', link: '/superadmin/products' },
  ];

  const orderCards = orderStats ? [
    { label: "Today's Orders", value: orderStats.todayOrders ?? 0, icon: <ShoppingBag size={22} />, color: 'bg-green-500' },
    { label: 'Pending Orders', value: orderStats.pendingOrders ?? 0, icon: <TrendingUp size={22} />, color: 'bg-yellow-500' },
    { label: "Today's Revenue", value: formatCurrency(orderStats.revenue ?? 0), icon: <TrendingUp size={22} />, color: 'bg-emerald-600' },
    { label: 'No-Shows', value: orderStats.noShows ?? 0, icon: <AlertCircle size={22} />, color: 'bg-red-500' },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-display text-gray-900">Welcome back, Super Admin 👋</h2>
        <p className="text-gray-500 mt-1">Here's an overview of the entire Simba network.</p>
      </div>

      {stats?.pendingBranches ? (
        <Link to="/superadmin/pending-branches" className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4 text-orange-700 hover:bg-orange-100 transition-colors">
          <AlertCircle size={20} className="flex-shrink-0" />
          <div className="flex-1">
            <span className="font-semibold">{stats.pendingBranches} branch{stats.pendingBranches > 1 ? 'es' : ''} awaiting your approval</span>
            <p className="text-sm text-orange-600/70">Click to review and approve or reject</p>
          </div>
          <ArrowRight size={18} />
        </Link>
      ) : null}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.link} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all group">
            <div className={`w-10 h-10 ${c.color} rounded-lg flex items-center justify-center text-white mb-3`}>
              {c.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{c.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{c.label}</p>
          </Link>
        ))}
      </div>

      {orderStats && (
        <>
          <h3 className="text-lg font-bold font-display text-gray-900">Today's Activity</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {orderCards.map((c) => (
              <div key={c.label} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className={`w-10 h-10 ${c.color} rounded-lg flex items-center justify-center text-white mb-3`}>
                  {c.icon}
                </div>
                <p className="text-2xl font-bold text-gray-900">{c.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{c.label}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Approve Branches', desc: 'Review pending branch applications', link: '/superadmin/pending-branches', color: 'border-orange-200 hover:bg-orange-50' },
          { label: 'Manage Users', desc: 'View all admins, staff and customers', link: '/superadmin/users', color: 'border-purple-200 hover:bg-purple-50' },
          { label: 'Product Catalog', desc: 'Add or edit products across branches', link: '/superadmin/products', color: 'border-simba-200 hover:bg-simba-50' },
        ].map((a) => (
          <Link key={a.label} to={a.link} className={`bg-white rounded-xl border p-5 transition-all group ${a.color}`}>
            <p className="font-bold text-gray-900 mb-1">{a.label}</p>
            <p className="text-sm text-gray-500">{a.desc}</p>
            <ArrowRight size={16} className="text-gray-400 mt-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
}
