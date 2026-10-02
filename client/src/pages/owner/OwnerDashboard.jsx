import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPets } from '../../services/petService';
import { getMyAppointments, cancelAppointment } from '../../services/appointmentService';
import { getNotifications } from '../../services/notificationService';
import PetFormModal from '../../components/modals/PetFormModal';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { useToast } from '../../context/ToastContext';
import {
  HeartHandshake,
  Calendar,
  CheckCircle2,
  PlusCircle,
  Search,
  ArrowRight,
  Clock,
  MapPin,
  Bell,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Pet Modal
  const [addPetOpen, setAddPetOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [petsData, apptsData, notifsData] = await Promise.all([
        getPets(),
        getMyAppointments('All'),
        getNotifications(),
      ]);
      setPets(petsData || []);
      setAppointments(apptsData || []);
      setNotifications(notifsData?.notifications || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppts = appointments.filter((a) =>
    ['Pending', 'Confirmed'].includes(a.status)
  );
  const completedAppts = appointments.filter((a) => a.status === 'Completed');
  const nextAppt = upcomingAppts[0];

  const handleCancelAppt = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await cancelAppointment(id);
        success('Appointment cancelled');
        loadDashboardData();
      } catch (err) {
        error(err.message || 'Failed to cancel appointment');
      }
    }
  };

  if (loading) {
    return <Loader message="Loading your dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* 1. Welcome Greeting Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pet Parent Account Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || 'Pet Parent'}! 👋
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
            Your pets are registered and ready for care. View your upcoming vet appointments, track health records, or find new specialists in your city.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setAddPetOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Add New Pet</span>
          </button>
          <Link
            to="/marketplace"
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Find Specialist</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Metric 1: Pets */}
        <Link
          to="/owner/pets"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
              🐾
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Manage
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900">{pets.length}</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Active Pet Profiles</p>
          </div>
        </Link>

        {/* Metric 2: Upcoming Appointments */}
        <Link
          to="/owner/appointments?tab=Upcoming"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-teal-500/30 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
              📅
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
              View
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900">{upcomingAppts.length}</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Upcoming Appointments</p>
          </div>
        </Link>

        {/* Metric 3: Completed Visits */}
        <Link
          to="/owner/appointments?tab=Completed"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-500/30 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
              ✓
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
              History
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900">{completedAppts.length}</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Completed Care Visits</p>
          </div>
        </Link>
      </div>

      {/* 3. Next Upcoming Appointment Spotlight */}
      {nextAppt && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Next Upcoming Appointment
              </h2>
            </div>
            <Badge status={nextAppt.status}>{nextAppt.status}</Badge>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-100 to-teal-100 text-emerald-800 flex items-center justify-center font-black text-xl shrink-0">
                {nextAppt.provider?.user?.name?.charAt(0) || 'D'}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {nextAppt.provider?.user?.name || 'Specialist'}
                </h3>
                <p className="text-xs font-semibold text-emerald-600">
                  {nextAppt.service?.name} • For {nextAppt.pet?.name || 'Your Pet'}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(nextAppt.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}{' '}
                    at {nextAppt.time}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {nextAppt.provider?.location || 'Clinic'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0">
              <button
                onClick={() => handleCancelAppt(nextAppt._id)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/80 transition-colors"
              >
                Cancel Booking
              </button>
              <Link
                to="/owner/appointments"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 4. My Pets Strip Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">My Registered Pets</h2>
            <p className="text-xs text-slate-400">Vaccine status and medical profiles</p>
          </div>
          <Link
            to="/owner/pets"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Manage All Pets ({pets.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pets.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              🐾
            </div>
            <h3 className="text-sm font-bold text-slate-900">No Pets Added Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your first dog, cat, rabbit, or companion to maintain medical notes and schedule appointments.
            </p>
            <button
              onClick={() => setAddPetOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
            >
              + Register First Pet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div
                key={pet._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl font-bold">
                      {pet.species === 'Dog'
                        ? '🐶'
                        : pet.species === 'Cat'
                        ? '🐱'
                        : pet.species === 'Rabbit'
                        ? '🐰'
                        : pet.species === 'Bird'
                        ? '🦜'
                        : '🐾'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{pet.name}</h4>
                      <p className="text-xs text-slate-500">
                        {pet.breed || pet.species} • {pet.age} yrs
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                    {pet.vaccinationStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl font-medium">
                  {pet.medicalNotes || 'No known allergies.'}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">{pet.weight} kg</span>
                  <Link
                    to="/marketplace"
                    className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <span>Book Specialist</span> ➔
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Pet Modal */}
      <PetFormModal
        isOpen={addPetOpen}
        onClose={() => setAddPetOpen(false)}
        onSaved={loadDashboardData}
      />
    </div>
  );
};

export default OwnerDashboard;
