import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import { getPets } from '../../services/petService';
import { bookAppointment, getProviderBookedSlots } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  PlusCircle,
  Heart,
  Stethoscope,
} from 'lucide-react';

const STANDARD_SLOTS = [
  '09:00 AM',
  '09:45 AM',
  '10:30 AM',
  '11:15 AM',
  '12:00 PM',
  '01:30 PM',
  '02:15 PM',
  '03:00 PM',
  '03:45 PM',
  '04:30 PM',
  '05:15 PM',
];

const BookingModal = ({ isOpen, onClose, provider, initialServiceId = null, onBooked }) => {
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(false);

  // Tomorrow as default date
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(tomorrow);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedServiceId(initialServiceId || (provider?.services?.[0]?._id ?? ''));
      setSelectedSlot('');
      setReason('');
      setBookingConfirmed(null);
      if (isAuthenticated) {
        loadUserPets();
      }
    }
  }, [isOpen, provider, initialServiceId, isAuthenticated]);

  useEffect(() => {
    if (isOpen && provider?._id && selectedDate) {
      loadBookedSlots();
    }
  }, [isOpen, provider, selectedDate]);

  const loadUserPets = async () => {
    try {
      setLoadingPets(true);
      const data = await getPets();
      setPets(data || []);
      if (data && data.length > 0 && !selectedPetId) {
        setSelectedPetId(data[0]._id);
      }
    } catch (err) {
      console.error('Failed to load pets:', err);
    } finally {
      setLoadingPets(false);
    }
  };

  const loadBookedSlots = async () => {
    try {
      setLoadingSlots(true);
      const booked = await getProviderBookedSlots(provider._id, selectedDate);
      setBookedSlots(booked || []);
    } catch (err) {
      console.error('Failed to fetch booked slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const selectedService = provider?.services?.find((s) => s._id === selectedServiceId);
  const selectedPet = pets.find((p) => p._id === selectedPetId);

  const handleNext = () => {
    if (step === 1 && !selectedServiceId) {
      error('Please select a service to proceed');
      return;
    }
    if (step === 2 && !selectedPetId) {
      error('Please choose a pet for this booking');
      return;
    }
    if (step === 3) {
      if (!selectedDate) {
        error('Please choose an appointment date');
        return;
      }
      if (!selectedSlot) {
        error('Please select an available time slot');
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        providerId: provider._id,
        serviceId: selectedServiceId,
        petId: selectedPetId,
        date: selectedDate,
        time: selectedSlot,
        reason: reason || 'Routine wellness visit',
      };

      const result = await bookAppointment(payload);
      success('Appointment successfully scheduled!');
      setBookingConfirmed(result);
      if (onBooked) onBooked(result);
    } catch (err) {
      error(err.message || 'Failed to complete appointment booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (!provider) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Book with ${provider.user?.name || 'Specialist'}`}
      subtitle={`${provider.providerType} • ${provider.location}`}
      maxWidth="max-w-2xl"
    >
      {/* If booking confirmed success screen */}
      {bookingConfirmed ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-md">
            ✓
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Booking Confirmed!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Your appointment request has been dispatched to{' '}
              <strong>{provider.user?.name}</strong>. The provider has been alerted in real time.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left max-w-md mx-auto text-xs space-y-2">
            <div className="flex justify-between pb-1.5 border-b border-slate-200">
              <span className="text-slate-500">Service:</span>
              <span className="font-bold text-slate-900">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-slate-200">
              <span className="text-slate-500">Patient Pet:</span>
              <span className="font-bold text-slate-900">{selectedPet?.name}</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-slate-200">
              <span className="text-slate-500">Date & Slot:</span>
              <span className="font-bold text-emerald-700">
                {selectedDate} at {selectedSlot}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500 font-semibold">Locked Catalog Price:</span>
              <span className="text-sm font-black text-slate-900">₹{selectedService?.price}</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                onClose();
                navigate('/owner/appointments');
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
            >
              View My Appointments
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Step Progress Indicator */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
              <span className={step >= 1 ? 'text-emerald-600 font-black' : ''}>1. Service</span>
              <span className={step >= 2 ? 'text-emerald-600 font-black' : ''}>2. Pet</span>
              <span className={step >= 3 ? 'text-emerald-600 font-black' : ''}>3. Date & Time</span>
              <span className={step >= 4 ? 'text-emerald-600 font-black' : ''}>4. Confirm</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Choose Offered Service
              </h4>
              {!provider.services || provider.services.length === 0 ? (
                <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
                  This specialist has no active services listed yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {provider.services.map((s) => {
                    const isSelected = selectedServiceId === s._id;
                    return (
                      <div
                        key={s._id}
                        onClick={() => setSelectedServiceId(s._id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <span className="text-[10px] font-bold">✓</span>}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{s.name}</p>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{s.description}</p>
                            <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" /> {s.duration} mins • {s.category}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-slate-900">₹{s.price}</span>
                          <span className="block text-[9px] uppercase font-bold text-slate-400">Locked</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Select Pet */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Select Patient Pet
                </h4>
                <button
                  type="button"
                  onClick={() => navigate('/owner/pets')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Register another pet
                </button>
              </div>

              {loadingPets ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading your pets...</div>
              ) : pets.length === 0 ? (
                <div className="p-8 bg-slate-50 rounded-2xl text-center space-y-3">
                  <p className="text-xs font-bold text-slate-800">No registered pets found</p>
                  <p className="text-[11px] text-slate-500">
                    You need to add a pet before scheduling an appointment.
                  </p>
                  <button
                    onClick={() => navigate('/owner/pets')}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                  >
                    Go to My Pets to Add One
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto">
                  {pets.map((p) => {
                    const isSelected = selectedPetId === p._id;
                    return (
                      <div
                        key={p._id}
                        onClick={() => setSelectedPetId(p._id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm shrink-0">
                          {p.species === 'Dog'
                            ? '🐶'
                            : p.species === 'Cat'
                            ? '🐱'
                            : p.species === 'Rabbit'
                            ? '🐰'
                            : p.species === 'Bird'
                            ? '🦜'
                            : '🐾'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {p.breed || p.species} • {p.age} yrs
                          </p>
                          <span className="inline-block mt-0.5 text-[10px] text-emerald-600 font-semibold">
                            {p.vaccinationStatus}
                          </span>
                        </div>
                        {isSelected && <span className="text-emerald-600 font-bold">✓</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Date & Time Slot */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                  Select Appointment Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Available Time Slots (45m windows)
                  </label>
                  {loadingSlots && <span className="text-[10px] text-slate-400">Checking collisions...</span>}
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {STANDARD_SLOTS.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    const isSelected = selectedSlot === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center ${
                          isBooked
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-dashed border-slate-200'
                            : isSelected
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                            : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700'
                        }`}
                      >
                        <span>{slot}</span>
                        {isBooked ? (
                          <span className="text-[9px] font-semibold text-rose-500 mt-0.5">Booked</span>
                        ) : (
                          <span className="text-[9px] font-semibold text-emerald-600 group-hover:text-emerald-700 mt-0.5">
                            Available
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Confirm Booking & Price Breakdown */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Visit / Symptoms (Optional)
                </label>
                <textarea
                  rows="2"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Annual booster vaccination, routine wellness, skin rash check..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Review Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                  <span className="text-slate-500">Provider:</span>
                  <span className="font-bold text-slate-900">{provider.user?.name}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-bold text-slate-900">
                    {selectedService?.name} ({selectedService?.duration} mins)
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                  <span className="text-slate-500">Patient Pet:</span>
                  <span className="font-bold text-slate-900">
                    {selectedPet?.name} ({selectedPet?.species})
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                  <span className="text-slate-500">Date & Slot:</span>
                  <span className="font-bold text-emerald-700">
                    {selectedDate} • {selectedSlot}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Authoritative Locked Price
                    </span>
                    <span className="text-lg font-black text-slate-900">₹{selectedService?.price}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Price Integrity Guaranteed
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20 active:scale-95"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 active:scale-95"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Confirming...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default BookingModal;
