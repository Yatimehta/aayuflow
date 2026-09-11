import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  HeartHandshake,
  Users,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  Languages,
  Zap,
  Database,
  CheckCircle2,
  Hospital,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setRole, selectedHospital, hospitals, setSelectedHospital } = useApp();

  const handlePortalSelect = (role: 'patient' | 'worker' | 'doctor' | 'admin') => {
    setRole(role);
    if (role === 'patient') navigate('/patient/dashboard');
    if (role === 'worker') navigate('/worker');
    if (role === 'doctor') navigate('/doctor');
    if (role === 'admin') navigate('/admin');
  };

  const featurePillars = [
    {
      icon: Database,
      title: 'Works with your health ID',
      desc: 'Connects with Ayushman Bharat (ABHA), so your records travel with you wherever you go.'
    },
    {
      icon: Languages,
      title: 'Speak your language',
      desc: 'Talk or type in Hindi, English, Tamil, and 7 more languages — we’ll understand.'
    },
    {
      icon: ShieldCheck,
      title: 'Your data, your choice',
      desc: 'You decide what to share and with whom. Everything is encrypted and kept private.'
    },
    {
      icon: Zap,
      title: 'Faster check-ins',
      desc: 'A clear summary is ready for your doctor before you even sit down.'
    },
    {
      icon: HeartHandshake,
      title: 'Built for everyone',
      desc: 'No smartphone needed — front-desk staff can help anyone check in, including elders and first-time visitors.'
    },
    {
      icon: Sprout,
      title: 'Ayurveda or modern medicine — your choice',
      desc: 'Pick the care that’s right for you. Both are supported equally and kept separately organised.'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
        {/* Soft background glow & shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-brand-teal-light/70 via-brand-blue-light/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top Leaf Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-teal/40 shadow-soft text-brand-teal-dark text-xs font-semibold">
              <Sprout className="w-4 h-4 text-brand-teal-dark" />
              <span>Trusted across AYUSH hospitals in India</span>
            </div>
          </div>

          {/* Tagline & Headline */}
          <div className="text-center max-w-3xl mx-auto mt-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-heading tracking-tight leading-tight">
              Healthcare that works <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal-dark via-[#4AA8A0] to-[#1E728C]">
                for everyone in your hospital
              </span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-brand-body leading-relaxed">
              Ayucarez helps patients check in, doctors see clear summaries, and hospital staff keep things running smoothly — all in one simple app.
            </p>
          </div>

          {/* Hospital Preview Selector */}
          <div className="mt-8 max-w-md mx-auto p-2 bg-white rounded-2xl border border-brand-border shadow-soft flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 pl-2">
              <Hospital className="w-4 h-4 text-brand-teal-dark" />
              <div className="text-left">
                <p className="text-[11px] text-brand-muted uppercase font-bold tracking-wider">Sample Hospital</p>
                <p className="text-xs font-bold text-brand-heading truncate max-w-[220px]">{selectedHospital.name}</p>
              </div>
            </div>
            <select
              value={selectedHospital.id}
              onChange={(e) => {
                const found = hospitals.find(h => h.id === e.target.value);
                if (found) setSelectedHospital(found);
              }}
              className="text-xs bg-brand-teal-light text-brand-teal-dark font-medium rounded-xl px-2.5 py-1.5 border border-brand-teal/30 focus:outline-none"
            >
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{h.city} ({h.currentWaitMinutes}m wait)</option>
              ))}
            </select>
          </div>

          {/* 4 Interactive Role Cards */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">

            {/* 1. Patient Portal Card */}
            <div
              onClick={() => handlePortalSelect('patient')}
              className="group relative bg-white rounded-3xl p-6 border border-brand-border hover:border-brand-teal shadow-soft hover:shadow-soft-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-teal text-white shadow-soft">
                Patient
              </div>

              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-teal-light text-brand-teal-dark flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-brand-heading mb-1">
                  For Patients
                </h2>
                <p className="text-xs text-brand-body leading-relaxed mb-3">
                  Check in for your visit, share your symptoms, and see your health records — all from your phone.
                </p>

                <div className="space-y-1.5 text-xs text-brand-heading">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-brand-teal-dark flex-shrink-0" />
                    <span>Your health dashboard</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-brand-teal-dark flex-shrink-0" />
                    <span>Simple check-in, in your language</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-brand-teal-dark flex-shrink-0" />
                    <span>All your records in one place</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-bold text-brand-teal-dark group-hover:translate-x-1 transition-transform">
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 2. AYUSH Worker Portal Card */}
            <div
              onClick={() => handlePortalSelect('worker')}
              className="group relative bg-white rounded-3xl p-6 border border-brand-border hover:border-brand-blue shadow-soft hover:shadow-soft-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-blue-dark text-white shadow-soft">
                Front Desk
              </div>

              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-blue-light text-brand-blue-dark flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-brand-heading mb-1">
                  For Front-Desk Staff
                </h2>
                <p className="text-xs text-brand-body leading-relaxed mb-3">
                  Help patients check in — especially elders, or anyone who needs a hand.
                </p>

                <div className="space-y-1.5 text-xs text-brand-heading">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-brand-blue-dark flex-shrink-0" />
                    <span>Easy step-by-step check-in</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-brand-blue-dark flex-shrink-0" />
                    <span>Scan prescriptions instantly</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-brand-blue-dark flex-shrink-0" />
                    <span>Call the next patient with one tap</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-bold text-brand-blue-dark group-hover:translate-x-1 transition-transform">
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 3. Doctor Portal Card */}
            <div
              onClick={() => handlePortalSelect('doctor')}
              className="group relative bg-white rounded-3xl p-6 border border-brand-border hover:border-brand-mint shadow-soft hover:shadow-soft-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#2E7D32] text-white shadow-soft">
                Doctor
              </div>

              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-mint text-[#2E7D32] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-brand-heading mb-1">
                  For Doctors
                </h2>
                <p className="text-xs text-brand-body leading-relaxed mb-3">
                  See a clear summary before every patient walks in, then write your prescription in seconds.
                </p>

                <div className="space-y-1.5 text-xs text-brand-heading">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#2E7D32] flex-shrink-0" />
                    <span>Patient summary, ready for you</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#2E7D32] flex-shrink-0" />
                    <span>Review and confirm with one click</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#2E7D32] flex-shrink-0" />
                    <span>Prescriptions saved automatically</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-bold text-[#2E7D32] group-hover:translate-x-1 transition-transform">
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 4. Admin Portal Card */}
            <div
              onClick={() => handlePortalSelect('admin')}
              className="group relative bg-white rounded-3xl p-6 border border-brand-border hover:border-slate-400 shadow-soft hover:shadow-soft-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-heading text-white shadow-soft">
                Admin
              </div>

              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-brand-heading flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-brand-heading mb-1">
                  For Hospital Admins
                </h2>
                <p className="text-xs text-brand-body leading-relaxed mb-3">
                  See how your hospital is running and where help is needed most — all in one screen.
                </p>

                <div className="space-y-1.5 text-xs text-brand-heading">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-brand-heading flex-shrink-0" />
                    <span>Track patient visits at a glance</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-brand-heading flex-shrink-0" />
                    <span>Manage staff and desks easily</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-brand-heading flex-shrink-0" />
                    <span>Records kept in sync automatically</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-bold text-brand-heading group-hover:translate-x-1 transition-transform">
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

          {/* Live Quick Metrics Strip */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-brand-border shadow-soft">
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-heading">98%</p>
              <p className="text-[11px] text-brand-muted">Finish Check-In</p>
            </div>
            <div className="text-center border-l border-brand-border">
              <p className="text-2xl font-bold text-brand-teal-dark">3.5 min</p>
              <p className="text-[11px] text-brand-muted">Average Check-In Time</p>
            </div>
            <div className="text-center border-l border-brand-border">
              <p className="text-2xl font-bold text-brand-heading">10+</p>
              <p className="text-[11px] text-brand-muted">Languages Supported</p>
            </div>
            <div className="text-center border-l border-brand-border">
              <p className="text-2xl font-bold text-[#2E7D32]">100%</p>
              <p className="text-[11px] text-brand-muted">Reviewed by a Real Doctor</p>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Strip at Bottom */}
      <section className="bg-white border-t border-brand-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl font-bold text-brand-heading">Made for busy hospitals and clinics</h3>
            <p className="text-xs text-brand-muted mt-1">Bringing Ayurveda and modern medicine together, digitally</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featurePillars.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-brand-bg border border-brand-border/80 hover:border-brand-teal/40 transition-colors">
                  <div className="p-2.5 rounded-xl bg-white shadow-soft text-brand-teal-dark flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-brand-heading">{feature.title}</h4>
                    <p className="text-xs text-brand-body mt-1 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-bg border-t border-brand-border py-6 text-center text-xs text-brand-muted">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-brand-teal-dark" />
            <span className="font-bold text-brand-heading">Ayucarez</span>
            <span>• Simple healthcare for everyone</span>
          </div>
          <p>© 2026 Ayucarez</p>
        </div>
      </footer>

    </div>
  );
};
