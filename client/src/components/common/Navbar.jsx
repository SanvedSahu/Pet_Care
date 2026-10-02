import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import Badge from './Badge';
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, HeartHandshake, Calendar, User } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isOwner, isAdmin, isProvider, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardPath = isAdmin
    ? '/admin/dashboard'
    : isProvider
    ? '/provider/dashboard'
    : '/owner/dashboard';

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform">
              🐾
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1">
                Pet<span className="text-emerald-600">Care</span>
              </span>
              <span className="hidden sm:block text-[10px] font-bold uppercase tracking-wider text-slate-400 -mt-1">
                Specialist Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                isActive('/') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                isActive('/marketplace') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Find Specialists
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                isActive('/about') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              About & Safety
            </Link>
          </nav>

          {/* Right Section: Auth & User Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <NotificationDropdown />

                <Link
                  to={dashboardPath}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>

                {/* Profile Pill & Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                        {user?.name || 'My Account'}
                      </p>
                      <p className="text-[10px] text-slate-500 capitalize">
                        {user?.role?.toLowerCase()?.replace('_', ' ') || 'User'}
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200/80 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                        <div className="mt-1.5">
                          <Badge status={user?.role}>{user?.role?.replace('_', ' ')}</Badge>
                        </div>
                      </div>

                      <div className="p-1 text-xs font-medium text-slate-700">
                        <Link
                          to={dashboardPath}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-500" />
                          <span>My Dashboard</span>
                        </Link>
                        {isOwner && (
                          <>
                            <Link
                              to="/owner/pets"
                              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                              <HeartHandshake className="w-4 h-4 text-emerald-600" />
                              <span>My Pets</span>
                            </Link>
                            <Link
                              to="/owner/appointments"
                              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                              <Calendar className="w-4 h-4 text-teal-600" />
                              <span>My Appointments</span>
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="p-1 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20 active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100"
          >
            Find Specialists
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100"
          >
            About & Safety
          </Link>
          {isAuthenticated && (
            <>
              <div className="border-t border-slate-100 pt-2" />
              <Link
                to={dashboardPath}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-emerald-700 bg-emerald-50"
              >
                Go to Dashboard
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
