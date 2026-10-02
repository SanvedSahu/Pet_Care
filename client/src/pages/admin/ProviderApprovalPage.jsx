import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Check,
  X,
  AlertOctagon,
  Search,
  Filter,
  MapPin,
  Award,
  Clock,
  Briefcase,
  AlertCircle,
  Eye,
} from 'lucide-react';
import {
  getProviders,
  approveProvider,
  rejectProvider,
  suspendProvider,
} from '../../services/adminService';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';

const ProviderApprovalPage = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending'); // Default to Pending for queue focus
  const [search, setSearch] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [toast, setToast] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);

  useEffect(() => {
    loadProviders();
  }, [activeTab]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadProviders = async () => {
    try {
      setLoading(true);
      const res = await getProviders({
        status: activeTab === 'All' ? undefined : activeTab,
      });
      if (res.success) {
        setProviders(res.data);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch providers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, name) => {
    try {
      setActionInProgress(id);
      const res = await approveProvider(id);
      if (res.success) {
        showToast(`${name || 'Provider'} has been approved and listed on marketplace!`);
        loadProviders();
        if (selectedProvider?._id === id) setSelectedProvider(null);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to approve provider', 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (id, name) => {
    if (!window.confirm(`Are you sure you want to reject ${name || 'this provider'}?`)) return;
    try {
      setActionInProgress(id);
      const res = await rejectProvider(id);
      if (res.success) {
        showToast(`${name || 'Provider'} application has been rejected`, 'warning');
        loadProviders();
        if (selectedProvider?._id === id) setSelectedProvider(null);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reject provider', 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleSuspend = async (id, name) => {
    if (!window.confirm(`Are you sure you want to suspend ${name || 'this provider'} account?`)) return;
    try {
      setActionInProgress(id);
      const res = await suspendProvider(id);
      if (res.success) {
        showToast(`${name || 'Provider'} account has been suspended`, 'warning');
        loadProviders();
        if (selectedProvider?._id === id) setSelectedProvider(null);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to suspend provider', 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  const filteredProviders = providers.filter((p) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      p.user?.name?.toLowerCase().includes(term) ||
      p.user?.email?.toLowerCase().includes(term) ||
      p.location?.toLowerCase().includes(term) ||
      p.specialization?.toLowerCase().includes(term) ||
      p.providerType?.toLowerCase().includes(term)
    );
  });

  const tabs = ['Pending', 'Approved', 'Suspended', 'Rejected', 'All'];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold flex items-center gap-2 animate-bounce ${
            toast.type === 'error'
              ? 'bg-red-50 text-red-800 border-red-200'
              : toast.type === 'warning'
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-600" />
          ) : (
            <Check className="w-4 h-4 text-emerald-600" />
          )}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Provider Verification Queue</h1>
          <p className="text-sm text-slate-600 mt-1">
            Review professional licenses, verify veterinary/grooming credentials, and govern marketplace access.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search provider, city, specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Provider List */}
      {loading ? (
        <Loader message="Loading service provider verification queue..." />
      ) : filteredProviders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Providers in "{activeTab}" Queue</h3>
          <p className="text-xs text-slate-500 mt-1">
            {activeTab === 'Pending'
              ? 'Great work! All incoming provider registrations have been reviewed.'
              : 'Try selecting another status tab or clear search filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredProviders.map((provider) => {
            const isPending = provider.approvalStatus === 'Pending';
            const isApproved = provider.approvalStatus === 'Approved';
            const isSuspended = provider.approvalStatus === 'Suspended';
            const isRejected = provider.approvalStatus === 'Rejected';
            const isBusy = actionInProgress === provider._id;

            return (
              <div
                key={provider._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black text-lg">
                        {provider.user?.name?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900 leading-tight">
                          {provider.user?.name || 'Unnamed Provider'}
                        </h2>
                        <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                          {provider.providerType}
                        </p>
                      </div>
                    </div>
                    <Badge status={provider.approvalStatus}>{provider.approvalStatus}</Badge>
                  </div>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{provider.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{provider.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <Award className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{provider.qualification}</span>
                    </div>
                  </div>

                  {/* Specialization & Bio */}
                  <div className="mb-4 space-y-1.5">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Specialization
                    </p>
                    <p className="text-xs text-slate-800 font-medium">{provider.specialization}</p>
                    {provider.bio && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{provider.bio}</p>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 mb-4">
                    Email: <span className="font-semibold text-slate-700">{provider.user?.email}</span> • Phone:{' '}
                    <span className="font-semibold text-slate-700">{provider.user?.phone}</span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedProvider(provider)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Inspect Details
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Approve Action */}
                    {(isPending || isRejected || isSuspended) && (
                      <button
                        onClick={() => handleApprove(provider._id, provider.user?.name)}
                        disabled={isBusy}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        {isSuspended ? 'Reinstate' : 'Approve'}
                      </button>
                    )}

                    {/* Reject Action */}
                    {isPending && (
                      <button
                        onClick={() => handleReject(provider._id, provider.user?.name)}
                        disabled={isBusy}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 disabled:opacity-50 text-xs font-bold transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    )}

                    {/* Suspend Action */}
                    {isApproved && (
                      <button
                        onClick={() => handleSuspend(provider._id, provider.user?.name)}
                        disabled={isBusy}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 border border-slate-200 disabled:opacity-50 text-xs font-bold transition-all"
                      >
                        <AlertOctagon className="w-3.5 h-3.5" />
                        Suspend
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Detailed Inspection */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                  {selectedProvider.user?.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedProvider.user?.name}</h3>
                  <p className="text-xs text-emerald-600 font-semibold">{selectedProvider.providerType}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProvider(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Status</span>
                  <Badge status={selectedProvider.approvalStatus}>{selectedProvider.approvalStatus}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Location</span>
                  <span className="font-bold text-slate-900">{selectedProvider.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Experience</span>
                  <span className="font-bold text-slate-900">{selectedProvider.experience} Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Services Listed</span>
                  <span className="font-bold text-slate-900">{selectedProvider.servicesCount || 0} active</span>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-800 uppercase tracking-wider mb-1">Qualification / License</p>
                <p className="p-3 bg-slate-50 rounded-xl text-slate-700 font-medium">{selectedProvider.qualification}</p>
              </div>

              <div>
                <p className="font-bold text-slate-800 uppercase tracking-wider mb-1">Professional Bio</p>
                <p className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed">
                  {selectedProvider.bio || 'No bio provided'}
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-800 uppercase tracking-wider mb-1">Contact Details</p>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <p>Email: <span className="font-semibold text-slate-900">{selectedProvider.user?.email}</span></p>
                  <p>Phone: <span className="font-semibold text-slate-900">{selectedProvider.user?.phone}</span></p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedProvider(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              {selectedProvider.approvalStatus === 'Pending' && (
                <button
                  onClick={() => handleApprove(selectedProvider._id, selectedProvider.user?.name)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Approve Application
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderApprovalPage;
