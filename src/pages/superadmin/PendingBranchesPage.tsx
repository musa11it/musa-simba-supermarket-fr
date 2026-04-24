import { useEffect, useState } from 'react';
import { MapPin, Phone, Clock, CheckCircle, XCircle, AlertCircle, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { Branch } from '../../types';
import { Spinner } from '../../components/ui';

export default function PendingBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<Branch | null>(null);
  const [reason, setReason] = useState('');

  const load = async () => {
    try {
      const res = await api.get('/branches/pending');
      setBranches(res.data.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const approve = async (branch: Branch) => {
    setActing(branch._id);
    try {
      await api.post(`/branches/${branch._id}/approve`);
      toast.success(`✅ ${branch.name} approved!`);
      setBranches((prev) => prev.filter((b) => b._id !== branch._id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    } finally {
      setActing(null);
    }
  };

  const reject = async () => {
    if (!rejectModal) return;
    setActing(rejectModal._id);
    try {
      await api.post(`/branches/${rejectModal._id}/reject`, { reason });
      toast.success(`Branch rejected`);
      setBranches((prev) => prev.filter((b) => b._id !== rejectModal._id));
      setRejectModal(null);
      setReason('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setActing(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-900">Pending Branch Approvals</h2>
          <p className="text-gray-500 mt-1">Review and approve or reject branch applications.</p>
        </div>
        <span className="bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-full text-sm">
          {branches.length} pending
        </span>
      </div>

      {branches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <CheckCircle size={56} className="text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">All caught up!</h3>
          <p className="text-gray-400">No branches pending approval right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {branches.map((branch) => (
            <div key={branch._id} className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
              {/* Header banner */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 px-5 py-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-orange-500" />
                <span className="text-sm font-semibold text-orange-700">Awaiting Approval</span>
                <span className="ml-auto text-xs text-gray-400">{new Date(branch.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-simba-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 size={24} className="text-simba-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900">{branch.name}</h3>
                    <div className="grid sm:grid-cols-3 gap-2 mt-2">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin size={14} className="text-simba-400" />
                        <span className="truncate">{branch.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Phone size={14} className="text-simba-400" />
                        {branch.phone}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Clock size={14} className="text-simba-400" />
                        {branch.openingHours}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => approve(branch)}
                    disabled={acting === branch._id}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60"
                  >
                    <CheckCircle size={18} />
                    {acting === branch._id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => setRejectModal(branch)}
                    disabled={acting === branch._id}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-5 py-2.5 rounded-xl border border-red-200 transition-colors disabled:opacity-60"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold font-display mb-1 text-gray-900">Reject Branch</h3>
            <p className="text-gray-500 text-sm mb-4">
              You are rejecting <strong>{rejectModal.name}</strong>. Please provide a reason (optional).
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for rejection (will be sent to the admin)..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none h-28 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setRejectModal(null); setReason(''); }}
                className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={reject}
                disabled={!!acting}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-60"
              >
                {acting ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
