import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Stethoscope, Lock, Award, CheckCircle2 } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Our Mission & Safety Standards
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Empowering Pet Parents With Trusted Healthcare
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          PetCare was founded to eliminate fragmented care, hidden clinic surcharges, and chaotic appointment scheduling for domestic companions.
        </p>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">100% Credential Verification</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every veterinarian and pet practitioner undergoes manual administrative review of their medical degrees and certifications before public listing.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Deterministic Schedule Locking</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our multi-gate collision detection engine guarantees no double-bookings, preventing patient delays and stress at the clinic.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Transparent Fixed Pricing</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Service prices are pulled authoritatively from the verified catalog database. No unannounced clinic fees upon arrival.
          </p>
        </div>
      </div>

      {/* Team CTA */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Ready to experience stress-free pet care?
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/marketplace"
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/25"
          >
            Find a Specialist Now
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700"
          >
            Create Your Pet Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
