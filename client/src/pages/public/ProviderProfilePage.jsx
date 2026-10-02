import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProviderById } from '../../services/providerService';
import BookingModal from '../../components/modals/BookingModal';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import {
  MapPin,
  Clock,
  Star,
  ShieldCheck,
  Calendar,
  ArrowLeft,
  Award,
  CheckCircle2,
  Stethoscope,
  Scissors,
  Phone,
  Mail,
} from 'lucide-react';

const ProviderProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking Modal
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  useEffect(() => {
    loadProvider();
  }, [id]);

  const loadProvider = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProviderById(id);
      setProvider(data);
    } catch (err) {
      console.error('Failed to load provider profile:', err);
      setError('Specialist profile not found or currently unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (serviceId) => {
    setSelectedServiceId(serviceId);
    setBookingOpen(true);
  };

  if (loading) {
    return <Loader message="Loading specialist profile..." />;
  }

  if (error || !provider) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto text-3xl">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-slate-900">Profile Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'This specialist is not available.'}</p>
        <button
          onClick={() => navigate('/marketplace')}
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-emerald-600/25 shrink-0">
              {provider.user?.name?.charAt(0) || 'P'}
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {provider.user?.name}
                </h1>
                <Badge status="Approved">Verified Specialist</Badge>
              </div>

              <p className="text-xs sm:text-sm font-bold text-emerald-600">
                {provider.providerType} • {provider.specialization}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {provider.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {provider.experience} Years Clinical Experience
                </span>
                <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-amber-800 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {provider.rating?.toFixed(1) || '4.9'} Rating
                </span>
              </div>
            </div>
          </div>

          {/* Book button top */}
          <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                setSelectedServiceId(provider.services?.[0]?._id);
                setBookingOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95"
            >
              Book Appointment ➔
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Bio & Details Left, Services Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Credentials & Bio */}
        <div className="space-y-6">
          {/* About Specialist */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              About Specialist
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {provider.bio ||
                'Dedicated animal care specialist committed to high-standard diagnostics, compassionate clinical treatments, and gentle pet handling.'}
            </p>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-900">Education & Credentials</h4>
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{provider.qualification || 'Certified Practitioner'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-900">Clinic Contact</h4>
              <div className="space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{provider.user?.phone || '+91 98000 00000'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{provider.user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Trust Guarantee */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-200/60 space-y-3 text-xs text-emerald-900">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>PetCare Verified Guarantee</span>
            </div>
            <p className="leading-relaxed text-[11px] text-emerald-800/80">
              Appointments scheduled through PetCare are backed by locked prices and automatic calendar validation to prevent overlapping appointments.
            </p>
          </div>
        </div>

        {/* Right Column: Service Catalog */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Available Service Catalog ({provider.services?.length || 0})
            </h3>
            <span className="text-[11px] text-slate-400">Locked prices resolved server-side</span>
          </div>

          {!provider.services || provider.services.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center text-xs text-slate-500">
              No services listed by this provider at the moment.
            </div>
          ) : (
            <div className="space-y-3">
              {provider.services.map((service) => (
                <div
                  key={service._id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-lg">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{service.name}</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg">
                        {service.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{service.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {service.duration} Minutes
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">Immediate slot booking</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-between sm:flex-col sm:items-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Price</span>
                      <span className="text-lg font-black text-slate-900">₹{service.price}</span>
                    </div>
                    <button
                      onClick={() => handleBookService(service._id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20 active:scale-95"
                    >
                      Book Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Wizard Modal */}
      {bookingOpen && (
        <BookingModal
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
          provider={provider}
          initialServiceId={selectedServiceId}
        />
      )}
    </div>
  );
};

export default ProviderProfilePage;
