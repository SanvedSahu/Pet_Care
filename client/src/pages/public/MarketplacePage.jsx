import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getProviders } from '../../services/providerService';
import BookingModal from '../../components/modals/BookingModal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import {
  Search,
  MapPin,
  Star,
  Clock,
  ArrowRight,
  Filter,
  RotateCcw,
  Stethoscope,
  Scissors,
  Award,
} from 'lucide-react';

const MarketplacePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedCity, setSelectedCity] = useState('All');
  const [minRating, setMinRating] = useState('0');
  const [sortBy, setSortBy] = useState('rating');
  const [search, setSearch] = useState(initialSearch);

  // Booking Modal State
  const [bookingProvider, setBookingProvider] = useState(null);

  useEffect(() => {
    fetchProviders();
  }, [selectedType, selectedCity, minRating]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const data = await getProviders({
        type: selectedType === 'All' ? undefined : selectedType,
        location: selectedCity === 'All' ? undefined : selectedCity,
        minRating: minRating !== '0' ? minRating : undefined,
      });
      setProviders(data || []);
    } catch (err) {
      console.error('Failed to load marketplace providers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedType('All');
    setSelectedCity('All');
    setMinRating('0');
    setSearch('');
    setSortBy('rating');
    setSearchParams({});
  };

  // Client-side search and sorting
  const filteredAndSorted = providers
    .filter((p) => {
      if (!search.trim()) return true;
      const term = search.toLowerCase();
      return (
        p.user?.name?.toLowerCase().includes(term) ||
        p.location?.toLowerCase().includes(term) ||
        p.specialization?.toLowerCase().includes(term) ||
        p.providerType?.toLowerCase().includes(term) ||
        p.services?.some((s) => s.name?.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price_asc') return (a.startingPrice || 0) - (b.startingPrice || 0);
      if (sortBy === 'experience') return (b.experience || 0) - (a.experience || 0);
      return 0;
    });

  const categories = [
    { label: 'All Specialists', value: 'All' },
    { label: 'Veterinarians', value: 'Veterinarian', icon: Stethoscope },
    { label: 'Pet Groomers', value: 'Pet Groomer', icon: Scissors },
    { label: 'Pet Trainers', value: 'Pet Trainer', icon: Award },
  ];

  const cities = ['All', 'Nagpur', 'Mumbai', 'Pune', 'Bangalore', 'Delhi'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
            Verified Service Marketplace
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Find Trusted Care For Your Pets
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Schedule appointments with certified veterinarians, master groomers, and dog trainers. All appointments feature locked server catalog pricing and zero double-booking assurance.
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        {/* Top row: Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedType(cat.value)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedType === cat.value
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Second row: Search, City, Min Rating, Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search provider, treatment, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50"
            />
          </div>

          {/* City Filter */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50 font-semibold"
            >
              <option value="All">All Cities</option>
              {cities.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>
                  📍 {c}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50 font-semibold"
            >
              <option value="0">All Ratings</option>
              <option value="4.5">★ 4.5 Stars & Up</option>
              <option value="4.8">★ 4.8 Stars & Up</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50 font-semibold"
            >
              <option value="rating">Sort: Highest Rated</option>
              <option value="price_asc">Sort: Price Low ➔ High</option>
              <option value="experience">Sort: Most Experienced</option>
            </select>

            <button
              onClick={handleResetFilters}
              title="Reset all filters"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
        <span>
          Showing <strong>{filteredAndSorted.length}</strong> certified specialists
        </span>
        {selectedType !== 'All' && (
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
            Filtering by: {selectedType}
          </span>
        )}
      </div>

      {/* Providers Grid */}
      {loading ? (
        <Loader message="Loading verified marketplace providers..." />
      ) : filteredAndSorted.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No Specialists Found"
          description="We couldn't find any service providers matching your exact search filters. Try clearing your filters or selecting 'All Cities'."
          actionText="Clear All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSorted.map((provider) => (
            <div
              key={provider._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Provider Card Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-100 to-teal-100 text-emerald-800 flex items-center justify-center font-black text-lg border border-emerald-200/60 shadow-sm shrink-0">
                      {provider.user?.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 leading-tight">
                        {provider.user?.name}
                      </h2>
                      <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                        {provider.providerType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-xl text-xs font-bold text-amber-800 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{provider.rating?.toFixed(1) || '4.9'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-medium">
                  {provider.specialization}
                </p>

                {/* Location and Experience */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl mb-4">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{provider.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{provider.experience} yrs exp</span>
                  </div>
                </div>

                {/* Services Preview */}
                {provider.services && provider.services.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Available Services
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
                      {provider.services.length > 3 && (
                        <span className="text-[11px] font-bold px-2 py-1 text-slate-400">
                          +{provider.services.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Starting From
                  </span>
                  <span className="text-base font-black text-slate-900">
                    ₹{provider.startingPrice || 500}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/providers/${provider._id}`}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => setBookingProvider(provider)}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20 active:scale-95"
                  >
                    Book Now <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

export default MarketplacePage;
