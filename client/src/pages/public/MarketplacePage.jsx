import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Stethoscope, Scissors, Award, Clock, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';

const MarketplacePage = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProviders();
  }, [selectedType]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/providers', {
        params: {
          type: selectedType === 'All' ? undefined : selectedType,
        },
      });
      if (res.data.success) {
        setProviders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load marketplace providers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter((p) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      p.user?.name?.toLowerCase().includes(term) ||
      p.location?.toLowerCase().includes(term) ||
      p.specialization?.toLowerCase().includes(term)
    );
  });

  const categories = ['All', 'Veterinarian', 'Pet Groomer', 'Pet Trainer'];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-emerald-600/30">
              🐾
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">PetCare</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100"
            >
              Admin Center
            </Link>
            <Link
              to="/login"
              className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl shadow-sm transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
              Certified & Vetted Specialists
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-4 mb-3 leading-tight">
              Find Trusted Care For Your Pets
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Book collision-free appointments with verified veterinarians, master groomers, and certified canine trainers with locked transparent pricing.
            </p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedType(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedType === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'All' ? 'All Specialists' : cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by provider, city, service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Providers Grid */}
        {loading ? (
          <Loader message="Loading verified marketplace providers..." />
        ) : filteredProviders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              🔍
            </div>
            <h3 className="text-base font-bold text-slate-900">No Providers Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your category filter or search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <div
                key={provider._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black text-lg">
                        {provider.user?.name?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900 leading-tight">
                          {provider.user?.name}
                        </h2>
                        <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                          {provider.providerType}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-bold text-amber-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{provider.rating?.toFixed(1) || '4.9'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-medium">
                    {provider.specialization}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{provider.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{provider.experience} yrs exp</span>
                    </div>
                  </div>

                  {provider.services && provider.services.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Available Services
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {provider.services.slice(0, 3).map((s) => (
                          <span
                            key={s._id}
                            className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg"
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
                    <span className="text-base font-black text-slate-900">
                      ₹{provider.startingPrice || 500}
                    </span>
                  </div>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Book Now <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
