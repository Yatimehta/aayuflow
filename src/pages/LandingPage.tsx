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
  ShieldAlert,
  LogIn
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
      title: 'HIS / EMR / ABDM Ready',
      desc: 'Seamless interoperability with Ayushman Bharat Digital Mission and Hospital Information Systems.'
    },
    {
      icon: Languages,
      title: 'Multi-Language Voice Intake',
      desc: 'Speech-to-text intake in 10+ Indian languages tailored for rural and elderly patients.'
    },
    {
      icon: ShieldCheck,
      title: 'HIPAA & Consent-Driven',
      desc: 'Full patient data sovereignty with encrypted clinical audit trails.'
    },
    {
      icon: Zap,
      title: '4x Faster OPD Triage',
      desc: 'Synthesizes Prakriti, Agni, and Chief Complaints into a pre-consultation dossier.'
    },
    {
      icon: HeartHandshake,
      title: 'Rural & Elderly Inclusive',
      desc: 'Assisted intake mode with hospital desk workers eliminates technology barriers.'
    },
    {
      icon: Sprout,
      title: 'Ayurveda & Modern Medicine',
      desc: 'Harmonizes classical Ayurvedic diagnostics (Nadi, Dosha) with allopathic lab findings.'
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
              <span>Ayush Grid & National Health Authority Aligned</span>
            </div>
          </div>

          {/* Tagline & Headline */}
          <div className="text-center max-w-3xl mx-auto mt-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-heading tracking-tight leading-tight">
              Accessible Care. Assisted by People. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal-dark via-[#4AA8A0] to-[#1E728C]">
                Powered by AI. Rooted in Ayurveda.
              </span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-brand-body leading-relaxed">
              AyuFlow transforms high-volume AYUSH OPDs with conversational AI intake, automatic Prakriti synthesis, and human-in-the-loop doctor verification.
            </p>
          </div>

          {/* Hospital Preview Selector */}
          <div className="mt-8 max-w-md mx-auto p-2 bg-white rounded-2xl border border-brand-border shadow-soft flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 pl-2">
              <Hospital className="w-4 h-4 text-brand-teal-dark" />
              <div className="text-left">
                <p className="text-[11px] text-brand-muted uppercase font-bold tracking-wider">Demo OPD Center</p>
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

          {/* Universal Login Quick Entry Banner */}
          <div className="mt-8 max-w-4xl mx-auto p-4 rounded-3xl bg-white border border-brand-border shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-teal-light text-brand-teal-dark flex items-center justify-center">
                <LogIn className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-brand-heading">Universal 4-Role Authentication Gateway</p>
                <p className="text-[11px] text-brand-muted">Login with 14-digit ABHA ID, Mobile OTP, or Hospital Staff / Doctor credentials.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-soft transition-all whitespace-nowrap"
            >
              <span>Universal Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
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
                  Patient Portal
                </h2>
                <p className="text-xs text-brand-body leading-relaxed mb-3">
                  Dashboard & 8-step intake wizard, past health records, AI evidence reports, and live queue token tracking.
                </p>

                <div className="space-y-1.5 text-xs text-brand-heading">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-brand-teal-dark flex-shrink-0" />
                    <span>Patient Home Dashboard</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-brand-teal-dark flex-shrink-0" />
                    <span>8-Step Multilingual Intake</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-brand-teal-dark flex-shrink-0" />
                    <span>ABHA ID & Records</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-bold text-brand-teal-dark group-hover:translate-x-1 transition-transform">
                <span>Open Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 2. AYUSH Worker Portal Card */}
            <div
              onClick={() => handlePortalSelect('worker')}
              className="group relative bg-white rounded-3xl p-6 border border-brand-border hover:border-brand-blue shadow-soft hover:shadow-soft-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-blue-dark text-white shadow-soft">
                Worker Desk
              </div>

              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-blue-light text-brand-blue-dark flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-brand-heading mb-1">
                  AYUSH Worker
                </h2>
                <p className="text-xs text-brand-body leading-relaxed mb-3">
                  Assisted desk interface for elderly & rural patients with split-view intake and electronic queue onboarding.
                </p>

                <div className="space-y-1.5 text-xs text-brand-heading">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-brand-blue-dark flex-shrink-0" />
                    <span>Split-View Intake Panel</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-brand-blue-dark flex-shrink-0" />
                    <span>Prescription Scanner</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-brand-blue-dark flex-shrink-0" />
                    <span>Live Queue Audio Calling</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-bold text-brand-blue-dark group-hover:translate-x-1 transition-transform">
                <span>Enter Assistant Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 3. Doctor Portal Card */}
            <div
              onClick={() => handlePortalSelect('doctor')}
              className="group relative bg-white rounded-3xl p-6 border border-brand-border hover:border-brand-mint shadow-soft hover:shadow-soft-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#2E7D32] text-white shadow-soft">
                Physician
              </div>

              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-mint text-[#2E7D32] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-brand-heading mb-1">
                  Doctor / Vaidya
                </h2>
                <p className="text-xs text-brand-body leading-relaxed mb-3">
                  Clinical cockpit to verify AI-synthesized Prakriti & Agni, write classical formulations, and sync to EMR.
                </p>

                <div className="space-y-1.5 text-xs text-brand-heading">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#2E7D32] flex-shrink-0" />
                    <span>AI Dossier: Prakriti & Agni</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#2E7D32] flex-shrink-0" />
                    <span>Verify & Request Changes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#2E7D32] flex-shrink-0" />
                    <span>Ayurvedic Rx & EMR Sync</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-bold text-[#2E7D32] group-hover:translate-x-1 transition-transform">
                <span>Access Clinical Suite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 4. Admin Portal Card */}
            <div
              onClick={() => handlePortalSelect('admin')}
              className="group relative bg-white rounded-3xl p-6 border border-brand-border hover:border-slate-400 shadow-soft hover:shadow-soft-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-heading text-white shadow-soft">
                Directorate
              </div>

              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-brand-heading flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-brand-heading mb-1">
                  Hospital Admin
                </h2>
                <p className="text-xs text-brand-body leading-relaxed mb-3">
                  Hospital-wide throughput analytics, staff and counter allocation, and real-time ABDM sync audit logs.
                </p>

                <div className="space-y-1.5 text-xs text-brand-heading">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-brand-heading flex-shrink-0" />
                    <span>OPD Throughput Analytics</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-brand-heading flex-shrink-0" />
                    <span>Counter & Staff Rostering</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-brand-heading flex-shrink-0" />
                    <span>ABDM Sync & Audit Stream</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-bold text-brand-heading group-hover:translate-x-1 transition-transform">
                <span>Enter Admin Suite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

          {/* Live Quick Metrics Strip */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-brand-border shadow-soft">
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-heading">98.4%</p>
              <p className="text-[11px] text-brand-muted">Case Intake Completion</p>
            </div>
            <div className="text-center border-l border-brand-border">
              <p className="text-2xl font-bold text-brand-teal-dark">3.5 min</p>
              <p className="text-[11px] text-brand-muted">Avg. Triage Intake Time</p>
            </div>
            <div className="text-center border-l border-brand-border">
              <p className="text-2xl font-bold text-brand-heading">10+</p>
              <p className="text-[11px] text-brand-muted">Indian Regional Languages</p>
            </div>
            <div className="text-center border-l border-brand-border">
              <p className="text-2xl font-bold text-[#2E7D32]">100%</p>
              <p className="text-[11px] text-brand-muted">Doctor-in-the-Loop Safe</p>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Strip at Bottom */}
      <section className="bg-white border-t border-brand-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl font-bold text-brand-heading">Built for High-Volume Public & Private AYUSH Centers</h3>
            <p className="text-xs text-brand-muted mt-1">Bridging traditional clinical wisdom with modern digital public health infrastructure</p>
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
            <span className="font-bold text-brand-heading">AyuFlow Platform</span>
            <span>• Ministry of Ayush Aligned</span>
          </div>
          <p>© 2026 AyuFlow. Pure Frontend Interactive Demo.</p>
        </div>
      </footer>

    </div>
  );
};
