import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getMyAppointments, cancelAppointment } from '../../services/appointmentService';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Search,
  AlertCircle,
  XCircle,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react';

const MyAppointmentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'All';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  // Cancel dialog
  const [apptToCancel, setApptToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, [activeTab]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await getMyAppointments(activeTab);
      setAppointments(data || []);
    } catch (err) {
      console.error('Failed to load appointments:', err);
      error('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab !== 'All' ? { tab } : {});
  };

  const confirmCancel = async () => {
    if (!apptToCancel) return;
    try {
      setCancelling(true);
      await cancelAppointment(apptToCancel._id);
      success('Appointment cancelled successfully.');
      setApptToCancel(null);
      loadAppointments();
    } catch (err) {
      error(err.message || 'Failed to cancel appointment');
    } finally {
      setCancelling(false);
    }
  };

  const tabs = [
    { label: 'All Bookings', value: 'All' },
    { label: 'Upcoming', value: 'Upcoming' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled / Declined', value: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Appointment Tracking & History
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor provider confirmations, view locked prices, and manage your pet care schedule.
          </p>
        </div>

        <Link
          to="/marketplace"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95 shrink-0"
        >
          <Calendar className="w-4 h-4" />
          <span>Book New Visit</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.value
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {loading ? (
        <Loader message="Loading appointment schedule..." />
      ) : appointments.length === 0 ? (
        <EmptyState
          icon="📅"
          title={`No ${activeTab !== 'All' ? activeTab : ''} Appointments Found`}
          description="You don't have any appointments in this category right now. Browse our verified specialists to book care for your pets."
          actionText="Explore Marketplace"
          onAction={() => (window.location.href = '/marketplace')}
        />
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => {
            const canCancel = ['Pending', 'Confirmed'].includes(appt.status);

            return (
              <div
                key={appt._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Left: Specialist and Pet Details */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-100 to-teal-100 text-emerald-800 flex items-center justify-center font-black text-xl border border-emerald-200/60 shadow-sm shrink-0">
                    {appt.provider?.user?.name?.charAt(0) || 'P'}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 leading-tight">
                        {appt.provider?.user?.name || 'Verified Specialist'}
                      </h3>
                      <Badge status={appt.status}>{appt.status}</Badge>
                    </div>

                    <p className="text-xs font-semibold text-emerald-700">
                      {appt.service?.name} ({appt.service?.duration || 30} mins)
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>
                        Patient:{' '}
                        <strong className="text-slate-900">
                          {appt.pet?.name || 'Your Pet'}
                        </strong>{' '}
                        ({appt.pet?.species})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {appt.provider?.location || 'Clinic Location'}
                      </span>
                    </div>

                    {appt.reason && (
                      <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl font-medium mt-1">
                        Note: {appt.reason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Date, Price & Action */}
                <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                  <div className="text-left sm:text-right lg:text-right">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span>
                        {new Date(appt.date).toLocaleDateString([], {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Time Slot: {appt.time}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Locked Price
                      </span>
                      <span className="text-base font-black text-slate-900">₹{appt.price}</span>
                    </div>
                  </div>

                  {canCancel && (
                    <button
                      onClick={() => setApptToCancel(appt)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/80 transition-colors"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!apptToCancel}
        onClose={() => setApptToCancel(null)}
        title="Cancel Appointment"
        subtitle="Please confirm you wish to abort this appointment"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to cancel your appointment with{' '}
            <strong>{apptToCancel?.provider?.user?.name}</strong> for{' '}
            <strong>{apptToCancel?.pet?.name}</strong> on {apptToCancel?.time}?
          </p>
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>The time slot will be reopened immediately on the provider's public calendar.</span>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={() => setApptToCancel(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Keep Booking
            </button>
            <button
              onClick={confirmCancel}
              disabled={cancelling}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyAppointmentsPage;
