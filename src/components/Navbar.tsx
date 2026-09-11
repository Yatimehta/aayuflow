import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  Search, 
  Bell, 
  User, 
  Hospital as HospitalIcon, 
  ChevronDown, 
  Check, 
  Sparkles,
  Stethoscope,
  Users,
  HeartHandshake,
  ExternalLink,
  ShieldAlert,
  LogIn,
  ChevronRight,
  FlaskConical,
  Settings,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    currentRole, 
    setRole, 
    currentUser,
    selectedHospital, 
    setSelectedHospital, 
    hospitals, 
    notifications, 
    unreadCount, 
    markNotificationRead,
    clearAllNotifications,
    logout
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showHospitalDropdown, setShowHospitalDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const getInitials = (name?: string) => {
    if (!name) return 'AY';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center shadow-md text-white transition-transform hover:scale-105">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">Ayu<span className="text-teal-600">Flow</span></span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                  AYUSH AI
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 -mt-0.5">
                Accessible Care • Rooted in Ayurveda
              </p>
            </div>
          </div>

          {/* Hospital Selector Pill */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setShowHospitalDropdown(!showHospitalDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-brand-border bg-brand-bg hover:bg-brand-teal-light/50 text-xs font-medium text-brand-heading transition-colors"
            >
              <HospitalIcon className="w-3.5 h-3.5 text-brand-teal-dark" />
              <span className="max-w-[200px] truncate">{selectedHospital.name}</span>
              <ChevronDown className="w-3 h-3 text-brand-muted" />
            </button>

            {showHospitalDropdown && (
              <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white shadow-soft-lg border border-brand-border py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 border-b border-brand-border text-[11px] font-semibold text-brand-muted uppercase tracking-wider">
                  Select Active Hospital / OPD
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {hospitals.map((hosp) => (
                    <button
                      key={hosp.id}
                      onClick={() => {
                        setSelectedHospital(hosp);
                        setShowHospitalDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-brand-teal-light transition-colors"
                    >
                      <div className="pr-2">
                        <p className="font-medium text-brand-heading">{hosp.name}</p>
                        <p className="text-[11px] text-brand-muted">{hosp.city} • {hosp.currentWaitMinutes}m wait</p>
                      </div>
                      {selectedHospital.id === hosp.id && (
                        <Check className="w-4 h-4 text-brand-teal-dark flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Global Search Input */}
          <div className="flex-1 max-w-xs md:max-w-sm hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search patient, token (AYU-1042)..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition-all placeholder:text-brand-muted"
              />
            </div>
          </div>

          {/* Right Action Stack: Notifications + Profile */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl border border-brand-border bg-brand-bg hover:bg-brand-teal-light/50 text-brand-body transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-teal-dark text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-soft-lg border border-brand-border py-2 z-50">
                  <div className="px-4 py-2 border-b border-brand-border flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-brand-heading">Notifications</p>
                      <p className="text-[10px] text-brand-muted">Hospital & Intake Updates</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[10px] text-brand-teal-dark hover:underline"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-brand-border/40">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-xs text-brand-muted">No new alerts</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 text-xs hover:bg-brand-bg transition-colors cursor-pointer ${
                            !n.read ? 'bg-brand-teal-light/30' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-brand-heading">{n.title}</p>
                            <span className="text-[10px] text-brand-muted">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-brand-body mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Login Button (Eliminating simultaneous display) */}
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200/80">
              {currentUser && currentRole !== 'guest' ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200/80 bg-white/80 hover:bg-white text-left transition-all shadow-xs"
                    title="User Profile & Settings"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center text-white text-xs font-bold shadow-xs flex-shrink-0">
                      {getInitials(currentUser.name)}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">
                        {currentUser?.name ? currentUser.name.split(' ')[0] : 'User'}
                      </p>
                      <p className="text-[10px] text-teal-700 font-extrabold uppercase leading-tight tracking-wider">
                        {currentRole}
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-soft-lg border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center text-white text-xs font-bold shadow-xs flex-shrink-0">
                            {getInitials(currentUser.name)}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-50 text-teal-700 font-bold uppercase tracking-wider border border-teal-200">
                                {currentRole}
                              </span>
                              {currentUser.abhaId && (
                                <span className="text-[10px] text-emerald-600 font-semibold truncate">ABHA Verified</span>
                              )}
                            </div>
                          </div>
                        </div>
                        {currentUser.abhaId && (
                          <p className="text-[10px] text-slate-500 font-mono mt-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 truncate">
                            {currentUser.abhaId}
                          </p>
                        )}
                        {currentUser.department && (
                          <p className="text-[11px] text-slate-500 mt-1.5">
                            Dept: <span className="font-semibold text-slate-700">{currentUser.department}</span>
                          </p>
                        )}
                      </div>

                      <div className="p-1 space-y-0.5">
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            if (currentRole === 'patient') navigate('/patient/dashboard');
                            else if (currentRole === 'doctor') navigate('/doctor/profile');
                            else navigate('/doctor');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>My Profile & Records</span>
                        </button>


                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            setShowHospitalDropdown(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Facility Settings</span>
                        </button>
                      </div>

                      <div className="border-t border-slate-100 mt-1 pt-1 p-1">
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            logout();
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white/80 hover:bg-white text-xs font-semibold text-slate-800 transition-colors shadow-xs"
                  title="Universal Login"
                >
                  <LogIn className="w-3.5 h-3.5 text-teal-600" />
                  <span>Login</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
