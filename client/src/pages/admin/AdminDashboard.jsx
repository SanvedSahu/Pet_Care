import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Calendar,
  AlertTriangle,
  Heart,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { getDashboardStats } from '../../services/adminService';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load executive statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Compiling platform metrics..." />;
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Platform Users',
      value: stats?.totalUsers || 0,
      subtext: `${stats?.totalPetOwners || 0} Owners • ${stats?.totalProviders || 0} Providers`,
      icon: Users,
      color: 'bg-blue-500 text-white',
      border: 'border-blue-100',
    },
    {
      title: 'Pending Provider Approvals',
      value: stats?.pendingProviders || 0,
      subtext: `${stats?.approvedProviders || 0} Approved • ${stats?.suspendedProviders || 0} Suspended`,
      icon: ShieldAlert,
      color: stats?.pendingProviders > 0 ? 'bg-amber-500 text-white' : 'bg-slate-400 text-white',
      border: stats?.pendingProviders > 0 ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100',
      highlight: stats?.pendingProviders > 0,
      link: '/admin/providers',
    },
    {
      title: 'Registered Pets',
      value: stats?.totalPets || 0,
      subtext: 'Dogs, Cats, Rabbits & Exotic Pets',
      icon: Heart,
      color: 'bg-emerald-500 text-white',
      border: 'border-emerald-100',
    },
    {
      title: 'Total Appointments',
      value: stats?.totalAppointments || 0,
      subtext: `${stats?.completedAppointments || 0} Completed • ${stats?.pendingAppointments || 0} Pending`,
      icon: Calendar,
      color: 'bg-indigo-500 text-white',
      border: 'border-indigo-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Executive Platform Overview</h1>
        <p className="text-sm text-slate-600 mt-1">
          Real-time metrics, provider credential reviews, and ecosystem governance controls.
        </p>
      </div>

      {/* Actionable Alert for Pending Providers */}
      {stats?.pendingProviders > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-amber-900">
                {stats.pendingProviders} Service Provider Application{stats.pendingProviders > 1 ? 's' : ''} Awaiting Review
              </h2>
              <p className="text-xs text-amber-700 mt-0.5">
                New practitioners cannot receive bookings until credentials and license details are approved.
              </p>
            </div>
          </div>
          <Link
            to="/admin/providers"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-sm flex-shrink-0"
          >
            Review Queue
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          const CardContent = (
            <div
              key={idx}
              className={`bg-white rounded-2xl border p-5 transition-all duration-200 hover:shadow-md ${card.border}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {card.title}
                </span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color} shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mb-1">{card.value}</div>
              <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                {card.subtext}
              </div>
            </div>
          );

          return card.link ? (
            <Link key={idx} to={card.link} className="block">
              {CardContent}
            </Link>
          ) : (
            <div key={idx}>{CardContent}</div>
          );
        })}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Latest Bookings</h2>
              <p className="text-xs text-slate-500 mt-0.5">Recent appointments booked on the platform</p>
            </div>
            <Link
              to="/admin/appointments"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {stats?.recentAppointments && stats.recentAppointments.length > 0 ? (
              stats.recentAppointments.map((appt) => (
                <div key={appt._id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                      🐾
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {appt.pet?.name || 'Pet'} ({appt.pet?.species || 'Pet'})
                      </p>
                      <p className="text-xs text-slate-500">
                        {appt.service?.name} with {appt.provider?.user?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">₹{appt.price}</p>
                    <Badge status={appt.status}>{appt.status}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 py-4 text-center">No recent appointments recorded</p>
            )}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Registrations</h2>
              <p className="text-xs text-slate-500 mt-0.5">Newly registered user accounts</p>
            </div>
            <Link
              to="/admin/users"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Manage Users <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {stats?.recentUsers && stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((u) => (
                <div key={u._id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-sm">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <Badge status={u.role}>{u.role}</Badge>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        u.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      title={u.isActive ? 'Active' : 'Inactive'}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 py-4 text-center">No user registrations found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
