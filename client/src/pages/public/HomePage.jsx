import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProviders } from '../../services/providerService';
import BookingModal from '../../components/modals/BookingModal';
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  CalendarCheck,
  Heart,
  Stethoscope,
  Scissors,
  Award,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

const HomePage = () => {
  const [featuredProviders, setFeaturedProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookingProvider, setBookingProvider] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    try {
      const data = await getProviders();
      setFeaturedProviders(data.slice(0, 3));
    } catch (err) {
      console.error('Failed to load featured specialists:', err);
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'All') params.set('type', selectedCategory);
    navigate(`/marketplace?${params.toString()}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20 bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-600/40 text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Premier Pet Care & Veterinary Booking Network</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Exceptional Care for Every Tail, Whisk & Feather
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            Connect with board-certified veterinarians, master pet groomers, and licensed trainers. Enjoy collision-free scheduling, locked catalog pricing, and centralized health portfolios.
          </p>

          {/* Quick Search Card */}
          <div className="max-w-3xl mx-auto bg-white p-3 rounded-3xl shadow-2xl border border-slate-200 text-slate-900 mt-8">
            <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Specialist name, clinic, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-44 px-3.5 py-3 rounded-2xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
              >
                <option value="All">All Categories</option>
                <option value="Veterinarian">Veterinarians 🩺</option>
                <option value="Pet Groomer">Pet Groomers ✂️</option>
                <option value="Pet Trainer">Pet Trainers 🏆</option>
              </select>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 active:scale-95 whitespace-nowrap"
              >
                Find Care ➔
              </button>
            </form>
          </div>

          {/* Trust Metrics Pill */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-emerald-200/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Vetted & Verified Providers</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Double-Booking Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Free Pet Medical Portfolio</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPECIALIST CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
            Certified Services
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Choose the Care Your Pet Needs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category 1: Veterinarian */}
          <Link
            to="/marketplace?type=Veterinarian"
            className="group bg-white rounded-3xl p-8 border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-xl transition-all relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              Veterinary Medicine
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Physical examinations, diagnostic checkups, rabies booster shots, dental assessments, and specialized clinical care.
            </p>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <span>Explore Veterinarians</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Category 2: Pet Groomer */}
          <Link
            to="/marketplace?type=Pet Groomer"
            className="group bg-white rounded-3xl p-8 border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-xl transition-all relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Scissors className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              Spa & Luxury Grooming
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Hypoallergenic medicated baths, breed-specific coat styling, de-shedding treatments, and stress-free electric nail trimming.
            </p>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-teal-600">
              <span>Explore Groomers</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Category 3: Pet Trainer */}
          <Link
            to="/marketplace?type=Pet Trainer"
            className="group bg-white rounded-3xl p-8 border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-xl transition-all relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
              Canine Training & Agility
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Positive reinforcement obedience training, puppy socialization, leash walking mastery, and behavior modification.
            </p>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-amber-600">
              <span>Explore Trainers</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              How PetCare Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Create Pet Profile',
                desc: 'Register species, breed, age, weight, and upload medical notes & vaccine status.',
              },
              {
                step: '02',
                title: 'Find Approved Specialist',
                desc: 'Browse certified vets, groomers, and trainers filtered by location, rating, and catalog.',
              },
              {
                step: '03',
                title: 'Select Collision-Free Slot',
                desc: 'Choose your desired service and book real-time available working slots with locked prices.',
              },
              {
                step: '04',
                title: 'Receive Real-Time Updates',
                desc: 'Get in-app status updates as your specialist confirms, provides care, and records history.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm relative space-y-3"
              >
                <div className="text-2xl font-black text-emerald-600/30">{s.step}</div>
                <h4 className="text-sm font-bold text-slate-900">{s.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROVIDERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
              Top Rated
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Featured Specialists
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Providers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProviders.map((provider) => (
            <div
              key={provider._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-100 to-teal-100 text-emerald-800 flex items-center justify-center font-black text-lg border border-emerald-200/60">
                      {provider.user?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {provider.user?.name}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                        {provider.providerType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-xl text-xs font-bold text-amber-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{provider.rating?.toFixed(1) || '4.9'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-medium">
                  {provider.specialization}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl mb-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{provider.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{provider.experience} yrs exp</span>
                  </div>
                </div>

                {provider.services && provider.services.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Popular Services
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {provider.services.slice(0, 3).map((s) => (
                        <span
                          key={s._id}
                          className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-xl"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Starting From</span>
                  <span className="text-base font-black text-slate-900">₹{provider.startingPrice || 500}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/providers/${provider._id}`}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => setBookingProvider(provider)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20 active:scale-95"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              For Professional Providers
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Are you a Veterinarian, Groomer, or Dog Trainer?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Join PetCare to manage your service catalog, streamline appointments, eliminate scheduling conflicts, and grow your client base.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              to="/register"
              className="px-6 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition-all text-center shadow-lg"
            >
              Register as Specialist
            </Link>
            <Link
              to="/marketplace"
              className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all text-center border border-emerald-500/40"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Wizard Modal */}
      {bookingProvider && (
        <BookingModal
          isOpen={!!bookingProvider}
          onClose={() => setBookingProvider(null)}
          provider={bookingProvider}
        />
      )}
    </div>
  );
};

export default HomePage;
