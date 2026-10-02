import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, PhoneCall, Stethoscope, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Banner: Emergency Contact Notice */}
      <div className="bg-emerald-950/70 border-b border-emerald-900/50 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold">
            <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>24/7 Companion Animal Emergency Guidance Helpline:</span>
            <span className="text-white font-bold tracking-wider">1800-PET-CARE</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>All Listed Specialists Are Credential-Verified</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-emerald-500/20">
                🐾
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Pet<span className="text-emerald-400">Care</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering loving pet parents with vetted veterinarians, master groomers, and canine behaviorists through transparent, conflict-free booking.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-slate-400">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for healthy, joyful pets</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
              Specialist Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/marketplace?type=Veterinarian" className="hover:text-emerald-400 transition-colors">
                  Veterinary Health Checkups
                </Link>
              </li>
              <li>
                <Link to="/marketplace?type=Veterinarian" className="hover:text-emerald-400 transition-colors">
                  Rabies & Core Vaccinations
                </Link>
              </li>
              <li>
                <Link to="/marketplace?type=Pet Groomer" className="hover:text-emerald-400 transition-colors">
                  Luxury Spa & De-Shed Baths
                </Link>
              </li>
              <li>
                <Link to="/marketplace?type=Pet Groomer" className="hover:text-emerald-400 transition-colors">
                  Full Breed Styling & Nail Buffing
                </Link>
              </li>
              <li>
                <Link to="/marketplace?type=Pet Trainer" className="hover:text-emerald-400 transition-colors">
                  Puppy Socialization & Obedience
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              Platform Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/owner/dashboard" className="hover:text-emerald-400 transition-colors">
                  Pet Owner Dashboard
                </Link>
              </li>
              <li>
                <Link to="/owner/pets" className="hover:text-emerald-400 transition-colors">
                  My Pets Medical Portfolios
                </Link>
              </li>
              <li>
                <Link to="/owner/appointments" className="hover:text-emerald-400 transition-colors">
                  Appointment History & Tracking
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-emerald-400 transition-colors">
                  Admin Governance Center
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">
                  Join as Service Provider
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Platform Guarantees
            </h4>
            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 space-y-2">
              <div className="flex items-start gap-2 text-xs">
                <span className="text-emerald-400 font-bold">✓</span>
                <p className="text-slate-300">
                  <strong className="text-white">Price Transparency:</strong> Server-locked prices from certified catalogs. No surprise clinic surcharges.
                </p>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <span className="text-emerald-400 font-bold">✓</span>
                <p className="text-slate-300">
                  <strong className="text-white">Zero Double Booking:</strong> Deterministic calendar collision prevention.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PetCare Management Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-300 transition-colors">Safety Standards</Link>
            <Link to="/about" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
