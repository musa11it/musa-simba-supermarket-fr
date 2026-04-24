import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../lib/utils';
import { Spinner } from '../../components/ui';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/stats').then((r) => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  const cards = [
    { label: "Today's Orders", value: stats?.todayOrders ?? 0, icon: <ShoppingBag size={22} />, color: 'bg-blue-500', link: '/admin/orders' },
    { label: 'Pending', value: stats?.pendingOrders ?? 0, icon: <Clock size={22} />, color: 'bg-yellow-500', link: '/admin/orders' },
    { label: 'Preparing', value: stats?.preparingOrders ?? 0, icon: <AlertCircle size={22} />, color: 'bg-orange-500', link: '/admin/orders' },
    { label: 'Completed Today', value: stats?.completedToday ?? 0, icon: <CheckCircle size={22} />, color: 'bg-green-500', link: '/admin/orders' },
    { label: "Today's Revenue", value: formatCurrency(stats?.revenue ?? 0), icon: <TrendingUp size={22} />, color: 'bg-simba-500', link: '/admin/orders' },
    { label: 'No-Shows', value: stats?.noShows ?? 0, icon: <AlertCircle size={22} />, color: 'bg-red-500', link: '/admin/orders' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-display text-gray-900">Branch Dashboard</h2>
        <p className="text-gray-500 mt-1">Welcome back, {user?.name}. Here's how your branch is doing today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.link} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all">
            <div className={`w-10 h-10 ${c.color} rounded-lg flex items-center justify-center text-white mb-3`}>
              {c.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{c.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Manage Orders', desc: 'View and process all branch orders', link: '/admin/orders' },
          { label: 'Inventory', desc: 'Monitor and update stock levels', link: '/admin/inventory' },
          { label: 'Staff', desc: 'Manage your branch staff members', link: '/admin/staff' },
        ].map((a) => (
          <Link key={a.label} to={a.link} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all group">
            <p className="font-bold text-gray-900 mb-1">{a.label}</p>
            <p className="text-sm text-gray-500">{a.desc}</p>
            <ArrowRight size={16} className="text-gray-400 mt-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
}
